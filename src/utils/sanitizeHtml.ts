import DOMPurify from 'dompurify';

export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: ['p','br','strong','em','ul','ol','li','h1','h2','h3','blockquote','code','pre','img','a','table','thead','tbody','tr','td','th'],
    ALLOWED_ATTR: ['href','src','alt','title','target','rel'],
    FORBID_ATTR: ['style','onerror','onclick','onload','onmouseover','onfocus','onmousedown'],
    FORBID_TAGS: ['iframe','script','style'],
    ALLOW_ARIA_ATTR: false,
    ALLOW_DATA_ATTR: false,
  });
}

