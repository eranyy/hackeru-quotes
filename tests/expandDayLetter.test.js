const fs = require('fs');
const path = require('path');

describe('expandDayLetter', () => {
    let fn;

    beforeAll(() => {
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

        // Find the start of the function
        const functionSignature = 'function expandDayLetter(';
        const startIndex = html.indexOf(functionSignature);

        if (startIndex === -1) {
            throw new Error("Could not find expandDayLetter function in index.html");
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
            throw new Error("Could not parse expandDayLetter function correctly");
        }

        const functionString = html.substring(startIndex, endIndex + 1);

        // Create a function from the string
        eval(functionString + '\n fn = expandDayLetter;');
    });

    test('should expand a single letter day with parentheses', () => {
        expect(fn("א (12:00-14:00)")).toBe("יום א' (12:00-14:00)");
        expect(fn("ב (08:00)")).toBe("יום ב' (08:00)");
        expect(fn("ג(10:00)")).toBe("יום ג' (10:00)");
        expect(fn("ת (13:00)")).toBe("יום ת' (13:00)");
    });

    test('should return the original string if it does not match the pattern', () => {
        expect(fn("יום א' (12:00-14:00)")).toBe("יום א' (12:00-14:00)");
        expect(fn("אב (12:00)")).toBe("אב (12:00)");
        expect(fn("א 12:00")).toBe("א 12:00");
        expect(fn("Something else")).toBe("Something else");
        expect(fn("")).toBe("");
    });
});
