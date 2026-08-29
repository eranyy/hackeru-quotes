const fs = require('fs');
const path = require('path');

// Read the index.html file
const htmlPath = path.join(__dirname, '../index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

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
const funcCode = extractFunction(htmlContent, 'function formatILS(num)');
const formatILS = eval('(' + funcCode + ')');

describe('formatILS', () => {
    it('formats zero correctly', () => {
        expect(formatILS(0)).toBe('0 ₪');
    });

    it('formats positive integers correctly', () => {
        expect(formatILS(1000)).toBe('1,000 ₪');
        expect(formatILS(25900)).toBe('25,900 ₪');
        expect(formatILS(1000000)).toBe('1,000,000 ₪');
    });

    it('formats negative integers correctly', () => {
        expect(formatILS(-1000)).toBe('\u200E-1,000 ₪');
        expect(formatILS(-50)).toBe('\u200E-50 ₪');
    });

    it('formats floating point numbers correctly', () => {
        expect(formatILS(1234.56)).toBe('1,234.56 ₪');
        expect(formatILS(99.99)).toBe('99.99 ₪');
    });

    it('formats string inputs correctly', () => {
        expect(formatILS("1500")).toBe('1,500 ₪');
        expect(formatILS("-200.5")).toBe('\u200E-200.5 ₪');
    });

    it('returns NaN format for invalid inputs', () => {
        expect(formatILS("abc")).toBe('NaN ₪');
        expect(formatILS(undefined)).toBe('NaN ₪');
    });
});
