# Apogee Backend v0.2

Python FastAPI + SQLite with full tables and model functionality.

## Tables
- users, organizations, team_members
- workspaces, data_sources
- models, model_runs
- subscriptions, invoices

## Setup

```bash
cd apogee-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# If you had an old apogee.db from v0.1, delete it first:
rm -f apogee.db

uvicorn app.main:app --reload --port 8000
```

Docs: http://localhost:8000/docs

## Main endpoints

### Auth
- POST `/api/auth/signup` — creates user + organization + admin membership
- POST `/api/auth/login`
- GET `/api/auth/me`

### Models
- GET `/api/models/prebuilt` — ready-made models from Apogee
- GET `/api/models` — your models
- POST `/api/models` — create (custom or from prebuilt via `template_key`)
- POST `/api/models/{id}/run` — simulate a run (sets status active + accuracy)
- DELETE `/api/models/{id}`

### Other
- CRUD-ish: `/api/workspaces`, `/api/data-sources`
- GET `/api/team`
- GET `/api/dashboard`
- GET `/api/billing/subscription`
