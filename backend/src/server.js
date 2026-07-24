/**
 * server.js
 *
 * Entry point — only responsibility is to bind the app to a port.
 * All app configuration lives in app.js.
 */

require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 PagePulse backend running on http://localhost:${PORT}`);
  console.log(`   Health:  GET  http://localhost:${PORT}/api/health`);
  console.log(`   Audit:   POST http://localhost:${PORT}/api/audit`);
});
