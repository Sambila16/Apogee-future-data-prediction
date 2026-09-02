# Apogee Full Stack

React frontend + Python FastAPI backend with real auth, tables, and models.

## Run

**Backend**
```bash
cd apogee-backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
rm -f apogee.db   # only if upgrading from older schema
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd apogee-full
npm install
npm run dev
```

## Flow
1. Sign up → user + org created in DB
2. Open **Models** → New model
3. Choose **Pre-built** (from Apogee) or **Custom**
4. Click **Run** on a model → status becomes active, accuracy stored
5. Workspaces / Data sources / Team / Dashboard all use the API
