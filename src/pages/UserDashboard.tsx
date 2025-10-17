import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, CreditCard, Star, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { mockBookings } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import { AIRecommendations } from '../components/AIRecommendations';

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userBookings = mockBookings.filter(b => b.userId === user?.id);
  const activeBookings = userBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const completedBookings = userBookings.filter(b => b.status === 'completed');
  const totalSpent = userBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  const stats = [
    { 
      title: 'Active Bookings', 
      value: activeBookings.length, 
      icon: Calendar, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      title: 'Completed', 
      value: completedBookings.length, 
      icon: Package, 
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      title: 'Total Spent', 
      value: `₹${totalSpent}`, 
      icon: CreditCard, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    { 
      title: 'Avg Rating Given', 
      value: '4.5', 
      icon: Star, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'completed':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's what's happening with your bookings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>What would you like to do today?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => navigate('/equipment')} className="h-auto py-6">
              <div className="flex flex-col items-center space-y-2">
                <Package className="h-6 w-6" />
                <span>Browse Equipment</span>
              </div>
            </Button>
            <Button onClick={() => navigate('/bookings')} variant="outline" className="h-auto py-6">
              <div className="flex flex-col items-center space-y-2">
                <Calendar className="h-6 w-6" />
                <span>My Bookings</span>
              </div>
            </Button>
            <Button onClick={() => navigate('/map')} variant="outline" className="h-auto py-6">
              <div className="flex flex-col items-center space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span>Nearby Equipment</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <AIRecommendations />

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Your latest equipment rentals</CardDescription>
        </CardHeader>
        <CardContent>
          {userBookings.length > 0 ? (
            <div className="space-y-4">
              {userBookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-900">{booking.equipmentName}</div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-gray-600 mt-2">
                      <Clock className="h-4 w-4 mr-2" />
                      {booking.startDate} • {booking.duration} {booking.durationType}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 mb-1">₹{booking.totalAmount}</div>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/bookings/${booking.id}`)}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-4">Start by browsing available equipment</p>
              <Button onClick={() => navigate('/equipment')}>Browse Equipment</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
