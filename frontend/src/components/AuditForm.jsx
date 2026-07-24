import { useState } from 'react';

/**
 * AuditForm — URL input + submit button.
 * Purely presentational; all async logic lives in the useAudit hook.
 */
export default function AuditForm({ onSubmit, isLoading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (trimmed && !isLoading) onSubmit(trimmed);
  };

  return (
    <form className="audit-form" onSubmit={handleSubmit} id="audit-form">
      <div className="form-row">
        <input
          id="url-input"
          type="text"
          className="url-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          disabled={isLoading}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="URL to audit"
        />
        <button
          id="audit-submit-btn"
          type="submit"
          className="audit-btn"
          disabled={isLoading || !url.trim()}
        >
          {isLoading ? 'Auditing…' : 'Audit →'}
        </button>
      </div>
    </form>
  );
}
