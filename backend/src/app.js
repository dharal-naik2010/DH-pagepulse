/**
 * app.js
 *
 * Builds and exports the Express application WITHOUT starting the server.
 * Kept separate from server.js so tests can import the app directly
 * without binding a port — a standard Node.js testing pattern.
 */

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const auditRouter = require('./routes/audit');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────

// Allow all origins — frontend (GitHub Pages) needs to call this API
app.use(cors({ origin: '*' }));

// Parse JSON bodies; cap at 10 KB to prevent abuse
app.use(express.json({ limit: '10kb' }));

// ── Rate limiting ─────────────────────────────────────────────────────────────
// 30 requests per minute per IP — prevents hammering the free-tier Render instance
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests — please wait a minute and try again.',
      },
    });
  },
});
app.use('/api', limiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', auditRouter);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} does not exist`,
    },
  });
});

// ── Global error handler ──────────────────────────────────────────────────────
// Catches any error forwarded via next(err).
// NEVER leaks stack traces to the client.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.message);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    },
  });
});

module.exports = app;
