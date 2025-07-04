// API Base URL
const API_BASE = 'http://localhost:3000/api';

// Global variables
let currentRoute = null;
let allRoutes = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 RouteBook App Initialized');
    
    // Load all routes when page loads
    loadRoutes();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    const travelDateInput = document.getElementById('travelDate');
    if (travelDateInput) {
        travelDateInput.value = today;
    }
    
    // Set up event listeners
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // Booking form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmission);
    }
    
    // Seats selection change
    const seatsSelect = document.getElementById('seatsBooked');
    if (seatsSelect) {
        seatsSelect.addEventListener('change', updateTotalAmount);
    }
    
    // Modal close on background click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Load all available routes
async function loadRoutes() {
    try {
        console.log('📡 Loading routes from API...');
        const response = await fetch(`${API_BASE}/routes`);
        
        if (!response.ok) {
            throw new Error('Failed to load routes');
        }
        
        const routes = await response.json();
        allRoutes = routes;
        
        console.log(`✅ Loaded ${routes.length} routes`);
        displayRoutes(routes);
        
    } catch (error) {
        console.error('❌ Error loading routes:', error);
        showError('Failed to load routes. Please try again.');
    }
}

// Display routes in the grid
function displayRoutes(routes) {
    const routesGrid = document.getElementById('routesGrid');
    if (!routesGrid) return;
    
    if (routes.length === 0) {
        routesGrid.innerHTML = `
            <div class="no-routes">
                <h3>No routes found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }
    
    routesGrid.innerHTML = routes.map(route => `
        <div class="route-card">
            <div class="route-header">
                <div class="route-path">${route.from} → ${route.to}</div>
                <div class="route-time">🕐 ${route.time}</div>
            </div>
            
            <div class="route-info">
                <div class="info-item">
                    <span class="info-icon">🏢</span>
                    <div>
                        <div class="info-text">Company</div>
                        <div class="info-value">${route.company}</div>
                    </div>
                </div>
                
                <div class="info-item">
                    <span class="info-icon">📅</span>
                    <div>
                        <div class="info-text">Date</div>
                        <div class="info-value">${formatDate(route.date)}</div>
                    </div>
                </div>
                
                <div class="info-item">
                    <span class="info-icon">🪑</span>
                    <div>
                        <div class="info-text">Seats Available</div>
                        <div class="info-value seats-left ${getSeatClass(route.seatsLeft)}">${route.seatsLeft}/${route.totalSeats}</div>
                    </div>
                </div>
                
                <div class="info-item">
                    <span class="info-icon">💰</span>
                    <div>
                        <div class="info-text">Price per seat</div>
                        <div class="info-value">${route.price} RWF</div>
                    </div>
                </div>
            </div>
            
            <div class="route-footer">
                <div class="route-price">${route.price} RWF</div>
                <button class="book-route-btn" onclick="openBookingModal('${route.id}')" ${route.seatsLeft === 0 ? 'disabled' : ''}>
                    ${route.seatsLeft === 0 ? 'Sold Out' : 'Book Now'}
                </button>
            </div>
        </div>
    `).join('');
}

// Search routes based on user input
function searchRoutes() {
    const fromCity = document.getElementById('fromCity').value.toLowerCase();
    const toCity = document.getElementById('toCity').value.toLowerCase();
    const travelDate = document.getElementById('travelDate').value;
    
    console.log('🔍 Searching routes:', { fromCity, toCity, travelDate });
    
    let filteredRoutes = allRoutes;
    
    // Filter by from city
    if (fromCity) {
        filteredRoutes = filteredRoutes.filter(route => 
            route.from.toLowerCase().includes(fromCity)
        );
    }
    
    // Filter by to city
    if (toCity) {
        filteredRoutes = filteredRoutes.filter(route => 
            route.to.toLowerCase().includes(toCity)
        );
    }
    
    // Filter by date
    if (travelDate) {
        filteredRoutes = filteredRoutes.filter(route => 
            route.date === travelDate
        );
    }
    
    console.log(`📊 Found ${filteredRoutes.length} matching routes`);
    displayRoutes(filteredRoutes);
}

// Open booking modal for a specific route
function openBookingModal(routeId) {
    const route = allRoutes.find(r => r.id === routeId);
    if (!route) {
        showError('Route not found');
        return;
    }
    
    currentRoute = route;
    
    // Populate route details
    const routeDetails = document.getElementById('routeDetails');
    routeDetails.innerHTML = `
        <h4>${route.from} → ${route.to}</h4>
        <p><strong>Company:</strong> ${route.company}</p>
        <p><strong>Date:</strong> ${formatDate(route.date)}</p>
        <p><strong>Time:</strong> ${route.time}</p>
        <p><strong>Price per seat:</strong> ${route.price} RWF</p>
        <p><strong>Available seats:</strong> ${route.seatsLeft}</p>
    `;
    
    // Update seats dropdown
    const seatsSelect = document.getElementById('seatsBooked');
    const maxSeats = Math.min(route.seatsLeft, 4);
    seatsSelect.innerHTML = '<option value="">Select seats</option>';
    
    for (let i = 1; i <= maxSeats; i++) {
        seatsSelect.innerHTML += `<option value="${i}">${i} Seat${i > 1 ? 's' : ''}</option>`;
    }
    
    // Reset form
    document.getElementById('bookingForm').reset();
    document.getElementById('totalAmount').textContent = 'Total: 0 RWF';
    
    // Show modal
    document.getElementById('bookingModal').style.display = 'block';
}

// Close booking modal
function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
    currentRoute = null;
}

// Update total amount when seats selection changes
function updateTotalAmount() {
    const seatsBooked = parseInt(document.getElementById('seatsBooked').value) || 0;
    const totalAmount = currentRoute ? currentRoute.price * seatsBooked : 0;
    document.getElementById('totalAmount').textContent = `Total: ${totalAmount} RWF`;
}

// Handle booking form submission
async function handleBookingSubmission(e) {
    e.preventDefault();
    
    if (!currentRoute) {
        showError('No route selected');
        return;
    }
    
    // Get form data
    const formData = {
        routeId: currentRoute.id,
        passengerName: document.getElementById('passengerName').value,
        passengerEmail: document.getElementById('passengerEmail').value,
        passengerPhone: document.getElementById('passengerPhone').value,
        seatsBooked: parseInt(document.getElementById('seatsBooked').value)
    };
    
    // Validate form
    if (!formData.passengerName || !formData.passengerEmail || !formData.seatsBooked) {
        showError('Please fill in all required fields');
        return;
    }
    
    try {
        console.log('📤 Submitting booking:', formData);
        
        // Show loading state
        const submitBtn = document.querySelector('.book-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Send booking request
        const response = await fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Booking failed');
        }
        
        console.log('✅ Booking successful:', result);
        
        // Close booking modal
        closeModal();
        
        // Show success modal
        showBookingSuccess(result.booking);
        
        // Reload routes to update seat availability
        loadRoutes();
        
    } catch (error) {
        console.error('❌ Booking failed:', error);
        showError(error.message || 'Booking failed. Please try again.');
    } finally {
        // Reset button state
        const submitBtn = document.querySelector('.book-btn');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Show booking success modal
function showBookingSuccess(booking) {
    const confirmationDiv = document.getElementById('bookingConfirmation');
    confirmationDiv.innerHTML = `
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p><strong>Passenger:</strong> ${booking.passengerName}</p>
        <p><strong>Email:</strong> ${booking.passengerEmail}</p>
        <p><strong>Seats:</strong> ${booking.seatsBooked}</p>
        <p><strong>Total Amount:</strong> ${booking.totalAmount} RWF</p>
        <p><strong>Status:</strong> ${booking.status}</p>
        <hr>
        <p><strong>Route:</strong> ${currentRoute.from} → ${currentRoute.to}</p>
        <p><strong>Date:</strong> ${formatDate(currentRoute.date)}</p>
        <p><strong>Time:</strong> ${currentRoute.time}</p>
    `;
    
    document.getElementById('successModal').style.display = 'block';
}

// Close success modal
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Helper functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getSeatClass(seatsLeft) {
    if (seatsLeft === 0) return 'critical';
    if (seatsLeft <= 5) return 'critical';
    if (seatsLeft <= 10) return 'low';
    return '';
}

function showError(message) {
    // Create error toast
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Add to page
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showSuccess(message) {
    // Create success toast
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    // Add to page
    document.body.appendChild(successDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC key closes modals
    if (e.key === 'Escape') {
        closeModal();
        closeSuccessModal();
    }
    
    // Enter key in search form triggers search
    if (e.key === 'Enter' && e.target.closest('.search-form')) {
        searchRoutes();
    }
});

// Handle window resize for responsive design
window.addEventListener('resize', function() {
    // Adjust modal positioning if needed
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (modal.style.display === 'block') {
            // Ensure modal is centered
            modal.style.display = 'block';
        }
    });
});

console.log('📱 RouteBook Frontend Loaded Successfully');