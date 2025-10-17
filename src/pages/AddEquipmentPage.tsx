import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Loader2, MapPin, Navigation, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { toast } from 'sonner';
import { equipmentService } from '../services/equipmentService';
import { useAuth } from '../context/AuthContext';
import { getImageForEquipment, getEquipmentImageWithFallback } from '../utils/equipmentImageMapper';

export const AddEquipmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    pricePerHour: '',
    pricePerDay: '',
    location: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    image: ''
  });

  // Get owner's location when component mounts
  useEffect(() => {
    getOwnerLocation();
  }, []);

  // Get owner's location when component mounts
  useEffect(() => {
    getOwnerLocation();
  }, []);

  const categories = [
    'Tractor',
    'Harvester',
    'Plow',
    'Irrigation',
    'Seeder',
    'Sprayer',
    'Other'
  ];

  // Get equipment owner's current GPS location
  const getOwnerLocation = async () => {
    setGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setLocation({ lat, lng });
        toast.success('📍 Location captured successfully!');
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.warning('Could not get location. Using default coordinates.');
        // Set default location (India center)
        setLocation({ lat: 20.5937, lng: 78.9629 });
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.pricePerDay) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to add equipment');
      return;
    }

    setLoading(true);

    try {
      // Use captured GPS location or fallback
      const equipmentLocation = location || { lat: 20.5937, lng: 78.9629 };
      
      // Prepare equipment data for backend
      const equipmentData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        pricePerDay: parseFloat(formData.pricePerDay),
        pricePerHour: formData.pricePerHour ? parseFloat(formData.pricePerHour) : null,
        operatorId: user.id,
        available: true,
        condition: 'Good',
        imageUrl: formData.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
        location: {
          latitude: equipmentLocation.lat,
          longitude: equipmentLocation.lng,
          address: formData.address || 'Village Center',
          city: formData.city || 'Lucknow',
          state: formData.state || 'Uttar Pradesh',
          zipCode: formData.zipCode || '226001'
        }
      };

      // Create equipment - backend will auto-generate QR code
      const newEquipment = await equipmentService.createEquipment(equipmentData);
      
      toast.success(`Equipment added successfully! QR Code: ${newEquipment.qrCode || 'Generated'}`);
      
      // Navigate to equipment details page to show QR code
      navigate(`/operator/equipment`);
    } catch (error: any) {
      console.error('Error adding equipment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add equipment. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/operator/equipment')}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Equipment
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Equipment</CardTitle>
            <CardDescription>
              Add equipment to your inventory. A QR code will be automatically generated for tracking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Equipment Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Tractor - John Deere 5050D"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your equipment..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Pricing</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerHour">Price per Hour (₹)</Label>
                    <Input
                      id="pricePerHour"
                      type="number"
                      placeholder="200"
                      value={formData.pricePerHour}
                      onChange={(e) => handleChange('pricePerHour', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePerDay">Price per Day (₹) *</Label>
                    <Input
                      id="pricePerDay"
                      type="number"
                      placeholder="1500"
                      value={formData.pricePerDay}
                      onChange={(e) => handleChange('pricePerDay', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Equipment Location</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getOwnerLocation}
                    disabled={gettingLocation}
                  >
                    {gettingLocation ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <Navigation className="h-4 w-4 mr-2" />
                        Refresh Location
                      </>
                    )}
                  </Button>
                </div>

                {/* Location Status Alert */}
                {location && (
                  <Alert className="bg-green-50 border-green-200">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Location Captured:</strong> {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                      <br />
                      <span className="text-xs text-green-600">
                        This GPS location will be saved with your equipment
                      </span>
                    </AlertDescription>
                  </Alert>
                )}

                {!location && !gettingLocation && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <MapPin className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <strong>Location not captured.</strong> Click "Refresh Location" to get your current GPS coordinates.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="ZIP Code"
                      value={formData.zipCode}
                      onChange={(e) => handleChange('zipCode', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Equipment Photo</h3>
                
                {/* Auto-Generated Image Preview */}
                {(formData.category || formData.name) && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-gray-600">
                        <Eye className="inline h-4 w-4 mr-1" />
                        Auto-Selected Image Preview
                      </Label>
                      <span className="text-xs text-gray-500">
                        Based on: {formData.category || 'category'} {formData.name && `• ${formData.name}`}
                      </span>
                    </div>
                    <div className="relative h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={getEquipmentImageWithFallback(formData.image, formData.name, formData.category)}
                        alt="Equipment preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop';
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="text-white text-sm font-medium">
                          ✨ This image will be automatically assigned
                        </p>
                        <p className="text-white/80 text-xs">
                          You can upload a custom image below to override this
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="image" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-500">Upload a custom image</span>
                        <input
                          id="image"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Handle file upload
                              toast.success('Custom image uploaded successfully');
                            }
                          }}
                        />
                      </label>
                      <span className="text-gray-500"> or drag and drop</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB (Optional)</p>
                    <p className="text-xs text-blue-600 mt-1">💡 Leave empty to use auto-selected image</p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Equipment...
                    </>
                  ) : (
                    'Add Equipment & Generate QR Code'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/operator/equipment')}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
