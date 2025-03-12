/**
 * Torah Schedule Creator - Main Application Logic
 * Handles UI interactions, schedule generation, and file downloads
 */

/**
 * Show a status message
 */
function showMessage(message) {
    console.log(message);
    // Fall back to alert for important messages
    alert(message);
}

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
    
    // Child schedule date pickers
    flatpickr('#childBirthdate', {
        dateFormat: 'Y-m-d',
        defaultDate: ''
    });
    
    flatpickr('#customStartDate', {
        dateFormat: 'Y-m-d',
        defaultDate: ''
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
    document.getElementById('chidonDivision').addEventListener('change', updateChidonBooksInfo);
    
    const scheduleTypeRadios = document.querySelectorAll('input[name="scheduleType"]');
    scheduleTypeRadios.forEach(radio => {
        radio.addEventListener('change', handleScheduleTypeChange);
    });
    
    document.getElementById('generateScheduleBtn').addEventListener('click', generateTanachSchedule);
    
    // Child schedule form listeners
    document.getElementById('useCustomStartDate').addEventListener('change', function() {
        document.getElementById('customStartDateGroup').style.display = 
            this.checked ? 'block' : 'none';
    });
    
    document.getElementById('childBirthdate').addEventListener('change', updateChildScheduleInfo);
    document.getElementById('customStartDate').addEventListener('change', updateChildScheduleInfo);
    document.getElementById('useCustomStartDate').addEventListener('change', updateChildScheduleInfo);
    
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
    const chidonDivisionGroup = document.getElementById('chidonDivisionGroup');
    const childScheduleGroup = document.getElementById('childScheduleGroup');
    
    if (selection === 'custom') {
        bookSelectionGroup.style.display = 'block';
        chidonDivisionGroup.style.display = 'none';
        childScheduleGroup.style.display = 'none';
    } else if (selection === 'chidon') {
        bookSelectionGroup.style.display = 'none';
        chidonDivisionGroup.style.display = 'block';
        childScheduleGroup.style.display = 'none';
        updateChidonBooksInfo();
    } else if (selection === 'childSchedule') {
        bookSelectionGroup.style.display = 'none';
        chidonDivisionGroup.style.display = 'none';
        childScheduleGroup.style.display = 'block';
        initializeChildScheduleForm();
        
        // Force timeframe selection for child schedule and disable units per day
        document.getElementById('timeframe').checked = true;
        document.getElementById('chaptersPerDay').disabled = true;
        document.getElementById('chaptersPerDayGroup').style.display = 'none';
        document.getElementById('timeframeGroup').style.display = 'block';
    } else {
        bookSelectionGroup.style.display = 'none';
        chidonDivisionGroup.style.display = 'none';
        childScheduleGroup.style.display = 'none';
        
        // Re-enable units per day option
        document.getElementById('chaptersPerDay').disabled = false;
    }
}

/**
 * Update the Chidon parts selection and books information display
 */
function updateChidonBooksInfo() {
    const division = document.getElementById('chidonDivision').value;
    const chidonPartsSelection = document.getElementById('chidonPartsSelection');
    const chidonBooksInfo = document.getElementById('chidonBooksInfo');
    const chidonParts = getChidonParts(division);
    
    // Generate checkboxes for parts selection
    let partsHtml = '';
    chidonParts.forEach(part => {
        partsHtml += `
        <div class="form-check">
            <input class="form-check-input chidon-part" type="checkbox" value="${part.id}" id="${part.id}" checked>
            <label class="form-check-label" for="${part.id}">
                ${part.name}
            </label>
        </div>`;
    });
    chidonPartsSelection.innerHTML = partsHtml;
    
    // Add event listeners to update book info when parts are selected/deselected
    document.querySelectorAll('.chidon-part').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedChidonBooks);
    });
    
    // Update the books information display
    updateSelectedChidonBooks();
}

/**
 * Update the display of selected Chidon books based on selected parts
 */
function updateSelectedChidonBooks() {
    const division = document.getElementById('chidonDivision').value;
    const chidonBooksInfo = document.getElementById('chidonBooksInfo');
    const selectedParts = document.querySelectorAll('.chidon-part:checked');
    const selectedPartIds = Array.from(selectedParts).map(checkbox => checkbox.value);
    
    // Get books from selected parts
    const chidonBooks = getChidonBooks(division, selectedPartIds);
    
    let html = '<ul class="mb-0">';
    chidonBooks.forEach(book => {
        if (book.fullBook) {
            html += `<li>${book.name} (${book.hebrewName}): Complete book</li>`;
        } else if (book.customChapters && book.customChapters.length > 0) {
            html += `<li>${book.name} (${book.hebrewName}): Chapters ${book.customChapters.join(', ')}</li>`;
        }
    });
    html += '</ul>';
    
    if (chidonBooks.length === 0) {
        html = '<p class="text-muted">Please select at least one part to view books.</p>';
    }
    
    chidonBooksInfo.innerHTML = html;
}

/**
 * Initialize the child schedule form
 */
function initializeChildScheduleForm() {
    // Initialize date pickers for birth date and custom start date
    flatpickr('#childBirthdate', {
        dateFormat: 'Y-m-d',
        allowInput: true
    });
    
    flatpickr('#customStartDate', {
        dateFormat: 'Y-m-d',
        allowInput: true
    });
    
    // Add event listener for custom start date checkbox
    document.getElementById('useCustomStartDate').addEventListener('change', function() {
        document.getElementById('customStartDateGroup').style.display = 
            this.checked ? 'block' : 'none';
    });
    
    // Add event listeners to update schedule information when inputs change
    document.getElementById('childBirthdate').addEventListener('change', updateChildScheduleInfo);
    document.getElementById('customStartDate').addEventListener('change', updateChildScheduleInfo);
    document.getElementById('useCustomStartDate').addEventListener('change', updateChildScheduleInfo);
}

/**
 * Update child schedule information based on input values
 */
function updateChildScheduleInfo() {
    const birthdateInput = document.getElementById('childBirthdate');
    const childScheduleInfo = document.getElementById('childScheduleInfo');
    const scheduleDetails = document.getElementById('scheduleDetails');
    
    if (!birthdateInput.value) {
        childScheduleInfo.style.display = 'none';
        return;
    }
    
    try {
        // Parse birth date
        const birthDate = parseDate(birthdateInput.value);
        if (!birthDate) {
            throw new Error('Invalid birth date');
        }
        
        // Show loading message
        scheduleDetails.innerHTML = '<p>Calculating Hebrew dates...</p>';
        childScheduleInfo.style.display = 'block';
        
        // Get Hebrew birth date using Hebcal API
        const birthYear = birthDate.getFullYear();
        const birthMonth = birthDate.getMonth() + 1; // JavaScript months are 0-indexed
        const birthDay = birthDate.getDate();
        
        // Format date for API call (YYYY-MM-DD)
        const dateStr = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
        
        // Fetch Hebrew date from Hebcal API
        fetch(`https://www.hebcal.com/converter?cfg=json&date=${dateStr}&g2h=1`)
            .then(response => response.json())
            .then(data => {
                // Store original Hebrew date information - ensure month name is included
                const originalHebrewDate = data.hebrew;
                const originalHebrewMonthName = getHebrewMonthName(data);
                const originalHebrewDateFormatted = `${data.hebrew} (${data.hd} ${originalHebrewMonthName} ${data.hy})`;
                
                // Get Hebrew date components
                const hebrewYear = data.hy;
                const hebrewMonth = data.hm;
                const hebrewDay = data.hd;
                
                // Calculate 5th Hebrew birthday
                return Promise.all([
                    originalHebrewDateFormatted,
                    fetch(`https://www.hebcal.com/converter?cfg=json&hy=${hebrewYear + 5}&hm=${hebrewMonth}&hd=${hebrewDay}&h2g=1`)
                ]);
            })
            .then(([originalHebrewDateFormatted, response]) => {
                return Promise.all([
                    originalHebrewDateFormatted,
                    response.json()
                ]);
            })
            .then(([originalHebrewDateFormatted, data]) => {
                // Debug: Log the 5th birthday API response with detailed property inspection
                console.log('Hebcal API response for 5th birthday:', data);
                console.log('5th birthday month properties:', {
                    hm: data.hm,
                    hm_type: typeof data.hm,
                    month: data.month,
                    month_type: typeof data.month,
                    hebrew: data.hebrew,
                    hd: data.hd,
                    hy: data.hy
                });
                
                // Get Gregorian date for 5th Hebrew birthday
                const fifthBirthday = new Date(data.gy, data.gm - 1, data.gd);
                
                // Store 5th Hebrew birthday information with proper month name
                // Use our improved getHebrewMonthName function to get the month name
                const fifthHebrewMonthName = getHebrewMonthName(data);
                const fifthHebrewDateFormatted = `${data.hebrew} (${data.hd} ${fifthHebrewMonthName} ${data.hy})`;
                
                // Log the formatted date for debugging
                console.log('Formatted 5th birthday:', {
                    original: data.hebrew,
                    monthName: fifthHebrewMonthName,
                    formatted: fifthHebrewDateFormatted
                });
                
                // Update the start date field automatically
                const tanachStartDate = document.getElementById('startDate');
                if (tanachStartDate) {
                    tanachStartDate.value = formatDateForInput(fifthBirthday);
                    console.log('Setting start date field to:', formatDateForInput(fifthBirthday));
                }
                
                // Get Hebrew date components again for 10th birthday calculation
                const birthDateStr = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
                return Promise.all([
                    fifthBirthday,
                    fifthHebrewDateFormatted,
                    originalHebrewDateFormatted,
                    fetch(`https://www.hebcal.com/converter?cfg=json&date=${birthDateStr}&g2h=1`)
                ]);
            })
            .then(([fifthBirthday, fifthHebrewDateFormatted, originalHebrewDateFormatted, response]) => {
                return Promise.all([
                    fifthBirthday,
                    fifthHebrewDateFormatted,
                    originalHebrewDateFormatted,
                    response.json()
                ]);
            })
            .then(([fifthBirthday, fifthHebrewDateFormatted, originalHebrewDateFormatted, data]) => {
                // Calculate 10th Hebrew birthday
                const hebrewYear = data.hy;
                const hebrewMonth = data.hm;
                const hebrewDay = data.hd;
                
                return Promise.all([
                    fifthBirthday,
                    fifthHebrewDateFormatted,
                    originalHebrewDateFormatted,
                    fetch(`https://www.hebcal.com/converter?cfg=json&hy=${hebrewYear + 10}&hm=${hebrewMonth}&hd=${hebrewDay}&h2g=1`)
                ]);
            })
            .then(([fifthBirthday, fifthHebrewDateFormatted, originalHebrewDateFormatted, response]) => {
                return Promise.all([
                    fifthBirthday,
                    fifthHebrewDateFormatted,
                    originalHebrewDateFormatted,
                    response.json()
                ]);
            })
            .then(([fifthBirthday, fifthHebrewDateFormatted, originalHebrewDateFormatted, data]) => {
                // Get Gregorian date for 10th Hebrew birthday
                const tenthBirthday = new Date(data.gy, data.gm - 1, data.gd);
                
                // Store 10th Hebrew birthday information with proper month name
                // Use our improved getHebrewMonthName function to get the month name
                const tenthBirthdayData = data; // Store the entire API response for later use
                const tenthHebrewMonthName = getHebrewMonthName(data);
                const tenthHebrewDateFormatted = `${data.hebrew} (${data.hd} ${tenthHebrewMonthName} ${data.hy})`;
                
                // Log the formatted date for debugging
                console.log('Formatted 10th birthday:', {
                    original: data.hebrew,
                    monthName: tenthHebrewMonthName,
                    formatted: tenthHebrewDateFormatted
                });
                
                // Update the end date field automatically
                const tanachEndDate = document.getElementById('endDate');
                if (tanachEndDate) {
                    tanachEndDate.value = formatDateForInput(tenthBirthday);
                    console.log('Setting end date field to:', formatDateForInput(tenthBirthday));
                }
                
                // Determine start date
                let startDate = fifthBirthday;
                const today = new Date();
                const useCustom = document.getElementById('useCustomStartDate').checked;
                
                if (useCustom) {
                    const customStartInput = document.getElementById('customStartDate');
                    if (customStartInput.value) {
                        startDate = parseDate(customStartInput.value);
                    }
                } else if ((today - birthDate) / (1000 * 60 * 60 * 24 * 365) >= 5) {
                    // If child is already older than 5, use today as start date
                    startDate = today;
                }
                
                // Calculate total days and verses
                const totalDays = Math.round((tenthBirthday - startDate) / (1000 * 60 * 60 * 24));
                const totalVerses = 23145; // Approximate total verses in Tanach
                const versesPerDay = Math.ceil(totalVerses / totalDays);
                
                // Display schedule information with Hebrew dates
                let html = `
                    <h3>Hebrew Date Information:</h3>
                    <p><strong>Birth Date:</strong> ${formatDateForDisplay(birthDate)}</p>
                    <p><strong>Birth Date (Hebrew):</strong> ${originalHebrewDateFormatted}</p>
                    <p><strong>5th Hebrew Birthday:</strong> ${fifthHebrewDateFormatted} (${formatDateForDisplay(fifthBirthday)})</p>
                    <p><strong>10th Hebrew Birthday:</strong> ${tenthHebrewDateFormatted} (${formatDateForDisplay(tenthBirthday)})</p>
                    
                    <h3>Schedule Information:</h3>
                    <p><strong>Child's Age:</strong> ${Math.floor((today - birthDate) / (1000 * 60 * 60 * 24 * 365))} years</p>
                    <p><strong>Start Date:</strong> ${formatDateForDisplay(startDate)}</p>
                    <p><strong>End Date (10th Hebrew birthday):</strong> ${formatDateForDisplay(tenthBirthday)}</p>
                    <p><strong>Total Days:</strong> ${totalDays}</p>
                    <p><strong>Approximate Verses Per Day:</strong> ${versesPerDay}</p>
                `;
                
                scheduleDetails.innerHTML = html;
                childScheduleInfo.style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching Hebrew dates:', error);
                scheduleDetails.innerHTML = `<p class="text-danger">Error calculating Hebrew dates: ${error.message}</p>`;
            });
    } catch (error) {
        console.error('Error calculating schedule:', error);
        scheduleDetails.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
        childScheduleInfo.style.display = 'block';
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
    
    // Handle child schedule option separately
    if (tanachSelection === 'childSchedule') {
        generateChildTanachSchedule();
        return;
    }
    
    const customBook = tanachSelection === 'custom' ? document.getElementById('bookSelection').value : null;
    const chidonDivision = tanachSelection === 'chidon' ? document.getElementById('chidonDivision').value : null;
    
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
    let startDate, endDate, unitsPerDay;
    const tanachStudyUnitType = document.getElementById('studyUnitType').value;
    
    if (scheduleType === 'chaptersPerDay') {
        unitsPerDay = parseInt(document.getElementById('chaptersPerDayInput').value);
        if (unitsPerDay < 1) {
            alert(`Please enter a valid number of ${tanachStudyUnitType} per day`);
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
    
    // Get chapters or verses for the selected books
    let units = [];
    // Use the already declared tanachStudyUnitType variable
    console.log('Tanach study unit type selected:', tanachStudyUnitType);
    
    if (tanachStudyUnitType === 'chapters') {
        units = getChaptersForSelection(tanachSelection, customBook, chidonDivision);
        console.log('Chapters retrieved:', units.length);
    } else if (tanachStudyUnitType === 'verses') {
        console.log('Retrieving verses for selection:', tanachSelection, 'custom book:', customBook, 'chidon division:', chidonDivision);
        units = getTanachVersesForSelection(tanachSelection, customBook, chidonDivision);
        console.log('Verses retrieved:', units.length, 'First few verses:', units.slice(0, 5));
    } else {
        console.error('Unknown study unit type:', tanachStudyUnitType);
    }
    
    if (units.length === 0) {
        console.error('No units found for selection');
        alert(`No ${tanachStudyUnitType} found for the selected books`);
        return;
    }
    
    // Generate the schedule
    console.log('About to generate schedule with:', {
        unitsCount: units.length,
        startDate: startDate.toDateString(),
        endDate: endDate ? endDate.toDateString() : 'none',
        unitsPerDay,
        selectedDays,
        studyUnitType: tanachStudyUnitType
    });
    const { schedule, chaptersInfo } = generateSchedule(units, startDate, endDate, unitsPerDay, selectedDays, tanachStudyUnitType);
    console.log('Schedule generated with', schedule.length, 'days');
    
    // Display the schedule
    displaySchedule(schedule, name, chaptersInfo);
}

/**
 * Generate a child's Tanach schedule (ages 5-10)
 */
function generateChildTanachSchedule() {
    // Get child's information
    const childName = document.getElementById('childName').value;
    if (!childName) {
        alert('Please enter the child\'s name');
        return;
    }
    
    const birthdateStr = document.getElementById('childBirthdate').value;
    if (!birthdateStr) {
        alert('Please enter the child\'s birth date');
        return;
    }
    
    const birthDate = parseDate(birthdateStr);
    if (!birthDate) {
        alert('Please enter a valid birth date');
        return;
    }
    
    // Get selected weekdays - use the regular weekday class since childWeekday doesn't exist
    const selectedDays = [];
    document.querySelectorAll('.weekday:checked').forEach(checkbox => {
        selectedDays.push(parseInt(checkbox.value));
    });
    
    if (selectedDays.length === 0) {
        alert('Please select at least one day of the week for study');
        return;
    }
    
    // We'll handle the schedule generation without showing a loading message
    
    // Clear any existing schedule to prevent duplication
    const tableBody = document.getElementById('scheduleTableBody');
    if (tableBody) {
        tableBody.innerHTML = '';
    }
    
    // Format date for API call (YYYY-MM-DD)
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth() + 1; // JavaScript months are 0-indexed
    const birthDay = birthDate.getDate();
    const dateStr = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
    
    // Get Hebrew date and calculate 5th and 10th Hebrew birthdays
    fetch(`https://www.hebcal.com/converter?cfg=json&date=${dateStr}&g2h=1`)
        .then(response => response.json())
        .then(data => {
            // Debug: Log the complete API response with detailed property inspection
            console.log('Hebcal API response for birth date:', data);
            console.log('Birth date month properties:', {
                hm: data.hm,
                hm_type: typeof data.hm,
                month: data.month,
                month_type: typeof data.month,
                hebrew: data.hebrew,
                hd: data.hd,
                hy: data.hy
            });
            // Store original Hebrew date information - ensure month name is included
            const originalHebrewDate = data.hebrew;
            // Store the complete birth date data for later use
            const birthDateData = data; // Store the entire API response for later use
            
            // Enhanced logging for debugging the birth date Hebrew month name
            console.log('BIRTH DATE DEBUG - Complete API response:', JSON.stringify(data, null, 2));
            console.log('BIRTH DATE DEBUG - Month name sources:', {
                hm: data.hm,
                hm_type: typeof data.hm,
                month: data.month,
                month_type: typeof data.month,
                hebrew: data.hebrew,
                heDateParts: data.heDateParts ? data.heDateParts : null,
                heDateParts_m: data.heDateParts ? data.heDateParts.m : null
            });
            
            // Try to get the Hebrew month name from different sources
            let originalHebrewMonthName = data.hm;
            
            // If hm is not available, try heDateParts.m
            if (!originalHebrewMonthName && data.heDateParts && data.heDateParts.m) {
                originalHebrewMonthName = data.heDateParts.m;
                console.log('BIRTH DATE DEBUG - Using heDateParts.m:', originalHebrewMonthName);
            }
            
            // If still not available, try to extract from the Hebrew date string
            if (!originalHebrewMonthName && data.hebrew) {
                try {
                    // Hebrew date format is typically like: כ״ז בַּאֲדָר א׳ תשפ״ד
                    // Split by spaces and get the second part (the month with prefix)
                    const parts = data.hebrew.split(' ');
                    if (parts.length >= 2) {
                        // The month is the second part, sometimes with a prefix ב
                        let monthPart = parts[1];
                        // Remove the prefix if present (like בַּ)
                        if (monthPart.startsWith('בַּ') || monthPart.startsWith('בְּ')) {
                            monthPart = monthPart.substring(2);
                        }
                        originalHebrewMonthName = monthPart;
                        console.log('BIRTH DATE DEBUG - Extracted from Hebrew string:', monthPart);
                    }
                } catch (e) {
                    console.error('BIRTH DATE DEBUG - Error extracting month:', e);
                }
            }
            
            // Final fallback - use a hardcoded mapping based on month ID
            if (!originalHebrewMonthName || originalHebrewMonthName === 'undefined') {
                const hebrewMonths = [
                    'Nisan', 'Iyar', 'Sivan', 'Tammuz', 'Av', 'Elul',
                    'Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar', 'Adar II'
                ];
                
                if (data.hm_id && data.hm_id > 0 && data.hm_id <= hebrewMonths.length) {
                    originalHebrewMonthName = hebrewMonths[data.hm_id - 1];
                    console.log('BIRTH DATE DEBUG - Using month from hm_id:', originalHebrewMonthName);
                }
            }
            
            console.log('BIRTH DATE DEBUG - Final month name:', originalHebrewMonthName);
            // Simply use the Hebrew date directly from the API
            // No need to parse or extract the month name separately
            const originalHebrewDateFormatted = `${originalHebrewDate} (${data.hd} ${data.hm} ${data.hy})`;
            
            // Log the formatted date for debugging
            console.log('Formatted birth date:', {
                original: originalHebrewDate,
                monthName: originalHebrewMonthName,
                formatted: originalHebrewDateFormatted
            });
            
            // Get Hebrew date components
            const hebrewYear = data.hy;
            const hebrewMonth = data.hm;
            const hebrewDay = data.hd;
            
            // Calculate 5th Hebrew birthday
            return Promise.all([
                fetch(`https://www.hebcal.com/converter?cfg=json&hy=${hebrewYear + 5}&hm=${hebrewMonth}&hd=${hebrewDay}&h2g=1`),
                originalHebrewDateFormatted,
                data
            ]);
        })
        .then(([response, originalHebrewDateFormatted, originalData]) => {
            return Promise.all([
                response.json(),
                originalHebrewDateFormatted,
                originalData
            ]);
        })
        .then(([fifthBirthdayData, originalHebrewDateFormatted, originalData]) => {
            // Get Gregorian date for 5th Hebrew birthday
            const fifthBirthday = new Date(fifthBirthdayData.gy, fifthBirthdayData.gm - 1, fifthBirthdayData.gd);
            
            // Format 5th Hebrew birthday for display - ensure month name is included
            const fifthHebrewMonthName = fifthBirthdayData.hm_name || fifthBirthdayData.month;
            const fifthHebrewDateFormatted = `${fifthBirthdayData.hebrew} (${fifthBirthdayData.hd} ${fifthHebrewMonthName} ${fifthBirthdayData.hy})`;
            
            // Calculate 10th Hebrew birthday
            const hebrewYear = originalData.hy;
            const hebrewMonth = originalData.hm;
            const hebrewDay = originalData.hd;
            
            return Promise.all([
                fifthBirthday,
                fifthHebrewDateFormatted,
                fetch(`https://www.hebcal.com/converter?cfg=json&hy=${hebrewYear + 10}&hm=${hebrewMonth}&hd=${hebrewDay}&h2g=1`),
                originalHebrewDateFormatted,
                originalData
            ]);
        })
        .then(([fifthBirthday, fifthHebrewDateFormatted, response, originalHebrewDateFormatted, originalData]) => {
            return Promise.all([
                fifthBirthday,
                fifthHebrewDateFormatted,
                response.json(),
                originalHebrewDateFormatted,
                originalData
            ]);
        })
        .then(([fifthBirthday, fifthHebrewDateFormatted, tenthBirthdayData, originalHebrewDateFormatted, originalData]) => {
            // Debug: Log the 10th birthday API response with detailed property inspection
            console.log('Hebcal API response for 10th birthday:', tenthBirthdayData);
            console.log('10th birthday month properties:', {
                hm: tenthBirthdayData.hm,
                hm_type: typeof tenthBirthdayData.hm,
                month: tenthBirthdayData.month,
                month_type: typeof tenthBirthdayData.month,
                hebrew: tenthBirthdayData.hebrew,
                hd: tenthBirthdayData.hd,
                hy: tenthBirthdayData.hy
            });
            
            // Get Gregorian date for 10th Hebrew birthday
            const tenthBirthday = new Date(tenthBirthdayData.gy, tenthBirthdayData.gm - 1, tenthBirthdayData.gd);
            
            // Format 10th Hebrew birthday for display - ensure month name is included
            // Use our improved getHebrewMonthName function to get the month name
            const tenthHebrewMonthName = getHebrewMonthName(tenthBirthdayData);
            const tenthHebrewDateFormatted = `${tenthBirthdayData.hebrew} (${tenthBirthdayData.hd} ${tenthHebrewMonthName} ${tenthBirthdayData.hy})`;
            
            // Log the formatted date for debugging
            console.log('Formatted 10th birthday:', {
                original: tenthBirthdayData.hebrew,
                monthName: tenthHebrewMonthName,
                formatted: tenthHebrewDateFormatted
            });
            
            // Determine start date
            let startDate = fifthBirthday;
            const today = new Date();
            const useCustom = document.getElementById('useCustomStartDate').checked;
            
            if (useCustom) {
                const customStartStr = document.getElementById('customStartDate').value;
                if (customStartStr) {
                    startDate = parseDate(customStartStr);
                    if (!startDate) {
                        alert('Please enter a valid custom start date');
                        return;
                    }
                }
            } else if ((today - birthDate) / (1000 * 60 * 60 * 24 * 365) >= 5) {
                // If child is already older than 5, use today as start date
                startDate = today;
            }
            
            // Get all Tanach verses
            const verses = getTanachVersesForSelection('all');
            
            if (verses.length === 0) {
                alert('Error: Could not retrieve Tanach verses');
                return;
            }
            
            // Generate the schedule with special distribution for child
            const saturdayEmphasis = document.getElementById('saturdayEmphasis').checked;
            
            // Create a custom schedule with balanced distribution
            const schedule = generateChildSchedule(verses, startDate, tenthBirthday, selectedDays, saturdayEmphasis);
            
            // Display the schedule
            const scheduleName = `${childName}'s Tanach Schedule (Ages 5-10, Hebrew Birthday)`;
            
            // Calculate child's age more precisely
            // Use current date for age calculation
            const currentDate = new Date();
            const ageInMilliseconds = currentDate - birthDate;
            const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
            const childAge = Math.max(0, Math.floor(ageInYears));
            console.log('Child\'s age calculation:', { birthDate, currentDate, ageInYears, childAge });
            
            // Update the timeframe in the UI first
            document.getElementById('timeframe').checked = true;
            // Trigger the change event to show the timeframe group
            document.getElementById('timeframe').dispatchEvent(new Event('change'));
            
            // Set the timeframe values - use the values that were already set by the Hebrew date calculations
            const tanachStartDate = document.getElementById('startDate');
            const tanachEndDate = document.getElementById('endDate');
            
            // Only update if they haven't been set already
            if (tanachStartDate && tanachEndDate) {
                // Log the current values for debugging
                console.log('Current start date value:', tanachStartDate.value);
                console.log('Current end date value:', tanachEndDate.value);
                
                // Only set if empty
                if (!tanachStartDate.value) {
                    tanachStartDate.value = formatDateForInput(startDate);
                    console.log('Updated start date to:', formatDateForInput(startDate));
                }
                
                if (!tanachEndDate.value) {
                    tanachEndDate.value = formatDateForInput(tenthBirthday);
                    console.log('Updated end date to:', formatDateForInput(tenthBirthday));
                }
            }
            
            // Create a single div for the schedule information
            // First, remove ALL existing schedule info divs to prevent duplication
            const existingScheduleInfos = document.querySelectorAll('.schedule-info');
            existingScheduleInfos.forEach(div => {
                if (div && div.parentNode) {
                    div.parentNode.removeChild(div);
                }
            });
            
            const scheduleInfoDiv = document.createElement('div');
            scheduleInfoDiv.className = 'schedule-info';
            
            // Format Hebrew dates properly for display using data from the API responses
            try {
                // The birthDateData variable is already defined in the outer scope from the first API call
                
                // Use the hebrew property directly from the API responses
                const birthDateHebrew = originalHebrewDate;
                const birthDateMonthName = getHebrewMonthName(birthDateData);
                
                // Use data from the 5th birthday API response
                const fifthBirthdayHebrew = data.hebrew;
                const fifthHebrewMonthName = getHebrewMonthName(data);
                
                // Use data from the 10th birthday API response
                const tenthBirthdayHebrew = tenthBirthdayData.hebrew;
                const tenthHebrewMonthName = getHebrewMonthName(tenthBirthdayData);
                
                // Update the date fields in the form
                const tanachStartDate = document.getElementById('startDate');
                const tanachEndDate = document.getElementById('endDate');
                if (tanachStartDate && tanachEndDate) {
                    tanachStartDate.value = formatDateForInput(startDate);
                    tanachEndDate.value = formatDateForInput(tenthBirthday);
                }
                
                // Create the schedule info content
                scheduleInfoDiv.innerHTML = `
    <h3>Schedule Information:</h3>
    <p><strong>Start Date:</strong> ${formatDateForDisplay(startDate)}</p>
    <p><strong>End Date (10th Hebrew birthday):</strong> ${formatDateForDisplay(tenthBirthday)}</p>
    <p><strong>Total Days:</strong> ${Math.round((tenthBirthday - startDate) / (1000 * 60 * 60 * 24))}</p>
    <p><strong>Approximate Verses Per Day:</strong> ${Math.ceil(verses.length / (schedule.length || 1))}</p>
`;
            } catch (error) {
                console.error('Error formatting Hebrew dates:', error);
                scheduleInfoDiv.innerHTML = `
                    
                    
                    <h3>Schedule Information:</h3>
                    <p><strong>Start Date (5th Hebrew birthday): </strong> ${formatDateForDisplay(startDate)}</p>
                    <p><strong>End Date (10th Hebrew birthday):</strong> ${formatDateForDisplay(tenthBirthday)}</p>
                    <p><strong>Total Days:</strong> ${Math.round((tenthBirthday - startDate) / (1000 * 60 * 60 * 24))}</p>
                    <p><strong>Approximate Verses Per Day:</strong> ${Math.ceil(verses.length / (schedule.length || 1))}</p>
                `;
            }
            
            // Display the schedule with the schedule info
            displaySchedule(schedule, scheduleName, scheduleInfoDiv);
        })
        .catch(error => {
            console.error('Error calculating Hebrew dates:', error);
            alert(`Error calculating Hebrew dates: ${error.message}`);
        });
}

/**
 * Generate a balanced schedule for children ages 5-10
 * This function creates a schedule that distributes Tanach verses over the period
 * between the start date and the child's 10th birthday
 * 
 * @param {Array} verses - Array of all Tanach verses
 * @param {Date} startDate - When to start the schedule
 * @param {Date} endDate - When to end the schedule (typically 10th birthday)
 * @param {Array} selectedDays - Array of days of the week to study (0-6)
 * @param {Boolean} saturdayEmphasis - Whether to assign more verses on Saturdays
 * @returns {Array} Schedule of daily readings
 */
function generateChildSchedule(verses, startDate, endDate, selectedDays, saturdayEmphasis) {
    // Sort selected days
    selectedDays.sort((a, b) => a - b);
    
    // Calculate total days between start and end dates
    const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    // Calculate number of study days based on selected weekdays
    const studyDaysPerWeek = selectedDays.length;
    const totalStudyDays = Math.floor(totalDays * (studyDaysPerWeek / 7));
    
    // Create a balanced distribution of verses
    const schedule = [];
    let currentDate = new Date(startDate);
    let verseIndex = 0;
    
    // Get all verses as simple strings
    const verseStrings = verses.map(v => typeof v === 'string' ? v : `${v.book} ${v.chapter}:${v.verse}`);
    
    // Group verses by book to maintain context
    const versesByBook = {};
    verseStrings.forEach(verse => {
        const bookName = verse.split(' ')[0]; // Extract book name from verse reference
        if (!versesByBook[bookName]) {
            versesByBook[bookName] = [];
        }
        versesByBook[bookName].push(verse);
    });
    
    // Create a reading plan that progresses through books
    const books = Object.keys(versesByBook);
    const versesPerDay = Math.ceil(verseStrings.length / totalStudyDays);
    
    // Adjust verses per day for Saturday if emphasis is enabled
    const regularDayVerses = saturdayEmphasis ? 
        Math.ceil(verseStrings.length / (totalStudyDays + (Math.floor(totalDays / 7) * 2))) : 
        versesPerDay;
    const saturdayVerses = saturdayEmphasis ? regularDayVerses * 3 : regularDayVerses;
    
    // Create schedule
    while (verseIndex < verseStrings.length && currentDate < endDate) {
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        // Check if this is a selected study day
        if (selectedDays.includes(dayOfWeek)) {
            // Determine how many verses to read today
            const todayVerses = dayOfWeek === 6 && saturdayEmphasis ? 
                saturdayVerses : regularDayVerses;
            
            // Get verses for today
            const dailyVerses = [];
            let versesNeeded = todayVerses;
            
            // Try to keep verses from the same book together
            for (let i = 0; i < books.length && versesNeeded > 0; i++) {
                const book = books[i];
                const bookVerses = versesByBook[book];
                
                if (bookVerses && bookVerses.length > 0) {
                    const versesToTake = Math.min(versesNeeded, bookVerses.length);
                    const versesForToday = bookVerses.splice(0, versesToTake);
                    dailyVerses.push(...versesForToday);
                    versesNeeded -= versesToTake;
                    
                    // Remove book from list if all verses are used
                    if (bookVerses.length === 0) {
                        delete versesByBook[book];
                    }
                }
            }
            
            if (dailyVerses.length > 0) {
                // Format for display in the schedule table
                schedule.push({
                    date: new Date(currentDate),
                    dayOfWeek: dayNames[dayOfWeek],
                    reading: dailyVerses,
                    completed: false
                });
                
                verseIndex += dailyVerses.length;
            }
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return schedule;
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
    let startDate, endDate, unitsPerDay;
    const mishnayotStudyUnitType = document.getElementById('mishnayotStudyUnitType').value;
    
    if (scheduleType === 'chaptersPerDay') {
        unitsPerDay = parseInt(document.getElementById('mishnayotChaptersPerDayInput').value);
        if (unitsPerDay < 1) {
            alert(`Please enter a valid number of ${mishnayotStudyUnitType === 'chapters' ? 'chapters' : 'Mishnayot'} per day`);
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
    
    // Get chapters or individual mishnayot for the selected tractates
    console.log('Generating schedule with:', { mishnayotSelection, customSeder, customTractates, studyWholeSeder: document.getElementById('studyWholeSeder').checked, mishnayotStudyUnitType });
    
    let units = [];
    if (mishnayotStudyUnitType === 'chapters') {
        units = getMishnayotChaptersForSelection(mishnayotSelection, customSeder, customTractates);
    } else if (mishnayotStudyUnitType === 'mishnayot') {
        units = getMishnayotIndividualForSelection(mishnayotSelection, customSeder, customTractates);
    }
    
    console.log(`${mishnayotStudyUnitType} generated:`, units.length);
    
    if (units.length === 0) {
        alert(`No ${mishnayotStudyUnitType} found for the selected tractates`);
        return;
    }
    
    // Generate the schedule
    console.log('About to generate Mishnayot schedule with:', {
        unitsCount: units.length,
        startDate: startDate.toDateString(),
        endDate: endDate ? endDate.toDateString() : 'none',
        unitsPerDay,
        selectedDays,
        studyUnitType: mishnayotStudyUnitType
    });
    const { schedule, chaptersInfo } = generateSchedule(units, startDate, endDate, unitsPerDay, selectedDays, mishnayotStudyUnitType);
    console.log('Mishnayot schedule generated with', schedule.length, 'days');
    
    // Display the schedule
    displaySchedule(schedule, name, chaptersInfo);
}

/**
 * Generate a study schedule based on parameters
 */
function generateSchedule(units, startDate, endDate, unitsPerDay, selectedDays, studyUnitType = 'chapters') {
    console.log('generateSchedule called with:', {
        unitsLength: units.length,
        startDate: startDate.toDateString(),
        endDate: endDate ? endDate.toDateString() : 'none',
        unitsPerDay,
        selectedDays: selectedDays.join(',')
    });
    
    const schedule = [];
    let currentDate = new Date(startDate);
    let remainingUnits = [...units];
    let chaptersInfo = null;
    
    // If using units per day mode, calculate how many days we need
    if (unitsPerDay) {
        const totalDays = Math.ceil(units.length / unitsPerDay);
        console.log(`Calculated ${totalDays} total days needed for ${units.length} units at ${unitsPerDay} per day`);
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
            totalChapters: units.length,
            totalDays: totalDays,
            chaptersPerDay: unitsPerDay,
            estimatedEndDate: estimatedEndDate,
            studyUnitType: typeof studyUnitType === 'string' ? studyUnitType : 'chapters'
        };
        console.log('Generated chaptersInfo:', chaptersInfo);
    } 
    // If using timeframe mode, calculate units per day
    else if (endDate) {
        const totalStudyDays = countStudyDays(startDate, endDate, selectedDays);
        const avgUnitsPerDay = units.length / totalStudyDays;
        
        chaptersInfo = {
            totalChapters: units.length,
            totalDays: totalStudyDays,
            chaptersPerDay: avgUnitsPerDay,
            studyUnitType: typeof studyUnitType === 'string' ? studyUnitType : 'chapters'
        };
    }
    
    // If no end date is provided, we'll just create a full schedule for all units
    if (!endDate) {
        // Calculate how many days we need based on units per day
        const totalDays = Math.ceil(units.length / (unitsPerDay || 1));
        console.log(`No end date provided. Calculated ${totalDays} total days needed for ${units.length} units`);
        
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
        
        // Use the estimated end date
        endDate = new Date(estimatedEndDate);
        
        // Update chaptersInfo
        if (!chaptersInfo) {
            chaptersInfo = {
                totalChapters: units.length,
                totalDays: totalDays,
                chaptersPerDay: unitsPerDay || Math.ceil(units.length / totalDays),
                estimatedEndDate: estimatedEndDate,
                studyUnitType: typeof studyUnitType === 'string' ? studyUnitType : 'chapters'
            };
        }
    }
    
    // Generate schedule entries
    while (currentDate <= endDate && remainingUnits.length > 0) {
        const dayOfWeek = currentDate.getDay();
        
        // Check if this is a selected study day
        if (selectedDays.includes(dayOfWeek)) {
            let dailyUnits;
            
            if (unitsPerDay) {
                // Fixed units per day mode
                dailyUnits = remainingUnits.slice(0, unitsPerDay);
                remainingUnits = remainingUnits.slice(unitsPerDay);
            } else {
                // Timeframe mode: distribute units evenly
                const daysLeft = countStudyDays(currentDate, endDate, selectedDays);
                if (daysLeft <= 0) break;
                
                const unitsPerDayDynamic = Math.ceil(remainingUnits.length / daysLeft);
                dailyUnits = remainingUnits.slice(0, unitsPerDayDynamic);
                remainingUnits = remainingUnits.slice(unitsPerDayDynamic);
            }
            
            if (dailyUnits.length > 0) {
                schedule.push({
                    date: new Date(currentDate),
                    dayOfWeek: getDayName(dayOfWeek),
                    reading: dailyUnits
                });
            }
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    console.log(`Returning schedule with ${schedule.length} days`);
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
 * Format date for input fields (YYYY-MM-DD)
 */
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get Hebrew month name from Hebcal API response
 * This function is designed to work with the Hebcal API v2 response format
 */
function getHebrewMonthName(data) {
    // If data is a string, it's already a month name
    if (typeof data === 'string') {
        return data;
    }
    
    // If data is not an object, return Unknown
    if (!data || typeof data !== 'object') {
        return 'Unknown';
    }
    
    // Log the data for debugging
    console.log('Getting Hebrew month name from:', data);
    
    // Direct approach: If hm is a string, use it (this is the most reliable source)
    if (data.hm && typeof data.hm === 'string') {
        return data.hm;
    }
    
    // If we have heDateParts, use it (this is available in newer API responses)
    if (data.heDateParts && data.heDateParts.m) {
        return data.heDateParts.m;
    }
    
    // If we have a month number in hm, map it to a name
    if (data.hm && typeof data.hm === 'number') {
        const hebrewMonths = {
            1: 'Nisan', 2: 'Iyar', 3: 'Sivan', 4: 'Tammuz', 5: 'Av', 6: 'Elul',
            7: 'Tishrei', 8: 'Cheshvan', 9: 'Kislev', 10: 'Tevet', 11: 'Shevat', 12: 'Adar', 13: 'Adar II'
        };
        return hebrewMonths[data.hm] || 'Unknown';
    }
    
    // Last resort: Try to extract from the Hebrew date string
    if (data.hebrew) {
        try {
            // Hebrew date format is typically like: כ״ז בַּאֲדָר א׳ תשפ״ד
            // Split by spaces and get the second part (the month with prefix)
            const parts = data.hebrew.split(' ');
            if (parts.length >= 2) {
                // The month is the second part, sometimes with a prefix ב
                let monthPart = parts[1];
                // Remove the prefix if present (like בַּ)
                if (monthPart.startsWith('בַּ') || monthPart.startsWith('בְּ')) {
                    monthPart = monthPart.substring(2);
                }
                return monthPart;
            }
        } catch (e) {
            console.error('Error extracting month from Hebrew date:', e);
        }
    }
    
    // If all else fails
    return 'Unknown';
}

/**
 * Display the generated schedule in the UI
 */
function displaySchedule(schedule, name, additionalInfo = null) {
    const tableBody = document.getElementById('scheduleTableBody');
    tableBody.innerHTML = '';
    
    // Clear ALL existing schedule info divs to prevent duplication
    const existingScheduleInfos = document.querySelectorAll('.schedule-info');
    existingScheduleInfos.forEach(div => {
        if (div && div.parentNode) {
            div.parentNode.removeChild(div);
        }
    });
    
    // Add summary information at the top if we have chapters info or additional info
    if (additionalInfo) {
        // If additionalInfo is a DOM element, add it directly
        if (additionalInfo instanceof HTMLElement) {
            const summaryRow = document.createElement('tr');
            summaryRow.className = 'table-primary';
            
            const summaryCell = document.createElement('td');
            summaryCell.colSpan = 3;
            summaryCell.appendChild(additionalInfo);
            
            summaryRow.appendChild(summaryCell);
            tableBody.appendChild(summaryRow);
        } else if (typeof additionalInfo === 'object') {
            // Handle traditional chaptersInfo object
            const summaryRow = document.createElement('tr');
            summaryRow.className = 'table-primary';
            
            const summaryCell = document.createElement('td');
            summaryCell.colSpan = 3;
            
            // Different summary based on whether we have an estimated end date or not
            if (additionalInfo.estimatedEndDate) {
                // For units per day mode
                const unitType = String(additionalInfo.studyUnitType || 'chapters');
                summaryCell.innerHTML = `<strong>Schedule Summary:</strong> ${additionalInfo.totalChapters} ${unitType} over ${additionalInfo.totalDays} study days.<br>
                                       <strong>${unitType.charAt(0).toUpperCase() + unitType.slice(1)} per day:</strong> ${additionalInfo.chaptersPerDay}.<br>
                                       <strong>Estimated completion date:</strong> ${formatDateForDisplay(additionalInfo.estimatedEndDate)}.`;
            } else {
                // For timeframe mode
                const unitType = String(additionalInfo.studyUnitType || 'chapters');
                summaryCell.innerHTML = `<strong>Schedule Summary:</strong> ${additionalInfo.totalChapters} ${unitType} over ${additionalInfo.totalDays} study days.<br>
                                       <strong>Average per day:</strong> ${additionalInfo.chaptersPerDay.toFixed(2)} ${unitType} on each study day.`;
            }
            
            summaryRow.appendChild(summaryCell);
            tableBody.appendChild(summaryRow);
        }
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
