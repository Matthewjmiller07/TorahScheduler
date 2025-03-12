// Script to compare mishnayot counts in data.js with counts in the CSV file

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

// Parse the tractate arrays from data.js
const dataJsTractates = {};
const tractateRegex = /'([^']+)': \[([^\]]+)\]/g;
let match;
while ((match = tractateRegex.exec(mishnayotCountsSection)) !== null) {
  const tractateName = match[1];
  const countsArray = match[2].split(',').map(num => parseInt(num.trim(), 10));
  dataJsTractates[tractateName] = countsArray;
}

// Read the CSV file
const csvPath = path.join(__dirname, 'Parsha Tracking Sheet - Chapters of Tanach and Mishnah.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const csvLines = csvContent.split('\n');

// Parse the CSV file to get mishnayot counts
const csvTractates = {};
let currentTractate = null;
let currentChapter = 0;

csvLines.forEach(line => {
  const parts = line.split(',');
  if (parts[0] === 'Mishnah') {
    const tractate = parts[1];
    const chapter = parseInt(parts[2], 10);
    const mishnayot = parseInt(parts[3], 10);
    
    if (!isNaN(chapter) && !isNaN(mishnayot)) {
      if (!csvTractates[tractate]) {
        csvTractates[tractate] = [];
      }
      
      // Ensure we're filling the array at the correct index (chapter - 1)
      while (csvTractates[tractate].length < chapter - 1) {
        csvTractates[tractate].push(0); // Fill any gaps with 0
      }
      
      csvTractates[tractate][chapter - 1] = mishnayot;
    }
  }
});

// Compare the counts
console.log('Comparing mishnayot counts between data.js and CSV:');
console.log('=================================================');
console.log('Tractate\t\tdata.js\tCSV\tDifference');
console.log('-------------------------------------------------');

let totalDataJs = 0;
let totalCsv = 0;
let discrepancies = [];

// First, check all tractates in data.js
for (const tractate in dataJsTractates) {
  const dataJsCount = dataJsTractates[tractate].reduce((sum, count) => sum + count, 0);
  totalDataJs += dataJsCount;
  
  let csvCount = 0;
  if (csvTractates[tractate]) {
    csvCount = csvTractates[tractate].reduce((sum, count) => sum + count, 0);
    totalCsv += csvCount;
  }
  
  const difference = dataJsCount - csvCount;
  
  if (difference !== 0) {
    const tractateStr = tractate.padEnd(20, ' ');
    console.log(`${tractateStr}\t${dataJsCount}\t${csvCount}\t${difference}`);
    
    discrepancies.push({
      tractate,
      dataJsCount,
      csvCount,
      difference
    });
  }
}

// Check for tractates in CSV but not in data.js
for (const tractate in csvTractates) {
  if (!dataJsTractates[tractate]) {
    const csvCount = csvTractates[tractate].reduce((sum, count) => sum + count, 0);
    totalCsv += csvCount;
    
    const tractateStr = tractate.padEnd(20, ' ');
    console.log(`${tractateStr}\t0\t${csvCount}\t-${csvCount}`);
    
    discrepancies.push({
      tractate,
      dataJsCount: 0,
      csvCount,
      difference: -csvCount
    });
  }
}

console.log('-------------------------------------------------');
const totalStr = 'TOTAL'.padEnd(20, ' ');
console.log(`${totalStr}\t${totalDataJs}\t${totalCsv}\t${totalDataJs - totalCsv}`);

// Generate code to fix the discrepancies
if (discrepancies.length > 0) {
  console.log('\nCode to fix the discrepancies:');
  console.log('============================');
  
  discrepancies.forEach(d => {
    if (d.csvCount > 0) {
      const csvArray = JSON.stringify(csvTractates[d.tractate]);
      console.log(`// Update ${d.tractate} (${d.dataJsCount} -> ${d.csvCount})`);
      console.log(`'${d.tractate}': ${csvArray.replace(/\[|\]/g, '')},`);
    } else {
      console.log(`// Remove ${d.tractate} (${d.dataJsCount} -> 0)`);
      console.log(`// Delete the line with '${d.tractate}': [...]`);
    }
  });
}
