const fs = require('fs');
const path = require('path');

describe('isDateExpired', () => {
    let fn;

    beforeAll(() => {
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

        // Find the start of the function
        const functionSignature = 'function isDateExpired(';
        const startIndex = html.indexOf(functionSignature);

        if (startIndex === -1) {
            throw new Error("Could not find isDateExpired function in index.html");
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
            throw new Error("Could not parse isDateExpired function correctly");
        }

        const functionString = html.substring(startIndex, endIndex + 1);

        // Create a function from the string
        eval(functionString + '\n fn = isDateExpired;');
    });

    beforeEach(() => {
        jest.useFakeTimers();
        // Set system time to a fixed date: October 15, 2023, 12:00:00 (Noon)
        jest.setSystemTime(new Date(2023, 9, 15, 12, 0, 0));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should return true for a date in the past', () => {
        // Oct 14, 2023 is before Oct 15, 2023
        expect(fn("14/10/2023")).toBe(true);
        // Way in the past
        expect(fn("01/01/2020")).toBe(true);
    });

    test('should return false for a date in the future', () => {
        // Oct 16, 2023 is after Oct 15, 2023
        expect(fn("16/10/2023")).toBe(false);
        // Way in the future
        expect(fn("01/01/2030")).toBe(false);
    });

    test('should return false for today date', () => {
        // The function checks if dateObj < today (where today is 00:00:00).
        // Since both dateObj and today will represent Oct 15, 2023 00:00:00, it should be false.
        expect(fn("15/10/2023")).toBe(false);
    });

    test('should return false for invalid string formats', () => {
        // Missing slashes
        expect(fn("15102023")).toBe(false);
        // Incorrect parts length
        expect(fn("15/10")).toBe(false);
        expect(fn("15/10/2023/12")).toBe(false);
        // Empty string
        expect(fn("")).toBe(false);
    });

    test('should return false for null, undefined, or other types', () => {
        expect(fn(null)).toBe(false);
        expect(fn(undefined)).toBe(false);
        // Trigger catch block by passing an object which doesn't have .includes
        expect(fn({})).toBe(false);
        expect(fn(123)).toBe(false);
    });
});
