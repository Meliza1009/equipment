import React, { useState } from 'react';
import { AlertCircle, CreditCard, Calendar, FileText, CheckCircle, Clock, XCircle, TrendingDown, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner@2.0.3';
import { useNavigate } from 'react-router-dom';

interface Fine {
  id: number;
  bookingId: string;
  equipmentName: string;
  type: 'late_return' | 'damage' | 'lost' | 'policy_violation';
  amount: number;
  status: 'pending' | 'paid' | 'waived' | 'disputed';
  dueDate: string;
  issuedDate: string;
  paidDate?: string;
  description: string;
  daysOverdue?: number;
  dailyRate?: number;
}

export const FinesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const fines: Fine[] = [
    {
      id: 1,
      bookingId: 'BK10123',
      equipmentName: 'Harvester - New Holland',
      type: 'late_return',
      amount: 400,
      status: 'pending',
      dueDate: '2025-10-20',
      issuedDate: '2025-10-13',
      description: 'Equipment returned 2 days late',
      daysOverdue: 2,
      dailyRate: 200
    },
    {
      id: 2,
      bookingId: 'BK10089',
      equipmentName: 'Tractor - John Deere 5050D',
      type: 'damage',
      amount: 1500,
      status: 'pending',
      dueDate: '2025-10-18',
      issuedDate: '2025-10-11',
      description: 'Minor damage to hydraulic system'
    },
    {
      id: 3,
      bookingId: 'BK10045',
      equipmentName: 'Water Pump - Kirloskar',
      type: 'late_return',
      amount: 200,
      status: 'paid',
      dueDate: '2025-10-08',
      issuedDate: '2025-10-02',
      paidDate: '2025-10-07',
      description: 'Equipment returned 1 day late',
      daysOverdue: 1,
      dailyRate: 200
    },
    {
      id: 4,
      bookingId: 'BK09987',
      equipmentName: 'Cultivator',
      type: 'late_return',
      amount: 300,
      status: 'waived',
      dueDate: '2025-09-25',
      issuedDate: '2025-09-20',
      description: 'Waived due to operator delay',
      daysOverdue: 1,
      dailyRate: 300
    }
  ];

  const filteredFines = filterStatus === 'all' 
    ? fines 
    : fines.filter(f => f.status === filterStatus);

  const totalPending = fines
    .filter(f => f.status === 'pending')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalPaid = fines
    .filter(f => f.status === 'paid')
    .reduce((sum, f) => sum + f.amount, 0);

  const pendingCount = fines.filter(f => f.status === 'pending').length;

  const getFineTypeLabel = (type: string) => {
    switch (type) {
      case 'late_return':
        return 'Late Return';
      case 'damage':
        return 'Damage Fee';
      case 'lost':
        return 'Lost Equipment';
      case 'policy_violation':
        return 'Policy Violation';
      default:
        return type;
    }
  };

  const getFineTypeBadge = (type: string) => {
    switch (type) {
      case 'late_return':
        return <Badge variant="outline" className="border-yellow-600 text-yellow-600">Late Return</Badge>;
      case 'damage':
        return <Badge variant="outline" className="border-red-600 text-red-600">Damage</Badge>;
      case 'lost':
        return <Badge variant="outline" className="border-purple-600 text-purple-600">Lost</Badge>;
      case 'policy_violation':
        return <Badge variant="outline" className="border-orange-600 text-orange-600">Violation</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-600">Pending</Badge>;
      case 'paid':
        return <Badge className="bg-green-600">Paid</Badge>;
      case 'waived':
        return <Badge className="bg-blue-600">Waived</Badge>;
      case 'disputed':
        return <Badge className="bg-orange-600">Disputed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handlePayFine = (fine: Fine) => {
    setSelectedFine(fine);
    setShowPaymentDialog(true);
  };

  const handleConfirmPayment = () => {
    toast.success('Payment processed successfully!');
    setShowPaymentDialog(false);
    setSelectedFine(null);
  };

  const handleDisputeFine = (fine: Fine) => {
    toast.success('Dispute submitted! Admin will review your case.');
  };

  const handlePayAll = () => {
    if (totalPending === 0) {
      toast.error('No pending fines to pay');
      return;
    }
    toast.success(`Processing payment of ₹${totalPending}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Fines & Penalties</h1>
          <p className="text-gray-600">Manage your outstanding fines and payment history</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-yellow-300 bg-yellow-50/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Fines</p>
                  <p className="text-3xl text-yellow-600 mt-2">₹{totalPending}</p>
                  <p className="text-xs text-gray-600 mt-1">{pendingCount} fine{pendingCount !== 1 ? 's' : ''}</p>
                </div>
                <AlertCircle className="h-12 w-12 text-yellow-600" />
              </div>
              {totalPending > 0 && (
                <Button className="w-full mt-4" onClick={handlePayAll}>
                  Pay All Pending
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-3xl text-green-600 mt-2">₹{totalPaid}</p>
                  <p className="text-xs text-gray-600 mt-1">Lifetime</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Fines</p>
                  <p className="text-3xl text-gray-900 mt-2">{fines.length}</p>
                  <p className="text-xs text-gray-600 mt-1">All time</p>
                </div>
                <FileText className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fine Policy Info */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-gray-900 mb-2">Fine Policy</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• <strong>Late Returns:</strong> ₹200 per day after due date</li>
                  <li>• <strong>Equipment Damage:</strong> Repair cost + 20% handling fee</li>
                  <li>• <strong>Lost Equipment:</strong> Full replacement cost</li>
                  <li>• <strong>Payment:</strong> All fines must be cleared before next booking</li>
                  <li>• <strong>Disputes:</strong> Submit within 7 days of fine issue</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Fine History</h2>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fines</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="waived">Waived</SelectItem>
              <SelectItem value="disputed">Disputed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fines Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Issued Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFines.length > 0 ? (
                    filteredFines.map((fine) => (
                      <TableRow key={fine.id}>
                        <TableCell>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto"
                            onClick={() => navigate(`/bookings/${fine.bookingId}`)}
                          >
                            {fine.bookingId}
                          </Button>
                        </TableCell>
                        <TableCell className="text-gray-900">{fine.equipmentName}</TableCell>
                        <TableCell>{getFineTypeBadge(fine.type)}</TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm text-gray-600 truncate">{fine.description}</p>
                          {fine.daysOverdue && (
                            <p className="text-xs text-gray-500 mt-1">
                              {fine.daysOverdue} day{fine.daysOverdue > 1 ? 's' : ''} @ ₹{fine.dailyRate}/day
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-900">₹{fine.amount}</TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(fine.issuedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(fine.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {fine.status === 'pending' && (
                              <>
                                <Button size="sm" onClick={() => handlePayFine(fine)}>
                                  Pay Now
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDisputeFine(fine)}
                                >
                                  Dispute
                                </Button>
                              </>
                            )}
                            {fine.status === 'paid' && (
                              <Button size="sm" variant="outline">
                                View Receipt
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No fines found</p>
                        <p className="text-sm text-gray-500">Keep up the good work!</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pay Fine</DialogTitle>
              <DialogDescription>
                Confirm payment for this fine
              </DialogDescription>
            </DialogHeader>
            
            {selectedFine && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Booking ID</span>
                    <span className="text-sm text-gray-900">{selectedFine.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Equipment</span>
                    <span className="text-sm text-gray-900">{selectedFine.equipmentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Fine Type</span>
                    <span className="text-sm text-gray-900">{getFineTypeLabel(selectedFine.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Description</span>
                    <span className="text-sm text-gray-900">{selectedFine.description}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-xl text-gray-900">₹{selectedFine.amount}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <Select defaultValue="upi">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                      <SelectItem value="wallet">Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmPayment}>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay ₹{selectedFine?.amount}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
