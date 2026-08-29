const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// The easiest way to benchmark is to create a large mock of "lines" array and benchmark the loops directly.
// Or we can extract the whole handleImport function, but it has many DOM dependencies.
// Let's create a focused benchmark testing just the difference between lines.length in the loop and cached length.

const lines = Array.from({length: 10000000}, (_, i) => "מחזור " + i + "\tת. התחלה\t1\t2\t3\t4\t5");

console.time("Unoptimized");
let count = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.includes("מחזור")) count++;
}
console.timeEnd("Unoptimized");

console.time("Optimized");
let count2 = 0;
const len = lines.length;
for (let i = 0; i < len; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.includes("מחזור")) count2++;
}
console.timeEnd("Optimized");
