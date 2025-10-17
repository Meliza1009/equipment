import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Package, MapPin, Clock, AlertTriangle, CheckCircle2, XCircle, X, Camera, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { QRScanner } from '../components/QRScanner';
import axios from '../utils/axios';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

interface Equipment {
  id: number;
  name: string;
  category: string;
  description: string;
  pricePerHour: number;
  pricePerDay: number;
  available: boolean;
  operatorName: string;
  location?: {
    address: string;
    lat: number;
    lng: number;
  };
  image?: string;
  rating: number;
}

interface Booking {
  id: number;
  equipmentName: string;
  startDate: string;
  endDate: string;
  status: string;
  totalAmount: number;
}

interface ScanResult {
  success: boolean;
  equipment?: Equipment;
  hasActiveBooking: boolean;
  activeBooking?: Booking;
  hasOverdueItems: boolean;
  canBorrow: boolean;
  canReturn: boolean;
  userName: string;
  message?: string;
}

const QRScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [durationType, setDurationType] = useState<'hours' | 'days'>('hours');
  const [duration, setDuration] = useState(1);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get user's location
  const getUserLocation = () => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setLocation(coords);
            resolve(coords);
          },
          (error) => {
            console.error('Error getting location:', error);
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation not supported'));
      }
    });
  };

  const handleScan = async (qrData: string) => {
    setLoading(true);
    setShowScanner(false);

    try {
      // Validate QR code with backend
      const response = await axios.post('/api/qr-scan/validate', { qrData });
      
      if (response.data.success) {
        setScanResult(response.data);
        
        // Get user location for tracking
        try {
          await getUserLocation();
        } catch (error) {
          console.log('Location access denied or not available');
        }

        toast.success(`QR Code Scanned - Equipment: ${response.data.equipment.name}`);
      } else {
        toast.error(response.data.message || 'Invalid QR Code');
      }
    } catch (error: any) {
      console.error('Scan error:', error);
      toast.error(error.response?.data?.message || 'Failed to validate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!scanResult?.equipment) return;

    setLoading(true);

    try {
      const requestData: any = {
        equipmentId: scanResult.equipment.id,
        durationType,
        duration,
      };

      // Add location if available
      if (location) {
        requestData.latitude = location.lat;
        requestData.longitude = location.lng;
      }

      const response = await axios.post('/api/qr-scan/borrow', requestData);

      if (response.data.success) {
        toast.success(`Equipment Borrowed Successfully! - ${scanResult.equipment.name} for ${duration} ${durationType}`);

        // Navigate to bookings page
        setTimeout(() => {
          navigate('/user/bookings');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Borrow error:', error);
      toast.error(error.response?.data?.message || 'Failed to borrow equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!scanResult?.activeBooking || !scanResult?.equipment) return;

    setLoading(true);

    try {
      const requestData: any = {
        bookingId: scanResult.activeBooking.id,
        equipmentId: scanResult.equipment.id,
      };

      // Add location if available
      if (location) {
        requestData.latitude = location.lat;
        requestData.longitude = location.lng;
      }

      const response = await axios.post('/api/qr-scan/return', requestData);

      if (response.data.success) {
        const lateFee = response.data.lateFee || 0;
        
        toast.success(
          lateFee > 0
            ? `Equipment Returned - Late fee: $${lateFee.toFixed(2)}. Total: $${response.data.finalAmount.toFixed(2)}`
            : `Equipment Returned Successfully! Thank you for returning ${scanResult.equipment.name} on time!`
        );

        // Navigate to bookings page
        setTimeout(() => {
          navigate('/user/bookings');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Return error:', error);
      toast.error(error.response?.data?.message || 'Failed to return equipment');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalCost = () => {
    if (!scanResult?.equipment) return 0;
    const price = durationType === 'hours'
      ? scanResult.equipment.pricePerHour
      : scanResult.equipment.pricePerDay;
    return (price || 0) * duration;
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">QR Equipment Scanner</h1>
          <p className="text-muted-foreground">
            Scan equipment QR code to borrow or return items
          </p>
        </div>
      </div>

      {/* Scan Button */}
      {!scanResult && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Button
              onClick={() => setShowScanner(true)}
              size="lg"
              className="w-full h-24 text-lg"
              disabled={loading}
            >
              <Camera className="mr-3 h-8 w-8" />
              {loading ? 'Processing...' : 'Scan QR Code'}
            </Button>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <QrCode className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                    How to use:
                  </h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                    <li>• Point camera at equipment QR code</li>
                    <li>• View equipment details and availability</li>
                    <li>• Borrow available equipment instantly</li>
                    <li>• Return borrowed equipment by scanning again</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan Result */}
      {scanResult && scanResult.equipment && (
        <div className="space-y-6">
          {/* Equipment Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-2xl">{scanResult.equipment.name}</CardTitle>
                    <Badge 
                      variant={scanResult.equipment.available ? 'default' : 'destructive'}
                      className="text-sm"
                    >
                      {scanResult.equipment.available ? '✓ Available' : '✗ Borrowed'}
                    </Badge>
                  </div>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>{scanResult.equipment.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono bg-muted px-2 py-1 rounded w-fit">
                      <QrCode className="h-3 w-3" />
                      <span>Equipment ID: #{scanResult.equipment.id}</span>
                    </div>
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setScanResult(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Banner */}
              <Alert className={scanResult.equipment.available ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'}>
                <AlertDescription className="flex items-center gap-2">
                  {scanResult.equipment.available ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-green-800 dark:text-green-200 font-medium">
                        This equipment is available for borrowing
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <span className="text-red-800 dark:text-red-200 font-medium">
                        This equipment is currently borrowed by another user
                      </span>
                    </>
                  )}
                </AlertDescription>
              </Alert>

              {scanResult.equipment.image && (
                <img
                  src={scanResult.equipment.image}
                  alt={scanResult.equipment.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}

              <p className="text-sm text-muted-foreground">
                {scanResult.equipment.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Per Hour</p>
                    <p className="font-semibold">${scanResult.equipment.pricePerHour}/hr</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Per Day</p>
                    <p className="font-semibold">${scanResult.equipment.pricePerDay}/day</p>
                  </div>
                </div>
              </div>

              {scanResult.equipment.location && (
                <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {scanResult.equipment.location.address}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Operator: {scanResult.equipment.operatorName}</span>
              </div>
            </CardContent>
          </Card>

          {/* Warnings */}
          {scanResult.hasOverdueItems && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have overdue equipment. Please return them before borrowing new items.
              </AlertDescription>
            </Alert>
          )}

          {/* Borrow Form */}
          {scanResult.canBorrow && (
            <Card>
              <CardHeader>
                <CardTitle>Borrow Equipment</CardTitle>
                <CardDescription>
                  Select duration and confirm to borrow this equipment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Duration</label>
                    <input
                      type="number"
                      min="1"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Type</label>
                    <select
                      value={durationType}
                      onChange={(e) => setDurationType(e.target.value as 'hours' | 'days')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="font-semibold">Total Cost:</span>
                  <span className="text-2xl font-bold text-primary">
                    ${calculateTotalCost().toFixed(2)}
                  </span>
                </div>

                {location && (
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Location tracking enabled</span>
                  </div>
                )}

                <Button
                  onClick={handleBorrow}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Processing...' : `Borrow for $${calculateTotalCost().toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Return Form */}
          {scanResult.canReturn && scanResult.activeBooking && (
            <Card>
              <CardHeader>
                <CardTitle>Return Equipment</CardTitle>
                <CardDescription>
                  Confirm to return this equipment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Booking ID:</span>
                    <span className="font-medium">#{scanResult.activeBooking.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Borrowed on:</span>
                    <span className="font-medium">{scanResult.activeBooking.startDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Due date:</span>
                    <span className="font-medium">{scanResult.activeBooking.endDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount paid:</span>
                    <span className="font-medium">${scanResult.activeBooking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    Late returns will incur a fee of ₹100 per hour.
                  </AlertDescription>
                </Alert>

                {location && (
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Return location will be recorded</span>
                  </div>
                )}

                <Button
                  onClick={handleReturn}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                  variant="default"
                >
                  {loading ? 'Processing...' : 'Confirm Return'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* No Action Available */}
          {!scanResult.canBorrow && !scanResult.canReturn && (
            <Alert>
              <AlertDescription>
                {!scanResult.equipment.available
                  ? 'This equipment is currently borrowed by someone else.'
                  : 'No action available for this equipment at the moment.'}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
          title="Scan Equipment QR Code"
          description="Position the QR code within the camera frame"
        />
      )}
    </div>
  );
};

export default QRScanPage;
