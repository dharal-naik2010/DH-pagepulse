import { useAudit } from './hooks/useAudit';
import AuditForm from './components/AuditForm';
import LoadingState from './components/LoadingState';
import ReportGrid from './components/ReportGrid';
import ErrorBanner from './components/ErrorBanner';

export default function App() {
  const { status, report, error, runAudit, reset } = useAudit();

  return (
    <div className="app">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="header">
        <div className="header-logo">
          {/* Pulse wave SVG icon */}
          <svg className="logo-svg" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <rect width="28" height="28" rx="7" fill="url(#logoGrad)" />
            <polyline
              points="4,14 8,14 10,8 13,20 16,11 18,14 24,14"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
          </svg>
          <span className="logo-name">Page Pulse</span>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main className={`main ${status === 'idle' || status === 'loading' ? 'is-centered-layout' : ''}`}>

        {/* Hero + form — always visible in idle state */}
        {/* Hero — visible in idle and loading state */}
        {(status === 'idle' || status === 'loading') && (
          <section className="hero">
            <h1 className="hero-title">
              Audit any page,<br /><span>instantly.</span>
            </h1>
            <p className="hero-subtitle">
              Enter any URL to get a detailed report on HTTP status,
              response time, SEO signals and accessibility in seconds.
            </p>
            <AuditForm onSubmit={runAudit} isLoading={status === 'loading'} />
          </section>
        )}

        {/* Results — show form in compact top bar when results/error shown */}
        {(status === 'success' || status === 'error') && (
          <section className="hero" style={{ marginTop: '2rem' }}>
            <AuditForm onSubmit={runAudit} isLoading={false} />
          </section>
        )}

        {/* State panels */}
        {status === 'loading' && <LoadingState />}

        {status === 'success' && report && (
          <ReportGrid report={report} onReset={reset} />
        )}

        {status === 'error' && error && (
          <ErrorBanner error={error} onRetry={reset} />
        )}

      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="footer">
        Built for{' '}
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Digital Heroes Training Task
        </a>
      </footer>

    </div>
  );
}
