# Bus & Taxi Booking System

A beginner-friendly web application for booking bus and taxi routes with a Node.js backend and Firebase Firestore integration.

## Features

### For Users
- 🔍 Browse available routes with real-time information
- 🎫 Book seats with instant confirmation
- 📱 Mobile-responsive design
- 🔄 Real-time seat availability updates

### For Transport Companies
- 🔐 Secure login system
- ➕ Add new routes easily
- 📊 View booking statistics
- 💰 Track revenue

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Backend:** Node.js with Express.js
- **Database:** Firebase Firestore (with mock data for demo)
- **Styling:** Custom CSS with modern design

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd bus-booking-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
bus-booking-app/
├── public/                 # Frontend files
│   ├── index.html         # Main page (route browsing)
│   ├── company-login.html # Company login page
│   ├── company-dashboard.html # Company dashboard
│   ├── styles.css         # CSS styles
│   ├── script.js          # Main JavaScript
│   └── company.js         # Company-specific JavaScript
├── server.js              # Express server
├── package.json           # Dependencies
└── README.md             # This file
```

## API Endpoints

### Public Routes
- `GET /api/routes` - Get all available routes
- `GET /api/routes/:id` - Get specific route details
- `POST /api/bookings` - Create a new booking

### Company Routes
- `POST /api/company/login` - Company login
- `POST /api/routes` - Add new route (company only)
- `GET /api/company/:companyName/bookings` - Get company bookings

## Demo Credentials

### Company Login
- **Email:** admin@express.com | **Password:** admin123
- **Email:** admin@westcoast.com | **Password:** admin123

## Features in Detail

### User Interface
- Clean, modern design with gradient backgrounds
- Smooth animations and hover effects
- Responsive grid layouts
- Intuitive booking process

### Backend Features
- RESTful API design
- Input validation and error handling
- Real-time seat availability management
- Mock data for development (easily replaceable with Firebase)

### Database Integration
- Ready for Firebase Firestore integration
- Structured data models for routes and bookings
- Real-time updates support

## Firebase Setup (Optional)

To use Firebase Firestore instead of mock data:

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore database
3. Download the service account key JSON file
4. Update the Firebase configuration in `server.js`
5. Add your Firebase credentials to `.env` file

## Learning Resources

This project is designed for beginners and includes:
- Comprehensive comments in all code files
- Clear separation of concerns
- Modern JavaScript practices
- RESTful API design patterns
- Responsive web design principles

## Future Enhancements

- [ ] User authentication and profiles
- [ ] Payment integration
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Route reviews and ratings
- [ ] Mobile app versions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please open an issue in the repository or contact the development team.

---

Built with ❤️ for learning and education