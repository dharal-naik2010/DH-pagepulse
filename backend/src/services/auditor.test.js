const axios = require('axios');
const { auditUrl } = require('./auditor');

jest.mock('axios');

describe('auditor service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should parse HTML correctly and return all SEO metrics (Happy Path)', async () => {
    // Mock a successful HTML response
    axios.get.mockResolvedValue({
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
      data: `
        <html>
          <head>
            <title>Mock Test Page</title>
            <meta name="description" content="This is a mocked meta description." />
          </head>
          <body>
            <h1>First H1</h1>
            <h1>Second H1</h1>
            
            <!-- 1 valid image -->
            <img src="good.jpg" alt="A descriptive text" />
            
            <!-- 2 images missing alt text (one empty, one missing entirely) -->
            <img src="bad1.jpg" alt="" />
            <img src="bad2.jpg" />
            
            <p>Here is some text with   multiple spaces.</p>
            <script>const ignoreMe = true;</script>
          </body>
        </html>
      `,
    });

    const report = await auditUrl('https://www.google.com');
    
    expect(report.url).toBe('https://www.google.com');
    expect(report.httpStatus).toBe(200);
    expect(report.title).toBe('Mock Test Page');
    expect(report.metaDescription).toBe('This is a mocked meta description.');
    expect(report.h1Count).toBe(2);
    
    // We expect 2 images missing the alt text
    expect(report.imagesMissingAlt).toBe(2);
    
    // "First H1" (2), "Second H1" (2), "Here is some text with multiple spaces." (7)
    // Total words = 11
    expect(report.wordCount).toBe(11);
  });

  it('should throw NON_HTML_RESPONSE if content-type is not text/html (Failure Case 1)', async () => {
    axios.get.mockResolvedValue({
      status: 200,
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify({ success: true }),
    });

    await expect(auditUrl('https://example.com/api')).rejects.toMatchObject({
      code: 'NON_HTML_RESPONSE',
    });
  });

  it('should throw FETCH_TIMEOUT when the request times out (Failure Case 2)', async () => {
    const timeoutError = new Error('timeout of 10000ms exceeded');
    timeoutError.code = 'ECONNABORTED';
    axios.get.mockRejectedValue(timeoutError);

    await expect(auditUrl('https://example.com')).rejects.toMatchObject({
      code: 'FETCH_TIMEOUT',
    });
  });
});
