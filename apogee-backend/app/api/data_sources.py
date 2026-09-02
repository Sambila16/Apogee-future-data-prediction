import csv
import io
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_user_org
from app.api.schemas import DataSourceCreate, DataSourceOut, DataRecordOut, RecordUploadResult
from app.db.models import DataSource, DataRecord, User
from app.db.session import get_db

router = APIRouter(prefix="/api/data-sources", tags=["data-sources"])


@router.get("", response_model=list[DataSourceOut])
def list_sources(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = get_user_org(user, db)
    rows = db.query(DataSource).filter(DataSource.organization_id == org.id).order_by(DataSource.created_at.desc()).all()
    return [DataSourceOut.model_validate(r) for r in rows]


@router.post("", response_model=DataSourceOut, status_code=201)
def create_source(
    payload: DataSourceCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    org = get_user_org(user, db)
    src = DataSource(
        organization_id=org.id,
        name=payload.name,
        source_type=payload.source_type,
        status="healthy",
        connection_config=payload.connection_config,
        last_sync_at=datetime.now(timezone.utc),
    )
    db.add(src)
    db.commit()
    db.refresh(src)
    return DataSourceOut.model_validate(src)


@router.delete("/{source_id}", status_code=204)
def delete_source(source_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = get_user_org(user, db)
    src = db.query(DataSource).filter(DataSource.id == source_id, DataSource.organization_id == org.id).first()
    if not src:
        raise HTTPException(status_code=404, detail="Data source not found")
    db.delete(src)
    db.commit()


def _get_source(source_id: int, user: User, db: Session) -> DataSource:
    org = get_user_org(user, db)
    src = db.query(DataSource).filter(DataSource.id == source_id, DataSource.organization_id == org.id).first()
    if not src:
        raise HTTPException(status_code=404, detail="Data source not found")
    return src


@router.get("/{source_id}/records", response_model=list[DataRecordOut])
def list_records(source_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    src = _get_source(source_id, user, db)
    rows = db.query(DataRecord).filter(DataRecord.data_source_id == src.id).order_by(DataRecord.ts.asc()).all()
    return [DataRecordOut.model_validate(r) for r in rows]


@router.post("/{source_id}/records/upload", response_model=RecordUploadResult)
def upload_records(
    source_id: int,
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload a CSV with columns `date,value` (e.g. 2026-01-01,4820.50).
    Replaces any existing records for this data source so re-uploads
    are idempotent rather than accumulating duplicates.
    """
    src = _get_source(source_id, user, db)

    raw = file.file.read().decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(raw))
    fieldnames = [f.strip().lower() for f in (reader.fieldnames or [])]
    if "date" not in fieldnames or "value" not in fieldnames:
        raise HTTPException(status_code=400, detail="CSV must have 'date' and 'value' columns")

    parsed: list[tuple[datetime, float]] = []
    errors = 0
    for row in reader:
        date_str = (row.get("date") or row.get("Date") or "").strip()
        value_str = (row.get("value") or row.get("Value") or "").strip()
        try:
            ts = datetime.fromisoformat(date_str).replace(tzinfo=timezone.utc)
            value = float(value_str)
            parsed.append((ts, value))
        except (ValueError, TypeError):
            errors += 1

    if not parsed:
        raise HTTPException(status_code=400, detail="No valid rows found in CSV")

    db.query(DataRecord).filter(DataRecord.data_source_id == src.id).delete()
    for ts, value in parsed:
        db.add(DataRecord(data_source_id=src.id, ts=ts, value=value))

    src.last_sync_at = datetime.now(timezone.utc)
    src.status = "healthy"
    db.commit()

    return RecordUploadResult(rows_imported=len(parsed), rows_skipped=errors)
