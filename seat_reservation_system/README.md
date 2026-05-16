# Seat Reservation System

A modern seat reservation system for interns with a beautiful blue and white theme. Built with React.js, Node.js, Express, and MongoDB.

## Features

### Intern Features
- ✅ View available seats by date
- ✅ Book/reserve a seat with double booking prevention
- ✅ View current and past reservations
- ✅ Cancel or modify future reservations
- ✅ Beautiful blue and white theme interface
- ✅ Responsive design with Tailwind CSS

### Admin Features
- ✅ Admin Dashboard with quick statistics
- ✅ Seat Management (add, edit, delete seat entries)
- ✅ View all reservations with filtering options
- ✅ Manual seat assignment to interns
- ✅ Generate comprehensive usage reports
- ✅ Role-based access control

## Project Structure

```
seat_reservation_system/
├── backend/
│   ├── models/
│   │   ├── Reservation.js
│   │   ├── Intern.js
│   │   ├── Admin.js
│   │   └── Seat.js
│   ├── routes/
│   │   ├── reservations.js
│   │   ├── seats.js
│   │   ├── auth.js
│   │   └── admin.js
│   ├── createAdmin.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InternDashboard.jsx
│   │   │   ├── SeatBooking.jsx
│   │   │   ├── MyReservations.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminSeatManagement.jsx
│   │   │   ├── AdminReservations.jsx
│   │   │   ├── AdminAssignSeats.jsx
│   │   │   └── AdminReports.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (copy from env.example):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/seat_reservation
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

4. Start the backend server:
```bash
npm run dev
```

5. Create default admin user (optional):
```bash
node createAdmin.js
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### Authentication
- **Register**: `http://localhost:3000/register`
- **Login**: `http://localhost:3000/login`
- Create account with username, email, and password
- Secure login with JWT token authentication
- **Admin Login**: Use email format `admin.name@gmail.com` and password `name+1234`
- **Default Admin**: `admin.saman@gmail.com` / `saman1234`

### Intern Dashboard
- **URL**: `http://localhost:3000/dashboard`
- View system statistics
- Access booking and reservation management
- User profile and logout functionality

### Seat Booking
- **URL**: `http://localhost:3000/booking`
- Select a date (up to 30 days in advance)
- Choose from available seats (1-50)
- Enter your name to complete booking
- Double booking prevention is implemented

### My Reservations
- **URL**: `http://localhost:3000/reservations`
- View all your current and past reservations
- Cancel future reservations
- See reservation status (Active, Cancelled, Completed)

### Admin Dashboard
- **URL**: `http://localhost:3000/admin`
- View system statistics and quick overview
- Access all admin functions
- User management and logout

### Admin Seat Management
- **URL**: `http://localhost:3000/admin/seats`
- Add, edit, and delete seat entries
- Manage seat locations and descriptions
- View seat status (active/inactive)

### Admin Reservations
- **URL**: `http://localhost:3000/admin/reservations`
- View all reservations with filtering options
- Filter by date, intern, or status
- Comprehensive reservation overview

### Admin Assign Seats
- **URL**: `http://localhost:3000/admin/assign`
- Manually assign seats to interns
- Select from available seats and interns
- Create reservations on behalf of interns

### Admin Reports
- **URL**: `http://localhost:3000/admin/reports`
- Generate usage reports for date ranges
- View popular seats and intern statistics
- Comprehensive analytics dashboard

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new intern
- `POST /api/auth/login` - Login intern or admin

### Reservations
- `GET /api/reservations/intern/:internId` - Get all reservations for an intern
- `POST /api/reservations` - Create a new reservation
- `PATCH /api/reservations/:id` - Update a reservation
- `PATCH /api/reservations/:id/cancel` - Cancel a reservation
- `DELETE /api/reservations/:id` - Delete a reservation

### Seats
- `GET /api/seats/available/:date` - Get available seats for a specific date
- `GET /api/seats/status/:date` - Get all seats status for a date

### Admin Endpoints
- `GET /api/admin/seats` - Get all seats (admin only)
- `POST /api/admin/seats` - Add new seat (admin only)
- `PUT /api/admin/seats/:id` - Update seat (admin only)
- `DELETE /api/admin/seats/:id` - Delete seat (admin only)
- `GET /api/admin/interns` - Get all interns (admin only)
- `GET /api/admin/reservations` - Get all reservations with filters (admin only)
- `POST /api/admin/reservations/assign` - Manually assign seat (admin only)
- `GET /api/admin/reports/usage` - Generate usage report (admin only)

## Key Features

### Double Booking Prevention
- Server-side validation prevents multiple bookings for the same seat on the same date
- Database compound index ensures data integrity
- Real-time seat availability checking

### User Experience
- Clean, modern interface with blue and white theme
- Responsive design for all devices
- Loading states and error handling
- Intuitive navigation between pages

### Data Management
- MongoDB for persistent storage
- RESTful API design
- Proper error handling and validation

## Technologies Used

### Frontend
- React.js 18
- React Router DOM
- Tailwind CSS
- Axios for API calls
- date-fns for date manipulation
- Vite for build tooling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS for cross-origin requests
- dotenv for environment variables

## Development

### Running Both Servers
1. Start MongoDB service
2. In backend directory: `npm run dev`
3. In frontend directory: `npm run dev`
4. Access the application at `http://localhost:3000`

### Database
The system uses MongoDB with a `seat_reservation` database. The main collection is `reservations` with the following schema:
- `internId`: String (required)
- `internName`: String (required)
- `seatNumber`: Number (1-50, required)
- `date`: Date (required)
- `status`: String (active/cancelled/completed, default: active)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

## Notes
- The system now includes complete authentication with JWT tokens
- Users must register/login before accessing the seat reservation features
- The seat grid shows 50 seats (5 rows × 10 columns)
- Reservations can be made up to 30 days in advance
- Cancellations are allowed for future reservations only
- All routes are protected except login and register 