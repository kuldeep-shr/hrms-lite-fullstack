export default function EmployeeList({
  employees,
  attendanceSummaryByEmployee,
  summaryLoading,
  selectedEmployeeId,
  onSelect,
  onDelete,
  isDeleting,
}) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Directory</p>
        <h2>Employees</h2>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Present Days</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr
                  key={employee.employee_id}
                  className={selectedEmployeeId === employee.employee_id ? "selected-row" : ""}
                >
                  <td>
                    <button
                      type="button"
                      className="ghost-link"
                      onClick={() => onSelect(employee.employee_id)}
                    >
                      {employee.employee_id}
                    </button>
                  </td>
                  <td>{employee.full_name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>
                    {summaryLoading
                      ? "..."
                      : attendanceSummaryByEmployee[employee.employee_id]?.presentDays ?? 0}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => onDelete(employee.employee_id)}
                      disabled={isDeleting}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
                  No employees yet. Add the first employee to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
