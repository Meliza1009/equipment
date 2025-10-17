import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'operator' | 'admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user) {
    // Convert both to lowercase for comparison
    const userRole = user.role?.toLowerCase();
    if (!allowedRoles.includes(userRole as any)) {
      return <Navigate to={`/${userRole}`} replace />;
    }
  }

  return <>{children}</>;
};
