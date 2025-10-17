import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Building, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner@2.0.3';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const storedBooking = sessionStorage.getItem('currentBooking');
    if (storedBooking) {
      setBooking(JSON.parse(storedBooking));
    } else {
      navigate('/equipment');
    }
  }, [navigate]);

  const handlePayment = async () => {
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Mock Razorpay integration
      if (paymentMethod === 'razorpay') {
        // In production, you would initialize Razorpay here
        // const options = {
        //   key: 'YOUR_RAZORPAY_KEY',
        //   amount: booking.totalAmount * 100,
        //   currency: 'INR',
        //   name: 'VillageRent',
        //   description: booking.equipmentName,
        //   handler: function (response) {
        //     // Handle success
        //   }
        // };
        // const rzp = new window.Razorpay(options);
        // rzp.open();
      }

      // Mock success
      sessionStorage.removeItem('currentBooking');
      sessionStorage.setItem('lastBooking', JSON.stringify({ ...booking, paymentStatus: 'paid', status: 'confirmed' }));
      toast.success('Payment successful!');
      navigate('/payment/success');
      setProcessing(false);
    }, 2000);
  };

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-gray-900 mb-8">Complete Payment</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Payment Method */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                            <div>
                              <div>Razorpay</div>
                              <div className="text-gray-500">Cards, UPI, Wallets & More</div>
                            </div>
                          </div>
                          <img 
                            src="https://razorpay.com/assets/razorpay-glyph.svg" 
                            alt="Razorpay"
                            className="h-6"
                          />
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Wallet className="h-5 w-5 text-purple-600" />
                          <div>
                            <div>UPI</div>
                            <div className="text-gray-500">Pay using UPI ID</div>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking" className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Building className="h-5 w-5 text-green-600" />
                          <div>
                            <div>Net Banking</div>
                            <div className="text-gray-500">Pay via your bank</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {paymentMethod === 'upi' && (
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label>UPI ID</Label>
                      <Input placeholder="yourname@upi" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cancellation Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-gray-600">
                <p>• Free cancellation up to 24 hours before booking time</p>
                <p>• 50% refund for cancellations within 24 hours</p>
                <p>• No refund for cancellations after booking time</p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-gray-900 mb-1">{booking.equipmentName}</div>
                  <div className="text-gray-500">
                    {booking.durationType === 'hours' ? 'Hourly Rental' : 'Daily Rental'}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Date</span>
                    <span>{booking.startDate}</span>
                  </div>
                  {booking.durationType === 'hours' && (
                    <div className="flex justify-between">
                      <span>Time</span>
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span>{booking.duration} {booking.durationType}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Rental charges</span>
                    <span>₹{booking.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Service fee</span>
                    <span>₹{Math.round(booking.totalAmount * 0.05)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span>₹{Math.round(booking.totalAmount * 0.18)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-gray-900">
                    <span>Total Amount</span>
                    <span>₹{Math.round(booking.totalAmount * 1.23)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : `Pay ₹${Math.round(booking.totalAmount * 1.23)}`}
                </Button>

                <p className="text-center text-gray-500">
                  Your payment is secure and encrypted
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const lastBooking = sessionStorage.getItem('lastBooking');
    if (lastBooking) {
      setBooking(JSON.parse(lastBooking));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-gray-900">Payment Successful!</h2>
            <p className="text-gray-600">
              Your booking has been confirmed. You will receive a confirmation email shortly.
            </p>
            
            {booking && (
              <Card className="bg-gray-50">
                <CardContent className="pt-6 space-y-2 text-left">
                  <div className="flex justify-between text-gray-600">
                    <span>Booking ID</span>
                    <span className="text-gray-900">#{Math.floor(Math.random() * 100000)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Equipment</span>
                    <span className="text-gray-900">{booking.equipmentName}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Date</span>
                    <span className="text-gray-900">{booking.startDate}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Total Paid</span>
                    <span className="text-gray-900">₹{Math.round(booking.totalAmount * 1.23)}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2 pt-4">
              <Button className="w-full" onClick={() => navigate('/bookings')}>
                View My Bookings
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/equipment')}>
                Browse More Equipment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
