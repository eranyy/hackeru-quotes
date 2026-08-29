const fs = require('fs');
const path = require('path');

// Read the index.html file
const htmlPath = path.join(__dirname, 'index.html');
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
const funcCode = extractFunction(htmlContent, 'function getUrgencyText(days)');
eval(funcCode); // This will define getUrgencyText in this scope

describe('getUrgencyText', () => {
    it('returns text for more than 30 days', () => {
        expect(getUrgencyText(35)).toBe('הקורס נפתח בעוד 35 ימים.');
        expect(getUrgencyText(31)).toBe('הקורס נפתח בעוד 31 ימים.');
    });

    it('returns text for more than 7 days (up to 30)', () => {
        expect(getUrgencyText(30)).toBe('ההרשמה נסגרת בקרוב! הקורס נפתח בעוד 30 ימים.');
        expect(getUrgencyText(15)).toBe('ההרשמה נסגרת בקרוב! הקורס נפתח בעוד 15 ימים.');
        expect(getUrgencyText(8)).toBe('ההרשמה נסגרת בקרוב! הקורס נפתח בעוד 8 ימים.');
    });

    it('returns text for more than 1 day (up to 7)', () => {
        expect(getUrgencyText(7)).toBe('🔥 הרשמה מיידית! נותרו 7 ימים בלבד לפתיחת הקורס.');
        expect(getUrgencyText(5)).toBe('🔥 הרשמה מיידית! נותרו 5 ימים בלבד לפתיחת הקורס.');
        expect(getUrgencyText(2)).toBe('🔥 הרשמה מיידית! נותרו 2 ימים בלבד לפתיחת הקורס.');
    });

    it('returns text for exactly 1 day', () => {
        expect(getUrgencyText(1)).toBe('🚨 הרשמה ברגע האחרון! הקורס נפתח מחר!');
    });

    it('returns text for exactly 0 days', () => {
        expect(getUrgencyText(0)).toBe('🚨 הקורס נפתח היום!');
    });

    it('returns text for negative days (course already started)', () => {
        expect(getUrgencyText(-1)).toBe('הקורס כבר החל (לפני 1 ימים).');
        expect(getUrgencyText(-5)).toBe('הקורס כבר החל (לפני 5 ימים).');
    });
});
