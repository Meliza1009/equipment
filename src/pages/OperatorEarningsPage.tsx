import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, IndianRupee, Calendar, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockBookings, mockEquipment } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const OperatorEarningsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('all');

  const operatorEquipment = mockEquipment.filter(e => e.operatorId === user?.id);
  const operatorBookings = mockBookings.filter(b => 
    operatorEquipment.some(e => e.id === b.equipmentId)
  );

  const totalEarnings = operatorBookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const pendingEarnings = operatorBookings
    .filter(b => b.paymentStatus === 'pending')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const thisMonthEarnings = operatorBookings
    .filter(b => b.paymentStatus === 'paid' && new Date(b.startDate).getMonth() === new Date().getMonth())
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const stats = [
    {
      title: 'Total Earnings',
      value: `₹${totalEarnings.toLocaleString()}`,
      icon: IndianRupee,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'This Month',
      value: `₹${thisMonthEarnings.toLocaleString()}`,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Pending',
      value: `₹${pendingEarnings.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Total Bookings',
      value: operatorBookings.length,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const handleExport = () => {
    toast.success('Earnings report exported successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={() => navigate('/operator')}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-gray-900 mt-4 mb-2">Earnings & Revenue</h1>
            <p className="text-gray-600">Track your earnings and financial performance</p>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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

        {/* Earnings by Equipment */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Earnings by Equipment</CardTitle>
            <CardDescription>Revenue breakdown by each equipment</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Total Bookings</TableHead>
                  <TableHead>Total Earnings</TableHead>
                  <TableHead>Average per Booking</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operatorEquipment.map((equipment) => {
                  const equipmentBookings = operatorBookings.filter(b => b.equipmentId === equipment.id);
                  const equipmentEarnings = equipmentBookings
                    .filter(b => b.paymentStatus === 'paid')
                    .reduce((sum, b) => sum + b.totalAmount, 0);
                  const avgEarnings = equipmentBookings.length > 0 
                    ? equipmentEarnings / equipmentBookings.length 
                    : 0;

                  return (
                    <TableRow key={equipment.id}>
                      <TableCell>{equipment.name}</TableCell>
                      <TableCell>{equipmentBookings.length}</TableCell>
                      <TableCell>₹{equipmentEarnings.toLocaleString()}</TableCell>
                      <TableCell>₹{avgEarnings.toFixed(0)}</TableCell>
                      <TableCell>
                        <Badge className={equipment.available ? 'bg-green-600' : 'bg-gray-600'}>
                          {equipment.available ? 'Available' : 'Booked'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Recent payments and earnings</CardDescription>
              </div>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operatorBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.startDate}</TableCell>
                    <TableCell>{booking.equipmentName}</TableCell>
                    <TableCell>{booking.userName}</TableCell>
                    <TableCell>{booking.duration} {booking.durationType}</TableCell>
                    <TableCell>₹{booking.totalAmount}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          booking.paymentStatus === 'paid'
                            ? 'bg-green-600'
                            : booking.paymentStatus === 'pending'
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                        }
                      >
                        {booking.paymentStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
