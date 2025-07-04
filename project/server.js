import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Initialize Firebase Admin (you'll need to add your service account key)
// For demo purposes, we'll use a mock setup
// In production, add your Firebase service account key file
let db;
try {
  // Initialize Firebase Admin with service account
  // const serviceAccount = require('./path/to/your/serviceAccountKey.json');
  // initializeApp({
  //   credential: cert(serviceAccount)
  // });
  // db = getFirestore();
  
  // Mock database for demo - replace with real Firebase
  console.log('Note: Using mock database. Add Firebase credentials for production.');
} catch (error) {
  console.log('Firebase not configured. Using mock data for demo.');
}

// Mock data for demonstration
let mockRoutes = [
  {
    id: '1',
    from: 'Kigali',
    to: 'Huye',
    time: '07:00',
    seatsLeft: 30,
    totalSeats: 60,
    price: 2500,
    company: 'Volcano Express',
    date: '2025-01-15'
  },
  {
    id: '2',
    from: 'Kigali',
    to: 'Musanze',
    time: '09:00',
    seatsLeft: 20,
    totalSeats: 60,
    price: 2000,
    company: 'RITCO',
    date: '2025-01-15'
  },
  {
    id: '3',
    from: 'Kigali',
    to: 'Rubavu',
    time: '11:00',
    seatsLeft: 15,
    totalSeats: 60,
    price: 3000,
    company: 'Kigali Coach',
    date: '2025-01-15'
  },
  {
    id: '4',
    from: 'Kigali',
    to: 'Rusizi',
    time: '06:30',
    seatsLeft: 40,
    totalSeats: 60,
    price: 5000,
    company: 'RITCO',
    date: '2025-01-15'
  },
  {
    id: '5',
    from: 'Kigali',
    to: 'Nyagatare',
    time: '08:00',
    seatsLeft: 25,
    totalSeats: 60,
    price: 3500,
    company: 'Volcano Express',
    date: '2025-01-15'
  },
  {
    id: '6',
    from: 'Huye',
    to: 'Kigali',
    time: '15:00',
    seatsLeft: 10,
    totalSeats: 60,
    price: 2500,
    company: 'Kigali Coach',
    date: '2025-01-15'
  },
  {
    id: '7',
    from: 'Musanze',
    to: 'Kigali',
    time: '17:00',
    seatsLeft: 18,
    totalSeats: 60,
    price: 2000,
    company: 'RITCO',
    date: '2025-01-15'
  },
  {
    id: '8',
    from: 'Rubavu',
    to: 'Kigali',
    time: '13:00',
    seatsLeft: 22,
    totalSeats: 60,
    price: 3000,
    company: 'Volcano Express',
    date: '2025-01-15'
  }
];

let mockBookings = [];
let mockCompanies = [
  { id: '1', name: 'Volcano Express', email: 'admin@volcano.rw', password: 'admin123' },
  { id: '2', name: 'RITCO', email: 'admin@ritco.rw', password: 'admin123' },
  { id: '3', name: 'Kigali Coach', email: 'admin@kigalicoach.rw', password: 'admin123' }
];

// API Routes

// Get all routes
app.get('/api/routes', (req, res) => {
  res.json(mockRoutes);
});

// Get route by ID
app.get('/api/routes/:id', (req, res) => {
  const route = mockRoutes.find(r => r.id === req.params.id);
  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.json(route);
});

// Book a seat
app.post('/api/bookings', (req, res) => {
  const { routeId, passengerName, passengerEmail, passengerPhone, seatsBooked } = req.body;
  
  // Validate input
  if (!routeId || !passengerName || !passengerEmail || !seatsBooked) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Find the route
  const route = mockRoutes.find(r => r.id === routeId);
  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }
  
  // Check seat availability
  if (route.seatsLeft < seatsBooked) {
    return res.status(400).json({ error: 'Not enough seats available' });
  }
  
  // Create booking
  const booking = {
    id: Date.now().toString(),
    routeId,
    passengerName,
    passengerEmail,
    passengerPhone,
    seatsBooked,
    totalAmount: route.price * seatsBooked,
    bookingDate: new Date().toISOString(),
    status: 'confirmed'
  };
  
  // Update route seats
  route.seatsLeft -= seatsBooked;
  
  // Save booking (in real app, this would go to Firebase)
  mockBookings.push(booking);
  
  res.json({ 
    success: true, 
    booking,
    message: 'Booking confirmed successfully!' 
  });
});

// Company login
app.post('/api/company/login', (req, res) => {
  const { email, password } = req.body;
  
  const company = mockCompanies.find(c => c.email === email && c.password === password);
  if (!company) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // In real app, generate JWT token
  res.json({ 
    success: true, 
    company: { id: company.id, name: company.name, email: company.email }
  });
});

// Add new route (company only)
app.post('/api/routes', (req, res) => {
  const { from, to, time, totalSeats, price, company, date } = req.body;
  
  if (!from || !to || !time || !totalSeats || !price || !company || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newRoute = {
    id: Date.now().toString(),
    from,
    to,
    time,
    seatsLeft: totalSeats,
    totalSeats,
    price,
    company,
    date
  };
  
  mockRoutes.push(newRoute);
  res.json({ success: true, route: newRoute });
});

// Get bookings for a company
app.get('/api/company/:companyName/bookings', (req, res) => {
  const companyName = req.params.companyName;
  
  // Get routes for this company
  const companyRoutes = mockRoutes.filter(r => r.company === companyName);
  const companyRouteIds = companyRoutes.map(r => r.id);
  
  // Get bookings for these routes
  const companyBookings = mockBookings.filter(b => companyRouteIds.includes(b.routeId));
  
  // Add route details to bookings
  const bookingsWithRoutes = companyBookings.map(booking => {
    const route = mockRoutes.find(r => r.id === booking.routeId);
    return { ...booking, route };
  });
  
  res.json(bookingsWithRoutes);
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('📋 Available routes:');
  console.log('  🏠 Home: http://localhost:3000');
  console.log('  📊 Company Login: http://localhost:3000/company-login.html');
  console.log('  📈 API Documentation: http://localhost:3000/api/routes');
});