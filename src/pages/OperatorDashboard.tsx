import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, IndianRupee, Star, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { mockBookings, mockEquipment } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const OperatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const operatorEquipment = mockEquipment.filter(e => e.operatorId === user?.id);
  const operatorBookings = mockBookings.filter(b => 
    operatorEquipment.some(e => e.id === b.equipmentId)
  );
  
  const pendingBookings = operatorBookings.filter(b => b.status === 'pending');
  const confirmedBookings = operatorBookings.filter(b => b.status === 'confirmed');
  const totalEarnings = operatorBookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const stats = [
    { 
      title: 'Total Equipment', 
      value: operatorEquipment.length, 
      icon: Package, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      title: 'Pending Requests', 
      value: pendingBookings.length, 
      icon: Clock, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    { 
      title: 'Total Earnings', 
      value: `₹${totalEarnings}`, 
      icon: IndianRupee, 
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      title: 'Average Rating', 
      value: '4.5', 
      icon: Star, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
  ];

  const handleApprove = (bookingId: number) => {
    toast.success('Booking approved successfully');
  };

  const handleReject = (bookingId: number) => {
    toast.success('Booking rejected');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gray-900 mb-2">Operator Dashboard</h1>
        <p className="text-gray-600">Manage your equipment and bookings</p>
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
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => navigate('/operator/equipment/add')} className="h-auto py-6">
              <div className="flex flex-col items-center space-y-2">
                <Package className="h-6 w-6" />
                <span>Add Equipment</span>
              </div>
            </Button>
            <Button onClick={() => navigate('/operator/equipment')} variant="outline" className="h-auto py-6">
              <div className="flex flex-col items-center space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span>Manage Equipment</span>
              </div>
            </Button>
            <Button onClick={() => navigate('/operator/earnings')} variant="outline" className="h-auto py-6">
              <div className="flex flex-col items-center space-y-2">
                <IndianRupee className="h-6 w-6" />
                <span>View Earnings</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Booking Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Booking Requests</CardTitle>
          <CardDescription>Review and approve booking requests</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingBookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.equipmentName}</TableCell>
                    <TableCell>{booking.userName}</TableCell>
                    <TableCell>{booking.startDate}</TableCell>
                    <TableCell>{booking.duration} {booking.durationType}</TableCell>
                    <TableCell>₹{booking.totalAmount}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(booking.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReject(booking.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">No pending requests</h3>
              <p className="text-gray-600">You're all caught up!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Equipment */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Equipment</CardTitle>
              <CardDescription>Manage your listed equipment</CardDescription>
            </div>
            <Button onClick={() => navigate('/operator/equipment')}>View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {operatorEquipment.slice(0, 4).map((equipment) => (
              <div key={equipment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-gray-900">{equipment.name}</div>
                  <Badge className={equipment.available ? 'bg-green-600' : 'bg-gray-600'}>
                    {equipment.available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                <div className="text-gray-600 mb-2">{equipment.category}</div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-900">₹{equipment.pricePerHour}/hr</div>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
