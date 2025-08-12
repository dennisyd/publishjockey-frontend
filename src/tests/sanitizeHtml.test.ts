import { sanitizeHtml } from '../utils/sanitizeHtml';

describe('sanitizeHtml', () => {
  it('removes scripts and event handlers', () => {
    const dirty = '<p onclick="alert(1)">ok</p><script>alert(2)</script>';
    const clean = sanitizeHtml(dirty);
    expect(clean).toBe('<p>ok</p>');
  });

  it('allows links but strips javascript: URLs and adds no opener where relevant', () => {
    const dirty = '<a href="javascript:alert(1)" target="_blank">x</a><a href="https://example.com">y</a>';
    const clean = sanitizeHtml(dirty);
    expect(clean).toBe('<a target="_blank">x</a><a href="https://example.com">y</a>');
  });

  it('allows basic formatting and images with safe attrs', () => {
    const dirty = '<img src="https://example.com/x.png" onerror="alert(1)" style="color:red" alt="x" />';
    const clean = sanitizeHtml(dirty);
    expect(clean).toBe('<img src="https://example.com/x.png" alt="x">');
  });
});


