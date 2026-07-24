/**
 * validateUrl.js
 *
 * Single-responsibility utility: validates a raw URL string.
 * Returns the normalised href on success; throws a typed error on failure.
 * Zero Express dependency — fully unit-testable in isolation.
 */

/**
 * @param {string} rawUrl
 * @returns {string} Normalised href
 * @throws {{ code: string, message: string }}
 */
function validateUrl(rawUrl) {
  // 1. Presence check
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
    throw makeError('MISSING_URL', 'A "url" field is required in the request body');
  }

  // 2. Parse check — new URL() throws on invalid syntax
  let parsed;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    throw makeError('INVALID_URL', `"${rawUrl.trim()}" is not a valid URL`);
  }

  // 3. Protocol check — only http / https allowed
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw makeError(
      'INVALID_URL',
      `Only http:// and https:// URLs are supported. Received: "${parsed.protocol}"`
    );
  }

  // 4. Hostname check — reject empty or localhost
  if (!parsed.hostname || parsed.hostname === 'localhost') {
    throw makeError('INVALID_URL', 'Auditing localhost or blank hostnames is not supported');
  }

  return parsed.href;
}

function makeError(code, message) {
  const err = new Error(message);
  err.code = code;
  return err;
}

module.exports = { validateUrl };
