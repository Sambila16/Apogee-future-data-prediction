from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_user_org
from app.api.schemas import MeOut, OrganizationOut, OrganizationUpdate, UserOut, UserUpdate
from app.db.models import TeamMember, User
from app.db.session import get_db

router = APIRouter(prefix="/api", tags=["profile"])


def _role_for(user: User, db: Session) -> str:
    membership = (
        db.query(TeamMember)
        .filter(TeamMember.user_id == user.id, TeamMember.status == "active")
        .first()
    )
    return membership.role if membership else "viewer"


@router.get("/me", response_model=MeOut)
def get_me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = get_user_org(user, db)
    return MeOut(
        user=UserOut.model_validate(user),
        organization=OrganizationOut.model_validate(org),
        role=_role_for(user, db),
    )


@router.put("/me", response_model=UserOut)
def update_me(payload: UserUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.full_name is not None:
        user.full_name = payload.full_name
    if payload.company is not None:
        user.company = payload.company
    db.commit()
    db.refresh(user)
    return UserOut.model_validate(user)


@router.put("/organization", response_model=OrganizationOut)
def update_organization(
    payload: OrganizationUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    org = get_user_org(user, db)
    role = _role_for(user, db)
    if role != "admin":
        raise HTTPException(status_code=403, detail="Only organization admins can update organization settings")
    org.name = payload.name
    db.commit()
    db.refresh(org)
    return OrganizationOut.model_validate(org)
