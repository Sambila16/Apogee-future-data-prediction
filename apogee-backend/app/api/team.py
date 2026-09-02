from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_user_org
from app.api.schemas import TeamMemberOut, UserOut
from app.db.models import TeamMember, User
from app.db.session import get_db

router = APIRouter(prefix="/api/team", tags=["team"])


@router.get("", response_model=list[TeamMemberOut])
def list_team(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = get_user_org(user, db)
    rows = (
        db.query(TeamMember)
        .filter(TeamMember.organization_id == org.id)
        .order_by(TeamMember.created_at.asc())
        .all()
    )
    out = []
    for m in rows:
        out.append(
            TeamMemberOut(
                id=m.id,
                role=m.role,
                status=m.status,
                user=UserOut.model_validate(m.user),
            )
        )
    return out
