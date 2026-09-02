import random
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_user_org
from app.api.schemas import ModelCreate, ModelOut, ModelRunOut, ModelUpdate, PrebuiltModel
from app.db.models import DataRecord, Model, ModelRun, User
from app.db.session import get_db
from app.services.forecast import InsufficientDataError, train_and_evaluate
from app.services.prebuilt import PREBUILT_MODELS, get_prebuilt

# Model types with a real training path implemented. Anything else still
# falls back to a simulated run — clearly flagged via `is_simulated` on the
# response rather than silently mixed in with genuine results.
REAL_TRAINING_TYPES = {"time_series"}

router = APIRouter(prefix="/api/models", tags=["models"])


@router.get("/prebuilt", response_model=list[PrebuiltModel])
def list_prebuilt():
    return PREBUILT_MODELS


@router.get("", response_model=list[ModelOut])
def list_models(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = get_user_org(user, db)
    rows = db.query(Model).filter(Model.organization_id == org.id).order_by(Model.updated_at.desc()).all()
    return [ModelOut.model_validate(r) for r in rows]


@router.post("", response_model=ModelOut, status_code=201)
def create_model(
    payload: ModelCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    org = get_user_org(user, db)

    name = payload.name
    model_type = payload.model_type
    origin = payload.origin
    target = payload.target_metric
    description = payload.description

    if payload.template_key or origin in ("prebuilt", "template"):
        key = payload.template_key
        if not key:
            raise HTTPException(status_code=400, detail="template_key required for prebuilt/template")
        pb = get_prebuilt(key)
        if not pb:
            raise HTTPException(status_code=404, detail="Prebuilt model not found")
        name = payload.name or pb.name
        model_type = pb.model_type
        origin = "prebuilt"
        target = target or pb.target_metric
        description = description or pb.description

    model = Model(
        organization_id=org.id,
        workspace_id=payload.workspace_id,
        data_source_id=payload.data_source_id,
        owner_id=user.id,
        name=name,
        model_type=model_type,
        origin=origin,
        status="draft",
        target_metric=target,
        description=description,
    )
    db.add(model)
    db.commit()
    db.refresh(model)
    return ModelOut.model_validate(model)


@router.get("/{model_id}", response_model=ModelOut)
def get_model(model_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = get_user_org(user, db)
    model = db.query(Model).filter(Model.id == model_id, Model.organization_id == org.id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return ModelOut.model_validate(model)


@router.patch("/{model_id}", response_model=ModelOut)
def update_model(
    model_id: int,
    payload: ModelUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    org = get_user_org(user, db)
    model = db.query(Model).filter(Model.id == model_id, Model.organization_id == org.id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(model, field, value)
    model.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(model)
    return ModelOut.model_validate(model)


@router.delete("/{model_id}", status_code=204)
def delete_model(model_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = get_user_org(user, db)
    model = db.query(Model).filter(Model.id == model_id, Model.organization_id == org.id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    db.delete(model)
    db.commit()


@router.get("/{model_id}/runs", response_model=list[ModelRunOut])
def list_runs(model_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = get_user_org(user, db)
    model = db.query(Model).filter(Model.id == model_id, Model.organization_id == org.id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    rows = (
        db.query(ModelRun)
        .filter(ModelRun.model_id == model.id)
        .order_by(ModelRun.created_at.desc())
        .all()
    )
    return [ModelRunOut.model_validate(r) for r in rows]


@router.post("/{model_id}/run", response_model=ModelRunOut)
def run_model(model_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = get_user_org(user, db)
    model = db.query(Model).filter(Model.id == model_id, Model.organization_id == org.id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    if model.model_type in REAL_TRAINING_TYPES and model.data_source_id:
        run = _run_real_forecast(model, db)
    else:
        # No real training path for this model_type yet, or no data
        # source attached to train against. Simulated, and reported as
        # such rather than presented as a genuine result.
        reason = (
            "no data source linked"
            if model.model_type in REAL_TRAINING_TYPES
            else f"real training not yet implemented for '{model.model_type}'"
        )
        accuracy = round(random.uniform(0.82, 0.97), 3)
        run = ModelRun(
            model_id=model.id,
            status="completed",
            accuracy=accuracy,
            is_simulated=True,
            result_summary=f"Simulated run ({reason}). No real data was used.",
        )
        model.accuracy = accuracy * 100

    model.status = "active"
    model.runs_count = (model.runs_count or 0) + 1
    model.updated_at = datetime.now(timezone.utc)
    db.add(run)
    db.commit()
    db.refresh(run)
    return ModelRunOut.model_validate(run)


def _run_real_forecast(model: Model, db: Session) -> ModelRun:
    records = (
        db.query(DataRecord)
        .filter(DataRecord.data_source_id == model.data_source_id)
        .order_by(DataRecord.ts.asc())
        .all()
    )
    values = [r.value for r in records]

    try:
        result = train_and_evaluate(values)
    except InsufficientDataError as e:
        return ModelRun(
            model_id=model.id,
            status="failed",
            is_simulated=False,
            result_summary=str(e),
        )

    # accuracy field kept for the UI's existing "Accuracy: X%" display;
    # here it's a genuine 100 - MAPE, not a random draw.
    accuracy_pct = round(max(0.0, 100 - result.mape), 1)
    model.accuracy = accuracy_pct

    return ModelRun(
        model_id=model.id,
        status="completed",
        accuracy=accuracy_pct,
        mae=result.mae,
        mape=result.mape,
        is_simulated=False,
        training_points=result.training_points,
        result_summary=(
            f"Trained on {result.training_points} points, tested on {result.test_points}. "
            f"MAE {result.mae}, MAPE {result.mape}%. Next-period forecast: {result.forecast_next}."
        ),
    )
