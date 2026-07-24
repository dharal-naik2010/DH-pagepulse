/**
 * auditor.js
 *
 * Core audit service — a pure async function that fetches a URL and
 * extracts all required SEO/performance signals from the HTML.
 *
 * Zero Express dependency: can be imported and called directly in tests
 * without spinning up an HTTP server.
 */

const axios = require('axios');
const cheerio = require('cheerio');

const TIMEOUT_MS = 10_000;           // 10-second hard timeout
const MAX_CONTENT_BYTES = 10_000_000; // 10 MB response cap

/**
 * Fetches a URL and returns a structured audit report.
 *
 * @param {string} url - A validated, normalised URL string
 * @returns {Promise<AuditReport>}
 *
 * @throws {{ code: 'FETCH_TIMEOUT'   }} — server took > 10s
 * @throws {{ code: 'FETCH_FAILED'    }} — DNS, connection, or network error
 * @throws {{ code: 'NON_HTML_RESPONSE' }} — Content-Type is not text/html
 */
async function auditUrl(url) {
  const start = Date.now();
  let response;

  // ── 1. Fetch ──────────────────────────────────────────────────────────────
  try {
    response = await axios.get(url, {
      timeout: TIMEOUT_MS,
      maxRedirects: 5,
      maxContentLength: MAX_CONTENT_BYTES,
      // validateStatus: always return true so HTTP 4xx/5xx are reported,
      // not thrown — we want to surface the real status code.
      validateStatus: () => true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PagePulse-Auditor/1.0)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
      },
      decompress: true,
    });
  } catch (axiosErr) {
    const code = axiosErr.code || '';
    const msg = axiosErr.message || '';

    if (code === 'ECONNABORTED' || msg.includes('timeout')) {
      throw makeError('FETCH_TIMEOUT', 'The request timed out after 10 seconds');
    }
    if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') {
      throw makeError('FETCH_FAILED', `Domain not found: "${new URL(url).hostname}"`);
    }
    if (code === 'ECONNREFUSED') {
      throw makeError('FETCH_FAILED', 'Connection refused by the target server');
    }
    throw makeError('FETCH_FAILED', msg || 'Failed to reach the URL');
  }

  const responseTimeMs = Date.now() - start;

  // ── 2. Content-type guard ─────────────────────────────────────────────────
  const contentType = response.headers['content-type'] || '';
  if (!contentType.includes('text/html')) {
    const type = contentType.split(';')[0].trim() || 'unknown';
    throw makeError(
      'NON_HTML_RESPONSE',
      `Expected text/html but the server returned "${type}"`
    );
  }

  // ── 3. Parse HTML ─────────────────────────────────────────────────────────
  const $ = cheerio.load(response.data);

  // Extract all metadata while the full DOM is intact
  const title = $('title').text().trim() || null;

  const metaDescription =
    $('meta[name="description"]').attr('content')?.trim() ||
    $('meta[property="og:description"]').attr('content')?.trim() ||
    null;

  const h1Count = $('h1').length;

  // Images missing alt = alt attribute absent OR present but empty string
  const imagesMissingAlt = $('img')
    .filter((_, el) => {
      const alt = $(el).attr('alt');
      return alt === undefined || alt.trim() === '';
    })
    .length;

  // Strip noisy elements before word count so JS/CSS don't inflate it
  $('script, style, noscript, svg, head').remove();
  const rawText = $('body').text().replace(/\s+/g, ' ').trim();
  const wordCount = rawText ? rawText.split(' ').filter(Boolean).length : 0;

  // ── 4. Return report ──────────────────────────────────────────────────────
  return {
    url,
    httpStatus: response.status,
    responseTimeMs,
    title,
    metaDescription,
    h1Count,
    imagesMissingAlt,
    wordCount,
    auditedAt: new Date().toISOString(),
  };
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function makeError(code, message) {
  const err = new Error(message);
  err.code = code;
  return err;
}

module.exports = { auditUrl };
