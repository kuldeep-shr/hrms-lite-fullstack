# HRMS Lite Fullstack

HRMS Lite is a full-stack employee management and attendance tracking application built with FastAPI, React, and PostgreSQL. It is designed for a lightweight admin workflow: create employees, track daily attendance, view employee-level attendance history, and monitor simple HR dashboard summaries from a clean single-page interface.

This repository is structured for:

- `Backend`: FastAPI + SQLAlchemy + PostgreSQL
- `Frontend`: React + Vite + Axios
- `Deployment`: Render for API, Vercel for UI
- `Database`: PostgreSQL, including Neon or Render Postgres

## Quick Deploy

Deploy backend on Render:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/kuldeep-shr/hrms-lite-fullstack)

Deploy frontend on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkuldeep-shr%2Fhrms-lite-fullstack&root-directory=frontend&install-command=npm%20install&build-command=npm%20run%20build&output-directory=dist&env=VITE_API_BASE_URL&envDescription=Enter%20your%20Render%20backend%20URL%20including%20%2Fapi%2Fv1.&envDefaults=%7B%22VITE_API_BASE_URL%22%3A%22https%3A%2F%2Fyour-render-service.onrender.com%2Fapi%2Fv1%22%7D)

Recommended deployment order:

1. Deploy the backend to Render first.
2. Copy the Render backend URL.
3. Deploy the frontend to Vercel and set `VITE_API_BASE_URL`.
4. Update Render `CORS_ORIGINS` with the final Vercel domain if needed.

## Core Features

- Add, list, and delete employees
- Enforce unique `employee_id` and `email`
- Mark attendance as `Present` or `Absent`
- View attendance history by employee
- Filter attendance records by date range
- Show total present days per employee
- Display dashboard summary cards for employees, departments, present days, and absent days
- Seed demo employees and attendance with a single script
- Deploy-ready structure for Render + Vercel

## Tech Stack

### Backend

- FastAPI
- SQLAlchemy 2.x
- Pydantic 2
- Psycopg 3
- PostgreSQL

### Frontend

- React
- Vite
- Axios
- Plain CSS

## Project Structure

```text
hrms_lite/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routers/
│   │   │   │   ├── attendance.py
│   │   │   │   └── employees.py
│   │   │   └── router.py
│   │   ├── core/
│   │   │   └── config.py
│   │   ├── db/
│   │   │   ├── base.py
│   │   │   └── session.py
│   │   ├── models/
│   │   │   ├── attendance.py
│   │   │   └── employee.py
│   │   ├── schemas/
│   │   │   ├── attendance.py
│   │   │   ├── common.py
│   │   │   └── employee.py
│   │   ├── services/
│   │   │   ├── attendance_service.py
│   │   │   └── employee_service.py
│   │   └── main.py
│   ├── scripts/
│   │   └── seed_dummy_data.py
│   ├── .env.example
│   ├── .python-version
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── components/
│   │   │   ├── AttendanceForm.jsx
│   │   │   ├── AttendanceRecords.jsx
│   │   │   ├── DashboardSummary.jsx
│   │   │   ├── EmployeeForm.jsx
│   │   │   └── EmployeeList.jsx
│   │   ├── constants/
│   │   │   └── departments.js
│   │   ├── styles/
│   │   │   └── app.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vercel.json
│   └── vite.config.js
├── .gitignore
├── README.md
└── render.yaml
```

## Functional Scope

### Employee Management

The admin can:

- Add a new employee
- View the employee list
- Delete an employee

Employee fields:

- `employee_id`
- `full_name`
- `email`
- `department`
- `created_at`

### Attendance Management

The admin can:

- Mark attendance for an employee
- View attendance history per employee
- Filter attendance by date range
- See present-day counts by employee

Attendance fields:

- `employee_id`
- `date`
- `status`

## Business Rules

- `employee_id` must be unique
- `email` must be unique and valid
- `department` must match an allowed enum value
- Each employee can have only one attendance record per date
- Deleting an employee also deletes related attendance records

### Allowed Departments

- `Engineering`
- `Human Resources`
- `Finance`
- `Marketing`
- `Sales`
- `Operations`
- `IT Support`

### Attendance Status Values

- `Present`
- `Absent`

## API Overview

Base URL:

```text
http://localhost:8000/api/v1
```

### Employee Endpoints

- `POST /employees`
- `GET /employees`
- `DELETE /employees/{employeeId}`

### Attendance Endpoints

- `POST /attendance`
- `GET /attendance/{employeeId}`

## Sample Requests

### Create Employee

```http
POST /api/v1/employees
Content-Type: application/json
```

```json
{
  "employee_id": "EMP-001",
  "full_name": "Ava Johnson",
  "email": "ava@company.com",
  "department": "Engineering"
}
```

### Mark Attendance

```http
POST /api/v1/attendance
Content-Type: application/json
```

```json
{
  "employee_id": "EMP-001",
  "date": "2026-03-16",
  "status": "Present"
}
```

### Response Format

Successful responses follow a consistent pattern:

```json
{
  "message": "Employees fetched successfully.",
  "data": []
}
```

## Local Development

### 1. Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Backend host:

```text
http://localhost:8000
```

Swagger docs:

```text
http://localhost:8000/docs
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend host:

```text
http://localhost:5173
```

## Environment Variables

### Backend

Example file: `backend/.env.example`

```env
APP_NAME=HRMS Lite API
APP_ENV=development
APP_DEBUG=true
API_PREFIX=/api/v1
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/hrms_lite
CORS_ORIGINS=["http://localhost:5173"]
```

### Frontend

Example file: `frontend/.env.example`

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Demo Seed Script

You can populate demo employees and attendance records with one command.

Run from the backend directory:

```bash
cd backend
.venv/bin/python scripts/seed_dummy_data.py
```

What it does:

- creates demo employees across multiple departments
- creates recent attendance history for each employee
- skips duplicates on rerun

## Deployment

### Backend on Render

The backend is configured for Render using `render.yaml`.

Render configuration summary:

- `rootDir`: `backend`
- `buildCommand`: `pip install -r requirements.txt`
- `startCommand`: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- `healthCheckPath`: `/health`

Steps:

1. Push this repository to GitHub.
2. In Render, create a new Blueprint deployment using the repo root.
3. Confirm the managed PostgreSQL database `hrms-lite-db`.
4. Set these backend variables:

```env
APP_ENV=production
APP_DEBUG=false
CORS_ORIGINS=["https://your-vercel-app.vercel.app"]
DATABASE_URL=<provided-by-render-or-your-postgres-provider>
```

5. Deploy the service.
6. Verify:

```text
https://your-render-service.onrender.com/health
https://your-render-service.onrender.com/docs
```

Python is pinned to `3.11` using [backend/.python-version](/Users/nk/Desktop/hrms_lite/backend/.python-version).
Python is pinned to `3.11` using `backend/.python-version`.

### Frontend on Vercel

The frontend is configured for Vercel using `frontend/vercel.json`.

Recommended Vercel settings:

```text
Framework Preset: Vite
Root Directory: frontend
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

Required frontend variable:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com/api/v1
```

After changing `VITE_API_BASE_URL`, redeploy the frontend so the new build-time value is applied.

## Production Checklist

- Render backend deploy succeeds
- Render `/health` returns `200`
- Vercel frontend uses `frontend` as the root directory
- Vercel output directory is `dist`
- `VITE_API_BASE_URL` points to the Render API with `/api/v1`
- Render `CORS_ORIGINS` contains the actual Vercel production domain
- PostgreSQL `DATABASE_URL` is configured

## Useful Commands

### Start Backend

```bash
cd backend
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Start Frontend

```bash
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173
```

### Build Frontend

```bash
cd frontend
npm run build
```

### Seed Dummy Data

```bash
cd backend
.venv/bin/python scripts/seed_dummy_data.py
```

## Notes

- Tables are created automatically on backend startup
- This project currently uses SQLAlchemy metadata creation, not Alembic migrations
- For larger production systems, add migrations, authentication, audit logs, and pagination
- The current dashboard summaries are computed client-side from attendance records
