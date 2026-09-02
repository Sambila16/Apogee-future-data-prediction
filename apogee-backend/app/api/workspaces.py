from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_user_org
from app.api.schemas import WorkspaceCreate, WorkspaceOut
from app.db.models import Model, User, Workspace
from app.db.session import get_db

router = APIRouter(prefix="/api/workspaces", tags=["workspaces"])


@router.get("", response_model=list[WorkspaceOut])
def list_workspaces(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = get_user_org(user, db)
    rows = db.query(Workspace).filter(Workspace.organization_id == org.id).order_by(Workspace.updated_at.desc()).all()
    out = []
    for w in rows:
        count = db.query(Model).filter(Model.workspace_id == w.id).count()
        item = WorkspaceOut.model_validate(w)
        item.models_count = count
        out.append(item)
    return out


@router.post("", response_model=WorkspaceOut, status_code=201)
def create_workspace(
    payload: WorkspaceCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    org = get_user_org(user, db)
    ws = Workspace(organization_id=org.id, name=payload.name, description=payload.description)
    db.add(ws)
    db.commit()
    db.refresh(ws)
    item = WorkspaceOut.model_validate(ws)
    item.models_count = 0
    return item


@router.delete("/{workspace_id}", status_code=204)
def delete_workspace(workspace_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = get_user_org(user, db)
    ws = db.query(Workspace).filter(Workspace.id == workspace_id, Workspace.organization_id == org.id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")
    db.delete(ws)
    db.commit()
