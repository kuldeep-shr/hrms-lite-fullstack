from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class Department(str, Enum):
    engineering = "Engineering"
    human_resources = "Human Resources"
    finance = "Finance"
    marketing = "Marketing"
    sales = "Sales"
    operations = "Operations"
    it_support = "IT Support"

    @classmethod
    def _missing_(cls, value):
        if isinstance(value, str):
            normalized_value = value.strip().lower()
            for member in cls:
                if normalized_value == member.value.lower():
                    return member
        return None


class EmployeeCreate(BaseModel):
    employee_id: str = Field(..., min_length=2, max_length=50)
    full_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    department: Department


class EmployeeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    employee_id: str
    full_name: str
    email: EmailStr
    department: Department
    created_at: datetime
