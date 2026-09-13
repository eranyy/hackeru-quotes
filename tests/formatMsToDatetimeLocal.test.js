const fs = require('fs');
const path = require('path');

describe('formatMsToDatetimeLocal', () => {
    let fn;

    beforeAll(() => {
        const js = fs.readFileSync(path.resolve(__dirname, '../content.js'), 'utf8');

        // Find the start of the function
        const functionSignature = 'function formatMsToDatetimeLocal(';
        const startIndex = js.indexOf(functionSignature);

        if (startIndex === -1) {
            throw new Error("Could not find formatMsToDatetimeLocal function in content.js");
        }

        // Find the matching closing brace for the function
        let braceCount = 0;
        let endIndex = -1;
        let started = false;

        for (let i = startIndex; i < js.length; i++) {
            if (js[i] === '{') {
                braceCount++;
                started = true;
            } else if (js[i] === '}') {
                braceCount--;
            }

            if (started && braceCount === 0) {
                endIndex = i;
                break;
            }
        }

        if (endIndex === -1) {
            throw new Error("Could not parse formatMsToDatetimeLocal function correctly");
        }

        const functionString = js.substring(startIndex, endIndex + 1);

        // Create a function from the string
        eval(functionString + '\n fn = formatMsToDatetimeLocal;');
    });

    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2023-10-27T10:30:00Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should format specific milliseconds to datetime-local string', () => {
        // Time in local timezone
        const date = new Date(2023, 0, 5, 14, 8); // Jan 5, 2023, 14:08 local
        expect(fn(date.getTime())).toBe('2023-01-05T14:08');
    });

    test('should format correctly for end of year', () => {
        const date = new Date(2022, 11, 31, 23, 59);
        expect(fn(date.getTime())).toBe('2022-12-31T23:59');
    });

    test('should pad single digit month, day, hour, and minute', () => {
        const date = new Date(2024, 8, 9, 7, 5); // Sep 9, 2024, 07:05 local
        expect(fn(date.getTime())).toBe('2024-09-09T07:05');
    });

    test('should fallback to current time if ms is falsy', () => {
        const d = new Date('2023-10-27T10:30:00Z');
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const expected = `${year}-${month}-${day}T${hours}:${minutes}`;

        expect(fn(undefined)).toBe(expected);
        expect(fn(null)).toBe(expected);
        expect(fn(0)).toBe(expected);
    });
});
