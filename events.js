// Events page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize calendar
    initEventCalendar();
    
    // Initialize booking modal
    initBookingModal();
    
    // Initialize price calculator
    initPriceCalculator();
    
    // Initialize event cards
    initEventCards();
});

// Event calendar functionality
function initEventCalendar() {
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Sample events data
    const events = {
        '2025-03-15': [{ type: 'music', title: 'Symphony of Colors' }],
        '2025-03-22': [{ type: 'theatre', title: 'Contemporary Hamlet' }],
        '2025-03-28': [{ type: 'dance', title: 'Flow State' }],
        '2025-04-05': [{ type: 'visual-arts', title: 'Digital Renaissance' }],
        '2025-04-12': [{ type: 'film', title: 'Independent Film Festival' }],
        '2025-04-18': [{ type: 'music', title: 'Jazz Night' }],
        '2025-04-25': [{ type: 'theatre', title: 'Modern Romeo & Juliet' }]
    };
    
    function renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const currentMonthElement = document.getElementById('currentMonth');
        
        // Update month display
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Clear calendar
        calendarGrid.innerHTML = '';
        
        // Add day headers
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            dayHeader.style.cssText = `
                background: var(--primary-color);
                color: white;
                padding: 1rem;
                text-align: center;
                font-weight: 600;
                font-size: 0.9rem;
            `;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
        
        // Add previous month's trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const dayElement = createCalendarDay(day, true);
            calendarGrid.appendChild(dayElement);
        }
        
        // Add current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = createCalendarDay(day, false);
            
            // Check for events
            const dateString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            if (events[dateString]) {
                dayElement.classList.add('has-event');
                events[dateString].forEach(event => {
                    const eventDot = document.createElement('div');
                    eventDot.className = `event-dot ${event.type}`;
                    eventDot.title = event.title;
                    dayElement.appendChild(eventDot);
                });
            }
            
            calendarGrid.appendChild(dayElement);
        }
        
        // Add next month's leading days
        const totalCells = 42; // 6 rows × 7 days
        const remainingCells = totalCells - (firstDay + daysInMonth);
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = createCalendarDay(day, true);
            calendarGrid.appendChild(dayElement);
        }
    }
    
    function createCalendarDay(day, isOtherMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        }
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Add click handler
        dayElement.addEventListener('click', function() {
            if (!isOtherMonth) {
                const dateString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                if (events[dateString]) {
                    showEventDetails(events[dateString], day, monthNames[currentMonth]);
                }
            }
        });
        
        return dayElement;
    }
    
    function showEventDetails(eventList, day, month) {
        const eventTitles = eventList.map(event => event.title).join(', ');
        showNotification(`Events on ${month} ${day}: ${eventTitles}`, 'info');
    }
    
    // Navigation buttons
    document.getElementById('prevMonth').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    // Initial render
    renderCalendar();
}

// Booking modal functionality
function initBookingModal() {
    const bookingModal = document.getElementById('bookingModal');
    
    if (bookingModal) {
        bookingModal.addEventListener('show.bs.modal', function(event) {
            const trigger = event.relatedTarget;
            
            // Extract event data
            const eventTitle = trigger.getAttribute('data-event');
            const eventDate = trigger.getAttribute('data-date');
            const eventVenue = trigger.getAttribute('data-venue');
            
            // Update modal content
            document.getElementById('bookingEventTitle').textContent = eventTitle;
            document.getElementById('bookingEventDate').textContent = eventDate;
            document.getElementById('bookingEventVenue').textContent = eventVenue;
            
            // Reset form
            document.getElementById('bookingForm').reset();
            updateTotalPrice();
        });
        
        // Handle booking form submission
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('submit', handleBookingSubmit);
        }
    }
}

// Price calculator
function initPriceCalculator() {
    const ticketTypeSelect = document.getElementById('ticketType');
    const ticketQuantitySelect = document.getElementById('ticketQuantity');
    
    if (ticketTypeSelect && ticketQuantitySelect) {
        ticketTypeSelect.addEventListener('change', updateTotalPrice);
        ticketQuantitySelect.addEventListener('change', updateTotalPrice);
    }
}

function updateTotalPrice() {
    const ticketType = document.getElementById('ticketType').value;
    const ticketQuantity = parseInt(document.getElementById('ticketQuantity').value) || 1;
    
    const prices = {
        'general': 45,
        'premium': 75,
        'vip': 120
    };
    
    const basePrice = prices[ticketType] || 0;
    const totalPrice = basePrice * ticketQuantity;
    
    document.getElementById('totalPrice').textContent = totalPrice;
}

// Booking form submission
function handleBookingSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = {
        firstName: document.getElementById('bookingFirstName').value,
        lastName: document.getElementById('bookingLastName').value,
        email: document.getElementById('bookingEmail').value,
        phone: document.getElementById('bookingPhone').value,
        ticketType: document.getElementById('ticketType').value,
        quantity: document.getElementById('ticketQuantity').value,
        eventTitle: document.getElementById('bookingEventTitle').textContent,
        total: document.getElementById('totalPrice').textContent
    };
    
    // Validate form
    if (!validateBookingForm(bookingData)) {
        return;
    }
    
    // Simulate booking process
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = showLoading(submitButton);
    
    setTimeout(() => {
        hideLoading(submitButton, originalText);
        showNotification(`Booking confirmed for ${bookingData.eventTitle}! Confirmation details sent to ${bookingData.email}.`, 'success');
        bootstrap.Modal.getInstance(document.getElementById('bookingModal')).hide();
        e.target.reset();
        updateTotalPrice();
    }, 2000);
}

function validateBookingForm(data) {
    if (!data.firstName || !data.lastName) {
        showNotification('Please enter your full name.', 'error');
        return false;
    }
    
    if (!validateEmail(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (!validatePhone(data.phone)) {
        showNotification('Please enter a valid phone number.', 'error');
        return false;
    }
    
    if (!data.ticketType) {
        showNotification('Please select a ticket type.', 'error');
        return false;
    }
    
    return true;
}

// Event cards interaction
function initEventCards() {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        // Add hover animations
        card.addEventListener('mouseenter', function() {
            const image = this.querySelector('.event-image img');
            image.style.transform = 'scale(1.1)';
            
            // Add subtle glow effect
            this.style.boxShadow = '0 25px 50px rgba(107, 70, 193, 0.2)';
        });

        card.addEventListener('mouseleave', function() {
            const image = this.querySelector('.event-image img');
            image.style.transform = 'scale(1)';
            this.style.boxShadow = 'var(--box-shadow)';
        });

        // Add click handler for "Learn More" functionality
        const learnMoreBtn = card.querySelector('.btn-outline-secondary');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const eventTitle = card.querySelector('h4').textContent;
                showEventDetails(eventTitle);
            });
        }
    });
}

function showEventDetails(eventTitle) {
    // In a real application, this would open a detailed event page
    showNotification(`Loading details for "${eventTitle}"...`, 'info');
}

// Combined DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', function() {
    // Call your event cards setup function
    initEventCards();

    // Testimonials interaction
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        // Stagger animation on scroll
        setTimeout(() => {
            card.classList.add('scroll-animation');
        }, index * 100);

        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'var(--box-shadow)';
        });
    });
});
// Event type filtering for calendar
function filterCalendarEvents(eventType) {
    const eventDots = document.querySelectorAll('.event-dot');
    
    eventDots.forEach(dot => {
        if (eventType === 'all' || dot.classList.contains(eventType)) {
            dot.style.display = 'block';
        } else {
            dot.style.display = 'none';
        }
    });
}

// Add event type filter to legend
document.addEventListener('DOMContentLoaded', function() {
    const legendItems = document.querySelectorAll('.legend-item');
    
    legendItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            const eventType = this.querySelector('.legend-color').className.split(' ')[1];
            
            // Toggle active state
            legendItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Filter calendar events
            filterCalendarEvents(eventType);
            
            // Visual feedback
            this.style.background = 'rgba(107, 70, 193, 0.1)';
            this.style.borderRadius = '8px';
            this.style.padding = '8px';
            
            setTimeout(() => {
                this.style.background = 'transparent';
            }, 200);
        });
    });
});

// Advanced booking features
function initAdvancedBooking() {
    // Seat selection (simplified version)
    const seatSelector = document.createElement('div');
    seatSelector.className = 'seat-selector mt-3';
    seatSelector.innerHTML = `
        <h6>Select Your Seats</h6>
        <div class="seat-map">
            <div class="seat-row">
                ${Array.from({length: 10}, (_, i) => 
                    `<div class="seat" data-seat="${i + 1}"></div>`
                ).join('')}
            </div>
        </div>
    `;
    
    // Add styles for seats
    const seatStyles = document.createElement('style');
    seatStyles.textContent = `
        .seat-map {
            display: flex;
            justify-content: center;
            margin: 1rem 0;
        }
        .seat-row {
            display: flex;
            gap: 5px;
        }
        .seat {
            width: 25px;
            height: 25px;
            background: #E5E7EB;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .seat:hover {
            background: var(--accent-color);
        }
        .seat.selected {
            background: var(--primary-color);
        }
        .seat.occupied {
            background: #EF4444;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(seatStyles);
}

// Mobile calendar optimization
function optimizeCalendarForMobile() {
    if (window.innerWidth <= 768) {
        const calendarGrid = document.getElementById('calendarGrid');
        if (calendarGrid) {
            calendarGrid.style.fontSize = '0.8rem';
            
            const calendarDays = document.querySelectorAll('.calendar-day');
            calendarDays.forEach(day => {
                day.style.minHeight = '50px';
                day.style.padding = '0.5rem';
            });
        }
    }
}

// Initialize mobile optimization
window.addEventListener('resize', optimizeCalendarForMobile);
document.addEventListener('DOMContentLoaded', optimizeCalendarForMobile);

// Event reminder system
function initEventReminders() {
    const reminderCheckbox = document.getElementById('eventReminders');
    
    if (reminderCheckbox) {
        reminderCheckbox.addEventListener('change', function() {
            if (this.checked) {
                showNotification('Event reminders enabled! You\'ll receive notifications before the event.', 'success');
            }
        });
    }
}

// Initialize event reminders
document.addEventListener('DOMContentLoaded', initEventReminders);