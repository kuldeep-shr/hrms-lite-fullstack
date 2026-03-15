from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.attendance import AttendanceCreate, AttendanceRead
from app.schemas.common import ApiResponse
from app.services.attendance_service import create_attendance, get_employee_attendance


router = APIRouter()


@router.post("", response_model=ApiResponse[AttendanceRead], status_code=status.HTTP_201_CREATED)
def create_attendance_endpoint(
    payload: AttendanceCreate,
    db: Session = Depends(get_db),
) -> ApiResponse[AttendanceRead]:
    attendance = create_attendance(db, payload)
    return ApiResponse(message="Attendance recorded successfully.", data=attendance)


@router.get("/{employee_id}", response_model=ApiResponse[list[AttendanceRead]])
def get_employee_attendance_endpoint(
    employee_id: str,
    db: Session = Depends(get_db),
) -> ApiResponse[list[AttendanceRead]]:
    attendance_records = get_employee_attendance(db, employee_id)
    return ApiResponse(message="Attendance fetched successfully.", data=attendance_records)
