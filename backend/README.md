# Equipment Sharing Backend (Spring Boot)

A production-ready Spring Boot backend with JWT authentication for the Equipment Sharing Platform frontend.

## Features

- ✅ **JWT Authentication**: Secure token-based authentication with 24-hour expiration
- ✅ **Password Hashing**: BCrypt encryption for user passwords
- ✅ **Role-Based Access Control**: USER, OPERATOR, and ADMIN roles
- ✅ **CORS Configuration**: Supports frontend origins
- ✅ **RESTful API**: Complete API matching frontend service requirements
- ✅ **In-Memory Storage**: Quick development without database setup

## Prerequisites

- Java 17+ installed
- Maven installed

## Quick Start

**PowerShell:**
```powershell
cd backend
mvn spring-boot:run
```

The server will start on **http://localhost:8080**

## Test Credentials

**Admin User (pre-seeded):**
- Email: `admin@example.com`
- Password: `admin123`

## API Documentation

See [JWT_TESTING_GUIDE.md](./JWT_TESTING_GUIDE.md) for detailed API testing examples and authentication flow.

### Key Endpoints

- `POST /auth/login` - Login with email/password, returns JWT token
- `POST /auth/register` - Register new user
- `GET /auth/profile` - Get current user profile (authenticated)
- `GET /equipment` - List all equipment (public)
- `POST /equipment` - Create equipment (OPERATOR/ADMIN only)
- `GET /bookings/my-bookings` - Get user's bookings (authenticated)
- `POST /bookings` - Create new booking (authenticated)
- `GET /admin/users` - Get all users (ADMIN only)

## Security

All authenticated endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

Get a token by calling `/auth/login` or `/auth/register`.

## Architecture

```
backend/
├── src/main/java/com/example/backend/
│   ├── controller/          # REST controllers
│   │   ├── AuthController.java
│   │   ├── EquipmentController.java
│   │   ├── BookingsController.java
│   │   ├── PaymentController.java
│   │   ├── NotificationsController.java
│   │   └── AdminController.java
│   ├── model/               # Domain models
│   │   ├── User.java
│   │   ├── Equipment.java
│   │   ├── Booking.java
│   │   ├── Payment.java
│   │   └── Notification.java
│   ├── security/            # JWT & Security config
│   │   ├── JwtUtil.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── SecurityConfig.java
│   └── store/               # In-memory data store
│       └── InMemoryDataStore.java
└── src/main/resources/
    └── application.properties
```

## Next Steps

- Replace in-memory store with Spring Data JPA + H2/PostgreSQL
- Add request/response validation with @Valid annotations
- Implement comprehensive unit and integration tests
- Add API documentation with Swagger/OpenAPI
- Implement refresh token mechanism
- Add rate limiting and additional security measures

## Notes

- This backend uses an in-memory store and is not production-ready as-is
- JWT secret key is generated at runtime (use environment variable in production)
- Data will be lost when the server restarts

