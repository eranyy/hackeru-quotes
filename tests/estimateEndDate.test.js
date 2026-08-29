const fs = require('fs');
const path = require('path');

describe('estimateEndDate', () => {
    let fn;

    beforeAll(() => {
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

        // Find the start of the function
        const functionSignature = 'function estimateEndDate(';
        const startIndex = html.indexOf(functionSignature);

        if (startIndex === -1) {
            throw new Error("Could not find estimateEndDate function in index.html");
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
            throw new Error("Could not parse estimateEndDate function correctly");
        }

        const functionString = html.substring(startIndex, endIndex + 1);

        // Define global variables required by the function
        global.els = {
            courseSelect: { value: 'default_course' },
            academicHours: { value: "350" }
        };

        global.coursePresets = {
            'default_course': { hours: 350 },
            'short_course': { hours: 40 },
            'medium_course': { hours: 150 },
            'long_course': { hours: 400 },
            'longest_course': { hours: 500 }
        };

        // Create a function from the string
        eval(functionString + '\n fn = estimateEndDate;');
    });

    test('should calculate correct end date for hours <= 50', () => {
        // 40 hours -> 1 month
        expect(fn("15/01/2023", "בוקר", "short_course")).toBe("15/02/2023");
        expect(fn("15/01/2023", "ערב", "short_course")).toBe("15/02/2023");
    });

    test('should calculate correct end date for hours <= 180', () => {
        // 150 hours -> 3 months (בוקר), 5 months (ערב)
        expect(fn("15/01/2023", "בוקר", "medium_course")).toBe("15/04/2023");
        expect(fn("15/01/2023", "ערב", "medium_course")).toBe("15/06/2023");
    });

    test('should calculate correct end date for hours <= 350', () => {
        // 350 hours -> 5 months (בוקר), 8 months (ערב)
        expect(fn("15/01/2023", "בוקר", "default_course")).toBe("15/06/2023");
        expect(fn("15/01/2023", "ערב", "default_course")).toBe("15/09/2023");
    });

    test('should calculate correct end date for hours <= 450', () => {
        // 400 hours -> 6 months (בוקר), 10 months (ערב)
        expect(fn("15/01/2023", "בוקר", "long_course")).toBe("15/07/2023");
        expect(fn("15/01/2023", "ערב", "long_course")).toBe("15/11/2023");
    });

    test('should calculate correct end date for hours > 450', () => {
        // 500 hours -> 8 months (בוקר), 13 months (ערב)
        expect(fn("15/01/2023", "בוקר", "longest_course")).toBe("15/09/2023");
        expect(fn("15/01/2023", "ערב", "longest_course")).toBe("15/02/2024");
    });

    test('should return empty string for invalid format (not 3 parts)', () => {
        expect(fn("15/01", "בוקר", "short_course")).toBe("");
        expect(fn("15", "בוקר", "short_course")).toBe("");
        expect(fn("", "בוקר", "short_course")).toBe("");
    });

    test('should handle exception and return empty string on bad input', () => {
        // Null or undefined will cause .split() to throw a TypeError, triggering the catch block
        expect(fn(null, "בוקר", "short_course")).toBe("");
        expect(fn(undefined, "בוקר", "short_course")).toBe("");
        expect(fn({}, "בוקר", "short_course")).toBe("");
        expect(fn(12345, "בוקר", "short_course")).toBe("");
    });

    test('should fallback to global els if courseKey is omitted', () => {
        // global els.courseSelect.value is 'default_course' (350 hours) -> 5 months (בוקר)
        expect(fn("15/01/2023", "בוקר", undefined)).toBe("15/06/2023");
        expect(fn("15/01/2023", "בוקר", "")).toBe("15/06/2023");
    });
});
