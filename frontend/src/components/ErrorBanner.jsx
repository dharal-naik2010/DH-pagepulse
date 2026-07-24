/* ── Friendly titles & icons per error code ── */
const META = {
  MISSING_URL:       { title: 'Missing URL',          emoji: '🔗' },
  INVALID_URL:       { title: 'Invalid URL',           emoji: '🔗' },
  FETCH_TIMEOUT:     { title: 'Request Timed Out',     emoji: '⏱️' },
  FETCH_FAILED:      { title: 'Could Not Reach URL',   emoji: '🌐' },
  NON_HTML_RESPONSE: { title: 'Not an HTML Page',      emoji: '📄' },
  RATE_LIMITED:      { title: 'Too Many Requests',     emoji: '🚦' },
  NETWORK_ERROR:     { title: 'Network Error',         emoji: '📡' },
  INTERNAL_ERROR:    { title: 'Server Error',          emoji: '⚠️' },
};

/**
 * ErrorBanner — Displays a typed error card with a retry button.
 *
 * Props:
 *   error   {{ message: string, code: string }}
 *   onRetry {() => void}
 */
export default function ErrorBanner({ error, onRetry }) {
  const { title, emoji } = META[error.code] || { title: 'Something Went Wrong', emoji: '⚠️' };

  return (
    <section className="error-wrap" role="alert" aria-label="Audit error">
      <div className="error-card">
        <div className="error-emoji">{emoji}</div>
        <div className="error-badge">{error.code || 'ERROR'}</div>
        <h2 className="error-title">{title}</h2>
        <p className="error-msg">{error.message}</p>
        <button id="retry-btn" className="retry-btn" onClick={onRetry}>
          Try Another URL
        </button>
      </div>
    </section>
  );
}
