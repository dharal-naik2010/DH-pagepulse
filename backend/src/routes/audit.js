/**
 * routes/audit.js
 *
 * Thin Express router — only handles:
 *   1. Input extraction from req.body
 *   2. Calling the service layer
 *   3. Mapping typed errors → HTTP status codes
 *
 * All business logic lives in services/auditor.js.
 */

const express = require('express');
const { validateUrl } = require('../utils/validateUrl');
const { auditUrl } = require('../services/auditor');

const router = express.Router();

// ── GET /api/health ───────────────────────────────────────────────────────────
// Lightweight health-check used by the frontend keep-alive pinger.
// Also useful for Render's own uptime checks.
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── POST /api/audit ───────────────────────────────────────────────────────────
router.post('/audit', async (req, res, next) => {
  const { url } = req.body || {};

  // 1. Validate presence
  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_URL',
        message: 'Request body must include a "url" string field',
      },
    });
  }

  // 2. Validate format / protocol
  let validatedUrl;
  try {
    validatedUrl = validateUrl(url);
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: { code: err.code || 'INVALID_URL', message: err.message },
    });
  }

  // 3. Run audit
  try {
    const report = await auditUrl(validatedUrl);
    return res.json({ success: true, data: report });
  } catch (err) {
    // Map typed service errors → HTTP status codes
    const HTTP_STATUS = {
      FETCH_TIMEOUT: 408,
      FETCH_FAILED: 502,
      NON_HTML_RESPONSE: 422,
    };

    const httpStatus = HTTP_STATUS[err.code];
    if (!httpStatus) {
      // Unknown error — forward to global error handler (→ 500)
      return next(err);
    }

    return res.status(httpStatus).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
  }
});

module.exports = router;
