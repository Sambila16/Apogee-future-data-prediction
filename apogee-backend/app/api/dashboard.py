from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_user_org
from app.api.schemas import DashboardStats, SubscriptionOut, InvoiceOut
from app.db.models import DataSource, Model, TeamMember, User, Workspace, Subscription, Invoice
from app.db.session import get_db

router = APIRouter(prefix="/api", tags=["dashboard"])


@router.get("/dashboard", response_model=DashboardStats)
def dashboard(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = get_user_org(user, db)
    return DashboardStats(
        models_count=db.query(Model).filter(Model.organization_id == org.id).count(),
        active_models=db.query(Model).filter(Model.organization_id == org.id, Model.status == "active").count(),
        data_sources_count=db.query(DataSource).filter(DataSource.organization_id == org.id).count(),
        workspaces_count=db.query(Workspace).filter(Workspace.organization_id == org.id).count(),
        team_count=db.query(TeamMember).filter(TeamMember.organization_id == org.id).count(),
    )


@router.get("/billing/subscription", response_model=SubscriptionOut | None)
def get_subscription(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = get_user_org(user, db)
    sub = db.query(Subscription).filter(Subscription.organization_id == org.id).first()
    return SubscriptionOut.model_validate(sub) if sub else None


@router.get("/billing/invoices", response_model=list[InvoiceOut])
def list_invoices(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = get_user_org(user, db)
    rows = db.query(Invoice).filter(Invoice.organization_id == org.id).order_by(Invoice.invoice_date.desc()).all()
    return [InvoiceOut.model_validate(r) for r in rows]
