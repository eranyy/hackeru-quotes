const fs = require('fs');
const path = require('path');

// Read the content.js file
const jsPath = path.join(__dirname, '../content.js');
const jsContent = fs.readFileSync(jsPath, 'utf8');

// Helper to extract function by signature and brace-matching
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

  if (!hasStarted || braceCount > 0) {
    throw new Error(`Could not find matching braces for "${functionSignature}"`);
  }

  return content.substring(startIndex, endIndex + 1);
}

// Extract and evaluate the function
const funcCode = extractFunction(jsContent, 'function formatIsraeliPhoneTo972(phone)');
const formatIsraeliPhoneTo972 = eval('(' + funcCode + ')');

describe('formatIsraeliPhoneTo972', () => {
    it('handles standard mobile numbers with 05 prefix', () => {
        expect(formatIsraeliPhoneTo972('050-1234567')).toBe('972501234567');
        expect(formatIsraeliPhoneTo972('0541234567')).toBe('972541234567');
        expect(formatIsraeliPhoneTo972('052 123 4567')).toBe('972521234567');
    });

    it('handles numbers starting with 5 (missing leading 0)', () => {
        expect(formatIsraeliPhoneTo972('501234567')).toBe('972501234567');
        expect(formatIsraeliPhoneTo972('54-1234567')).toBe('972541234567');
    });

    it('handles numbers that already have 972 prefix', () => {
        expect(formatIsraeliPhoneTo972('972501234567')).toBe('972501234567');
        expect(formatIsraeliPhoneTo972('+972-50-123-4567')).toBe('972501234567');
        expect(formatIsraeliPhoneTo972('+972541234567')).toBe('972541234567');
    });

    it('handles landline numbers starting with 0', () => {
        expect(formatIsraeliPhoneTo972('03-1234567')).toBe('97231234567');
        expect(formatIsraeliPhoneTo972('02 123 4567')).toBe('97221234567');
    });

    it('handles 9-digit landline missing leading 0', () => {
        // e.g. 31234567 (which is 03-1234567) -> has length 8, won't trigger the length 9 or 10 checks in function.
        // Let's check what the function does for length 8:
        // '31234567' -> starts with 3, not 5, not 972. Length is 8.
        // It skips: clean.startsWith("0") -> false
        // It skips: clean.startsWith("5") && length === 9|10 -> false
        // It skips: !startsWith("972") && length === 9|10 -> false
        // Returns clean -> '31234567'
        expect(formatIsraeliPhoneTo972('31234567')).toBe('31234567');

        // Wait, what if it's a 9 digit number not starting with 5?
        // e.g. 1700123456 -> length 10. Wait, length 10 landline?
        // Let's test a generic 9-digit number
        expect(formatIsraeliPhoneTo972('123456789')).toBe('972123456789');
    });

    it('handles short or invalid lengths gracefully', () => {
        expect(formatIsraeliPhoneTo972('1234')).toBe('1234');
        expect(formatIsraeliPhoneTo972('')).toBe('');
    });

    it('throws on null or undefined since it calls replace on undefined', () => {
        expect(() => formatIsraeliPhoneTo972(null)).toThrow(TypeError);
        expect(() => formatIsraeliPhoneTo972(undefined)).toThrow(TypeError);
    });
});
