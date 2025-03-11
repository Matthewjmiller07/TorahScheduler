/**
 * Torah Schedule Creator - Main Application Logic
 * Handles UI interactions, schedule generation, and file downloads
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize date pickers
    initializeDatePickers();
    
    // Initialize form event listeners
    initializeFormListeners();
    
    // Initialize book selection dropdowns
    populateBookSelections();
    
    // Initialize Mishnah selection dropdowns
    populateMishnayotSelections();
});

/**
 * Initialize all date picker fields
 */
function initializeDatePickers() {
    const today = new Date();
    
    // Tanach date pickers
    const startDatePicker = flatpickr('#startDate', {
        dateFormat: 'Y-m-d',
        defaultDate: today
    });
    
    flatpickr('#endDate', {
        dateFormat: 'Y-m-d',
        defaultDate: '',
        onOpen: function(selectedDates, dateStr, instance) {
            // Set default to start date when opened if empty
            if (!dateStr) {
                const startDate = document.getElementById('startDate').value;
                if (startDate) {
                    instance.setDate(startDate);
                }
            }
        }
    });
    
    // Mishnayot date pickers
    flatpickr('#mishnayotStartDate', {
        dateFormat: 'Y-m-d',
        defaultDate: today
    });
    
    flatpickr('#mishnayotEndDate', {
        dateFormat: 'Y-m-d',
        defaultDate: '',
        onOpen: function(selectedDates, dateStr, instance) {
            // Set default to start date when opened if empty
            if (!dateStr) {
                const startDate = document.getElementById('mishnayotStartDate').value;
                if (startDate) {
                    instance.setDate(startDate);
                }
            }
        }
    });
}

/**
 * Parse a date string in YYYY-MM-DD format to ensure consistent date handling
 * This avoids timezone issues that can occur with the Date constructor
 */
function parseDate(dateStr) {
    if (!dateStr) return new Date();
    
    const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
    return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date
}

/**
 * Initialize event listeners for form controls
 */
function initializeFormListeners() {
    // Tanach form listeners
    document.getElementById('tanachSelection').addEventListener('change', handleTanachSelectionChange);
    
    const scheduleTypeRadios = document.querySelectorAll('input[name="scheduleType"]');
    scheduleTypeRadios.forEach(radio => {
        radio.addEventListener('change', handleScheduleTypeChange);
    });
    
    document.getElementById('generateScheduleBtn').addEventListener('click', generateTanachSchedule);
    
    // Mishnayot form listeners
    document.getElementById('mishnayotSelection').addEventListener('change', handleMishnayotSelectionChange);
    
    const mishnayotScheduleTypeRadios = document.querySelectorAll('input[name="mishnayotScheduleType"]');
    mishnayotScheduleTypeRadios.forEach(radio => {
        radio.addEventListener('change', handleMishnayotScheduleTypeChange);
    });
    
    document.getElementById('sederSelection').addEventListener('change', handleSederSelectionChange);
    document.getElementById('studyWholeSeder').addEventListener('change', handleStudyWholeSederChange);
    document.getElementById('generateMishnayotScheduleBtn').addEventListener('click', generateMishnayotSchedule);
    
    // Download buttons
    document.getElementById('downloadCsvBtn').addEventListener('click', downloadScheduleCSV);
    document.getElementById('downloadIcsBtn').addEventListener('click', downloadScheduleICS);
}

/**
 * Populate book selection dropdowns
 */
function populateBookSelections() {
    const bookSelection = document.getElementById('bookSelection');
    bookSelection.innerHTML = '';
    
    // Add all books from Tanach
    const allBooks = getAllTanachBooks();
    allBooks.forEach(book => {
        const option = document.createElement('option');
        option.value = book.name;
        option.textContent = `${book.name} (${book.hebrewName})`;
        bookSelection.appendChild(option);
    });
}

/**
 * Populate Mishnah selection dropdowns
 */
function populateMishnayotSelections() {
    // Populate Seder selection
    const sederSelection = document.getElementById('sederSelection');
    sederSelection.innerHTML = '';
    
    const sedarim = [
        { value: 'zeraim', label: 'Zeraim (Seeds)' },
        { value: 'moed', label: 'Moed (Festival)' },
        { value: 'nashim', label: 'Nashim (Women)' },
        { value: 'nezikin', label: 'Nezikin (Damages)' },
        { value: 'kodashim', label: 'Kodashim (Holy Things)' },
        { value: 'taharot', label: 'Taharot (Purities)' }
    ];
    
    sedarim.forEach(seder => {
        const option = document.createElement('option');
        option.value = seder.value;
        option.textContent = seder.label;
        sederSelection.appendChild(option);
    });
    
    // Populate tractate selection with all tractates initially
    updateTractateSelection('zeraim');
}

/**
 * Update tractate selection based on selected Seder
 */
function updateTractateSelection(seder) {
    const tractateSelection = document.getElementById('tractateSelection');
    tractateSelection.innerHTML = '';
    
    const tractates = getMishnayotBySeder(seder);
    tractates.forEach(tractate => {
        const option = document.createElement('option');
        option.value = tractate.name;
        option.textContent = `${tractate.name} (${tractate.hebrewName}) - ${tractate.chapters} chapters`;
        tractateSelection.appendChild(option);
    });
}

/**
 * Populate tractate options with all tractates or filtered by seder
 */
function populateTractateOptions(showAll = false) {
    const tractateSelection = document.getElementById('tractateSelection');
    
    if (showAll) {
        // Clear existing options
        tractateSelection.innerHTML = '';
        
        // Add all tractates from all sedarim
        for (const seder in mishnah) {
            const tractates = getMishnayotBySeder(seder);
            
            // Create an optgroup for each seder
            const optgroup = document.createElement('optgroup');
            optgroup.label = seder;
            
            // Add each tractate to the group
            tractates.forEach(tractate => {
                const option = document.createElement('option');
                option.value = tractate.name;
                option.textContent = `${tractate.name} (${tractate.hebrewName}) - ${tractate.chapters} chapters`;
                optgroup.appendChild(option);
            });
            
            tractateSelection.appendChild(optgroup);
        }
    } else {
        // Filter by selected seder
        const seder = document.getElementById('sederSelection').value;
        updateTractateSelection(seder);
    }
}

/**
 * Handle change in Tanach selection dropdown
 */
function handleTanachSelectionChange() {
    const selection = document.getElementById('tanachSelection').value;
    const bookSelectionGroup = document.getElementById('bookSelectionGroup');
    
    if (selection === 'custom') {
        bookSelectionGroup.style.display = 'block';
    } else {
        bookSelectionGroup.style.display = 'none';
    }
}

/**
 * Handle change in schedule type radio buttons
 */
function handleScheduleTypeChange() {
    const scheduleType = document.querySelector('input[name="scheduleType"]:checked').value;
    const chaptersPerDayGroup = document.getElementById('chaptersPerDayGroup');
    const timeframeGroup = document.getElementById('timeframeGroup');
    
    if (scheduleType === 'chaptersPerDay') {
        chaptersPerDayGroup.style.display = 'block';
        timeframeGroup.style.display = 'none';
    } else {
        chaptersPerDayGroup.style.display = 'none';
        timeframeGroup.style.display = 'block';
    }
}

/**
 * Handle change in Mishnayot selection dropdown
 */
function handleMishnayotSelectionChange() {
    const selection = document.getElementById('mishnayotSelection').value;
    const sederSelectionGroup = document.getElementById('sederSelectionGroup');
    
    if (selection === 'seder') {
        sederSelectionGroup.style.display = 'block';
        // Make sure the checkbox is checked by default
        document.getElementById('studyWholeSeder').checked = true;
        // Hide tractate selection initially
        document.getElementById('tractateSelectionContainer').style.display = 'none';
    } else {
        sederSelectionGroup.style.display = 'none';
    }
}

/**
 * Handle change in Study Whole Seder checkbox
 */
function handleStudyWholeSederChange() {
    const studyWholeSeder = document.getElementById('studyWholeSeder').checked;
    const tractateSelectionContainer = document.getElementById('tractateSelectionContainer');
    
    if (studyWholeSeder) {
        tractateSelectionContainer.style.display = 'none';
    } else {
        tractateSelectionContainer.style.display = 'block';
        // Update tractate options based on selected seder
        const seder = document.getElementById('sederSelection').value;
        updateTractateSelection(seder);
        console.log('Tractate selection updated for seder:', seder);
    }
}

/**
 * Handle change in Mishnayot schedule type radio buttons
 */
function handleMishnayotScheduleTypeChange() {
    const scheduleType = document.querySelector('input[name="mishnayotScheduleType"]:checked').value;
    const chaptersPerDayGroup = document.getElementById('mishnayotChaptersPerDayGroup');
    const timeframeGroup = document.getElementById('mishnayotTimeframeGroup');
    
    if (scheduleType === 'chaptersPerDay') {
        chaptersPerDayGroup.style.display = 'block';
        timeframeGroup.style.display = 'none';
    } else {
        chaptersPerDayGroup.style.display = 'none';
        timeframeGroup.style.display = 'block';
    }
}

/**
 * Handle change in Seder selection dropdown
 */
function handleSederSelectionChange() {
    const seder = document.getElementById('sederSelection').value;
    
    // Only update tractate selection if the checkbox is unchecked
    if (!document.getElementById('studyWholeSeder').checked) {
        updateTractateSelection(seder);
    }
}

/**
 * Generate Tanach study schedule
 */
function generateTanachSchedule() {
    // Get form values
    const name = document.getElementById('name').value;
    if (!name) {
        alert('Please enter a name for the schedule');
        return;
    }
    
    const tanachSelection = document.getElementById('tanachSelection').value;
    const customBook = tanachSelection === 'custom' ? document.getElementById('bookSelection').value : null;
    
    // Get selected weekdays
    const selectedDays = [];
    document.querySelectorAll('.weekday:checked').forEach(checkbox => {
        selectedDays.push(parseInt(checkbox.value));
    });
    
    if (selectedDays.length === 0) {
        alert('Please select at least one day of the week for study');
        return;
    }
    
    // Get schedule type and related values
    const scheduleType = document.querySelector('input[name="scheduleType"]:checked').value;
    let startDate, endDate, chaptersPerDay;
    
    if (scheduleType === 'chaptersPerDay') {
        chaptersPerDay = parseInt(document.getElementById('chaptersPerDayInput').value);
        if (chaptersPerDay < 1) {
            alert('Please enter a valid number of chapters per day');
            return;
        }
        
        // Parse the date string correctly to avoid timezone issues
        const startDateStr = document.getElementById('startDate').value;
        startDate = startDateStr ? parseDate(startDateStr) : new Date();
        // End date will be calculated based on chapters per day
    } else {
        const startDateStr = document.getElementById('startDate').value;
        startDate = parseDate(startDateStr);
        
        if (!startDate) {
            alert('Please enter a valid start date');
            return;
        }
        
        // Check if end date is provided
        const endDateStr = document.getElementById('endDate').value;
        if (endDateStr && endDateStr.trim() !== '') {
            endDate = parseDate(endDateStr);
            
            if (!endDate || startDate >= endDate) {
                alert('Please enter a valid end date that is after the start date');
                return;
            }
        } else {
            // If no end date is specified, set end date to start date (complete all on start date)
            endDate = new Date(startDate);
        }
    }
    
    // Get chapters for the selected books
    const chapters = getChaptersForSelection(tanachSelection, customBook);
    
    if (chapters.length === 0) {
        alert('No chapters found for the selected books');
        return;
    }
    
    // Generate the schedule
    const { schedule, chaptersInfo } = generateSchedule(chapters, startDate, endDate, chaptersPerDay, selectedDays);
    
    // Display the schedule
    displaySchedule(schedule, name, chaptersInfo);
}

/**
 * Generate Mishnayot study schedule
 */
function generateMishnayotSchedule() {
    // Get form values
    const name = document.getElementById('mishnayotName').value;
    if (!name) {
        alert('Please enter a name for the schedule');
        return;
    }
    
    const mishnayotSelection = document.getElementById('mishnayotSelection').value;
    let customSeder = null;
    let customTractates = [];
    
    if (mishnayotSelection === 'seder') {
        customSeder = document.getElementById('sederSelection').value;
        
        // Check if studying whole seder or specific tractates
        const studyWholeSeder = document.getElementById('studyWholeSeder').checked;
        if (!studyWholeSeder) {
            // Get selected tractates (multiple selection possible)
            const tractateSelect = document.getElementById('tractateSelection');
            for (let i = 0; i < tractateSelect.selectedOptions.length; i++) {
                customTractates.push(tractateSelect.selectedOptions[i].value);
            }
            
            console.log('Selected tractates:', customTractates);
            
            if (customTractates.length === 0) {
                alert('Please select at least one tractate');
                return;
            }
        }
    }
    
    // Get selected weekdays
    const selectedDays = [];
    document.querySelectorAll('.mishnayotWeekday:checked').forEach(checkbox => {
        selectedDays.push(parseInt(checkbox.value));
    });
    
    if (selectedDays.length === 0) {
        alert('Please select at least one day of the week for study');
        return;
    }
    
    // Get schedule type and related values
    const scheduleType = document.querySelector('input[name="mishnayotScheduleType"]:checked').value;
    let startDate, endDate, chaptersPerDay;
    
    if (scheduleType === 'chaptersPerDay') {
        chaptersPerDay = parseInt(document.getElementById('mishnayotChaptersPerDayInput').value);
        if (chaptersPerDay < 1) {
            alert('Please enter a valid number of chapters per day');
            return;
        }
        
        // Parse the date string correctly to avoid timezone issues
        const startDateStr = document.getElementById('mishnayotStartDate').value;
        startDate = startDateStr ? parseDate(startDateStr) : new Date();
        // End date will be calculated based on chapters per day
    } else {
        const startDateStr = document.getElementById('mishnayotStartDate').value;
        startDate = parseDate(startDateStr);
        
        if (!startDate) {
            alert('Please enter a valid start date');
            return;
        }
        
        // Check if end date is provided
        const endDateStr = document.getElementById('mishnayotEndDate').value;
        if (endDateStr && endDateStr.trim() !== '') {
            endDate = parseDate(endDateStr);
            
            if (!endDate || startDate >= endDate) {
                alert('Please enter a valid end date that is after the start date');
                return;
            }
        } else {
            // If no end date is specified, set end date to start date (complete all on start date)
            endDate = new Date(startDate);
        }
    }
    
    // Get chapters for the selected tractates
    console.log('Generating schedule with:', { mishnayotSelection, customSeder, customTractates, studyWholeSeder: document.getElementById('studyWholeSeder').checked });
    const chapters = getMishnayotChaptersForSelection(mishnayotSelection, customSeder, customTractates);
    console.log('Chapters generated:', chapters.length);
    
    if (chapters.length === 0) {
        alert('No chapters found for the selected tractates');
        return;
    }
    
    // Generate the schedule
    const { schedule, chaptersInfo } = generateSchedule(chapters, startDate, endDate, chaptersPerDay, selectedDays);
    
    // Display the schedule
    displaySchedule(schedule, name, chaptersInfo);
}

/**
 * Generate a study schedule based on parameters
 */
function generateSchedule(chapters, startDate, endDate, chaptersPerDay, selectedDays) {
    const schedule = [];
    let currentDate = new Date(startDate);
    let remainingChapters = [...chapters];
    let chaptersInfo = null;
    
    // If using chapters per day mode, calculate how many days we need
    if (chaptersPerDay) {
        const totalDays = Math.ceil(chapters.length / chaptersPerDay);
        let estimatedEndDate = new Date(startDate);
        let studyDaysFound = 0;
        
        // Find the date when we'll have enough study days
        while (studyDaysFound < totalDays) {
            if (selectedDays.includes(estimatedEndDate.getDay())) {
                studyDaysFound++;
            }
            if (studyDaysFound < totalDays) {
                estimatedEndDate.setDate(estimatedEndDate.getDate() + 1);
            }
        }
        
        // If no end date provided, use the estimated one
        if (!endDate || startDate.getTime() === endDate.getTime()) {
            endDate = new Date(estimatedEndDate);
        }
        
        chaptersInfo = {
            totalChapters: chapters.length,
            totalDays: totalDays,
            chaptersPerDay: chaptersPerDay,
            estimatedEndDate: estimatedEndDate
        };
    } 
    // If using timeframe mode, calculate chapters per day
    else if (endDate) {
        const totalStudyDays = countStudyDays(startDate, endDate, selectedDays);
        const avgChaptersPerDay = chapters.length / totalStudyDays;
        
        chaptersInfo = {
            totalChapters: chapters.length,
            totalDays: totalStudyDays,
            chaptersPerDay: avgChaptersPerDay
        };
    }
    
    // Generate schedule entries
    while (currentDate <= endDate && remainingChapters.length > 0) {
        const dayOfWeek = currentDate.getDay();
        
        // Check if this is a selected study day
        if (selectedDays.includes(dayOfWeek)) {
            let dailyChapters;
            
            if (chaptersPerDay) {
                // Fixed chapters per day mode
                dailyChapters = remainingChapters.slice(0, chaptersPerDay);
                remainingChapters = remainingChapters.slice(chaptersPerDay);
            } else {
                // Timeframe mode: distribute chapters evenly
                const daysLeft = countStudyDays(currentDate, endDate, selectedDays);
                if (daysLeft <= 0) break;
                
                const chaptersPerDayDynamic = Math.ceil(remainingChapters.length / daysLeft);
                dailyChapters = remainingChapters.slice(0, chaptersPerDayDynamic);
                remainingChapters = remainingChapters.slice(chaptersPerDayDynamic);
            }
            
            if (dailyChapters.length > 0) {
                schedule.push({
                    date: new Date(currentDate),
                    dayOfWeek: getDayName(dayOfWeek),
                    reading: dailyChapters
                });
            }
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return { schedule, chaptersInfo };
}

/**
 * Count the number of study days between two dates
 */
function countStudyDays(startDate, endDate, selectedDays) {
    let count = 0;
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        if (selectedDays.includes(currentDate.getDay())) {
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return count;
}

/**
 * Get day name from day number
 */
function getDayName(dayNumber) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Format date for display in a more readable format
 */
function formatDateForDisplay(date) {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

/**
 * Display the generated schedule in the UI
 */
function displaySchedule(schedule, name, chaptersInfo = null) {
    const tableBody = document.getElementById('scheduleTableBody');
    tableBody.innerHTML = '';
    
    // Add summary information at the top if we have chapters info
    if (chaptersInfo) {
        const summaryRow = document.createElement('tr');
        summaryRow.className = 'table-primary';
        
        const summaryCell = document.createElement('td');
        summaryCell.colSpan = 3;
        
        // Different summary based on whether we have an estimated end date or not
        if (chaptersInfo.estimatedEndDate) {
            // For chapters per day mode
            summaryCell.innerHTML = `<strong>Schedule Summary:</strong> ${chaptersInfo.totalChapters} chapters over ${chaptersInfo.totalDays} study days.<br>
                                   <strong>Chapters per day:</strong> ${chaptersInfo.chaptersPerDay}.<br>
                                   <strong>Estimated completion date:</strong> ${formatDateForDisplay(chaptersInfo.estimatedEndDate)}.`;
        } else {
            // For timeframe mode
            summaryCell.innerHTML = `<strong>Schedule Summary:</strong> ${chaptersInfo.totalChapters} chapters over ${chaptersInfo.totalDays} study days.<br>
                                   <strong>Average per day:</strong> ${chaptersInfo.chaptersPerDay.toFixed(2)} chapters on each study day.`;
        }
        
        summaryRow.appendChild(summaryCell);
        tableBody.appendChild(summaryRow);
    }
    
    schedule.forEach(entry => {
        const row = document.createElement('tr');
        
        const dateCell = document.createElement('td');
        dateCell.textContent = formatDateForDisplay(entry.date);
        row.appendChild(dateCell);
        
        const dayCell = document.createElement('td');
        dayCell.textContent = entry.dayOfWeek;
        row.appendChild(dayCell);
        
        const readingCell = document.createElement('td');
        readingCell.textContent = entry.reading.join(', ');
        row.appendChild(readingCell);
        
        tableBody.appendChild(row);
    });
    
    // Store the schedule and name in window for download functions
    window.currentSchedule = schedule;
    window.scheduleName = name;
    
    // Show the result section
    document.getElementById('resultSection').style.display = 'block';
    
    // Scroll to results
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Download the schedule as a CSV file
 */
function downloadScheduleCSV() {
    if (!window.currentSchedule || window.currentSchedule.length === 0) {
        alert('No schedule to download');
        return;
    }
    
    const csvContent = [
        'Date,Day of Week,Reading',
        ...window.currentSchedule.map(entry => {
            return `${formatDate(entry.date)},${entry.dayOfWeek},"${entry.reading.join(', ')}"`;  
        })
    ].join('\n');
    
    downloadFile(csvContent, `${window.scheduleName}_schedule.csv`, 'text/csv');
}

/**
 * Download the schedule as an ICS file for calendar import
 */
function downloadScheduleICS() {
    if (!window.currentSchedule || window.currentSchedule.length === 0) {
        alert('No schedule to download');
        return;
    }
    
    const icsLines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Torah Schedule Creator//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH'
    ];
    
    window.currentSchedule.forEach((entry, index) => {
        const dateStr = formatDate(entry.date).replace(/-/g, '');
        const nextDay = new Date(entry.date);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayStr = formatDate(nextDay).replace(/-/g, '');
        
        icsLines.push('BEGIN:VEVENT');
        icsLines.push(`UID:${dateStr}-${index}@torahschedule`);
        icsLines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '').split('T')[0]}T000000Z`);
        icsLines.push(`DTSTART;VALUE=DATE:${dateStr}`);
        icsLines.push(`DTEND;VALUE=DATE:${nextDayStr}`);
        icsLines.push(`SUMMARY:${window.scheduleName} Study Schedule`);
        icsLines.push(`DESCRIPTION:${entry.reading.join(', ')}`);
        icsLines.push('END:VEVENT');
    });
    
    icsLines.push('END:VCALENDAR');
    
    downloadFile(icsLines.join('\r\n'), `${window.scheduleName}_schedule.ics`, 'text/calendar');
}

/**
 * Helper function to download a file
 */
function downloadFile(content, fileName, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
}
