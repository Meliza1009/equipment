import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  Users, 
  BarChart3,
  Settings,
  FileText,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from './ui/utils';

interface DashboardSidebarProps {
  onNavigate?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ onNavigate }) => {
  const location = useLocation();
  const { user } = useAuth();

  const userLinks = [
    { to: '/user', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/equipment', icon: Package, label: 'Browse Equipment' },
    { to: '/bookings', icon: Calendar, label: 'My Bookings' },
    { to: '/payments', icon: CreditCard, label: 'Payments' },
    { to: '/map', icon: MapPin, label: 'Nearby Equipment' },
    { to: '/feedback', icon: MessageSquare, label: 'Feedback' },
  ];

  const operatorLinks = [
    { to: '/operator', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/operator/equipment', icon: Package, label: 'My Equipment' },
    { to: '/operator/bookings', icon: Calendar, label: 'Booking Requests' },
    { to: '/operator/earnings', icon: CreditCard, label: 'Earnings' },
    { to: '/operator/reviews', icon: MessageSquare, label: 'Reviews' },
  ];

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Manage Users' },
    { to: '/admin/equipment', icon: Package, label: 'Equipment' },
    { to: '/admin/bookings', icon: Calendar, label: 'All Bookings' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { to: '/admin/reports', icon: FileText, label: 'Reports' },
  ];

  let links = userLinks;
  if (user?.role === 'operator') links = operatorLinks;
  if (user?.role === 'admin') links = adminLinks;

  return (
    <aside className="w-64 bg-white border-r h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
        
        <div className="pt-4 mt-4 border-t">
          <Link
            to="/settings"
            onClick={onNavigate}
            className={cn(
              'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
              location.pathname === '/settings'
                ? 'bg-green-50 text-green-700'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
};
