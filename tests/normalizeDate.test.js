const fs = require('fs');
const path = require('path');

describe('normalizeDate', () => {
    let fn;

    beforeAll(() => {
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

        // Find the start of the function
        const functionSignature = 'function normalizeDate(';
        const startIndex = html.indexOf(functionSignature);

        if (startIndex === -1) {
            throw new Error("Could not find normalizeDate function in index.html");
        }

        // Find the matching closing brace for the function
        let braceCount = 0;
        let endIndex = -1;
        let started = false;

        for (let i = startIndex; i < html.length; i++) {
            if (html[i] === '{') {
                braceCount++;
                started = true;
            } else if (html[i] === '}') {
                braceCount--;
            }

            if (started && braceCount === 0) {
                endIndex = i;
                break;
            }
        }

        if (endIndex === -1) {
            throw new Error("Could not parse normalizeDate function correctly");
        }

        const functionString = html.substring(startIndex, endIndex + 1);

        // Create a function from the string
        eval(functionString + '\n fn = normalizeDate;');
    });

    test('should return empty string for falsy input', () => {
        expect(fn(null)).toBe('');
        expect(fn(undefined)).toBe('');
        expect(fn('')).toBe('');
    });

    test('should return empty string for false input', () => {
        expect(fn(false)).toBe('');
    });

    test('should pad single-digit day and month', () => {
        expect(fn('1/2/2023')).toBe('01/02/2023');
        expect(fn('5/9/2023')).toBe('05/09/2023');
    });

    test('should convert 2-digit year to 4-digit year', () => {
        expect(fn('15/05/23')).toBe('15/05/2023');
        expect(fn('01/02/99')).toBe('01/02/2099');
    });

    test('should convert dots to slashes', () => {
        expect(fn('15.05.2023')).toBe('15/05/2023');
        expect(fn('1.2.23')).toBe('01/02/2023');
    });

    test('should leave properly formatted date unchanged', () => {
        expect(fn('15/05/2023')).toBe('15/05/2023');
        expect(fn(' 15/05/2023 ')).toBe('15/05/2023'); // Should trim
    });

    test('should handle dates with less or more than 3 parts by returning normalized string', () => {
        expect(fn('15/05')).toBe('15/05');
        expect(fn('15/05/2023/extra')).toBe('15/05/2023/extra');
        expect(fn('not_a_date')).toBe('not_a_date');
    });
});
