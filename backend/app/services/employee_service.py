from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate


def create_employee(db: Session, payload: EmployeeCreate) -> Employee:
    existing_employee = db.scalar(
        select(Employee).where(
            (Employee.employee_id == payload.employee_id) | (Employee.email == payload.email)
        )
    )
    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Employee with the same employee ID or email already exists.",
        )

    employee = Employee(
        employee_id=payload.employee_id,
        full_name=payload.full_name,
        email=payload.email,
        department=payload.department.value,
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


def list_employees(db: Session) -> list[Employee]:
    result = db.scalars(select(Employee).order_by(Employee.created_at.desc()))
    return list(result)


def get_employee_by_public_id(db: Session, employee_id: str) -> Optional[Employee]:
    return db.scalar(select(Employee).where(Employee.employee_id == employee_id))


def delete_employee(db: Session, employee_id: str) -> None:
    employee = get_employee_by_public_id(db, employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )

    db.delete(employee)
    db.commit()
