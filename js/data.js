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
