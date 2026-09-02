from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import String, DateTime, Integer, Float, Text, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    company: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    memberships = relationship("TeamMember", back_populates="user")
    models = relationship("Model", back_populates="owner")


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    plan: Mapped[str] = mapped_column(String(50), default="starter")  # starter | professional | enterprise
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    members = relationship("TeamMember", back_populates="organization")
    workspaces = relationship("Workspace", back_populates="organization")
    data_sources = relationship("DataSource", back_populates="organization")
    models = relationship("Model", back_populates="organization")


class TeamMember(Base):
    __tablename__ = "team_members"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="editor")  # admin | editor | viewer
    status: Mapped[str] = mapped_column(String(50), default="active")  # active | invited
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    organization = relationship("Organization", back_populates="members")
    user = relationship("User", back_populates="memberships")


class Workspace(Base):
    __tablename__ = "workspaces"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    organization = relationship("Organization", back_populates="workspaces")
    models = relationship("Model", back_populates="workspace")


class DataSource(Base):
    __tablename__ = "data_sources"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    source_type: Mapped[str] = mapped_column(String(100), nullable=False)  # crm | database | analytics | payments | warehouse
    status: Mapped[str] = mapped_column(String(50), default="healthy")  # healthy | warning | error
    connection_config: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON string
    last_sync_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    organization = relationship("Organization", back_populates="data_sources")
    models = relationship("Model", back_populates="data_source")
    records = relationship("DataRecord", back_populates="data_source", cascade="all, delete-orphan")


class DataRecord(Base):
    """A single historical data point belonging to a DataSource.
    Minimal shape for time-series work: a timestamp and a numeric value
    (e.g. one day's revenue). Real ingestion (CRM/warehouse sync) can
    populate this later; for now it's filled via CSV upload.
    """

    __tablename__ = "data_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    data_source_id: Mapped[int] = mapped_column(ForeignKey("data_sources.id"), nullable=False, index=True)
    ts: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    value: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    data_source = relationship("DataSource", back_populates="records")


class Model(Base):
    __tablename__ = "models"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), nullable=False)
    workspace_id: Mapped[Optional[int]] = mapped_column(ForeignKey("workspaces.id"), nullable=True)
    data_source_id: Mapped[Optional[int]] = mapped_column(ForeignKey("data_sources.id"), nullable=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    model_type: Mapped[str] = mapped_column(String(100), nullable=False)
    # time_series | classification | regression | scenario | reasoning | prebuilt
    origin: Mapped[str] = mapped_column(String(50), default="custom")  # prebuilt | template | custom
    status: Mapped[str] = mapped_column(String(50), default="draft")  # draft | training | active | failed
    target_metric: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    accuracy: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    runs_count: Mapped[int] = mapped_column(Integer, default=0)
    config: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    organization = relationship("Organization", back_populates="models")
    workspace = relationship("Workspace", back_populates="models")
    data_source = relationship("DataSource", back_populates="models")
    owner = relationship("User", back_populates="models")
    runs = relationship("ModelRun", back_populates="model", cascade="all, delete-orphan")


class ModelRun(Base):
    __tablename__ = "model_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    model_id: Mapped[int] = mapped_column(ForeignKey("models.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="completed")  # running | completed | failed
    accuracy: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # legacy/simulated only; see is_simulated
    mae: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # mean absolute error, real forecasts only
    mape: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # mean absolute % error, real forecasts only
    is_simulated: Mapped[bool] = mapped_column(Boolean, default=True)  # False once trained on real data
    training_points: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    result_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    model = relationship("Model", back_populates="runs")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), nullable=False)
    plan: Mapped[str] = mapped_column(String(50), default="professional")
    status: Mapped[str] = mapped_column(String(50), default="active")
    amount: Mapped[float] = mapped_column(Float, default=149.0)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    renews_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="paid")
    invoice_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
