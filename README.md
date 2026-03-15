# HRMS Lite Fullstack

HRMS Lite is a full-stack employee management and attendance tracking app built with:

- `Backend`: FastAPI + SQLAlchemy + PostgreSQL
- `Frontend`: React + Vite + Axios
- `Deploy`: Render + Vercel

## Features

- Employee management: add, list, delete
- Attendance management: mark present/absent, view history
- Department enum validation
- Dashboard summary
- Seed script for demo data
- GitHub Actions cron job to reduce Render free-tier cold starts

## Project Structure

```text
backend/                  FastAPI app
backend/scripts/          Seed script
frontend/                 React app
render.yaml               Render backend config
.github/workflows/        GitHub Actions keepalive workflow
```

## Local Setup

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Environment Variables

### Backend

File: `backend/.env`

```env
APP_NAME=HRMS Lite API
APP_ENV=development
APP_DEBUG=true
API_PREFIX=/api/v1
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/hrms_lite
CORS_ORIGINS=["http://localhost:5173"]
```

### Frontend

File: `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Seed Demo Data

Run from `backend`:

```bash
.venv/bin/python scripts/seed_dummy_data.py
```

This script:

- creates sample employees
- creates sample attendance
- skips duplicates on rerun

## API Routes

- `POST /api/v1/employees`
- `GET /api/v1/employees`
- `DELETE /api/v1/employees/{employeeId}`
- `POST /api/v1/attendance`
- `GET /api/v1/attendance/{employeeId}`

## Deployment Setup

### 1. Deploy Backend on Render

This repo already includes `render.yaml`.

Important backend env values on Render:

```env
APP_ENV=production
APP_DEBUG=false
CORS_ORIGINS=["https://your-vercel-app.vercel.app"]
DATABASE_URL=<your-postgres-url>
```

Backend API base should look like:

```text
https://your-render-service.onrender.com/api/v1
```

Health check:

```text
https://your-render-service.onrender.com/health
```

### 2. Deploy Frontend on Vercel

Set:

- Root Directory: `frontend`
- Framework: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Frontend env value:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com/api/v1
```

## CORS Setup

If frontend is deployed on Vercel, Render must allow that origin.

Example:

```env
CORS_ORIGINS=["https://your-vercel-app.vercel.app"]
```

If you also want local frontend access:

```env
CORS_ORIGINS=["https://your-vercel-app.vercel.app","http://localhost:5173"]
```

Important:

- `CORS_ORIGINS` must be a JSON array string
- use `/api/v1` in `VITE_API_BASE_URL`
- use `/employees`, not `/employee`

## GitHub Actions Keepalive

File:

```text
.github/workflows/keep-render-awake.yml
```

What it does:

- sends a request to the Render `/health` endpoint every 10 minutes
- helps reduce free Render cold starts

Current workflow target:

```text
https://hrms-lite-api-b8o0.onrender.com/health
```

If your Render URL changes, update this file.

## How To Check GitHub Action Is Working

1. Open your GitHub repo.
2. Go to the `Actions` tab.
3. Open workflow: `Keep Render Awake`.
4. You should see scheduled runs every 10 minutes.
5. Open the latest run.
6. The job `ping-render` should be green.
7. Inside the logs, step `Ping Render health endpoint` should complete without error.

Expected result:

- workflow status shows `Success`
- Render `/health` returns `200 OK`

If it fails:

- check whether GitHub Actions is enabled for the repo
- check whether the Render URL in the workflow is correct
- check whether the Render service is still live

## Useful Commands

### Build Frontend

```bash
cd frontend
npm run build
```

### Push Latest Changes

```bash
cd /Users/nk/Desktop/hrms_lite
git push origin main
```
