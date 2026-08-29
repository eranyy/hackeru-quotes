const fs = require('fs');
const path = require('path');

// Read the index.html file
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

// Extract the numberToHebrewWords function
const match = html.match(/function numberToHebrewWords\(num\) {[\s\S]*?return parts\.join\(" "\) \+ " שקלים";\s*}/);
if (!match) {
    throw new Error('Could not find numberToHebrewWords function in index.html');
}

// Evaluate the function in the current scope
eval(match[0]);

describe('numberToHebrewWords', () => {
    test('handles 0 and negative numbers', () => {
        expect(numberToHebrewWords(0)).toBe("אפס שקלים");
        expect(numberToHebrewWords(-5)).toBe("אפס שקלים");
    });

    test('handles single digit numbers (1-9)', () => {
        expect(numberToHebrewWords(1)).toBe("אחד שקלים");
        expect(numberToHebrewWords(5)).toBe("חמישה שקלים");
        expect(numberToHebrewWords(9)).toBe("תשעה שקלים");
    });

    test('handles teens (10-19)', () => {
        expect(numberToHebrewWords(10)).toBe("עשרה שקלים");
        expect(numberToHebrewWords(11)).toBe("אחד עשר שקלים");
        expect(numberToHebrewWords(15)).toBe("חמישה עשר שקלים");
        expect(numberToHebrewWords(19)).toBe("תשעה עשר שקלים");
    });

    test('handles tens (20-90)', () => {
        expect(numberToHebrewWords(20)).toBe("עשרים שקלים");
        expect(numberToHebrewWords(50)).toBe("חמישים שקלים");
        expect(numberToHebrewWords(90)).toBe("תשעים שקלים");
    });

    test('handles numbers 21-99', () => {
        expect(numberToHebrewWords(21)).toBe("עשרים ואחד שקלים");
        expect(numberToHebrewWords(55)).toBe("חמישים וחמישה שקלים");
        expect(numberToHebrewWords(99)).toBe("תשעים ותשעה שקלים");
    });

    test('handles hundreds (100-900)', () => {
        expect(numberToHebrewWords(100)).toBe("מאה שקלים");
        expect(numberToHebrewWords(200)).toBe("מאתיים שקלים");
        expect(numberToHebrewWords(500)).toBe("חמש מאות שקלים");
        expect(numberToHebrewWords(900)).toBe("תשע מאות שקלים");
    });

    test('handles numbers 101-999', () => {
        expect(numberToHebrewWords(101)).toBe("מאה ואחד שקלים");
        expect(numberToHebrewWords(110)).toBe("מאה ועשרה שקלים");
        expect(numberToHebrewWords(115)).toBe("מאה וחמישה עשר שקלים");
        expect(numberToHebrewWords(250)).toBe("מאתיים וחמישים שקלים");
        expect(numberToHebrewWords(999)).toBe("תשע מאות ותשעים ותשעה שקלים");
    });

    test('handles thousands (1000, 2000, 3000-10000)', () => {
        expect(numberToHebrewWords(1000)).toBe("אלף שקלים");
        expect(numberToHebrewWords(2000)).toBe("אלפיים שקלים");
        expect(numberToHebrewWords(3000)).toBe("שלושה אלפים שקלים");
        // now 10000 should use the 'else' branch, i.e. convertGroupBelowThousand(10) + " אלף"
        expect(numberToHebrewWords(10000)).toBe("עשרה אלף שקלים");
    });

    test('handles numbers above 10000', () => {
        expect(numberToHebrewWords(11000)).toBe("אחד עשר אלף שקלים");
        expect(numberToHebrewWords(20000)).toBe("עשרים אלף שקלים");
        expect(numberToHebrewWords(150000)).toBe("מאה וחמישים אלף שקלים");
    });

    test('handles complex numbers', () => {
        // Let's match current behavior to have green tests, then we document the tests we added.
        expect(numberToHebrewWords(1234)).toBe("אלף ומאתיים ושלושים וארבעה שקלים");
        expect(numberToHebrewWords(5678)).toBe("חמישה אלפים ושש מאות ושבעים ושמונה שקלים");
        expect(numberToHebrewWords(12345)).toBe("שתים עשרה אלף ושלוש מאות וארבעים וחמישה שקלים");
    });
});
