const fs = require('fs');
const path = require('path');

describe('formatIsraeliPhoneWithDash', () => {
    let fn;

    beforeAll(() => {
        const jsPath = path.resolve(__dirname, '../content.js');
        const jsContent = fs.readFileSync(jsPath, 'utf8');

        // Find the start of the function
        const functionSignature = 'function formatIsraeliPhoneWithDash(';
        const startIndex = jsContent.indexOf(functionSignature);

        if (startIndex === -1) {
            throw new Error(`Could not find ${functionSignature} in content.js`);
        }

        // Find the matching closing brace for the function
        let braceCount = 0;
        let endIndex = -1;
        let started = false;

        for (let i = startIndex; i < jsContent.length; i++) {
            if (jsContent[i] === '{') {
                braceCount++;
                started = true;
            } else if (jsContent[i] === '}') {
                braceCount--;
            }

            if (started && braceCount === 0) {
                endIndex = i;
                break;
            }
        }

        if (endIndex === -1) {
            throw new Error("Could not parse formatIsraeliPhoneWithDash function correctly");
        }

        const functionString = jsContent.substring(startIndex, endIndex + 1);

        // Create a function from the string
        eval(functionString + '\n fn = formatIsraeliPhoneWithDash;');
    });

    test('should return empty string for falsy input', () => {
        expect(fn(null)).toBe("");
        expect(fn("")).toBe("");
        expect(fn(undefined)).toBe("");
    });

    test('should strip non-digits', () => {
        expect(fn("052-123-4567")).toBe("052-1234567");
        expect(fn("052 123 4567")).toBe("052-1234567");
        expect(fn("+972521234567")).toBe("052-1234567");
    });

    test('should replace 972 prefix with 0', () => {
        expect(fn("972521234567")).toBe("052-1234567");
        expect(fn("97231234567")).toBe("03-1234567");
    });

    test('should add leading zero if missing for 9 or 10 digit numbers', () => {
        expect(fn("521234567")).toBe("052-1234567");
        expect(fn("771234567")).toBe("077-1234567");
        expect(fn("5212345678")).toBe("052-12345678");
    });

    test('should format mobile and 07X numbers correctly', () => {
        expect(fn("0501234567")).toBe("050-1234567");
        expect(fn("0521234567")).toBe("052-1234567");
        expect(fn("0541234567")).toBe("054-1234567");
        expect(fn("0771234567")).toBe("077-1234567");
    });

    test('should format landline numbers correctly', () => {
        expect(fn("021234567")).toBe("02-1234567");
        expect(fn("031234567")).toBe("03-1234567");
        expect(fn("041234567")).toBe("04-1234567");
        expect(fn("081234567")).toBe("08-1234567");
        expect(fn("091234567")).toBe("09-1234567");
    });

    test('should fallback and format general 8+ digit numbers', () => {
        expect(fn("1234")).toBe("1234");
        expect(fn("14151234567")).toBe("141-51234567");
        expect(fn("1234567")).toBe("1234567");
    });
});
