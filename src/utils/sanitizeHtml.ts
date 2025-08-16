import DOMPurify from 'dompurify';

/**
 * Enhanced HTML sanitization function to prevent XSS attacks
 * @param input - Raw HTML input to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(input: string | null | undefined): string {
  // Handle null/undefined input
  if (input == null) {
    return '';
  }

  // Convert to string if needed
  const inputString = String(input);

  // Additional pre-sanitization checks for common attack patterns
  const dangerousPatterns = [
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /data:application\/javascript/gi,
    /<script[^>]*>.*?<\/script>/gis,
    /<iframe[^>]*>.*?<\/iframe>/gis,
    /<object[^>]*>.*?<\/object>/gis,
    /<embed[^>]*>/gi,
    /<link[^>]*>/gi,
    /<meta[^>]*>/gi,
    /on\w+\s*=/gi, // Event handlers
    /expression\s*\(/gi, // CSS expressions
  ];

  let preSanitized = inputString;
  dangerousPatterns.forEach(pattern => {
    preSanitized = preSanitized.replace(pattern, '');
  });

  // Use DOMPurify for comprehensive sanitization
  return DOMPurify.sanitize(preSanitized, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'code', 'pre', 'kbd', 'samp', 'var',
      'img', 'a', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
      'div', 'span', 'section', 'article', 'header', 'footer',
      'cite', 'q', 'abbr', 'acronym', 'dfn', 'small', 'sub', 'sup'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'target', 'rel',
      'width', 'height', 'class', 'id', 'name',
      'cite', 'datetime', 'lang'
    ],
    FORBID_ATTR: [
      'style', 'onerror', 'onclick', 'onload', 'onmouseover', 'onfocus', 'onmousedown',
      'onmouseup', 'onmouseout', 'onkeydown', 'onkeyup', 'onkeypress', 'onchange',
      'onsubmit', 'onreset', 'onselect', 'onblur', 'onabort', 'onbeforeunload',
      'onhashchange', 'onmessage', 'onoffline', 'ononline', 'onpagehide',
      'onpageshow', 'onpopstate', 'onresize', 'onstorage', 'onunload'
    ],
    FORBID_TAGS: [
      'iframe', 'script', 'style', 'object', 'embed', 'applet',
      'form', 'input', 'textarea', 'select', 'button', 'label',
      'fieldset', 'legend', 'optgroup', 'option'
    ],
    ALLOW_ARIA_ATTR: false,
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    SANITIZE_DOM: true,
    WHOLE_DOCUMENT: false,
  });
}

/**
 * Sanitize text content (no HTML allowed)
 * @param input - Raw text input to sanitize
 * @returns Sanitized text string
 */
export function sanitizeText(input: string | null | undefined): string {
  if (input == null) {
    return '';
  }

  const inputString = String(input);
  
  // Remove all HTML tags and dangerous content
  return DOMPurify.sanitize(inputString, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

/**
 * Sanitize URLs to prevent protocol-based attacks
 * @param url - URL to sanitize
 * @returns Sanitized URL or empty string if dangerous
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (url == null) {
    return '';
  }

  const urlString = String(url).trim();
  
  // Check for dangerous protocols
  // eslint-disable-next-line no-script-url
  const dangerousProtocols = ['javascript:', 'vbscript:', 'data:', 'file:'];
  const lowerUrl = urlString.toLowerCase();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return '';
    }
  }

  // Allow only safe protocols
  const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
  const hasSafeProtocol = safeProtocols.some(protocol => 
    lowerUrl.startsWith(protocol)
  );

  if (!hasSafeProtocol && !urlString.startsWith('/') && !urlString.startsWith('#')) {
    return '';
  }

  return urlString;
}

