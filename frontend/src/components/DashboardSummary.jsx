export default function DashboardSummary({ stats, isLoading }) {
  const items = [
    { label: "Total Employees", value: stats.totalEmployees },
    { label: "Departments", value: stats.totalDepartments },
    { label: "Present Days", value: stats.totalPresentDays },
    { label: "Absent Days", value: stats.totalAbsentDays },
  ];

  return (
    <section className="summary-grid" aria-label="Dashboard summary">
      {items.map((item) => (
        <article key={item.label} className="summary-card">
          <p className="eyebrow">Overview</p>
          <h2>{isLoading ? "..." : item.value}</h2>
          <p className="summary-label">{item.label}</p>
        </article>
      ))}
    </section>
  );
}
