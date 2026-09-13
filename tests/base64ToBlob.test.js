const fs = require('fs');
const path = require('path');

describe('base64ToBlob', () => {
    let fn;

    beforeAll(() => {
        const js = fs.readFileSync(path.resolve(__dirname, '../content.js'), 'utf8');

        // Find the start of the function
        const functionSignature = 'function base64ToBlob(';
        const startIndex = js.indexOf(functionSignature);

        if (startIndex === -1) {
            throw new Error("Could not find base64ToBlob function in content.js");
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
            throw new Error("Could not parse base64ToBlob function correctly");
        }

        const functionString = js.substring(startIndex, endIndex + 1);

        // Define global variables required by the function
        global.window = {
            atob: (str) => {
                if (str === undefined) {
                    throw new Error("Failed to execute 'atob': The string to be decoded is not correctly encoded.");
                }
                // Simulate browser's atob throwing on invalid chars (like non-base64 data URI prefix).
                // Actually, if we pass empty string, atob returns empty string.
                // We'll use Buffer but explicitly throw if str has characters not valid in base64.
                if (!/^[A-Za-z0-9+/]*={0,2}$/.test(str)) {
                     throw new Error("Invalid character error");
                }
                return Buffer.from(str, 'base64').toString('binary');
            }
        };
        global.atob = global.window.atob;

        global.Blob = class Blob {
            constructor(content, options) {
                this.content = content;
                this.options = options;
                this.size = content.reduce((acc, val) => acc + val.length, 0);
                this.type = options ? options.type : '';
            }
        };

        // Create a function from the string
        eval(functionString + '\n fn = base64ToBlob;');
    });

    afterAll(() => {
        delete global.window;
        delete global.atob;
        delete global.Blob;
    });

    test('should convert valid base64 with data URI prefix', () => {
        const base64Data = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        const blob = fn(base64Data, 'image/png');
        expect(blob).toBeInstanceOf(global.Blob);
        expect(blob.type).toBe('image/png');
        expect(blob.size).toBe(68);
        expect(blob.content[0]).toBeInstanceOf(Uint8Array);
    });

    test('should handle raw base64 string without data URI prefix', () => {
        const rawBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        const blob = fn(rawBase64, 'image/png');
        expect(blob).toBeInstanceOf(global.Blob);
        expect(blob.type).toBe('image/png');
        expect(blob.size).toBe(68);
        expect(blob.content[0]).toBeInstanceOf(Uint8Array);
    });

    test('should handle empty data URI gracefully', () => {
        const base64Data = 'data:text/plain;base64,';
        const blob = fn(base64Data, 'text/plain');
        expect(blob).toBeInstanceOf(global.Blob);
        expect(blob.type).toBe('text/plain');
        expect(blob.size).toBe(0);
    });

    test('should throw error for invalid base64 data', () => {
        const invalidData = 'data:text/plain;base64,inval!d@base64';
        expect(() => fn(invalidData, 'text/plain')).toThrow('Invalid character error');
    });
});
