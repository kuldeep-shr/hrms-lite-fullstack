import os
import sys
from datetime import date, timedelta
from pathlib import Path
from typing import Optional


BACKEND_DIR = Path(__file__).resolve().parents[1]

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.chdir(BACKEND_DIR)

from pydantic import EmailStr
from sqlalchemy import select

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.attendance import Attendance
from app.models.employee import Employee
from app.schemas.attendance import AttendanceCreate, AttendanceStatus
from app.schemas.employee import Department, EmployeeCreate
from app.services.attendance_service import create_attendance
from app.services.employee_service import create_employee


ATTENDANCE_DAYS = 10

EMPLOYEE_FIXTURES = [
    {
        "employee_id": "EMP-1001",
        "full_name": "Ava Johnson",
        "email": "ava.johnson@example.com",
        "department": Department.engineering,
    },
    {
        "employee_id": "EMP-1002",
        "full_name": "Liam Carter",
        "email": "liam.carter@example.com",
        "department": Department.finance,
    },
    {
        "employee_id": "EMP-1003",
        "full_name": "Sophia Patel",
        "email": "sophia.patel@example.com",
        "department": Department.human_resources,
    },
    {
        "employee_id": "EMP-1004",
        "full_name": "Noah Martinez",
        "email": "noah.martinez@example.com",
        "department": Department.operations,
    },
    {
        "employee_id": "EMP-1005",
        "full_name": "Mia Thompson",
        "email": "mia.thompson@example.com",
        "department": Department.marketing,
    },
    {
        "employee_id": "EMP-1006",
        "full_name": "Ethan Walker",
        "email": "ethan.walker@example.com",
        "department": Department.it_support,
    },
]


def build_recent_workdays(days: int) -> list[date]:
    workdays = []
    current = date.today()

    while len(workdays) < days:
        if current.weekday() < 5:
            workdays.append(current)
        current -= timedelta(days=1)

    workdays.reverse()
    return workdays


def attendance_status_for(employee_index: int, day_index: int) -> AttendanceStatus:
    if (employee_index + day_index) % 6 == 0:
        return AttendanceStatus.absent
    return AttendanceStatus.present


def find_existing_employee(db, employee_id: str, email: EmailStr) -> Optional[Employee]:
    return db.scalar(
        select(Employee).where(
            (Employee.employee_id == employee_id) | (Employee.email == str(email))
        )
    )


def seed_employees(db) -> tuple[list[Employee], int, int]:
    employees = []
    created_count = 0
    existing_count = 0

    for fixture in EMPLOYEE_FIXTURES:
        employee = find_existing_employee(
            db,
            employee_id=fixture["employee_id"],
            email=fixture["email"],
        )

        if employee:
            existing_count += 1
        else:
            payload = EmployeeCreate(**fixture)
            employee = create_employee(db, payload)
            created_count += 1

        employees.append(employee)

    return employees, created_count, existing_count


def attendance_exists(db, employee_pk: int, attendance_date: date) -> bool:
    record = db.scalar(
        select(Attendance).where(
            Attendance.employee_id == employee_pk,
            Attendance.date == attendance_date,
        )
    )
    return record is not None


def seed_attendance(db, employees: list[Employee]) -> tuple[int, int]:
    created_count = 0
    skipped_count = 0
    recent_workdays = build_recent_workdays(ATTENDANCE_DAYS)

    for employee_index, employee in enumerate(employees):
        for day_index, attendance_date in enumerate(recent_workdays):
            if attendance_exists(db, employee.id, attendance_date):
                skipped_count += 1
                continue

            payload = AttendanceCreate(
                employee_id=employee.employee_id,
                date=attendance_date,
                status=attendance_status_for(employee_index, day_index),
            )
            create_attendance(db, payload)
            created_count += 1

    return created_count, skipped_count


def main() -> None:
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        employees, created_employees, existing_employees = seed_employees(db)
        created_attendance, skipped_attendance = seed_attendance(db, employees)

    print("Dummy data seed complete.")
    print(f"Employees created: {created_employees}")
    print(f"Employees already present: {existing_employees}")
    print(f"Attendance records created: {created_attendance}")
    print(f"Attendance records skipped: {skipped_attendance}")
    print("")
    print("Run from the backend directory with:")
    print("  .venv/bin/python scripts/seed_dummy_data.py")


if __name__ == "__main__":
    main()
