import { useEffect, useState } from "react";

import apiClient from "./api/client";
import AttendanceForm from "./components/AttendanceForm";
import AttendanceRecords from "./components/AttendanceRecords";
import DashboardSummary from "./components/DashboardSummary";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";

function App() {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceSummaryByEmployee, setAttendanceSummaryByEmployee] = useState({});
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [submittingEmployee, setSubmittingEmployee] = useState(false);
  const [submittingAttendance, setSubmittingAttendance] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(false);
  const [banner, setBanner] = useState({ type: "", message: "" });

  const showBanner = (type, message) => {
    setBanner({ type, message });
  };

  const unwrapError = (error, fallbackMessage) =>
    error?.response?.data?.detail || error?.response?.data?.message || fallbackMessage;

  const calculateAttendanceSummary = (records) => {
    return records.reduce(
      (summary, record) => {
        summary.totalRecords += 1;
        if (record.status === "Present") {
          summary.presentDays += 1;
        } else {
          summary.absentDays += 1;
        }

        return summary;
      },
      {
        totalRecords: 0,
        presentDays: 0,
        absentDays: 0,
      },
    );
  };

  const fetchAttendanceSummaries = async (employeeList) => {
    if (employeeList.length === 0) {
      setAttendanceSummaryByEmployee({});
      return;
    }

    setLoadingSummary(true);
    try {
      const responses = await Promise.all(
        employeeList.map((employee) => apiClient.get(`/attendance/${employee.employee_id}`)),
      );

      const summaryMap = employeeList.reduce((summary, employee, index) => {
        summary[employee.employee_id] = calculateAttendanceSummary(responses[index].data.data);
        return summary;
      }, {});

      setAttendanceSummaryByEmployee(summaryMap);
    } catch (error) {
      showBanner("error", unwrapError(error, "Unable to load attendance summaries."));
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await apiClient.get("/employees");
      const data = response.data.data;
      setEmployees(data);

      if (data.length === 0) {
        setSelectedEmployeeId("");
        setAttendanceRecords([]);
        setAttendanceSummaryByEmployee({});
        return;
      }

      await fetchAttendanceSummaries(data);

      setSelectedEmployeeId((current) => {
        if (current && data.some((employee) => employee.employee_id === current)) {
          return current;
        }
        return data[0].employee_id;
      });
    } catch (error) {
      showBanner("error", unwrapError(error, "Unable to load employees."));
    }
  };

  const fetchAttendance = async (employeeId) => {
    if (!employeeId) {
      setAttendanceRecords([]);
      return;
    }

    setLoadingAttendance(true);
    try {
      const response = await apiClient.get(`/attendance/${employeeId}`);
      setAttendanceRecords(response.data.data);
    } catch (error) {
      setAttendanceRecords([]);
      showBanner("error", unwrapError(error, "Unable to load attendance records."));
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchAttendance(selectedEmployeeId);
  }, [selectedEmployeeId]);

  const handleCreateEmployee = async (payload) => {
    setSubmittingEmployee(true);
    try {
      await apiClient.post("/employees", payload);
      showBanner("success", "Employee created successfully.");
      await fetchEmployees();
      if (!selectedEmployeeId) {
        setSelectedEmployeeId(payload.employee_id);
      }
      return true;
    } catch (error) {
      showBanner("error", unwrapError(error, "Unable to create employee."));
      return false;
    } finally {
      setSubmittingEmployee(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    setDeletingEmployee(true);
    try {
      await apiClient.delete(`/employees/${employeeId}`);
      showBanner("success", "Employee deleted successfully.");
      if (selectedEmployeeId === employeeId) {
        setSelectedEmployeeId("");
        setAttendanceRecords([]);
      }
      await fetchEmployees();
    } catch (error) {
      showBanner("error", unwrapError(error, "Unable to delete employee."));
    } finally {
      setDeletingEmployee(false);
    }
  };

  const handleMarkAttendance = async (payload) => {
    setSubmittingAttendance(true);
    try {
      await apiClient.post("/attendance", payload);
      showBanner("success", "Attendance marked successfully.");
      setSelectedEmployeeId(payload.employee_id);
      await Promise.all([fetchAttendance(payload.employee_id), fetchEmployees()]);
      return true;
    } catch (error) {
      showBanner("error", unwrapError(error, "Unable to mark attendance."));
      return false;
    } finally {
      setSubmittingAttendance(false);
    }
  };

  const dashboardStats = {
    totalEmployees: employees.length,
    totalDepartments: new Set(employees.map((employee) => employee.department)).size,
    totalPresentDays: Object.values(attendanceSummaryByEmployee).reduce(
      (total, employee) => total + employee.presentDays,
      0,
    ),
    totalAbsentDays: Object.values(attendanceSummaryByEmployee).reduce(
      (total, employee) => total + employee.absentDays,
      0,
    ),
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Admin Workspace</p>
          <h1>HRMS Lite</h1>
          <p className="hero-copy">
            Manage employee records and track daily attendance from one lightweight dashboard.
          </p>
        </div>
        <div className="hero-card">
          <span>{employees.length} Employees</span>
          <span>{dashboardStats.totalPresentDays} Present Days</span>
        </div>
      </section>

      {banner.message ? (
        <div className={`banner ${banner.type}`} role="status">
          {banner.message}
        </div>
      ) : null}

      <DashboardSummary stats={dashboardStats} isLoading={loadingSummary} />

      <section className="dashboard-grid">
        <EmployeeForm onSubmit={handleCreateEmployee} isSubmitting={submittingEmployee} />
        <AttendanceForm
          employees={employees}
          selectedEmployeeId={selectedEmployeeId}
          onSubmit={handleMarkAttendance}
          isSubmitting={submittingAttendance}
        />
      </section>

      <section className="dashboard-grid bottom-grid">
        <EmployeeList
          employees={employees}
          attendanceSummaryByEmployee={attendanceSummaryByEmployee}
          summaryLoading={loadingSummary}
          selectedEmployeeId={selectedEmployeeId}
          onSelect={setSelectedEmployeeId}
          onDelete={handleDeleteEmployee}
          isDeleting={deletingEmployee}
        />
        <AttendanceRecords
          selectedEmployeeId={selectedEmployeeId}
          records={attendanceRecords}
          isLoading={loadingAttendance}
        />
      </section>
    </main>
  );
}

export default App;
