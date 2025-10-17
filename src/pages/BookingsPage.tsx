import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { mockBookings } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';

export const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const userBookings = mockBookings.filter(b => b.userId === user?.id);

  const activeBookings = userBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = userBookings.filter(b => b.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'completed':
        return 'bg-blue-600';
      case 'cancelled':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-gray-900 mb-2">{booking.equipmentName}</CardTitle>
            <Badge className={getStatusColor(booking.status)}>
              {booking.status.toUpperCase()}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-gray-500">Booking ID</div>
            <div className="text-gray-900">#{booking.id}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start space-x-2">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-gray-500">Date</div>
              <div className="text-gray-900">{booking.startDate}</div>
              {booking.endDate !== booking.startDate && (
                <div className="text-gray-900">to {booking.endDate}</div>
              )}
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-gray-500">Duration</div>
              <div className="text-gray-900">
                {booking.duration} {booking.durationType}
              </div>
              {booking.durationType === 'hours' && (
                <div className="text-gray-900">{booking.startTime} - {booking.endTime}</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <div className="text-gray-500">Total Amount</div>
            <div className="text-gray-900">₹{booking.totalAmount}</div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Invoice
            </Button>
            <Button size="sm">View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage and track your equipment rentals</p>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">
              Active Bookings ({activeBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Bookings ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeBookings.length > 0 ? (
              <div className="grid gap-6">
                {activeBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-gray-900 mb-2">No active bookings</h3>
                  <p className="text-gray-600 mb-4">You don't have any active bookings at the moment</p>
                  <Button>Browse Equipment</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {pastBookings.length > 0 ? (
              <div className="grid gap-6">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-gray-900 mb-2">No past bookings</h3>
                  <p className="text-gray-600">Your completed bookings will appear here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
