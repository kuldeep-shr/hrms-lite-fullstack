from datetime import date as dt_date
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class AttendanceStatus(str, Enum):
    present = "Present"
    absent = "Absent"


class AttendanceCreate(BaseModel):
    employee_id: str = Field(..., min_length=2, max_length=50)
    date: dt_date
    status: AttendanceStatus


class AttendanceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    employee_id: str
    full_name: str
    date: dt_date
    status: AttendanceStatus
