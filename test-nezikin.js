// Test script to debug Nezikin order mishnah count

// First, let's define the Nezikin tractates and their mishnah counts
const nezikinTractates = [
    { name: "Bava Kamma", chapters: 10 },
    { name: "Bava Metzia", chapters: 10 },
    { name: "Bava Batra", chapters: 10 },
    { name: "Sanhedrin", chapters: 11 },
    { name: "Makkot", chapters: 3 },
    { name: "Shevuot", chapters: 8 },
    { name: "Eduyot", chapters: 8 },
    { name: "Avodah Zarah", chapters: 5 },
    { name: "Avot", chapters: 6 },
    { name: "Horayot", chapters: 3 }
];

const nezikinCounts = {
    'Bava Kamma': [4, 6, 11, 9, 7, 6, 7, 7, 12, 10],
    'Bava Metzia': [8, 11, 12, 12, 11, 8, 11, 9, 13, 6],
    'Bava Batra': [6, 14, 8, 9, 11, 8, 4, 8, 10, 8],
    'Sanhedrin': [6, 5, 8, 5, 5, 6, 11, 7, 6, 6, 6],
    'Makkot': [10, 8, 16],
    'Shevuot': [7, 5, 11, 13, 5, 7, 8, 6],
    'Eduyot': [14, 10, 12, 12, 7, 3, 9, 7],
    'Avodah Zarah': [9, 7, 10, 12, 12],
    'Avot': [18, 16, 18, 22, 23, 11],
    'Horayot': [5, 7, 8]
};

// Function to build mishnah references (simplified version of the one in data.js)
function buildMishnayotReferences(tractate) {
    const mishnayot = [];
    let tractateTotal = 0;
    console.log(`Building references for tractate: ${tractate.name}, chapters: ${tractate.chapters}`);
    
    for (let chapter = 1; chapter <= tractate.chapters; chapter++) {
        // If we have detailed mishnah counts, use them, otherwise estimate 8 mishnayot per chapter
        const mishnayotCount = nezikinCounts[tractate.name] ? nezikinCounts[tractate.name][chapter-1] : 8;
        console.log(`  Chapter ${chapter}: ${mishnayotCount} mishnayot`);
        tractateTotal += mishnayotCount;
        
        for (let mishnah = 1; mishnah <= mishnayotCount; mishnah++) {
            mishnayot.push(`${tractate.name} ${chapter}:${mishnah}`);
        }
    }
    
    console.log(`  Total for ${tractate.name}: ${tractateTotal} mishnayot`);
    return mishnayot;
}

// Test function to calculate total mishnayot in Nezikin order
function testNezikinCount() {
    console.log('TESTING NEZIKIN ORDER MISHNAH COUNT');
    console.log('==================================');
    
    let allMishnayot = [];
    let orderTotal = 0;
    
    // Process each tractate
    nezikinTractates.forEach(tractate => {
        const tractateRefs = buildMishnayotReferences(tractate);
        allMishnayot = allMishnayot.concat(tractateRefs);
        orderTotal += tractateRefs.length;
    });
    
    console.log('\nSUMMARY:');
    console.log(`Total mishnayot in Nezikin order: ${allMishnayot.length}`);
    
    // Double-check by manually summing the counts
    let manualTotal = 0;
    for (const tractate in nezikinCounts) {
        const tractateTotal = nezikinCounts[tractate].reduce((sum, count) => sum + count, 0);
        console.log(`  ${tractate}: ${tractateTotal} mishnayot`);
        manualTotal += tractateTotal;
    }
    console.log(`Manual total: ${manualTotal} mishnayot`);
    
    // Check if there's a mismatch
    if (allMishnayot.length !== manualTotal) {
        console.log('\nWARNING: Mismatch between calculated total and manual total!');
    }
}

// Run the test
testNezikinCount();
