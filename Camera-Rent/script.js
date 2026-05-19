class CustomCalendar {
    constructor(inputId, calendarId, displayId, monthYearId, prevId, nextId, datesId) {
        this.input = document.getElementById(inputId);
        this.calendar = document.getElementById(calendarId);
        this.display = document.getElementById(displayId);
        this.monthYear = document.getElementById(monthYearId);
        this.prevBtn = document.getElementById(prevId);
        this.nextBtn = document.getElementById(nextId);
        this.datesContainer = document.getElementById(datesId);
        
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.selectedDate = null;
        
        this.months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        this.init();
    }
    
    init() {
        this.input.addEventListener('click', () => this.toggleCalendar());
        this.prevBtn.addEventListener('click', () => this.previousMonth());
        this.nextBtn.addEventListener('click', () => this.nextMonth());
        
        document.addEventListener('click', (e) => {
            if (!this.input.contains(e.target) && !this.calendar.contains(e.target)) {
                this.hideCalendar();
            }
        });
        
        this.renderCalendar();
    }
    
    toggleCalendar() {
        this.calendar.classList.toggle('show');
    }
    
    hideCalendar() {
        this.calendar.classList.remove('show');
    }
    
    previousMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.renderCalendar();
    }
    
    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.renderCalendar();
    }
    
    renderCalendar() {
        this.monthYear.textContent = `${this.months[this.currentMonth]} ${this.currentYear}`;
        
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        const today = new Date();
        
        this.datesContainer.innerHTML = '';
        

        for (let i = 0; i < firstDay; i++) {
            const emptyDate = document.createElement('div');
            emptyDate.className = 'calendar-date other-month';
            this.datesContainer.appendChild(emptyDate);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateElement = document.createElement('div');
            dateElement.className = 'calendar-date';
            dateElement.textContent = day;
            
            const currentDate = new Date(this.currentYear, this.currentMonth, day);
            
            if (currentDate < today.setHours(0, 0, 0, 0)) {
                dateElement.classList.add('disabled');
            } else {
                dateElement.addEventListener('click', () => this.selectDate(day));
            }
            
            if (this.selectedDate && 
                this.selectedDate.getDate() === day && 
                this.selectedDate.getMonth() === this.currentMonth && 
                this.selectedDate.getFullYear() === this.currentYear) {
                dateElement.classList.add('selected');
            }
            
            this.datesContainer.appendChild(dateElement);
        }
    }
    
    selectDate(day) {
        this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
        const formattedDate = this.selectedDate.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric', 
            month: 'short',
            day: 'numeric'
        });
        this.display.textContent = formattedDate;
        this.hideCalendar();
        this.renderCalendar();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('pickup-input') && document.getElementById('return-input')) {
        const pickupCalendar = new CustomCalendar(
            'pickup-input', 'pickup-calendar', 'pickup-display', 
            'pickup-month-year', 'pickup-prev', 'pickup-next', 'pickup-dates'
        );
        
        const returnCalendar = new CustomCalendar(
            'return-input', 'return-calendar', 'return-display',
            'return-month-year', 'return-prev', 'return-next', 'return-dates'
        );
    }
});