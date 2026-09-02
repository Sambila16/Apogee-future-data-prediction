from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_user_org
from app.api.schemas import AnalyticsOut, ModelPerformanceItem, RevenueSeriesPoint
from app.db.models import DataRecord, Model, ModelRun, User
from app.db.session import get_db
from app.services.forecast import train_and_evaluate, InsufficientDataError

router = APIRouter(prefix="/api", tags=["analytics"])


@router.get("/analytics", response_model=AnalyticsOut)
def analytics(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = get_user_org(user, db)
    models = db.query(Model).filter(Model.organization_id == org.id).all()

    # Real per-model performance, pulled from each model's latest run
    performance: list[ModelPerformanceItem] = []
    for m in models:
        latest_run = (
            db.query(ModelRun).filter(ModelRun.model_id == m.id).order_by(ModelRun.created_at.desc()).first()
        )
        performance.append(
            ModelPerformanceItem(
                id=m.id,
                name=m.name,
                accuracy=m.accuracy,
                is_simulated=latest_run.is_simulated if latest_run else True,
                status=m.status,
            )
        )

    # Revenue vs forecast chart: only built for a real, trained time-series
    # model with enough linked data. If none exists, we say so rather than
    # showing a chart that implies one does.
    revenue_series: list[RevenueSeriesPoint] = []
    has_real_forecast = False

    ts_model = next(
        (m for m in models if m.model_type == "time_series" and m.data_source_id and m.accuracy is not None),
        None,
    )
    if ts_model:
        records = (
            db.query(DataRecord)
            .filter(DataRecord.data_source_id == ts_model.data_source_id)
            .order_by(DataRecord.ts.asc())
            .all()
        )
        values = [r.value for r in records]
        try:
            result = train_and_evaluate(values)
            has_real_forecast = True
            # actuals for the held-out test window, plus the model's fitted line over that same window
            test_records = records[result.training_points :]
            for i, rec in enumerate(test_records):
                predicted = result.slope * (result.training_points + i) + result.intercept
                revenue_series.append(
                    RevenueSeriesPoint(date=rec.ts, actual=rec.value, predicted=round(predicted, 2))
                )
            # one extra point: the actual next-period forecast, no actual yet
            if records:
                from datetime import timedelta

                next_date = records[-1].ts + (records[-1].ts - records[-2].ts if len(records) > 1 else timedelta(days=7))
                revenue_series.append(RevenueSeriesPoint(date=next_date, actual=None, predicted=result.forecast_next))
        except InsufficientDataError:
            has_real_forecast = False

    return AnalyticsOut(
        has_real_forecast=has_real_forecast,
        revenue_series=revenue_series,
        model_performance=performance,
    )
