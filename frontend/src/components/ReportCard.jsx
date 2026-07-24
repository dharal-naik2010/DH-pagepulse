/**
 * ReportCard — A single metric card in the audit report grid.
 *
 * Props:
 *   label   {string}  — Metric name (e.g. "HTTP Status")
 *   value   {*}       — The metric value (null = not found)
 *   unit    {string}  — Optional context text below the value
 *   status  {string}  — 'good' | 'warn' | 'alert' | 'neutral'
 *   isText  {boolean} — True for string values (title, meta desc) — uses smaller font
 */
export default function ReportCard({ label, value, unit, status, isText = false }) {
  const isNull = value === null || value === undefined;

  return (
    <article
      className="report-card"
      data-status={status}
      aria-label={`${label}: ${isNull ? 'Not found' : value}`}
    >
      <span className="status-dot" data-status={status} aria-hidden="true" />
      <p className="card-label">{label}</p>

      {isNull ? (
        <p className="card-value is-null">Not found</p>
      ) : (
        <p className={`card-value${isText ? ' is-text' : ''}`}>{value}</p>
      )}

      {unit && !isNull && <p className="card-unit">{unit}</p>}
    </article>
  );
}
