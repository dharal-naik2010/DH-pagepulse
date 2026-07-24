/**
 * LoadingState — Animated heartbeat pulse shown while the audit is running.
 */
export default function LoadingState() {
  return (
    <section className="loading-wrap" aria-live="polite" aria-label="Auditing in progress">
      <div className="loading-info">
        <svg className="heartbeat-loader" width="80" height="40" viewBox="0 0 80 40" fill="none">
          <polyline
            points="0,20 20,20 30,5 45,35 55,20 80,20"
            stroke="url(#pulseGradLoader)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="pulseGradLoader" x1="0" y1="0" x2="80" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
        </svg>
        <p className="loading-label">Analysing your URL…</p>
      </div>
    </section>
  );
}
