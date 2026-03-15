export default function BackendWakeCard({ isWaking, message, onRetry }) {
  return (
    <section className="warmup-card">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Free Tier Notice</p>
          <h2>Waking Backend</h2>
        </div>
      </div>
      <p className="warmup-copy">
        Render free web services sleep after inactivity. We are waking the backend before loading live
        employee and attendance data so the app feels smoother.
      </p>
      <div className="warmup-status" role="status" aria-live="polite">
        <span className={`warmup-dot ${isWaking ? "active" : "idle"}`} />
        <span>{message}</span>
      </div>
      {!isWaking ? (
        <button type="button" className="secondary-button light" onClick={onRetry}>
          Retry Connection
        </button>
      ) : null}
    </section>
  );
}
