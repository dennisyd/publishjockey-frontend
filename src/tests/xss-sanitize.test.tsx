import { sanitizeHtml } from '../utils/sanitizeHtml';

describe('sanitizeHtml', () => {
  it('removes script tags and event handlers', () => {
    const evil = "<img src=x onerror=alert(1)><script>alert(1)</script>";
    const safe = sanitizeHtml(evil);
    expect(safe).not.toMatch(/<script/i);
    expect(safe).not.toMatch(/onerror=/i);
  });
});


