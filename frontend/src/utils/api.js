/**
 * api.js — Base API client
 *
 * Handles all communication with the backend.
 * In dev: VITE_API_BASE_URL is unset → requests go to '' (relative),
 *         which Vite's proxy redirects to http://localhost:3001.
 * In prod: VITE_API_BASE_URL is set to the Render URL.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * POST /api/audit
 * @param {string} url - The URL to audit
 * @returns {Promise<AuditReport>}
 * @throws {{ message: string, code: string }}
 */
export async function auditUrl(url) {
  let response;

  try {
    response = await fetch(`${API_BASE}/api/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
  } catch {
    // Network-level failure (backend unreachable, no internet, etc.)
    const err = new Error('Could not reach the server. Is the backend running?');
    err.code = 'NETWORK_ERROR';
    throw err;
  }

  const data = await response.json();

  if (!data.success) {
    const err = new Error(data.error?.message || 'Audit failed');
    err.code = data.error?.code || 'UNKNOWN_ERROR';
    throw err;
  }

  return data.data;
}

/**
 * GET /api/health — silent keep-alive ping
 * Called every 14 minutes by the useAudit hook to prevent Render cold starts.
 */
export async function pingHealth() {
  try {
    await fetch(`${API_BASE}/api/health`);
  } catch {
    // Silent fail — pinging is best-effort
  }
}
