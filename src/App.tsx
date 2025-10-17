import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { DemoModeBanner } from './components/DemoModeBanner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { EquipmentDetailsPage } from './pages/EquipmentDetailsPage';
import { BookingPage } from './pages/BookingPage';
import { PaymentPage, PaymentSuccessPage } from './pages/PaymentPage';
import { BookingsPage } from './pages/BookingsPage';
import { BorrowReturnPage } from './pages/BorrowReturnPage';
import { FinesPage } from './pages/FinesPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { ReportProblemPage } from './pages/ReportProblemPage';
import { MapPage } from './pages/MapPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { HelpPage } from './pages/HelpPage';
import { UserDashboard } from './pages/UserDashboard';
import { OperatorDashboard } from './pages/OperatorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { InventoryManagementPage } from './pages/InventoryManagementPage';
import QRScanPage from './pages/QRScanPage';
import { OperatorEquipmentPage } from './pages/OperatorEquipmentPage';
import { AddEquipmentPage } from './pages/AddEquipmentPage';
import { OperatorEarningsPage } from './pages/OperatorEarningsPage';

// Dashboard redirect component
const DashboardRedirect: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Convert role to lowercase for routing
  const role = user.role?.toLowerCase() || 'user';
  return <Navigate to={`/${role}`} replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <DemoModeBanner />
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route element={<MainLayout><LandingPage /></MainLayout>} path="/" />
          <Route element={<LoginPage />} path="/login" />
          <Route element={<RegisterPage />} path="/register" />
          <Route element={<MainLayout><HelpPage /></MainLayout>} path="/help" />
          
          {/* Protected Equipment Routes */}
          <Route 
            path="/equipment" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <EquipmentPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/equipment/:id" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <EquipmentDetailsPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/map" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <MapPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            } 
          />
          
          {/* User Dashboard */}
          <Route 
            path="/user" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <DashboardLayout>
                  <UserDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Operator Dashboard */}
          <Route 
            path="/operator" 
            element={
              <ProtectedRoute allowedRoles={['operator']}>
                <DashboardLayout>
                  <OperatorDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Dashboard */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Booking Routes */}
          <Route 
            path="/booking/:id" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <BookingPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <PaymentPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/payment/success" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <PaymentSuccessPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <BookingsPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/feedback" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <FeedbackPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <NotificationsPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/borrow-return" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <BorrowReturnPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/fines" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <FinesPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/report-problem" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ReportProblemPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/operator/inventory" 
            element={
              <ProtectedRoute allowedRoles={['operator']}>
                <MainLayout>
                  <InventoryManagementPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/operator/equipment" 
            element={
              <ProtectedRoute allowedRoles={['operator']}>
                <DashboardLayout>
                  <OperatorEquipmentPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/operator/equipment/add" 
            element={
              <ProtectedRoute allowedRoles={['operator']}>
                <DashboardLayout>
                  <AddEquipmentPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/operator/earnings" 
            element={
              <ProtectedRoute allowedRoles={['operator']}>
                <DashboardLayout>
                  <OperatorEarningsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* QR Scan Route */}
          <Route 
            path="/qr-scan" 
            element={
              <ProtectedRoute>
                <QRScanPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <Toaster />
      </Router>
    </AuthProvider>
  );
}
