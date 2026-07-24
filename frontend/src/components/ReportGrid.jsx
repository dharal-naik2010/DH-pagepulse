import ReportCard from './ReportCard';

/* ── Status helpers ────────────────────────────────────────────────── */
const httpStatus = (code) => code >= 200 && code < 300 ? 'good' : code < 400 ? 'warn' : 'alert';
const rspStatus = (ms) => ms < 500 ? 'good' : ms < 2000 ? 'warn' : 'alert';
const h1Status = (n) => n === 1 ? 'good' : 'warn';
const altStatus = (n) => n === 0 ? 'good' : n <= 5 ? 'warn' : 'alert';

/* ── Human-readable unit strings ───────────────────────────────────── */
const httpUnit = (code) =>
  code >= 200 && code < 300 ? 'Page is live ✓'
    : code >= 300 && code < 400 ? 'Redirect chain'
      : 'Error response';

const rspUnit = (ms) =>
  ms < 500 ? 'Fast response' : ms < 2000 ? 'Acceptable' : 'Slow — may affect UX';

const h1Unit = (n) =>
  n === 0 ? 'Missing — add one H1' : n === 1 ? 'Perfect — exactly one H1' : `${n} H1s — should be exactly 1`;

const altUnit = (n) =>
  n === 0 ? 'All images have alt text ✓' : `${n} image${n > 1 ? 's' : ''} need alt text`;

/**
 * ReportGrid — Renders the full 7-card audit report.
 */
export default function ReportGrid({ report, onReset }) {
  const {
    url, httpStatus: code, responseTimeMs,
    title, metaDescription,
    h1Count, imagesMissingAlt, wordCount,
    auditedAt,
  } = report;

  const time = new Date(auditedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <section className="report-wrap" aria-label="Audit report">

      {/* Header row */}
      <div className="report-meta">
        <div className="report-url-row">
          <span className="report-url-tag">Audited</span>
          <span className="report-url-val" title={url}>{url}</span>
        </div>
        <span className="report-audited">at {time}</span>
        <button id="new-audit-btn" className="new-audit-btn" onClick={onReset}>
          ← New Audit
        </button>
      </div>

      {/* Metric cards */}
      <div className="report-grid">
        <ReportCard
          label="HTTP Status"
          value={code}
          unit={httpUnit(code)}
          status={httpStatus(code)}
        />
        <ReportCard
          label="Response Time"
          value={`${responseTimeMs} ms`}
          unit={rspUnit(responseTimeMs)}
          status={rspStatus(responseTimeMs)}
        />
        <ReportCard
          label="Page Title"
          value={title}
          status={title ? 'good' : 'alert'}
          isText
        />
        <ReportCard
          label="Meta Description"
          value={metaDescription}
          status={metaDescription ? 'good' : 'alert'}
          isText
        />
        <ReportCard
          label="H1 Count"
          value={h1Count}
          unit={h1Unit(h1Count)}
          status={h1Status(h1Count)}
        />
        <ReportCard
          label="Images Missing Alt"
          value={imagesMissingAlt}
          unit={altUnit(imagesMissingAlt)}
          status={altStatus(imagesMissingAlt)}
        />
        <ReportCard
          label="Word Count"
          value={wordCount.toLocaleString()}
          unit="approximate words"
          status="neutral"
        />
      </div>
    </section>
  );
}
