const fs = require('fs');
const path = require('path');

const optionsJsPath = path.join(__dirname, '../options.js');
const optionsJsCode = fs.readFileSync(optionsJsPath, 'utf8');

// Function to extract window.onunhandledrejection
function extractFunction(sourceCode, searchString) {
    const startIndex = sourceCode.indexOf(searchString);
    if (startIndex === -1) {
        throw new Error(`Could not find "${searchString}" in the source code`);
    }

    let openBraces = 0;
    let endIndex = -1;
    let started = false;

    for (let i = startIndex; i < sourceCode.length; i++) {
        if (sourceCode[i] === '{') {
            openBraces++;
            started = true;
        } else if (sourceCode[i] === '}') {
            openBraces--;
        }

        if (started && openBraces === 0) {
            endIndex = i + 1;
            break;
        }
    }

    if (endIndex === -1) {
        throw new Error(`Could not extract function: Mismatched braces for "${searchString}"`);
    }

    return sourceCode.substring(startIndex, endIndex);
}

const escapeHTMLCode = extractFunction(optionsJsCode, 'function escapeHTML(str)');
const onunhandledrejectionCode = extractFunction(optionsJsCode, 'window.onunhandledrejection = function(event)');

describe('window.onunhandledrejection XSS Prevention', () => {
    let mockDocument;
    let appendedChild;

    beforeEach(() => {
        appendedChild = null;
        mockDocument = {
            createElement: jest.fn().mockReturnValue({
                style: {},
            }),
            documentElement: {
                appendChild: jest.fn((child) => {
                    appendedChild = child;
                })
            },
            body: null
        };

        // Reset global mock window/document state
        global.document = mockDocument;
        global.window = {};

        // Evaluate the escapeHTML function in the global scope
        eval(escapeHTMLCode);

        // Evaluate the assignment to window.onunhandledrejection
        eval(onunhandledrejectionCode);
    });

    afterEach(() => {
        delete global.document;
        delete global.window;
        delete global.escapeHTML;
    });

    it('should sanitize event.reason to prevent XSS', () => {
        const maliciousReason = '<script>alert("XSS")</script>';

        // Call the function
        global.window.onunhandledrejection({ reason: maliciousReason });

        expect(mockDocument.createElement).toHaveBeenCalledWith('div');
        expect(appendedChild).toBeDefined();

        // Assert the reason is properly escaped
        expect(appendedChild.innerHTML).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
        expect(appendedChild.innerHTML).not.toContain('<script>');
    });
});
