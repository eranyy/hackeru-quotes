const fs = require('fs');
const path = require('path');

// Read index.html and extract escapeHTML function
const htmlPath = path.join(__dirname, '../index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

function extractFunction(content, functionSignature) {
  const startIndex = content.indexOf(functionSignature);
  if (startIndex === -1) {
    throw new Error(`Function signature "${functionSignature}" not found`);
  }

  let braceCount = 0;
  let hasStarted = false;
  let endIndex = startIndex;

  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '{') {
      braceCount++;
      hasStarted = true;
    } else if (content[i] === '}') {
      braceCount--;
    }

    if (hasStarted && braceCount === 0) {
      endIndex = i;
      break;
    }
  }

  return content.substring(startIndex, endIndex + 1);
}

const funcCode = extractFunction(htmlContent, 'function escapeHTML(str)');
eval(funcCode);

describe('escapeHTML - Security XSS Sanitization', () => {
    it('escapes HTML tags and special characters', () => {
        expect(escapeHTML('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
        expect(escapeHTML("x' || '1'='1")).toBe('x&#39; || &#39;1&#39;=&#39;1');
        expect(escapeHTML('Fish & Chips')).toBe('Fish &amp; Chips');
    });

    it('returns empty or falsy inputs unharmed', () => {
        expect(escapeHTML('')).toBe('');
        expect(escapeHTML(null)).toBe(null);
        expect(escapeHTML(undefined)).toBe(undefined);
    });

    it('sanitizes event handler payloads', () => {
        const payload = '<img src=x onerror="alert(1)">';
        expect(escapeHTML(payload)).toBe('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
    });
});
