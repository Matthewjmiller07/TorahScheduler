// Script to count all mishnayot in the data.js file

// First, let's extract the mishnayotCounts object from data.js
const fs = require('fs');
const path = require('path');

// Read the data.js file
const dataJsPath = path.join(__dirname, 'js', 'data.js');
const dataJsContent = fs.readFileSync(dataJsPath, 'utf8');

// Extract the mishnayotCounts object section
const mishnayotCountsSection = dataJsContent.substring(
  dataJsContent.indexOf('const mishnayotCounts = {'),
  dataJsContent.indexOf('// Helper function to build individual Mishnah references')
);

// Parse the tractate arrays
const tractateArrays = {};
const tractateRegex = /'([^']+)': \[([^\]]+)\]/g;
let match;
while ((match = tractateRegex.exec(mishnayotCountsSection)) !== null) {
  const tractateName = match[1];
  const countsArray = match[2].split(',').map(num => parseInt(num.trim(), 10));
  tractateArrays[tractateName] = countsArray;
}

// Calculate totals
let totalMishnayot = 0;
let totalChapters = 0;
const tractateResults = [];

for (const tractate in tractateArrays) {
  const chapterCounts = tractateArrays[tractate];
  const tractateTotal = chapterCounts.reduce((sum, count) => sum + count, 0);
  totalMishnayot += tractateTotal;
  totalChapters += chapterCounts.length;
  
  tractateResults.push({
    tractate,
    chapters: chapterCounts.length,
    mishnayot: tractateTotal
  });
}

// Sort tractates alphabetically
tractateResults.sort((a, b) => a.tractate.localeCompare(b.tractate));

// Print results
console.log('\nMishnayot Count by Tractate:');
console.log('===========================');
console.log('Tractate\t\tChapters\tMishnayot');
console.log('---------------------------------------------------');

tractateResults.forEach(result => {
  const tractateStr = result.tractate.padEnd(20, ' ');
  console.log(`${tractateStr}\t${result.chapters}\t\t${result.mishnayot}`);
});

console.log('---------------------------------------------------');
const totalStr = 'TOTAL'.padEnd(20, ' ');
console.log(`${totalStr}\t${totalChapters}\t\t${totalMishnayot}`);

// Compare with expected count
const expectedCount = 4192;
const difference = totalMishnayot - expectedCount;

console.log('\nComparison with CSV:');
console.log('===================');
console.log(`Total mishnayot in data.js: ${totalMishnayot}`);
console.log(`Expected count from CSV: ${expectedCount}`);
console.log(`Difference: ${difference} (${difference > 0 ? 'more' : 'fewer'} in data.js than CSV)`);
