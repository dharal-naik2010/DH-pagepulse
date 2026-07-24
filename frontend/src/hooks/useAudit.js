/**
 * useAudit.js — Custom React hook
 *
 * Centralises all async logic so components stay pure and presentational.
 * Manages: audit lifecycle (idle → loading → success/error) + keep-alive pinger.
 */

import { useState, useEffect, useCallback } from 'react';
import { auditUrl, pingHealth } from '../utils/api';

// Ping every 14 minutes — just under Render's 15-minute sleep threshold
const KEEP_ALIVE_MS = 14 * 60 * 1000;

export function useAudit() {
  const [status, setStatus] = useState('idle');   // 'idle' | 'loading' | 'success' | 'error'
  const [report, setReport] = useState(null);
  const [error, setError]   = useState(null);     // { message, code }

  // ── Keep-alive pinger ─────────────────────────────────────────────
  useEffect(() => {
    pingHealth(); // ping immediately when the page loads
    const id = setInterval(pingHealth, KEEP_ALIVE_MS);
    return () => clearInterval(id);
  }, []);

  // ── Run audit ─────────────────────────────────────────────────────
  const runAudit = useCallback(async (url) => {
    setStatus('loading');
    setReport(null);
    setError(null);

    try {
      const data = await auditUrl(url);
      setReport(data);
      setStatus('success');
    } catch (err) {
      setError({ message: err.message, code: err.code });
      setStatus('error');
    }
  }, []);

  // ── Reset to idle ─────────────────────────────────────────────────
  const reset = useCallback(() => {
    setStatus('idle');
    setReport(null);
    setError(null);
  }, []);

  return { status, report, error, runAudit, reset };
}
