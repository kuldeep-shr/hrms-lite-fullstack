import { useEffect, useState } from "react";

export default function AttendanceRecords({ selectedEmployeeId, records, isLoading }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    setFromDate("");
    setToDate("");
  }, [selectedEmployeeId]);

  const filteredRecords = records.filter((record) => {
    if (fromDate && record.date < fromDate) {
      return false;
    }

    if (toDate && record.date > toDate) {
      return false;
    }

    return true;
  });

  const presentDays = filteredRecords.filter((record) => record.status === "Present").length;
  const absentDays = filteredRecords.filter((record) => record.status === "Absent").length;

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">History</p>
        <h2>Attendance Records</h2>
      </div>
      {!selectedEmployeeId ? (
        <p className="helper-text">Select an employee from the directory to view attendance history.</p>
      ) : isLoading ? (
        <p className="helper-text">Loading attendance records...</p>
      ) : (
        <>
          <div className="filter-grid">
            <label>
              From Date
              <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
            </label>
            <label>
              To Date
              <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
            </label>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
            >
              Clear Filters
            </button>
          </div>

          <div className="record-summary">
            <span>{filteredRecords.length} Records</span>
            <span>{presentDays} Present</span>
            <span>{absentDays} Absent</span>
          </div>

          {filteredRecords.length > 0 ? (
            <div className="record-list">
              {filteredRecords.map((record) => (
                <article key={`${record.employee_id}-${record.date}`} className="record-card">
                  <div>
                    <p className="record-date">{record.date}</p>
                    <h3>{record.full_name}</h3>
                  </div>
                  <span className={`status-pill ${record.status.toLowerCase()}`}>{record.status}</span>
                </article>
              ))}
            </div>
          ) : records.length > 0 ? (
            <p className="helper-text">No attendance entries match the selected date range.</p>
          ) : (
            <p className="helper-text">No attendance entries found for this employee yet.</p>
          )}
        </>
      )}
    </section>
  );
}
