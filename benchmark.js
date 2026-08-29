const { JSDOM } = require('jsdom');
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// The DOM might be huge, let's just test getElementById inside a loop
const dom = new JSDOM(html);
const document = dom.window.document;

const iterations = 100000;

let start = performance.now();
for (let i = 0; i < iterations; i++) {
    document.getElementById('lblClientId').innerText = 'Test';
}
let end = performance.now();
console.log(`Unoptimized (query in loop): ${end - start} ms`);

const labelEl = document.getElementById('lblClientId');
start = performance.now();
for (let i = 0; i < iterations; i++) {
    labelEl.innerText = 'Test';
}
end = performance.now();
console.log(`Optimized (cached element): ${end - start} ms`);
