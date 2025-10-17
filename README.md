
# Equipment Sharing Platform

A full-stack web application for managing equipment sharing and rentals. This platform allows users to browse, book, and manage equipment with features like QR code scanning, map integration, and UPI payments.

## Features

- 🔐 User Authentication & Role-based Access
- 📱 QR Code Scanning for Equipment
- 🗺️ Equipment Location Mapping
- 💳 UPI Payment Integration
- 📊 Inventory Management
- 📅 Equipment Booking System
- 💰 Operator Earnings Tracking
- 📍 Geolocation Features

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v16 or higher)
- Java JDK 11 or higher
- Maven
- Git

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Build the backend:
   ```powershell
   mvn clean install
   ```

3. Run the Spring Boot application:
   ```powershell
   mvn spring-boot:run
   ```
   The backend server will start on `http://localhost:8080`

### Frontend Setup

1. From the root directory, install dependencies:
   ```powershell
   npm install
   ```

2. Start the development server:
   ```powershell
   npm run dev
   ```
   The frontend will be available on `http://localhost:3000`

### Database Setup

The application uses H2 database with file persistence mode. The database will:
1. Automatically create required tables on first run
2. Initialize with sample data from `data.sql`
3. Persist data between application restarts
4. Store data in `backend/data/equipmentdb` file

To reset the database:
1. Stop the application
2. Delete the `backend/data` folder
3. Restart the application (it will recreate tables and load sample data)

## User Roles and Features

### Admin
- Manage inventory
- Add/remove equipment
- View all bookings
- Manage users
- Access analytics

### Operator
- Track earnings
- Manage equipment status
- Handle equipment handover
- Process returns
- View assigned bookings

### User
- Browse available equipment
- Book equipment
- Scan QR codes
- Make payments
- View equipment locations
- Track booking history

## Key Features Guide

### QR Code System
- Scan QR codes to quickly access equipment information
- Generate QR codes for new equipment
- Verify equipment during handover/return

### Map Integration
- View equipment locations on interactive maps
- Multiple map providers (Google Maps, OpenStreetMap)
- Location-based equipment search

### Payment System
- Integrated UPI payment gateway
- Secure transaction processing
- Payment status tracking
- Fine management

## Development Mode

The application includes a demo mode for testing features without a backend connection. To use demo mode:
1. The application automatically detects if the backend is unavailable
2. Demo data is loaded for testing features
3. All features remain functional with mock data

## Troubleshooting

### Common Issues

1. Backend Connection Issues
   - Verify the backend server is running on port 8080
   - Check if the database is properly initialized
   - Ensure no other service is using port 8080

2. Frontend Issues
   - Clear browser cache and reload
   - Check console for error messages
   - Verify all dependencies are installed

3. Database Issues
   - Check if H2 database file exists
   - Verify database credentials
   - Ensure proper database initialization

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please create an issue in the repository or contact the development team.  