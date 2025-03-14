// Debugging script to calculate total mishnayot count

// Copy of mishnayotCounts from data.js
const mishnayotCounts = {
    // Zeraim
    'Berakhot': [5, 8, 6, 7, 5, 8, 5, 8, 5],
    'Peah': [6, 8, 8, 11, 8, 11, 8, 9],
    'Damai': [4, 5, 6, 7, 11, 12, 8],
    'Kilayim': [9, 11, 7, 9, 8, 9, 8, 6, 10],
    'Sheviit': [8, 10, 10, 10, 9, 6, 7, 11, 9, 9],
    'Terumot': [10, 6, 9, 13, 9, 6, 7, 12, 7, 12, 10],
    'Maasrot': [8, 8, 10, 6, 8],
    'Maaser Sheni': [7, 10, 13, 12, 15],
    'Challah': [9, 8, 10, 11],
    'Orlah': [9, 16, 9],
    'Bikkurim': [11, 11, 12, 5],
    // Moed
    'Shabbat': [11, 7, 6, 2, 4, 10, 4, 7, 7, 6, 6, 6, 7, 4, 3, 8, 8, 3, 6, 5, 3, 6, 5, 5],
    'Eruvin': [10, 6, 9, 11, 9, 10, 11, 11, 4, 15],
    'Pesachim': [7, 8, 8, 9, 10, 6, 13, 8, 11, 9],
    'Shekalim': [7, 5, 4, 9, 6, 6, 7, 8],
    'Yoma': [8, 7, 11, 6, 7, 8, 5, 9],
    'Sukkah': [11, 9, 15, 10, 8],
    'Beitzah': [10, 10, 8, 7, 7],
    'Rosh Hashanah': [9, 8, 9, 9],
    'Taanit': [7, 10, 9, 8],
    'Megillah': [11, 6, 6, 10],
    'Moed Katan': [10, 5, 9],
    'Chagigah': [8, 7, 8],
    // Nashim
    'Yevamot': [4, 10, 10, 13, 6, 6, 6, 6, 6, 9, 7, 6, 13, 9, 10, 7],
    'Ketubot': [10, 10, 9, 12, 9, 7, 10, 8, 9, 6, 6, 4, 11],
    'Nedarim': [4, 5, 11, 8, 6, 10, 9, 7, 10, 8, 12],
    'Nazir': [7, 10, 7, 7, 7, 11, 4, 2, 5],
    'Sotah': [9, 6, 8, 5, 5, 4, 8, 7, 15],
    'Gittin': [6, 7, 8, 9, 9, 7, 9, 10, 10],
    'Kiddushin': [10, 10, 13, 14],
    // Nezikin
    'Bava Kamma': [4, 6, 11, 9, 7, 6, 7, 7, 12, 10],
    'Bava Metzia': [8, 11, 12, 12, 11, 8, 11, 9, 13, 6],
    'Bava Batra': [6, 14, 8, 9, 11, 8, 4, 8, 10, 8],
    'Sanhedrin': [6, 5, 8, 5, 5, 6, 11, 7, 6, 6, 6],
    'Makkot': [10, 8, 16],
    'Shevuot': [7, 5, 11, 13, 5, 7, 8, 6],
    'Eduyot': [14, 10, 12, 12, 7, 3, 9, 7],
    'Avodah Zarah': [9, 7, 10, 12, 12],
    'Avot': [18, 16, 18, 22, 23, 11],
    'Horayot': [5, 7, 8],
    // Kodashim
    'Zevachim': [4, 5, 6, 6, 8, 7, 6, 12, 7, 8, 8, 6, 8, 10],
    'Menachot': [4, 5, 7, 5, 9, 7, 6, 7, 9, 9, 9, 5, 11],
    'Chullin': [7, 10, 7, 7, 5, 7, 6, 6, 8, 4, 2, 5],
    'Bekhorot': [7, 9, 4, 10, 6, 12, 7, 10, 8],
    'Arakhin': [4, 6, 5, 4, 6, 5, 5, 7, 8],
    'Temurah': [6, 3, 5, 4, 6, 5, 6, 12],
    'Keritot': [7, 6, 10, 3, 8, 9],
    'Meilah': [4, 9, 8, 6, 5, 6],
    'Tamid': [4, 5, 9, 3, 6, 3, 4],
    'Middot': [9, 6, 8, 7, 4],
    'Kinnim': [4, 5, 6],
    // Tahorot
    'Kelim': [9, 8, 8, 4, 11, 4, 6, 11, 8, 8, 9, 8, 8, 8, 6, 8, 17, 9, 10, 7, 3, 10, 5, 17, 9, 9, 12, 10, 8, 4],
    'Oholot': [8, 7, 7, 3, 7, 7, 6, 6, 16, 7, 9, 8, 6, 7, 10, 5, 5, 10],
    'Negaim': [6, 5, 8, 11, 5, 8, 5, 10, 3, 10, 12, 7, 12, 13],
    'Parah': [4, 5, 11, 4, 9, 5, 12, 11, 9, 6, 9, 11],
    'Tahorot': [9, 8, 8, 13, 9, 10, 9, 9, 9, 8],
    'Mikvaot': [8, 10, 4, 5, 6, 11, 7, 5, 7, 8],
    'Niddah': [7, 7, 7, 7, 9, 14, 5, 4, 11, 8],
    'Makhshirin': [6, 11, 8, 10, 11, 8],
    'Zavim': [6, 4, 3, 7, 12],
    'Tevul Yom': [5, 8, 6, 7],
    'Yadayim': [5, 4, 5, 8],
    'Uktzin': [6, 10, 12]
};

// Copy of mishnayotData from data.js (just the structure)
const mishnayotData = {
    zeraim: [
        { name: "Berakhot", chapters: 9 },
        { name: "Peah", chapters: 8 },
        { name: "Damai", chapters: 7 },
        { name: "Kilayim", chapters: 9 },
        { name: "Sheviit", chapters: 10 },
        { name: "Terumot", chapters: 11 },
        { name: "Maasrot", chapters: 5 },
        { name: "Maaser Sheni", chapters: 5 },
        { name: "Challah", chapters: 4 },
        { name: "Orlah", chapters: 3 },
        { name: "Bikkurim", chapters: 4 }
    ],
    moed: [
        { name: "Shabbat", chapters: 24 },
        { name: "Eruvin", chapters: 10 },
        { name: "Pesachim", chapters: 10 },
        { name: "Shekalim", chapters: 8 },
        { name: "Yoma", chapters: 8 },
        { name: "Sukkah", chapters: 5 },
        { name: "Beitzah", chapters: 5 },
        { name: "Rosh Hashanah", chapters: 4 },
        { name: "Taanit", chapters: 4 },
        { name: "Megillah", chapters: 4 },
        { name: "Moed Katan", chapters: 3 },
        { name: "Chagigah", chapters: 3 }
    ],
    nashim: [
        { name: "Yevamot", chapters: 16 },
        { name: "Ketubot", chapters: 13 },
        { name: "Nedarim", chapters: 11 },
        { name: "Nazir", chapters: 9 },
        { name: "Sotah", chapters: 9 },
        { name: "Gittin", chapters: 9 },
        { name: "Kiddushin", chapters: 4 }
    ],
    nezikin: [
        { name: "Bava Kamma", chapters: 10 },
        { name: "Bava Metzia", chapters: 10 },
        { name: "Bava Batra", chapters: 10 },
        { name: "Sanhedrin", chapters: 11 },
        { name: "Makkot", chapters: 3 },
        { name: "Shevuot", chapters: 8 },
        { name: "Eduyot", chapters: 8 },
        { name: "Avodah Zarah", chapters: 5 },
        { name: "Avot", chapters: 5 },
        { name: "Horayot", chapters: 3 }
    ],
    kodashim: [
        { name: "Zevachim", chapters: 14 },
        { name: "Menachot", chapters: 13 },
        { name: "Chullin", chapters: 12 },
        { name: "Bekhorot", chapters: 9 },
        { name: "Arakhin", chapters: 9 },
        { name: "Temurah", chapters: 7 },
        { name: "Keritot", chapters: 6 },
        { name: "Meilah", chapters: 6 },
        { name: "Tamid", chapters: 7 },
        { name: "Middot", chapters: 5 },
        { name: "Kinnim", chapters: 3 }
    ],
    tahorot: [
        { name: "Kelim", chapters: 30 },
        { name: "Oholot", chapters: 18 },
        { name: "Negaim", chapters: 14 },
        { name: "Parah", chapters: 12 },
        { name: "Tahorot", chapters: 10 },
        { name: "Mikvaot", chapters: 10 },
        { name: "Niddah", chapters: 10 },
        { name: "Makhshirin", chapters: 6 },
        { name: "Zavim", chapters: 5 },
        { name: "Tevul Yom", chapters: 4 },
        { name: "Yadayim", chapters: 4 },
        { name: "Uktzin", chapters: 3 }
    ]
};

// Function to calculate mishnayot for a tractate
function calculateMishnayotForTractate(tractate) {
    const counts = mishnayotCounts[tractate.name];
    if (!counts) {
        // If we don't have counts, estimate 8 per chapter
        return tractate.chapters * 8;
    }
    return counts.reduce((sum, count) => sum + count, 0);
}

// Calculate totals by order
function calculateTotalsByOrder() {
    const totals = {};
    let grandTotal = 0;
    
    for (const order in mishnayotData) {
        let orderTotal = 0;
        const tractates = mishnayotData[order];
        
        console.log(`\n${order.toUpperCase()} ORDER:`);
        tractates.forEach(tractate => {
            const tractateTotal = calculateMishnayotForTractate(tractate);
            console.log(`${tractate.name}: ${tractateTotal} mishnayot`);
            orderTotal += tractateTotal;
        });
        
        totals[order] = orderTotal;
        grandTotal += orderTotal;
        console.log(`${order} total: ${orderTotal} mishnayot`);
    }
    
    console.log(`\nGRAND TOTAL: ${grandTotal} mishnayot`);
    return { totals, grandTotal };
}

// Run the calculation
calculateTotalsByOrder();
