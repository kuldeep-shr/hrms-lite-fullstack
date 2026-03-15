from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import ApiResponse
from app.schemas.employee import EmployeeCreate, EmployeeRead
from app.services.employee_service import (
    create_employee,
    delete_employee,
    list_employees,
)


router = APIRouter()


@router.post("", response_model=ApiResponse[EmployeeRead], status_code=status.HTTP_201_CREATED)
def create_employee_endpoint(payload: EmployeeCreate, db: Session = Depends(get_db)) -> ApiResponse[EmployeeRead]:
    employee = create_employee(db, payload)
    return ApiResponse(message="Employee created successfully.", data=employee)


@router.get("", response_model=ApiResponse[list[EmployeeRead]])
def list_employees_endpoint(db: Session = Depends(get_db)) -> ApiResponse[list[EmployeeRead]]:
    employees = list_employees(db)
    return ApiResponse(message="Employees fetched successfully.", data=employees)


@router.delete("/{employee_id}", response_model=ApiResponse[dict])
def delete_employee_endpoint(employee_id: str, db: Session = Depends(get_db)) -> ApiResponse[dict]:
    delete_employee(db, employee_id)
    return ApiResponse(message="Employee deleted successfully.", data={"employeeId": employee_id})
