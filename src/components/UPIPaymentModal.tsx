import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { QRCodeCanvas } from 'qrcode.react';
import { CheckCircle2, Copy, Loader2, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface UPIPaymentModalProps {
  open: boolean;
  onClose: () => void;
  equipmentName: string;
  operatorName: string;
  operatorUpiId: string;
  amount: number;
  onPaymentComplete: () => void;
}

export const UPIPaymentModal: React.FC<UPIPaymentModalProps> = ({
  open,
  onClose,
  equipmentName,
  operatorName,
  operatorUpiId,
  amount,
  onPaymentComplete,
}) => {
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Generate fake UPI payment string
  const upiString = `upi://pay?pa=${operatorUpiId}&pn=${encodeURIComponent(operatorName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Payment for ${equipmentName}`)}`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(operatorUpiId);
    toast.success('UPI ID copied to clipboard!');
  };

  const simulatePayment = () => {
    setProcessing(true);
    
    // Simulate payment processing (3 seconds)
    setTimeout(() => {
      const fakeTransactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
      setTransactionId(fakeTransactionId);
      setPaymentSuccess(true);
      setProcessing(false);
      toast.success('Payment successful!');
      
      // Call parent callback after 2 seconds
      setTimeout(() => {
        onPaymentComplete();
      }, 2000);
    }, 3000);
  };

  const handleClose = () => {
    if (!processing) {
      onClose();
      // Reset state after modal closes
      setTimeout(() => {
        setPaymentSuccess(false);
        setTransactionId('');
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {!paymentSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-green-600" />
                Pay with UPI
              </DialogTitle>
              <DialogDescription>
                Scan QR code or use UPI ID to complete payment
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Equipment Details */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Equipment:</span>
                      <span className="font-semibold">{equipmentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Operator:</span>
                      <span className="font-semibold">{operatorName}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-900 font-semibold">Total Amount:</span>
                      <span className="text-2xl font-bold text-green-600">₹{amount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* UPI QR Code */}
              <div className="flex flex-col items-center space-y-3 py-4 bg-white border rounded-lg">
                <p className="text-sm text-gray-600">Scan with any UPI app</p>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <QRCodeCanvas
                    value={upiString}
                    size={180}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>Google Pay</span>
                  <span>•</span>
                  <span>PhonePe</span>
                  <span>•</span>
                  <span>Paytm</span>
                  <span>•</span>
                  <span>BHIM</span>
                </div>
              </div>

              {/* UPI ID with Copy Button */}
              <div className="space-y-2">
                <Label>Or pay using UPI ID</Label>
                <div className="flex gap-2">
                  <Input
                    value={operatorUpiId}
                    readOnly
                    className="flex-1 bg-gray-50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyUpiId}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Simulate Payment Button (for demo) */}
              <div className="pt-4 border-t">
                <Button
                  className="w-full"
                  onClick={simulatePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    'Simulate Payment (Demo)'
                  )}
                </Button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  In production, payment will be verified automatically
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
                Payment Successful!
              </DialogTitle>
              <DialogDescription>
                Your booking has been confirmed
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-sm font-semibold">{transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="text-lg font-bold text-green-600">₹{amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid to:</span>
                      <span className="font-semibold">{operatorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">UPI ID:</span>
                      <span className="text-sm">{operatorUpiId}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-blue-900">
                  Booking confirmed! Check your bookings page for details.
                </p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
