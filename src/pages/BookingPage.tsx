import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Star, User, IndianRupee } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Separator } from '../components/ui/separator';
import { mockEquipment } from '../utils/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { UPIPaymentModal } from '../components/UPIPaymentModal';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { equipmentService } from '../services';

export const BookingPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [durationType, setDurationType] = useState<'hours' | 'days'>('hours');
  const [duration, setDuration] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  // Load equipment from backend
  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const data = await equipmentService.getEquipmentById(Number(id));
        setEquipment(data);
      } catch (error) {
        console.error('Failed to load equipment:', error);
        toast.error('Failed to load equipment details');
      } finally {
        setLoading(false);
      }
    };
    loadEquipment();
  }, [id]);

  if (loading || !equipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>{loading ? 'Loading...' : 'Equipment Not Found'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {loading ? 'Please wait...' : "The equipment you're looking for doesn't exist."}
            </p>
          </CardContent>
          {!loading && (
            <CardFooter>
              <Button onClick={() => navigate('/equipment')}>Browse Equipment</Button>
            </CardFooter>
          )}
        </Card>
      </div>
    );
  }

  const calculateTotal = () => {
    if (durationType === 'hours') {
      return equipment.pricePerHour * duration;
    } else {
      return equipment.pricePerDay * duration;
    }
  };

  const handleBooking = () => {
    if (!startDate) {
      toast.error('Please select a start date');
      return;
    }

    if (durationType === 'days' && !endDate) {
      toast.error('Please select an end date');
      return;
    }

    // Check if operator has UPI ID
    if (!equipment.owner?.upiId) {
      toast.error('Operator UPI ID not available. Please contact operator.');
      return;
    }

    // Create booking object and store in session
    const booking = {
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      operatorName: equipment.owner?.name || equipment.operatorName,
      operatorUpiId: equipment.owner?.upiId || 'operator@upi',
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: durationType === 'days' && endDate ? format(endDate, 'yyyy-MM-dd') : format(startDate, 'yyyy-MM-dd'),
      startTime,
      endTime,
      duration,
      durationType,
      totalAmount: calculateTotal(),
    };

    // Store booking in session storage
    sessionStorage.setItem('currentBooking', JSON.stringify(booking));
    
    // Show UPI payment modal instead of navigating
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    toast.success('Booking confirmed! Redirecting to bookings page...');
    setTimeout(() => {
      navigate('/bookings');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate('/equipment')} className="mb-6">
          ← Back to Equipment
        </Button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Equipment Details */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <div className="relative h-64 bg-gray-200">
                <ImageWithFallback
                  src={equipment.image}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{equipment.name}</CardTitle>
                <CardDescription>{equipment.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{equipment.description}</p>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center text-gray-600">
                    <User className="h-5 w-5 mr-2" />
                    <div>
                      <div className="text-gray-500">Operator</div>
                      <div className="text-gray-900">{equipment.operatorName}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <div>
                      <div className="text-gray-500">Location</div>
                      <div className="text-gray-900">{equipment.location.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Star className="h-5 w-5 mr-2 fill-yellow-400 text-yellow-400" />
                    <div>
                      <div className="text-gray-500">Rating</div>
                      <div className="text-gray-900">{equipment.rating} / 5.0</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <IndianRupee className="h-5 w-5 mr-2" />
                    <div>
                      <div className="text-gray-500">Pricing</div>
                      <div className="text-gray-900">₹{equipment.pricePerHour}/hr</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Book Equipment</CardTitle>
                <CardDescription>Select your preferred dates and time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Rental Type</Label>
                  <Select value={durationType} onValueChange={(value: 'hours' | 'days') => setDurationType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Hourly</SelectItem>
                      <SelectItem value="days">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {durationType === 'days' && (
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => !startDate || date < startDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {durationType === 'hours' && (
                  <>
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label>Duration ({durationType})</Label>
                  <Input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Rate</span>
                    <span>
                      ₹{durationType === 'hours' ? equipment.pricePerHour : equipment.pricePerDay}/{durationType === 'hours' ? 'hr' : 'day'}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Duration</span>
                    <span>{duration} {durationType}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-gray-900">
                    <span>Total</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleBooking}>
                  Proceed to Payment
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* UPI Payment Modal */}
        <UPIPaymentModal
          open={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          equipmentName={equipment?.name || ''}
          operatorName={equipment?.owner?.name || equipment?.operatorName || 'Operator'}
          operatorUpiId={equipment?.owner?.upiId || 'operator@upi'}
          amount={calculateTotal()}
          onPaymentComplete={handlePaymentComplete}
        />
      </div>
    </div>
  );
};
