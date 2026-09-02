from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.api.schemas import Token, UserCreate, UserLogin, UserOut
from app.core.security import create_access_token, hash_password, verify_password
from app.db.models import User, Organization, TeamMember, Subscription
from app.db.session import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _bootstrap_org(db: Session, user: User, company: str | None) -> None:
    org = Organization(name=company or f"{user.full_name}'s Organization", plan="professional")
    db.add(org)
    db.flush()
    db.add(TeamMember(organization_id=org.id, user_id=user.id, role="admin", status="active"))
    db.add(
        Subscription(
            organization_id=org.id,
            plan="professional",
            status="active",
            amount=149.0,
        )
    )


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=payload.email.lower(),
        full_name=payload.full_name,
        company=payload.company,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.flush()
    _bootstrap_org(db, user, payload.company)
    db.commit()
    db.refresh(user)

    token = create_access_token(str(user.id))
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(str(user.id))
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return UserOut.model_validate(user)
