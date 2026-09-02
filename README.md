# Apogee — Full Stack (Backend + Frontend)

This repository contains two projects in a single repository:

- `apogee-backend` — FastAPI backend (SQLite by default)
- `apogee-full` — Vite + React/TypeScript frontend

Quick start
-----------

Prerequisites
- Python 3.10+ (recommended)
- Node.js 18+ and npm/yarn

Run the backend
---------------
Open a terminal in `apogee-backend` and create a virtual environment, install requirements, and start the server:

```powershell
cd apogee-backend
python -m venv venv
venv\Scripts\Activate.ps1   # PowerShell
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Notes:
- The project uses `sqlite:///./apogee.db` by default. The file is included in `.gitignore` for safety.
- To reset the DB, stop the server and remove `apogee.db` (the app or migrations will recreate it if supported).

Run the frontend
----------------
Open a terminal in `apogee-full` and install and start the dev server:

```bash
cd apogee-full
npm install
npm run dev
```

Configuration
-------------
- Backend settings are in `apogee-backend/app/core/config.py`.
- Replace any secrets before publishing or sharing.

Security & housekeeping
-----------------------
- Do not commit `venv/`, `node_modules/`, or secret files. `.gitignore` files are already present in subprojects.
- Remove or rotate any development secrets before making the repo public.

Contributing
------------
- Submit PRs against `main` or open issues for discussion.

Contact
-------
For questions, check the repository on GitHub or open an issue.
