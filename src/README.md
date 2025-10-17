# Village Rent - Equipment Sharing Platform

A modern full-stack web application for sharing and renting agricultural equipment in villages. Built with React, TypeScript, Tailwind CSS, and ready to connect to Java Spring Boot backend.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**That's it!** The app works immediately in **Demo Mode** (no backend required).

### Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| User | `user@village.com` | anything |
| Operator | `operator@village.com` | anything |
| Admin | `admin@village.com` | anything |

---

## ✨ Features

### 🌾 For Users
- Browse equipment catalog with search & filters
- Book equipment by hour or day
- View equipment on map
- Make payments (Razorpay integration)
- Track booking history
- Submit feedback & ratings
- AI-powered recommendations

### 🚜 For Operators
- Manage equipment listings
- Approve/reject bookings
- Track earnings & analytics
- Respond to customer reviews
- QR code check-in/out

### 👨‍💼 For Admins
- Comprehensive analytics dashboard
- User & operator management
- Monitor all bookings
- Track platform revenue
- Generate reports

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** | Complete setup & installation guide |
| **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | Common issues & solutions |
| **[BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)** | Java Spring Boot API specification |
| **[INTEGRATION_EXAMPLE.md](./INTEGRATION_EXAMPLE.md)** | Code examples for API usage |
| **[FEATURES.md](./FEATURES.md)** | Detailed feature list |
| **[USER_FLOWS.md](./USER_FLOWS.md)** | User journey documentation |

---

## 🎯 Tech Stack

**Frontend:**
- ⚛️ React 18 + TypeScript
- ⚡ Vite
- 🎨 Tailwind CSS
- 🧩 Shadcn/ui Components
- 🧭 React Router DOM
- 📡 Axios

**Backend (Separate Project):**
- ☕ Java Spring Boot
- 🗄️ PostgreSQL/MongoDB
- 🔐 JWT Authentication
- 💳 Razorpay API
- 🗺️ Google Maps API
- 🔔 Firebase Cloud Messaging

---

## 🔧 Environment Setup

1. **Copy environment template:**
```bash
cp .env.example .env
```

2. **Configure `.env` (optional):**
```env
VITE_API_URL=http://localhost:8080/api
VITE_USE_MOCK_DATA=false
VITE_RAZORPAY_KEY=rzp_test_xxxxx
VITE_GOOGLE_MAPS_KEY=your_google_maps_key
```

3. **Restart server after changes:**
```bash
npm run dev
```

---

## 🌐 Demo Mode vs Backend Mode

### 📱 Demo Mode (Default - No Backend Required)
- ✅ Works immediately after `npm run dev`
- ✅ All features functional with mock data
- ✅ Perfect for testing & UI development
- ⚠️ Data doesn't persist after refresh
- 💡 Yellow banner shows you're in demo mode

### 🔌 Backend Mode (Java Spring Boot)
- ✅ Real data persistence
- ✅ Multi-user support
- ✅ Actual payment processing
- ✅ Real-time notifications
- 🔧 Requires backend setup (see BACKEND_INTEGRATION.md)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── AIRecommendations.tsx  # AI-powered suggestions
│   ├── DemoModeBanner.tsx     # Demo mode indicator
│   ├── Navbar.tsx             # Main navigation
│   └── DashboardSidebar.tsx   # Dashboard navigation
├── pages/
│   ├── LandingPage.tsx        # Home page
│   ├── LoginPage.tsx          # Authentication
│   ├── RegisterPage.tsx       # User registration
│   ├── EquipmentPage.tsx      # Equipment catalog
│   ├── BookingPage.tsx        # Create booking
│   ├── PaymentPage.tsx        # Payment processing
│   ├── UserDashboard.tsx      # User dashboard
│   ├── OperatorDashboard.tsx  # Operator dashboard
│   └── AdminDashboard.tsx     # Admin dashboard
├── services/
│   ├── authService.ts         # Authentication API
│   ├── equipmentService.ts    # Equipment API
│   ├── bookingService.ts      # Booking API
│   ├── paymentService.ts      # Payment API
│   └── adminService.ts        # Admin API
├── context/
│   └── AuthContext.tsx        # Auth state management
├── utils/
│   ├── axios.ts               # API client
│   ├── config.ts              # Configuration
│   └── mockData.ts            # Demo data
└── App.tsx                    # Main app & routing
```

---

## 🛠️ Development Commands

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Role-based access control (User/Operator/Admin)
- ✅ Protected routes
- ✅ Secure token storage
- ✅ Auto-logout on token expiration
- ✅ Input validation & sanitization

---

## 📱 Responsive Design

Fully responsive and tested on:
- 💻 Desktop (1920px+)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile (320px - 767px)

---

## 🚀 Backend Integration

### Quick Steps:

1. **Start your Java Spring Boot backend** on `http://localhost:8080`
2. **Ensure CORS allows** `http://localhost:5173`
3. **Implement REST APIs** from [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)
4. **Restart frontend** - it will auto-detect backend

### API Endpoints Required:

```
POST   /api/auth/login          # User login
POST   /api/auth/register       # User registration
GET    /api/equipment           # List equipment
POST   /api/bookings            # Create booking
POST   /api/payments/razorpay   # Payment processing
GET    /api/admin/analytics     # Analytics data
... (see BACKEND_INTEGRATION.md for complete list)
```

---

## 🧪 Testing Different Roles

### User Role
```bash
# Login as: user@village.com
# Access to: Browse, Book, Pay, Feedback
# Dashboard: /user
```

### Operator Role
```bash
# Login as: operator@village.com
# Access to: Manage Equipment, View Bookings, Earnings
# Dashboard: /operator
```

### Admin Role
```bash
# Login as: admin@village.com
# Access to: Full System, Analytics, User Management
# Dashboard: /admin
```

---

## 🐛 Troubleshooting

### Error: "Cannot read properties of undefined (reading 'VITE_API_URL')"

**Solution:**
```bash
# Create .env file
cp .env.example .env

# Restart server
npm run dev
```

### Error: "Network Error" on login

**Solution:** 
- Backend not running → App auto-switches to Demo Mode ✅
- Or start backend: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

**See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more issues & solutions**

---

## 📦 Key Dependencies

```json
{
  "react": "^18.3.1",
  "typescript": "^5.6.2",
  "tailwindcss": "^4.0.0",
  "axios": "^1.7.9",
  "react-router-dom": "^7.1.1",
  "recharts": "^2.15.0",
  "lucide-react": "^0.468.0",
  "sonner": "^2.0.3"
}
```

---

## 🎨 Features Highlights

- ✅ **Smart Demo Mode** - Works without backend
- ✅ **AI Recommendations** - ML-powered equipment suggestions
- ✅ **QR Code Support** - Check-in/out functionality
- ✅ **Payment Integration** - Razorpay ready
- ✅ **Map Visualization** - Google Maps integration
- ✅ **Real-time Updates** - Live booking status
- ✅ **Analytics Dashboard** - Comprehensive insights
- ✅ **Mobile Responsive** - Works on all devices

---

## 🔮 Future Enhancements

- [ ] Real-time chat
- [ ] Equipment comparison
- [ ] Dark mode
- [ ] PWA support
- [ ] Multi-language
- [ ] Advanced analytics
- [ ] Notification center
- [ ] Equipment maintenance tracking

---

## 📝 License

This project is created for educational purposes and village community support.

---

## 🤝 Support

- 📖 **Documentation Issues:** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- 🔧 **Backend Help:** See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)
- 💡 **Code Examples:** See [INTEGRATION_EXAMPLE.md](./INTEGRATION_EXAMPLE.md)

---

## ⭐ Project Status

- ✅ **Frontend:** Production-ready
- ✅ **API Services:** Implemented
- ✅ **Demo Mode:** Fully functional
- 🔄 **Backend:** Ready for integration
- 🔄 **Deployment:** Ready to deploy

---

**Built with ❤️ for village communities**

🚜 Happy Equipment Sharing! 🌾
