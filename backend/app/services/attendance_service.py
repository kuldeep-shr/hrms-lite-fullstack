from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.models.employee import Employee
from app.schemas.attendance import AttendanceCreate, AttendanceRead
from app.services.employee_service import get_employee_by_public_id


def create_attendance(db: Session, payload: AttendanceCreate) -> AttendanceRead:
    employee = get_employee_by_public_id(db, payload.employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )

    existing_record = db.scalar(
        select(Attendance).where(
            Attendance.employee_id == employee.id,
            Attendance.date == payload.date,
        )
    )
    if existing_record:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Attendance for this employee and date already exists.",
        )

    attendance = Attendance(
        employee_id=employee.id,
        date=payload.date,
        status=payload.status.value,
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)

    return AttendanceRead(
        employee_id=employee.employee_id,
        full_name=employee.full_name,
        date=attendance.date,
        status=attendance.status,
    )


def get_employee_attendance(db: Session, employee_id: str) -> list[AttendanceRead]:
    employee = get_employee_by_public_id(db, employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )

    records = db.scalars(
        select(Attendance)
        .where(Attendance.employee_id == employee.id)
        .order_by(Attendance.date.desc())
    )
    return [
        AttendanceRead(
            employee_id=employee.employee_id,
            full_name=employee.full_name,
            date=record.date,
            status=record.status,
        )
        for record in records
    ]
