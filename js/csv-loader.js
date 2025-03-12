// CSV Loader for Mishnah data

async function loadMishnayotFromCSV() {
    try {
        const response = await fetch('Parsha Tracking Sheet - Chapters of Tanach and Mishnah.csv');
        const csvText = await response.text();
        
        // Parse CSV
        const lines = csvText.split('\n');
        const mishnayotData = {};
        
        // Process each line
        lines.forEach(line => {
            const cols = line.split(',');
            if (cols.length >= 4 && cols[0] === 'Mishnah') {
                const tractate = cols[1];
                const chapter = parseInt(cols[2]);
                const mishnayotCount = parseInt(cols[3]);
                
                if (!isNaN(chapter) && !isNaN(mishnayotCount)) {
                    if (!mishnayotData[tractate]) {
                        mishnayotData[tractate] = [];
                    }
                    
                    // Ensure the array has enough elements
                    while (mishnayotData[tractate].length < chapter) {
                        mishnayotData[tractate].push(0);
                    }
                    
                    mishnayotData[tractate][chapter - 1] = mishnayotCount;
                }
            }
        });
        
        return mishnayotData;
    } catch (error) {
        console.error('Error loading CSV:', error);
        return null;
    }
}

// Function to count total mishnayot
function countTotalMishnayot(mishnayotData) {
    let total = 0;
    for (const tractate in mishnayotData) {
        total += mishnayotData[tractate].reduce((sum, count) => sum + count, 0);
    }
    return total;
}

// Export functions
window.loadMishnayotFromCSV = loadMishnayotFromCSV;
window.countTotalMishnayot = countTotalMishnayot;
