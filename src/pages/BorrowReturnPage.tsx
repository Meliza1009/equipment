import React, { useState } from 'react';
import { Package, Clock, MapPin, CheckCircle, AlertCircle, Calendar, Camera, FileText, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { useNavigate } from 'react-router-dom';

interface BorrowedItem {
  id: number;
  equipmentName: string;
  equipmentImage: string;
  bookingId: string;
  borrowDate: string;
  returnDate: string;
  dueDate: string;
  status: 'active' | 'overdue' | 'returned' | 'pending_pickup';
  location: string;
  operator: string;
  condition: 'excellent' | 'good' | 'fair';
  securityDeposit: number;
  rentalCost: number;
}

export const BorrowReturnPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('active');
  const [returnNotes, setReturnNotes] = useState('');
  const [reportIssue, setReportIssue] = useState('');

  const borrowedItems: BorrowedItem[] = [
    {
      id: 1,
      equipmentName: 'Tractor - John Deere 5050D',
      equipmentImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      bookingId: 'BK10245',
      borrowDate: '2025-10-10 09:00',
      returnDate: '',
      dueDate: '2025-10-16 18:00',
      status: 'active',
      location: 'Rampur Village',
      operator: 'Ramesh Kumar',
      condition: 'excellent',
      securityDeposit: 5000,
      rentalCost: 1500
    },
    {
      id: 2,
      equipmentName: 'Harvester - New Holland',
      equipmentImage: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400',
      bookingId: 'BK10123',
      borrowDate: '2025-10-05 14:00',
      returnDate: '',
      dueDate: '2025-10-13 18:00',
      status: 'overdue',
      location: 'Sitapur Village',
      operator: 'Priya Singh',
      condition: 'good',
      securityDeposit: 8000,
      rentalCost: 2500
    },
    {
      id: 3,
      equipmentName: 'Water Pump - Kirloskar',
      equipmentImage: 'https://images.unsplash.com/photo-1581094794329-c8112c4e5190?w=400',
      bookingId: 'BK10198',
      borrowDate: '2025-10-08 10:00',
      returnDate: '',
      dueDate: '2025-10-17 17:00',
      status: 'pending_pickup',
      location: 'Bharatpur Village',
      operator: 'Amit Patel',
      condition: 'excellent',
      securityDeposit: 2000,
      rentalCost: 500
    }
  ];

  const returnedItems: BorrowedItem[] = [
    {
      id: 4,
      equipmentName: 'Cultivator',
      equipmentImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400',
      bookingId: 'BK10056',
      borrowDate: '2025-09-28 08:00',
      returnDate: '2025-10-02 16:30',
      dueDate: '2025-10-02 18:00',
      status: 'returned',
      location: 'Rampur Village',
      operator: 'Suresh Yadav',
      condition: 'good',
      securityDeposit: 3000,
      rentalCost: 800
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'overdue':
        return <Badge className="bg-red-600">Overdue</Badge>;
      case 'pending_pickup':
        return <Badge className="bg-yellow-600">Pending Pickup</Badge>;
      case 'returned':
        return <Badge className="bg-gray-600">Returned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return <Badge variant="outline" className="border-green-600 text-green-600">Excellent</Badge>;
      case 'good':
        return <Badge variant="outline" className="border-blue-600 text-blue-600">Good</Badge>;
      case 'fair':
        return <Badge variant="outline" className="border-yellow-600 text-yellow-600">Fair</Badge>;
      default:
        return <Badge variant="outline">{condition}</Badge>;
    }
  };

  const calculateDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));
    return diff;
  };

  const calculateTimeProgress = (borrowDate: string, dueDate: string) => {
    const start = new Date(borrowDate).getTime();
    const end = new Date(dueDate).getTime();
    const now = new Date().getTime();
    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const handleInitiateReturn = (item: BorrowedItem) => {
    toast.success('Return initiated! Please deliver the equipment to the operator.');
  };

  const handleExtendRental = (item: BorrowedItem) => {
    toast.success('Extension request sent to operator for approval.');
  };

  const handleReportIssue = (item: BorrowedItem) => {
    if (!reportIssue.trim()) {
      toast.error('Please describe the issue');
      return;
    }
    toast.success('Issue reported successfully! Operator will contact you soon.');
    setReportIssue('');
  };

  const handleViewReceipt = (bookingId: string) => {
    navigate(`/bookings/${bookingId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Borrow & Return Tracking</h1>
          <p className="text-gray-600">Monitor your borrowed equipment and manage returns</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Rentals</p>
                  <p className="text-2xl text-gray-900 mt-1">2</p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overdue</p>
                  <p className="text-2xl text-red-600 mt-1">1</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Pickup</p>
                  <p className="text-2xl text-yellow-600 mt-1">1</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Deposit</p>
                  <p className="text-2xl text-gray-900 mt-1">₹15,000</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="active">
              Active ({borrowedItems.filter(i => i.status !== 'returned').length})
            </TabsTrigger>
            <TabsTrigger value="history">
              History ({returnedItems.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending Pickup (1)
            </TabsTrigger>
          </TabsList>

          {/* Active Rentals Tab */}
          <TabsContent value="active" className="space-y-6">
            {borrowedItems.filter(item => item.status === 'active' || item.status === 'overdue').map((item) => {
              const daysRemaining = calculateDaysRemaining(item.dueDate);
              const timeProgress = calculateTimeProgress(item.borrowDate, item.dueDate);
              
              return (
                <Card key={item.id} className={item.status === 'overdue' ? 'border-red-300 bg-red-50/30' : ''}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Equipment Image */}
                      <div className="w-full md:w-48 flex-shrink-0">
                        <ImageWithFallback
                          src={item.equipmentImage}
                          alt={item.equipmentName}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-gray-900 mb-1">{item.equipmentName}</h3>
                            <p className="text-sm text-gray-600">Booking ID: {item.bookingId}</p>
                          </div>
                          {getStatusBadge(item.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <div>
                              <p>Borrowed</p>
                              <p className="text-gray-900">{new Date(item.borrowDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <div>
                              <p>Due Date</p>
                              <p className={item.status === 'overdue' ? 'text-red-600' : 'text-gray-900'}>
                                {new Date(item.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <div>
                              <p>Location</p>
                              <p className="text-gray-900">{item.location}</p>
                            </div>
                          </div>
                        </div>

                        {/* Time Progress */}
                        <div>
                          <div className="flex items-center justify-between mb-2 text-sm">
                            <span className="text-gray-600">Rental Period Progress</span>
                            <span className={daysRemaining < 2 && daysRemaining >= 0 ? 'text-yellow-600' : daysRemaining < 0 ? 'text-red-600' : 'text-gray-900'}>
                              {daysRemaining >= 0 ? `${daysRemaining} days left` : `${Math.abs(daysRemaining)} days overdue`}
                            </span>
                          </div>
                          <Progress 
                            value={timeProgress} 
                            className={`h-2 ${item.status === 'overdue' ? '[&>div]:bg-red-600' : ''}`}
                          />
                        </div>

                        {/* Condition & Costs */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Condition: </span>
                            {getConditionBadge(item.condition)}
                          </div>
                          <Separator orientation="vertical" className="h-6" />
                          <div>
                            <span className="text-gray-600">Security Deposit: </span>
                            <span className="text-gray-900">₹{item.securityDeposit}</span>
                          </div>
                          <Separator orientation="vertical" className="h-6" />
                          <div>
                            <span className="text-gray-600">Rental Cost: </span>
                            <span className="text-gray-900">₹{item.rentalCost}</span>
                          </div>
                        </div>

                        {/* Operator Info */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                              {item.operator.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm">Operator</p>
                              <p className="text-sm text-gray-900">{item.operator}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Contact
                          </Button>
                        </div>

                        {item.status === 'overdue' && (
                          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-red-900">
                                  This rental is overdue! Please return the equipment immediately to avoid additional late fees.
                                </p>
                                <p className="text-xs text-red-700 mt-1">
                                  Late fee: ₹200/day (₹{Math.abs(daysRemaining) * 200} accumulated)
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Button onClick={() => handleInitiateReturn(item)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Initiate Return
                          </Button>
                          <Button variant="outline" onClick={() => handleExtendRental(item)}>
                            <Clock className="h-4 w-4 mr-2" />
                            Extend Rental
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Report Issue
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Report Issue</DialogTitle>
                                <DialogDescription>
                                  Describe any problems with the equipment
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="issue">Issue Description</Label>
                                  <Textarea
                                    id="issue"
                                    rows={4}
                                    value={reportIssue}
                                    onChange={(e) => setReportIssue(e.target.value)}
                                    placeholder="Describe the issue..."
                                  />
                                </div>
                                <Button onClick={() => handleReportIssue(item)} className="w-full">
                                  Submit Report
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" onClick={() => handleViewReceipt(item.bookingId)}>
                            View Receipt
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {returnedItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-32 flex-shrink-0">
                      <ImageWithFallback
                        src={item.equipmentImage}
                        alt={item.equipmentName}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-gray-900">{item.equipmentName}</h3>
                          <p className="text-sm text-gray-600">Booking ID: {item.bookingId}</p>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <p>Borrowed</p>
                          <p className="text-gray-900">{new Date(item.borrowDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p>Returned</p>
                          <p className="text-gray-900">{new Date(item.returnDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p>Total Cost</p>
                          <p className="text-gray-900">₹{item.rentalCost}</p>
                        </div>
                        <div>
                          <p>Deposit Status</p>
                          <p className="text-green-600">Refunded</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" onClick={() => handleViewReceipt(item.bookingId)}>
                          View Receipt
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Pending Pickup Tab */}
          <TabsContent value="pending" className="space-y-4">
            {borrowedItems.filter(item => item.status === 'pending_pickup').map((item) => (
              <Card key={item.id} className="border-yellow-300 bg-yellow-50/30">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-48 flex-shrink-0">
                      <ImageWithFallback
                        src={item.equipmentImage}
                        alt={item.equipmentName}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-gray-900 mb-1">{item.equipmentName}</h3>
                          <p className="text-sm text-gray-600">Booking ID: {item.bookingId}</p>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                      
                      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg mb-4">
                        <p className="text-sm text-yellow-900">
                          Your booking is confirmed! Please pick up the equipment from the operator by {new Date(item.borrowDate).toLocaleString()}.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <div>
                            <p>Pickup Location</p>
                            <p className="text-gray-900">{item.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <div>
                            <p>Pickup Time</p>
                            <p className="text-gray-900">{new Date(item.borrowDate).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-lg mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            {item.operator.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm">Operator</p>
                            <p className="text-sm text-gray-900">{item.operator}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Call Operator
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        <Button>
                          <MapPin className="h-4 w-4 mr-2" />
                          Get Directions
                        </Button>
                        <Button variant="outline" onClick={() => handleViewReceipt(item.bookingId)}>
                          View Booking
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
