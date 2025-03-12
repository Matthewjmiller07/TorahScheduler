// Functions for loading and using Mishnah data directly from CSV

// Load Mishnayot data from CSV file
async function loadMishnayotFromCSV() {
    try {
        console.log('Fetching CSV data...');
        // Use absolute path to ensure the file is found
        const response = await fetch('/Parsha Tracking Sheet - Chapters of Tanach and Mishnah.csv');
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
        }
        
        const csvText = await response.text();
        console.log('CSV data loaded, length:', csvText.length);
        
        // Parse CSV - handle both \n and \r\n line endings
        const lines = csvText.split(/?
/);
        console.log('CSV lines:', lines.length);
        
        const mishnayotData = {};
        let mishnayotCount = 0;
        
        // Process each line
        lines.forEach((line, index) => {
            // Skip empty lines
            if (!line.trim()) return;
            
            const cols = line.split(',');
            if (cols.length >= 4 && cols[0].trim() === 'Mishnah') {
                const tractate = cols[1].trim();
                const chapter = parseInt(cols[2].trim());
                const count = parseInt(cols[3].trim());
                
                if (!isNaN(chapter) && !isNaN(count)) {
                    if (!mishnayotData[tractate]) {
                        mishnayotData[tractate] = [];
                    }
                    
                    // Ensure the array has enough elements
                    while (mishnayotData[tractate].length < chapter) {
                        mishnayotData[tractate].push(0);
                    }
                    
                    mishnayotData[tractate][chapter - 1] = count;
                    mishnayotCount += count;
                }
            }
        });
        
        console.log('Total tractates loaded from CSV:', Object.keys(mishnayotData).length);
        console.log('Total mishnayot count from CSV:', mishnayotCount);
        
        if (mishnayotCount === 0) {
            throw new Error('No mishnayot found in CSV data');
        }
        
        return mishnayotData;
    } catch (error) {
        console.error('Error loading CSV:', error);
        return null;
    }
}

// Count total mishnayot in the data
function countTotalMishnayot(mishnayotData) {
    let total = 0;
    for (const tractate in mishnayotData) {
        total += mishnayotData[tractate].reduce((sum, count) => sum + count, 0);
    }
    return total;
}

// Get all tractate names from the CSV data
function getAllTractatesFromCSV(csvData) {
    return Object.keys(csvData);
}

// Get tractates for a specific seder from the CSV data
function getTractatesForSederFromCSV(seder, csvData) {
    // Map seder names to their tractates based on the traditional order
    const sederMapping = {
        'zeraim': [
            'Berachot', 'Peah', 'Damai', 'Kilaim', 'Sheviit', 'Terumot',
            'Maserot', 'Maser Sheni', 'Chalah', 'Orlah', 'Bikurim'
        ],
        'moed': [
            'Shabbat', 'Eruvin', 'Psachim', 'Shekalim', 'Yoma', 'Sukkah',
            'Beitzah', 'Rosh HaShanah', 'Taanit', 'Megilah', 'Moed Kattan', 'Chaggigah'
        ],
        'nashim': [
            'Yevamot', 'Ketubot', 'Nedarim', 'Nazir', 'Sotah', 'Gittin', 'Kidushin'
        ],
        'nezikin': [
            'Bava Kamma', 'Bava Metzia', 'Bava Batra', 'Sanhedrin', 'Makot',
            'Shevuot', 'Eduyot', 'Avodah Zara', 'Avot', 'Horyot'
        ],
        'kodashim': [
            'Zevachim', 'Menachot', 'Chullin', 'Bechorot', 'Erchin',
            'Temurah', 'Keritot', 'Meilah', 'Tamid', 'Middot', 'Kinnim'
        ],
        'taharot': [
            'Kelim', 'Ohalot', 'Negaim', 'Parah', 'Taharot', 'Mikvaot',
            'Niddah', 'Machshirin', 'Zavim', 'Tevul Yom', 'Yadayim', 'Uktzim'
        ]
    };
    
    // Get the tractates for the selected seder
    const sederTractates = sederMapping[seder] || [];
    
    // Filter to only include tractates that exist in the CSV data
    return sederTractates.filter(tractate => csvData[tractate]);
}

// Generate individual mishnayot references from CSV data
function generateMishnayotReferencesFromCSV(tractate, csvData) {
    if (!csvData[tractate]) {
        console.warn(`Tractate ${tractate} not found in CSV data`);
        return [];
    }
    
    const mishnayot = [];
    const chapterCounts = csvData[tractate];
    
    for (let chapter = 1; chapter <= chapterCounts.length; chapter++) {
        const mishnayotCount = chapterCounts[chapter - 1];
        for (let mishnah = 1; mishnah <= mishnayotCount; mishnah++) {
            mishnayot.push(`${tractate} ${chapter}:${mishnah}`);
        }
    }
    
    return mishnayot;
}

// Get individual mishnayot for the selected tractates using CSV data
async function getMishnayotFromCSV(selection, customSeder = null, customTractates = []) {
    // Load CSV data if not already loaded
    const csvData = await loadMishnayotFromCSV();
    if (!csvData) {
        console.error('Failed to load CSV data');
        return [];
    }
    
    let mishnayot = [];
    
    if (selection === 'all') {
        // All of Mishnayot
        const allTractates = getAllTractatesFromCSV(csvData);
        for (const tractate of allTractates) {
            mishnayot = mishnayot.concat(generateMishnayotReferencesFromCSV(tractate, csvData));
        }
    } else if (selection === 'seder' && customSeder) {
        // Check if we're studying specific tractates or the whole seder
        const studyWholeSeder = document.getElementById('studyWholeSeder').checked;
        
        if (studyWholeSeder) {
            // Specific Seder - all tractates
            const tractates = getTractatesForSederFromCSV(customSeder, csvData);
            for (const tractate of tractates) {
                mishnayot = mishnayot.concat(generateMishnayotReferencesFromCSV(tractate, csvData));
            }
        } else if (customTractates && customTractates.length > 0) {
            // Specific tractates from the seder
            for (const tractate of customTractates) {
                mishnayot = mishnayot.concat(generateMishnayotReferencesFromCSV(tractate, csvData));
            }
        }
    }
    
    return mishnayot;
}
