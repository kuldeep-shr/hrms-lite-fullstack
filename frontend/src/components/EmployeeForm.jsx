import { useState } from "react";

import { DEPARTMENTS } from "../constants/departments";

const initialState = {
  employee_id: "",
  full_name: "",
  email: "",
  department: DEPARTMENTS[0],
};

export default function EmployeeForm({ onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const created = await onSubmit(form);
    if (created) {
      setForm(initialState);
    }
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Employee Management</p>
        <h2>Add Employee</h2>
      </div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Employee ID
          <input
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            placeholder="EMP-001"
            required
          />
        </label>
        <label>
          Full Name
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Ava Johnson"
            required
          />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="ava@company.com"
            required
          />
        </label>
        <label>
          Department
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          >
            {DEPARTMENTS.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Add Employee"}
        </button>
      </form>
    </section>
  );
}
