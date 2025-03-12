// Test script to verify mishnayot counts

// Import functions from data.js
const { getMishnayotIndividualForSelection } = await import('./js/data.js');

// Count all individual mishnayot
const allMishnayot = getMishnayotIndividualForSelection('all');

// Count by tractate
const tractateCounts = {};
allMishnayot.forEach(unit => {
    const tractateName = unit.split(' ')[0];
    tractateCounts[tractateName] = (tractateCounts[tractateName] || 0) + 1;
});

// Display results
console.log('Mishnayot count by tractate:', tractateCounts);
console.log('Total mishnayot count:', allMishnayot.length);

// Compare with expected count
const expectedCount = 4192;
console.log(`Expected count from CSV: ${expectedCount}`);
console.log(`Difference: ${allMishnayot.length - expectedCount}`);
