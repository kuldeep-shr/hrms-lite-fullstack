from fastapi import APIRouter

from app.api.routers import attendance, employees


api_router = APIRouter()
api_router.include_router(employees.router, prefix="/employees", tags=["Employees"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["Attendance"])
