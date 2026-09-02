from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.models_api import router as models_router
from app.api.workspaces import router as workspaces_router
from app.api.data_sources import router as data_sources_router
from app.api.team import router as team_router
from app.api.dashboard import router as dashboard_router
from app.api.me import router as me_router
from app.api.analytics import router as analytics_router
from app.core.config import settings
from app.db.session import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME, version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(models_router)
app.include_router(workspaces_router)
app.include_router(data_sources_router)
app.include_router(team_router)
app.include_router(dashboard_router)
app.include_router(me_router)
app.include_router(analytics_router)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "apogee-api", "version": "0.2.0"}
