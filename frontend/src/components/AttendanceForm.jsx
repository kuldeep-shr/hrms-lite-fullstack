import { useEffect, useState } from "react";

const today = new Date().toISOString().slice(0, 10);

export default function AttendanceForm({ employees, selectedEmployeeId, onSubmit, isSubmitting }) {
  const [form, setForm] = useState({
    employee_id: selectedEmployeeId || "",
    date: today,
    status: "Present",
  });

  useEffect(() => {
    setForm((current) => ({
      ...current,
      employee_id: selectedEmployeeId || current.employee_id,
    }));
  }, [selectedEmployeeId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const created = await onSubmit(form);
    if (created) {
      setForm((current) => ({ ...current, date: today, status: "Present" }));
    }
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Attendance</p>
        <h2>Mark Attendance</h2>
      </div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Employee
          <select
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            required
          >
            <option value="">Select employee</option>
            {employees.map((employee) => (
              <option key={employee.employee_id} value={employee.employee_id}>
                {employee.employee_id} - {employee.full_name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
        </label>
        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange} required>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </label>
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Mark Attendance"}
        </button>
      </form>
    </section>
  );
}
