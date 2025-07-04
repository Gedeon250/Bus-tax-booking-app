// API Base URL
const API_BASE = 'http://localhost:3000/api';

// Global variables
let currentCompany = null;
let companyBookings = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏢 Company Dashboard Initialized');
    
    // Check if we're on the login page or dashboard
    const isLoginPage = window.location.pathname.includes('login');
    const isDashboard = window.location.pathname.includes('dashboard');
    
    if (isLoginPage) {
        setupLoginForm();
    } else if (isDashboard) {
        checkAuthentication();
        setupDashboard();
    } else {
        // Check if company is logged in and redirect accordingly
        const company = getStoredCompany();
        if (company) {
            window.location.href = 'company-dashboard.html';
        }
    }
});

// Setup login form
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    // Also setup register form if present
    setupRegisterForm();
}

// Setup register form
function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', registerCompany);
    }
}

// Handle company login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = document.querySelector('.login-btn');
    const originalText = submitBtn.textContent;
    
    if (!email || !password) {
        showError('Please enter both email and password');
        return;
    }
    
    try {
        console.log('🔐 Attempting login for:', email);
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        // Send login request
        const response = await fetch(`${API_BASE}/company/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Login failed');
        }
        
        console.log('✅ Login successful:', result);
        
        // Store company info
        localStorage.setItem('company', JSON.stringify(result.company));
        
        // Redirect to dashboard
        window.location.href = 'company-dashboard.html';
        
    } catch (error) {
        console.error('❌ Login failed:', error);
        showError(error.message || 'Login failed. Please try again.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Register company (mock, no Firebase yet)
async function registerCompany(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const submitBtn = document.querySelector('.register-btn');
    const originalText = submitBtn.textContent;
    if (!name || !email || !password) {
        showError('Please fill in all fields');
        return;
    }
    try {
        submitBtn.textContent = 'Registering...';
        submitBtn.disabled = true;
        const response = await fetch(`${API_BASE}/company/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Registration failed');
        }
        showSuccess('Registration successful! You can now log in.');
        // Optionally redirect to login page
        window.location.href = 'company-login.html';
    } catch (error) {
        showError(error.message || 'Registration failed. Please try again.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Check authentication for dashboard
function checkAuthentication() {
    const company = getStoredCompany();
    if (!company) {
        window.location.href = 'company-login.html';
        return;
    }
    
    currentCompany = company;
    
    // Update company name in header
    const companyNameElement = document.getElementById('companyName');
    if (companyNameElement) {
        companyNameElement.textContent = company.name;
    }
}

// Setup dashboard
function setupDashboard() {
    // Load dashboard data
    loadDashboardData();
    
    // Setup form for adding routes
    const addRouteForm = document.getElementById('addRouteForm');
    if (addRouteForm) {
        addRouteForm.addEventListener('submit', handleAddRoute);
    }
    
    // Set default date to today
    const routeDateInput = document.getElementById('routeDate');
    if (routeDateInput) {
        routeDateInput.value = new Date().toISOString().split('T')[0];
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        console.log('📊 Loading dashboard data...');
        
        // Load bookings for this company
        const response = await fetch(`${API_BASE}/company/${encodeURIComponent(currentCompany.name)}/bookings`);
        
        if (!response.ok) {
            throw new Error('Failed to load bookings');
        }
        
        const bookings = await response.json();
        companyBookings = bookings;
        
        console.log(`📋 Loaded ${bookings.length} bookings`);
        
        // Update statistics
        updateDashboardStats(bookings);
        
        // Load recent bookings
        displayRecentBookings(bookings);
        
    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        showError('Failed to load dashboard data');
    }
}

// Update dashboard statistics
function updateDashboardStats(bookings) {
    // Load routes to count active routes
    fetch(`${API_BASE}/routes`)
        .then(response => response.json())
        .then(routes => {
            const companyRoutes = routes.filter(route => route.company === currentCompany.name);
            document.getElementById('totalRoutes').textContent = companyRoutes.length;
        })
        .catch(error => console.error('Error loading routes:', error));
    
    // Total bookings
    document.getElementById('totalBookings').textContent = bookings.length;
    
    // Total revenue
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    document.getElementById('totalRevenue').textContent = `$${totalRevenue}`;
}

// Display recent bookings
function displayRecentBookings(bookings) {
    const contentTitle = document.getElementById('contentTitle');
    const contentBody = document.getElementById('contentBody');
    
    if (!contentTitle || !contentBody) return;
    
    contentTitle.textContent = 'Recent Bookings';
    
    if (bookings.length === 0) {
        contentBody.innerHTML = `
            <div class="no-bookings">
                <p>No bookings yet. Add some routes to start receiving bookings!</p>
            </div>
        `;
        return;
    }
    
    // Sort bookings by date (newest first)
    const sortedBookings = bookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
    
    contentBody.innerHTML = `
        <table class="booking-table">
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Passenger</th>
                    <th>Route</th>
                    <th>Seats</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${sortedBookings.map(booking => `
                    <tr>
                        <td>#${booking.id}</td>
                        <td>
                            <div>
                                <strong>${booking.passengerName}</strong><br>
                                <small>${booking.passengerEmail}</small>
                            </div>
                        </td>
                        <td>${booking.route ? `${booking.route.from} → ${booking.route.to}` : 'N/A'}</td>
                        <td>${booking.seatsBooked}</td>
                        <td>$${booking.totalAmount}</td>
                        <td>${formatDate(booking.bookingDate)}</td>
                        <td>
                            <span class="status ${booking.status}">${booking.status}</span>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Show add route modal
function showAddRouteModal() {
    document.getElementById('addRouteModal').style.display = 'block';
}

// Close add route modal
function closeAddRouteModal() {
    document.getElementById('addRouteModal').style.display = 'none';
    document.getElementById('addRouteForm').reset();
}

// Handle add route form submission
async function handleAddRoute(e) {
    e.preventDefault();
    
    const formData = {
        from: document.getElementById('routeFrom').value,
        to: document.getElementById('routeTo').value,
        time: document.getElementById('routeTime').value,
        date: document.getElementById('routeDate').value,
        totalSeats: parseInt(document.getElementById('totalSeats').value),
        price: parseFloat(document.getElementById('routePrice').value),
        company: currentCompany.name
    };
    
    // Validate form
    if (!formData.from || !formData.to || !formData.time || !formData.date || !formData.totalSeats || !formData.price) {
        showError('Please fill in all required fields');
        return;
    }
    
    try {
        console.log('➕ Adding new route:', formData);
        
        // Show loading state
        const submitBtn = document.querySelector('.add-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Adding Route...';
        submitBtn.disabled = true;
        
        // Send add route request
        const response = await fetch(`${API_BASE}/routes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to add route');
        }
        
        console.log('✅ Route added successfully:', result);
        
        // Close modal
        closeAddRouteModal();
        
        // Show success message
        showSuccess('Route added successfully!');
        
        // Reload dashboard data
        loadDashboardData();
        
    } catch (error) {
        console.error('❌ Failed to add route:', error);
        showError(error.message || 'Failed to add route. Please try again.');
    } finally {
        // Reset button state
        const submitBtn = document.querySelector('.add-btn');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Load and display bookings
function loadBookings() {
    displayRecentBookings(companyBookings);
}

// Logout function
function logout() {
    // Clear stored company info
    localStorage.removeItem('company');
    
    // Redirect to login page
    window.location.href = 'company-login.html';
}

// Get stored company info
function getStoredCompany() {
    const companyData = localStorage.getItem('company');
    return companyData ? JSON.parse(companyData) : null;
}

// Helper functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Handle modal close on background click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC key closes modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
});

console.log('🏢 Company Dashboard Loaded Successfully');