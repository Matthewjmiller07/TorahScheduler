/**
 * Torah Schedule Creator - Data Module
 * Contains all the data structures for Tanach books and Mishnah tractates
 */

// Tanach data organization
const tanachData = {
    // Torah (Five Books of Moses)
    torah: [
        { name: "Genesis", hebrewName: "בראשית", chapters: 50 },
        { name: "Exodus", hebrewName: "שמות", chapters: 40 },
        { name: "Leviticus", hebrewName: "ויקרא", chapters: 27 },
        { name: "Numbers", hebrewName: "במדבר", chapters: 36 },
        { name: "Deuteronomy", hebrewName: "דברים", chapters: 34 }
    ],
    
    // Nevi'im (Prophets)
    neviim: [
        { name: "Joshua", hebrewName: "יהושע", chapters: 24 },
        { name: "Judges", hebrewName: "שופטים", chapters: 21 },
        { name: "I Samuel", hebrewName: "שמואל א", chapters: 31 },
        { name: "II Samuel", hebrewName: "שמואל ב", chapters: 24 },
        { name: "I Kings", hebrewName: "מלכים א", chapters: 22 },
        { name: "II Kings", hebrewName: "מלכים ב", chapters: 25 },
        { name: "Isaiah", hebrewName: "ישעיה", chapters: 66 },
        { name: "Jeremiah", hebrewName: "ירמיה", chapters: 52 },
        { name: "Ezekiel", hebrewName: "יחזקאל", chapters: 48 },
        { name: "Hosea", hebrewName: "הושע", chapters: 14 },
        { name: "Joel", hebrewName: "יואל", chapters: 4 },
        { name: "Amos", hebrewName: "עמוס", chapters: 9 },
        { name: "Obadiah", hebrewName: "עובדיה", chapters: 1 },
        { name: "Jonah", hebrewName: "יונה", chapters: 4 },
        { name: "Micah", hebrewName: "מיכה", chapters: 7 },
        { name: "Nahum", hebrewName: "נחום", chapters: 3 },
        { name: "Habakkuk", hebrewName: "חבקוק", chapters: 3 },
        { name: "Zephaniah", hebrewName: "צפניה", chapters: 3 },
        { name: "Haggai", hebrewName: "חגי", chapters: 2 },
        { name: "Zechariah", hebrewName: "זכריה", chapters: 14 },
        { name: "Malachi", hebrewName: "מלאכי", chapters: 3 }
    ],
    
    // Ketuvim (Writings)
    ketuvim: [
        { name: "Psalms", hebrewName: "תהלים", chapters: 150 },
        { name: "Proverbs", hebrewName: "משלי", chapters: 31 },
        { name: "Job", hebrewName: "איוב", chapters: 42 },
        { name: "Song of Songs", hebrewName: "שיר השירים", chapters: 8 },
        { name: "Ruth", hebrewName: "רות", chapters: 4 },
        { name: "Lamentations", hebrewName: "איכה", chapters: 5 },
        { name: "Ecclesiastes", hebrewName: "קהלת", chapters: 12 },
        { name: "Esther", hebrewName: "אסתר", chapters: 10 },
        { name: "Daniel", hebrewName: "דניאל", chapters: 12 },
        { name: "Ezra", hebrewName: "עזרא", chapters: 10 },
        { name: "Nehemiah", hebrewName: "נחמיה", chapters: 13 },
        { name: "I Chronicles", hebrewName: "דברי הימים א", chapters: 29 },
        { name: "II Chronicles", hebrewName: "דברי הימים ב", chapters: 36 }
    ]
};

// Mishnah data organization by Seder (Order) and Tractate
const mishnayotData = {
    // Zeraim (Seeds) - Agricultural laws
    zeraim: [
        { name: "Berakhot", hebrewName: "ברכות", chapters: 9 },
        { name: "Peah", hebrewName: "פאה", chapters: 8 },
        { name: "Demai", hebrewName: "דמאי", chapters: 7 },
        { name: "Kilayim", hebrewName: "כלאים", chapters: 9 },
        { name: "Sheviit", hebrewName: "שביעית", chapters: 10 },
        { name: "Terumot", hebrewName: "תרומות", chapters: 11 },
        { name: "Maasrot", hebrewName: "מעשרות", chapters: 5 },
        { name: "Maaser Sheni", hebrewName: "מעשר שני", chapters: 5 },
        { name: "Challah", hebrewName: "חלה", chapters: 4 },
        { name: "Orlah", hebrewName: "ערלה", chapters: 3 },
        { name: "Bikkurim", hebrewName: "ביכורים", chapters: 4 }
    ],
    
    // Moed (Festival) - Laws of Shabbat and Festivals
    moed: [
        { name: "Shabbat", hebrewName: "שבת", chapters: 24 },
        { name: "Eruvin", hebrewName: "עירובין", chapters: 10 },
        { name: "Pesachim", hebrewName: "פסחים", chapters: 10 },
        { name: "Shekalim", hebrewName: "שקלים", chapters: 8 },
        { name: "Yoma", hebrewName: "יומא", chapters: 8 },
        { name: "Sukkah", hebrewName: "סוכה", chapters: 5 },
        { name: "Beitzah", hebrewName: "ביצה", chapters: 5 },
        { name: "Rosh Hashanah", hebrewName: "ראש השנה", chapters: 4 },
        { name: "Taanit", hebrewName: "תענית", chapters: 4 },
        { name: "Megillah", hebrewName: "מגילה", chapters: 4 },
        { name: "Moed Katan", hebrewName: "מועד קטן", chapters: 3 },
        { name: "Chagigah", hebrewName: "חגיגה", chapters: 3 }
    ],
    
    // Nashim (Women) - Laws related to marriage and divorce
    nashim: [
        { name: "Yevamot", hebrewName: "יבמות", chapters: 16 },
        { name: "Ketubot", hebrewName: "כתובות", chapters: 13 },
        { name: "Nedarim", hebrewName: "נדרים", chapters: 11 },
        { name: "Nazir", hebrewName: "נזיר", chapters: 9 },
        { name: "Sotah", hebrewName: "סוטה", chapters: 9 },
        { name: "Gittin", hebrewName: "גיטין", chapters: 9 },
        { name: "Kiddushin", hebrewName: "קידושין", chapters: 4 }
    ],
    
    // Nezikin (Damages) - Civil and criminal law
    nezikin: [
        { name: "Bava Kamma", hebrewName: "בבא קמא", chapters: 10 },
        { name: "Bava Metzia", hebrewName: "בבא מציעא", chapters: 10 },
        { name: "Bava Batra", hebrewName: "בבא בתרא", chapters: 10 },
        { name: "Sanhedrin", hebrewName: "סנהדרין", chapters: 11 },
        { name: "Makkot", hebrewName: "מכות", chapters: 3 },
        { name: "Shevuot", hebrewName: "שבועות", chapters: 8 },
        { name: "Eduyot", hebrewName: "עדויות", chapters: 8 },
        { name: "Avodah Zarah", hebrewName: "עבודה זרה", chapters: 5 },
        { name: "Avot", hebrewName: "אבות", chapters: 5 },
        { name: "Horayot", hebrewName: "הוריות", chapters: 3 }
    ],
    
    // Kodashim (Holy things) - Temple service and sacrifices
    kodashim: [
        { name: "Zevachim", hebrewName: "זבחים", chapters: 14 },
        { name: "Menachot", hebrewName: "מנחות", chapters: 13 },
        { name: "Chullin", hebrewName: "חולין", chapters: 12 },
        { name: "Bekhorot", hebrewName: "בכורות", chapters: 9 },
        { name: "Arakhin", hebrewName: "ערכין", chapters: 9 },
        { name: "Temurah", hebrewName: "תמורה", chapters: 7 },
        { name: "Keritot", hebrewName: "כריתות", chapters: 6 },
        { name: "Meilah", hebrewName: "מעילה", chapters: 6 },
        { name: "Tamid", hebrewName: "תמיד", chapters: 7 },
        { name: "Middot", hebrewName: "מידות", chapters: 5 },
        { name: "Kinnim", hebrewName: "קינים", chapters: 3 }
    ],
    
    // Taharot (Purities) - Ritual purity and impurity
    taharot: [
        { name: "Kelim", hebrewName: "כלים", chapters: 30 },
        { name: "Ohalot", hebrewName: "אהלות", chapters: 18 },
        { name: "Negaim", hebrewName: "נגעים", chapters: 14 },
        { name: "Parah", hebrewName: "פרה", chapters: 12 },
        { name: "Taharot", hebrewName: "טהרות", chapters: 10 },
        { name: "Mikvaot", hebrewName: "מקוואות", chapters: 10 },
        { name: "Niddah", hebrewName: "נידה", chapters: 10 },
        { name: "Makhshirin", hebrewName: "מכשירין", chapters: 6 },
        { name: "Zavim", hebrewName: "זבים", chapters: 5 },
        { name: "Tevul Yom", hebrewName: "טבול יום", chapters: 4 },
        { name: "Yadayim", hebrewName: "ידיים", chapters: 4 },
        { name: "Uktzin", hebrewName: "עוקצין", chapters: 3 }
    ]
};

// Helper function to get all books from Tanach
function getAllTanachBooks() {
    return [...tanachData.torah, ...tanachData.neviim, ...tanachData.ketuvim];
}

// Helper function to get all tractates from Mishnah
function getAllMishnayotTractates() {
    return [
        ...mishnayotData.zeraim,
        ...mishnayotData.moed,
        ...mishnayotData.nashim,
        ...mishnayotData.nezikin,
        ...mishnayotData.kodashim,
        ...mishnayotData.taharot
    ];
}

// Helper function to get tractates by seder
function getMishnayotBySeder(seder) {
    return mishnayotData[seder] || [];
}

// Helper function to build chapter references for a book
function buildChapterReferences(book, totalChapters) {
    const chapters = [];
    for (let i = 1; i <= totalChapters; i++) {
        chapters.push(`${book} ${i}`);
    }
    return chapters;
}

// Helper function to get all chapters for selected books
function getChaptersForSelection(selection, customBook = null) {
    let chapters = [];
    
    if (selection === 'all') {
        // All of Tanach
        getAllTanachBooks().forEach(book => {
            chapters = chapters.concat(buildChapterReferences(book.name, book.chapters));
        });
    } else if (selection === 'torah') {
        // Torah only
        tanachData.torah.forEach(book => {
            chapters = chapters.concat(buildChapterReferences(book.name, book.chapters));
        });
    } else if (selection === 'neviim') {
        // Nevi'im only
        tanachData.neviim.forEach(book => {
            chapters = chapters.concat(buildChapterReferences(book.name, book.chapters));
        });
    } else if (selection === 'ketuvim') {
        // Ketuvim only
        tanachData.ketuvim.forEach(book => {
            chapters = chapters.concat(buildChapterReferences(book.name, book.chapters));
        });
    } else if (selection === 'custom' && customBook) {
        // Individual book
        const allBooks = getAllTanachBooks();
        const book = allBooks.find(b => b.name === customBook);
        if (book) {
            chapters = buildChapterReferences(book.name, book.chapters);
        }
    }
    
    return chapters;
}

// Helper function to get all verses for selected books
function getTanachVersesForSelection(selection, customBook = null) {
    console.log('getTanachVersesForSelection called with:', { selection, customBook });
    let verses = [];
    
    // Verse counts per chapter for each book (approximate)
    const verseData = {
        // Torah books have detailed verse counts per chapter
        'Genesis': [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26],
        'Exodus': [22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38],
        'Leviticus': [17, 16, 17, 35, 19, 30, 38, 36, 24, 20, 47, 8, 59, 56, 33, 34, 16, 30, 37, 27, 24, 33, 44, 23, 55, 46, 34],
        'Numbers': [54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 16, 33, 45, 41, 50, 13, 32, 22, 29, 35, 41, 30, 25, 18, 65, 23, 31, 40, 16, 54, 42, 56, 29, 34, 13],
        'Deuteronomy': [46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 32, 18, 29, 23, 22, 20, 22, 21, 20, 23, 30, 25, 22, 19, 19, 26, 68, 29, 20, 30, 52, 29, 12]
    };
    console.log('Verse data loaded for books:', Object.keys(verseData));
    
    // Helper function to build verse references for a book
    function buildVerseReferences(book, chapterVerseCounts) {
        console.log('Building verse references for book:', book.name, 'with', book.chapters, 'chapters');
        const verses = [];
        for (let chapter = 1; chapter <= book.chapters; chapter++) {
            // If we have detailed verse counts, use them, otherwise estimate 25 verses per chapter
            const verseCount = chapterVerseCounts ? chapterVerseCounts[chapter-1] : 25;
            console.log(`Chapter ${chapter} has ${verseCount} verses`);
            for (let verse = 1; verse <= verseCount; verse++) {
                verses.push(`${book.name} ${chapter}:${verse}`);
            }
        }
        console.log(`Generated ${verses.length} verses for ${book.name}`);
        return verses;
    }
    
    console.log('Processing selection:', selection);
    if (selection === 'all') {
        // All Tanach
        console.log('Getting all Tanach books');
        const allBooks = getAllTanachBooks();
        console.log('Found', allBooks.length, 'books in Tanach');
        allBooks.forEach(book => {
            verses = verses.concat(buildVerseReferences(book, verseData[book.name]));
        });
    } else if (selection === 'torah') {
        // Torah only
        console.log('Getting Torah books');
        tanachData.torah.forEach(book => {
            verses = verses.concat(buildVerseReferences(book, verseData[book.name]));
        });
    } else if (selection === 'neviim') {
        // Neviim only
        console.log('Getting Neviim books');
        tanachData.neviim.forEach(book => {
            verses = verses.concat(buildVerseReferences(book, verseData[book.name]));
        });
    } else if (selection === 'ketuvim') {
        // Ketuvim only
        console.log('Getting Ketuvim books');
        tanachData.ketuvim.forEach(book => {
            verses = verses.concat(buildVerseReferences(book, verseData[book.name]));
        });
    } else if (selection === 'custom' && customBook) {
        // Custom book
        console.log('Getting custom book:', customBook);
        const allBooks = getAllTanachBooks();
        const book = allBooks.find(b => b.name === customBook);
        if (book) {
            console.log('Found book:', book.name, 'with', book.chapters, 'chapters');
            verses = buildVerseReferences(book, verseData[book.name]);
        } else {
            console.error('Custom book not found:', customBook);
        }
    } else {
        console.error('Unknown selection type:', selection);
    }
    
    console.log(`Returning ${verses.length} verses total`);
    return verses;
}

// Helper function to get all chapters for selected Mishnah tractates
function getMishnayotChaptersForSelection(selection, customSeder = null, customTractates = []) {
    let chapters = [];
    
    if (selection === 'all') {
        // All of Mishnayot
        getAllMishnayotTractates().forEach(tractate => {
            chapters = chapters.concat(buildChapterReferences(tractate.name, tractate.chapters));
        });
    } else if (selection === 'seder' && customSeder) {
        // Check if we're studying specific tractates or the whole seder
        const studyWholeSeder = document.getElementById('studyWholeSeder').checked;
        console.log('In data.js - studyWholeSeder:', studyWholeSeder);
        console.log('In data.js - customTractates:', customTractates);
        
        if (studyWholeSeder) {
            // Specific Seder - all tractates
            const tractates = mishnayotData[customSeder] || [];
            console.log('In data.js - studying whole seder, tractates:', tractates.map(t => t.name));
            tractates.forEach(tractate => {
                chapters = chapters.concat(buildChapterReferences(tractate.name, tractate.chapters));
            });
        } else if (customTractates && customTractates.length > 0) {
            // Specific tractates from the seder
            const tractates = mishnayotData[customSeder] || [];
            console.log('In data.js - studying specific tractates from', customSeder, 'available tractates:', tractates.map(t => t.name));
            
            customTractates.forEach(tractateName => {
                console.log('Looking for tractate:', tractateName);
                const tractate = tractates.find(t => t.name === tractateName);
                if (tractate) {
                    console.log('Found tractate:', tractate.name, 'with', tractate.chapters, 'chapters');
                    chapters = chapters.concat(buildChapterReferences(tractate.name, tractate.chapters));
                } else {
                    console.log('Tractate not found:', tractateName);
                }
            });
        }
    }
    
    return chapters;
}

// Helper function to get all individual Mishnayot for selected tractates
function getMishnayotIndividualForSelection(selection, customSeder = null, customTractates = []) {
    let mishnayot = [];
    
    // Approximate counts of Mishnayot per chapter for each tractate
    const mishnayotCounts = {
        // Average number of Mishnayot per chapter for each tractate
        // These are approximate and would need to be refined with actual counts
        'Berakhot': [5, 8, 6, 7, 5, 8, 5, 8, 5],
        'Peah': [6, 8, 8, 11, 8, 11, 8, 9],
        'Shabbat': [11, 7, 6, 2, 4, 10, 4, 7, 7, 6, 6, 6, 7, 4, 3, 8, 8, 3, 6, 5, 3, 6, 5, 5]
    };
    
    // Helper function to build individual Mishnah references
    function buildMishnayotReferences(tractate) {
        const mishnayot = [];
        for (let chapter = 1; chapter <= tractate.chapters; chapter++) {
            // If we have detailed mishnah counts, use them, otherwise estimate 8 mishnayot per chapter
            const mishnayotCount = mishnayotCounts[tractate.name] ? mishnayotCounts[tractate.name][chapter-1] : 8;
            for (let mishnah = 1; mishnah <= mishnayotCount; mishnah++) {
                mishnayot.push(`${tractate.name} ${chapter}:${mishnah}`);
            }
        }
        return mishnayot;
    }
    
    if (selection === 'all') {
        // All of Mishnayot
        getAllMishnayotTractates().forEach(tractate => {
            mishnayot = mishnayot.concat(buildMishnayotReferences(tractate));
        });
    } else if (selection === 'seder' && customSeder) {
        // Check if we're studying specific tractates or the whole seder
        const studyWholeSeder = document.getElementById('studyWholeSeder').checked;
        
        if (studyWholeSeder) {
            // Specific Seder - all tractates
            const tractates = mishnayotData[customSeder] || [];
            tractates.forEach(tractate => {
                mishnayot = mishnayot.concat(buildMishnayotReferences(tractate));
            });
        } else if (customTractates && customTractates.length > 0) {
            // Specific tractates from the seder
            const tractates = mishnayotData[customSeder] || [];
            
            customTractates.forEach(tractateName => {
                const tractate = tractates.find(t => t.name === tractateName);
                if (tractate) {
                    mishnayot = mishnayot.concat(buildMishnayotReferences(tractate));
                }
            });
        }
    }
    
    return mishnayot;
}
