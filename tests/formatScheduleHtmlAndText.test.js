const fs = require('fs');
const path = require('path');

describe('formatScheduleHtmlAndText', () => {
    let fn;
    let escapeFn;
    let expandFn;

    beforeAll(() => {
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

        // Extract escapeHTML
        const escapeStartIndex = html.indexOf('function escapeHTML(');
        let braceCount = 0;
        let escapeEndIndex = -1;
        let started = false;
        for (let i = escapeStartIndex; i < html.length; i++) {
            if (html[i] === '{') { braceCount++; started = true; }
            else if (html[i] === '}') { braceCount--; }
            if (started && braceCount === 0) { escapeEndIndex = i; break; }
        }
        const escapeStr = html.substring(escapeStartIndex, escapeEndIndex + 1);

        // Extract expandDayLetter
        const expandStartIndex = html.indexOf('function expandDayLetter(');
        braceCount = 0;
        let expandEndIndex = -1;
        started = false;
        for (let i = expandStartIndex; i < html.length; i++) {
            if (html[i] === '{') { braceCount++; started = true; }
            else if (html[i] === '}') { braceCount--; }
            if (started && braceCount === 0) { expandEndIndex = i; break; }
        }
        const expandStr = html.substring(expandStartIndex, expandEndIndex + 1);

        // Extract formatScheduleHtmlAndText
        const functionSignature = 'function formatScheduleHtmlAndText(';
        const startIndex = html.indexOf(functionSignature);

        if (startIndex === -1) {
            throw new Error("Could not find formatScheduleHtmlAndText function in index.html");
        }

        braceCount = 0;
        let endIndex = -1;
        started = false;

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
            throw new Error("Could not parse formatScheduleHtmlAndText function correctly");
        }

        const functionString = html.substring(startIndex, endIndex + 1);

        // Mock 'els' since it's used inside the function
        global.els = {
            courseFormat: {
                selectedIndex: 0,
                options: [
                    { text: 'קורס פרונטלי' }
                ]
            }
        };

        // Create functions from the strings in global scope so they can call each other
        eval(escapeStr + '\n' + expandStr + '\n' + functionString + '\n fn = formatScheduleHtmlAndText;\n escapeFn = escapeHTML;\n expandFn = expandDayLetter;');
    });

    test('should escape HTML in single day input', () => {
        const maliciousInput = "<img src=x onerror=alert(1)>";
        const result = fn(maliciousInput);
        expect(result.html).not.toContain("<img");
        expect(result.html).toContain("&lt;img");
    });

    test('should escape HTML in multiple days input', () => {
        const maliciousInput = "א (12:00-14:00), <script>alert('xss')</script>";
        const result = fn(maliciousInput);
        expect(result.html).not.toContain("<script>");
        expect(result.html).toContain("&lt;script&gt;");
    });

    test('should format correctly for clean input', () => {
        const input = "א'+ד', 17:30-21:15";
        const result = fn(input);
        expect(result.html).toContain("יום א&#039;");
        expect(result.html).toContain("17:30-21:15");
        expect(result.html).toContain("יום ד&#039;");
    });
});
