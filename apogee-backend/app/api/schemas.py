from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field


# ── Auth ──────────────────────────────────────────────
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str = Field(min_length=1)
    company: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    company: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ── Workspaces ────────────────────────────────────────
class WorkspaceCreate(BaseModel):
    name: str = Field(min_length=1)
    description: Optional[str] = None


class WorkspaceOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    models_count: int = 0

    class Config:
        from_attributes = True


# ── Data sources ──────────────────────────────────────
class DataSourceCreate(BaseModel):
    name: str
    source_type: str  # crm | database | analytics | payments | warehouse
    connection_config: Optional[str] = None


class DataSourceOut(BaseModel):
    id: int
    name: str
    source_type: str
    status: str
    last_sync_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class DataRecordOut(BaseModel):
    id: int
    ts: datetime
    value: float

    class Config:
        from_attributes = True


class RecordUploadResult(BaseModel):
    rows_imported: int
    rows_skipped: int


# ── Models ────────────────────────────────────────────
class ModelCreate(BaseModel):
    name: str = Field(min_length=1)
    model_type: str  # time_series | classification | regression | scenario | reasoning | prebuilt
    origin: str = "custom"  # prebuilt | template | custom
    target_metric: Optional[str] = None
    description: Optional[str] = None
    workspace_id: Optional[int] = None
    data_source_id: Optional[int] = None
    template_key: Optional[str] = None  # for prebuilt/template


class ModelUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    target_metric: Optional[str] = None
    description: Optional[str] = None
    workspace_id: Optional[int] = None
    data_source_id: Optional[int] = None


class ModelOut(BaseModel):
    id: int
    name: str
    model_type: str
    origin: str
    status: str
    target_metric: Optional[str] = None
    description: Optional[str] = None
    accuracy: Optional[float] = None
    runs_count: int
    workspace_id: Optional[int] = None
    data_source_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ModelRunOut(BaseModel):
    id: int
    model_id: int
    status: str
    accuracy: Optional[float] = None
    mae: Optional[float] = None
    mape: Optional[float] = None
    is_simulated: bool = True
    training_points: Optional[int] = None
    result_summary: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PrebuiltModel(BaseModel):
    key: str
    name: str
    model_type: str
    description: str
    target_metric: str


# ── Team ──────────────────────────────────────────────
class TeamMemberOut(BaseModel):
    id: int
    role: str
    status: str
    user: UserOut

    class Config:
        from_attributes = True


class TeamInvite(BaseModel):
    email: EmailStr
    role: str = "editor"


# ── Billing ───────────────────────────────────────────
class SubscriptionOut(BaseModel):
    plan: str
    status: str
    amount: float
    currency: str
    renews_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class InvoiceOut(BaseModel):
    id: int
    amount: float
    status: str
    invoice_date: datetime

    class Config:
        from_attributes = True


# ── Profile / organization ──────────────────────────────
class OrganizationOut(BaseModel):
    id: int
    name: str
    plan: str

    class Config:
        from_attributes = True


class MeOut(BaseModel):
    user: UserOut
    organization: OrganizationOut
    role: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=1)
    company: Optional[str] = None


class OrganizationUpdate(BaseModel):
    name: str = Field(min_length=1)


# ── Analytics ─────────────────────────────────────────
class RevenueSeriesPoint(BaseModel):
    date: datetime
    actual: Optional[float] = None
    predicted: Optional[float] = None


class ModelPerformanceItem(BaseModel):
    id: int
    name: str
    accuracy: Optional[float] = None
    is_simulated: bool
    status: str


class AnalyticsOut(BaseModel):
    has_real_forecast: bool
    revenue_series: list[RevenueSeriesPoint] = []
    model_performance: list[ModelPerformanceItem] = []


# ── Dashboard ─────────────────────────────────────────
class DashboardStats(BaseModel):
    models_count: int
    active_models: int
    data_sources_count: int
    workspaces_count: int
    team_count: int
