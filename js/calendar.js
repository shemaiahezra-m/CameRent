// ==============================================
// CALENDAR FUNCTIONALITY (for Cameras Page)
// ==============================================

// Custom Calendar Implementation
class CustomCalendar {
    constructor(inputElement, options = {}) {
        this.inputElement = inputElement;
        this.selectedDate = null;
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.minDate = options.minDate || new Date();
        this.maxDate = options.maxDate || null;
        
        this.init();
    }

    init() {
        this.createCalendarHTML();
        this.attachEventListeners();
        this.updateDisplay();
    }

    createCalendarHTML() {
        // Create custom date input
        const customInput = document.createElement('div');
        customInput.className = 'custom-date-input';
        customInput.innerHTML = `
            <span class="selected-date">Select Date</span>
            <i class="fas fa-calendar-alt"></i>
        `;

        // Create calendar popup
        const calendarPopup = document.createElement('div');
        calendarPopup.className = 'calendar-popup';
        calendarPopup.innerHTML = `
            <div class="calendar-header">
                <button type="button" class="calendar-nav" data-direction="prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="calendar-month-year"></div>
                <button type="button" class="calendar-nav" data-direction="next">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="calendar-weekdays">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
            </div>
            <div class="calendar-dates"></div>
        `;

        // Replace original input
        this.inputElement.style.display = 'none';
        this.inputElement.parentNode.insertBefore(customInput, this.inputElement);
        this.inputElement.parentNode.appendChild(calendarPopup);

        this.customInput = customInput;
        this.calendarPopup = calendarPopup;
    }

    attachEventListeners() {
        // Toggle calendar
        this.customInput.addEventListener('click', () => {
            this.toggleCalendar();
        });

        // Navigation buttons
        this.calendarPopup.querySelectorAll('.calendar-nav').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const direction = e.currentTarget.dataset.direction;
                if (direction === 'prev') {
                    this.previousMonth();
                } else {
                    this.nextMonth();
                }
            });
        });

        // Close calendar when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.customInput.contains(e.target) && !this.calendarPopup.contains(e.target)) {
                this.hideCalendar();
            }
        });
    }

    toggleCalendar() {
        if (this.calendarPopup.classList.contains('show')) {
            this.hideCalendar();
        } else {
            this.showCalendar();
        }
    }

    showCalendar() {
        this.calendarPopup.classList.add('show');
        this.renderCalendar();
    }

    hideCalendar() {
        this.calendarPopup.classList.remove('show');
    }

    previousMonth() {
        if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else {
            this.currentMonth--;
        }
        this.renderCalendar();
    }

    nextMonth() {
        if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else {
            this.currentMonth++;
        }
        this.renderCalendar();
    }

    renderCalendar() {
        const monthYear = this.calendarPopup.querySelector('.calendar-month-year');
        const datesContainer = this.calendarPopup.querySelector('.calendar-dates');

        // Update month/year display
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        monthYear.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;

        // Generate calendar dates
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const firstDayWeekday = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        datesContainer.innerHTML = '';

        // Previous month's trailing dates
        const prevMonth = new Date(this.currentYear, this.currentMonth, 0);
        const prevMonthDays = prevMonth.getDate();
        for (let i = firstDayWeekday - 1; i >= 0; i--) {
            const dateEl = document.createElement('div');
            dateEl.className = 'calendar-date other-month';
            dateEl.textContent = prevMonthDays - i;
            datesContainer.appendChild(dateEl);
        }

        // Current month dates
        for (let day = 1; day <= daysInMonth; day++) {
            const dateEl = document.createElement('div');
            dateEl.className = 'calendar-date';
            dateEl.textContent = day;

            const currentDate = new Date(this.currentYear, this.currentMonth, day);
            
            // Check if date is disabled
            if (this.minDate && currentDate < this.minDate) {
                dateEl.classList.add('disabled');
            } else if (this.maxDate && currentDate > this.maxDate) {
                dateEl.classList.add('disabled');
            } else {
                // Check if selected
                if (this.selectedDate && 
                    currentDate.toDateString() === this.selectedDate.toDateString()) {
                    dateEl.classList.add('selected');
                }

                dateEl.addEventListener('click', () => {
                    this.selectDate(currentDate);
                });
            }

            datesContainer.appendChild(dateEl);
        }

        // Next month's leading dates
        const totalCells = datesContainer.children.length;
        const remainingCells = 42 - totalCells; // 6 rows × 7 days
        for (let day = 1; day <= remainingCells && day <= 14; day++) {
            const dateEl = document.createElement('div');
            dateEl.className = 'calendar-date other-month';
            dateEl.textContent = day;
            datesContainer.appendChild(dateEl);
        }
    }

    selectDate(date) {
        this.selectedDate = date;
        this.updateDisplay();
        this.hideCalendar();
        
        // Update original input
        this.inputElement.value = this.formatDate(date);
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        this.inputElement.dispatchEvent(event);
        
        // Calculate and display rental period
        setTimeout(() => {
            if (typeof calculateRentalDays === 'function') {
                calculateRentalDays();
            }
        }, 100);
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    updateDisplay() {
        const selectedDateSpan = this.customInput.querySelector('.selected-date');
        if (this.selectedDate) {
            selectedDateSpan.textContent = this.formatDate(this.selectedDate);
        } else {
            selectedDateSpan.textContent = 'Select Date';
        }
    }
}

// Function to calculate rental days
function calculateRentalDays() {
    // Try multiple ways to find the date elements
    let pickupDate = document.getElementById('pickup-display')?.textContent;
    let returnDate = document.getElementById('return-display')?.textContent;
    
    // If not found, try finding by class
    if (!pickupDate || pickupDate === 'Select Date') {
        const pickupElement = document.querySelector('#pickup-input .selected-date') || 
                            document.querySelector('.date-group:first-child .selected-date');
        pickupDate = pickupElement?.textContent;
    }
    
    if (!returnDate || returnDate === 'Select Date') {
        const returnElement = document.querySelector('#return-input .selected-date') ||
                            document.querySelector('.date-group:last-child .selected-date');
        returnDate = returnElement?.textContent;
    }
    
    console.log('Pickup date:', pickupDate);
    console.log('Return date:', returnDate);
    
    // Check if both dates are selected and not default text
    if (pickupDate && returnDate && 
        pickupDate !== 'Select Date' && returnDate !== 'Select Date' &&
        pickupDate.trim() !== '' && returnDate.trim() !== '') {
        
        // Parse dates (format: "Oct 13, 2025")
        const pickup = new Date(pickupDate);
        const returnD = new Date(returnDate);
        
        console.log('Parsed pickup:', pickup);
        console.log('Parsed return:', returnD);
        
        // Check if dates are valid
        if (isNaN(pickup.getTime()) || isNaN(returnD.getTime())) {
            console.log('Invalid dates');
            return;
        }
        
        // Calculate difference in milliseconds
        const timeDifference = returnD.getTime() - pickup.getTime();
        
        // Convert to days
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
        
        // Make sure it's at least 1 day
        const rentalDays = Math.max(daysDifference, 1);
        
        console.log('Rental days:', rentalDays);
        
        // Update the display
        const rentalDaysSpan = document.getElementById('rental-days');
        const rentalPeriodDiv = document.getElementById('rental-period');
        
        console.log('Elements found:', rentalDaysSpan, rentalPeriodDiv);
        
        if (rentalDaysSpan && rentalPeriodDiv) {
            rentalDaysSpan.textContent = rentalDays;
            rentalPeriodDiv.style.display = 'block';
        }
    } else {
        console.log('Dates not selected or invalid');
        // Hide if dates are not selected
        const rentalPeriodDiv = document.getElementById('rental-period');
        if (rentalPeriodDiv) {
            rentalPeriodDiv.style.display = 'none';
        }
    }
}

// Calendar monitoring for rental days calculation
document.addEventListener('DOMContentLoaded', function() {
    // Only run if we're on the cameras page
    if (!document.querySelector('.date-picker-card')) {
        return;
    }
    
    // Set up a mutation observer to watch for changes in the date display
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                setTimeout(calculateRentalDays, 100);
            }
        });
    });
    
    // Observe changes to the date picker area
    const datePickerCard = document.querySelector('.date-picker-card');
    if (datePickerCard) {
        observer.observe(datePickerCard, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
    
    // Also try calling it periodically
    setInterval(calculateRentalDays, 1000);
});