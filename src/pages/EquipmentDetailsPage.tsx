import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Calendar, Clock, Shield, Wrench, Share2, Heart, MessageCircle, Loader2, Navigation } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { equipmentService, Equipment } from '../services/equipmentService';
import { toast } from 'sonner';
import ThrissurMap from '../components/ThrissurMap';

export const EquipmentDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadEquipmentDetails();
  }, [id]);

  const loadEquipmentDetails = async () => {
    try {
      setLoading(true);
      const data = await equipmentService.getEquipmentById(parseInt(id || '0'));
      setEquipment(data);
    } catch (error) {
      console.error('Failed to load equipment:', error);
      toast.error('Failed to load equipment details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading equipment details...</span>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Equipment not found</p>
      </div>
    );
  }

  const handleBookNow = () => {
    navigate(`/booking/${equipment.id}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: equipment.name,
        text: equipment.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const mockReviews = [
    {
      id: 1,
      userName: 'Rajesh Kumar',
      rating: 5,
      comment: 'Excellent tractor! Very well maintained and powerful. The operator was very helpful.',
      date: '2 days ago',
      avatar: 'RK'
    },
    {
      id: 2,
      userName: 'Priya Singh',
      rating: 4,
      comment: 'Good equipment, but delivery was a bit delayed. Overall satisfied with the service.',
      date: '1 week ago',
      avatar: 'PS'
    },
    {
      id: 3,
      userName: 'Amit Patel',
      rating: 5,
      comment: 'Perfect for my farm work. The operator provided good guidance on usage.',
      date: '2 weeks ago',
      avatar: 'AP'
    }
  ];

  const specifications = {
    'Engine Power': '50 HP',
    'Fuel Type': 'Diesel',
    'Transmission': 'Manual',
    'Drive Type': '4WD',
    'Weight': '2500 kg',
    'Year': '2022',
    'Condition': 'Excellent',
    'Maintenance': 'Last serviced 15 days ago'
  };

  const availabilitySchedule = [
    { day: 'Monday', status: 'Available' },
    { day: 'Tuesday', status: 'Booked (9 AM - 5 PM)' },
    { day: 'Wednesday', status: 'Available' },
    { day: 'Thursday', status: 'Available' },
    { day: 'Friday', status: 'Booked (2 PM - 6 PM)' },
    { day: 'Saturday', status: 'Available' },
    { day: 'Sunday', status: 'Maintenance' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleFavorite}
              className={isFavorite ? 'text-red-500' : ''}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video rounded-t-lg overflow-hidden">
                  <ImageWithFallback
                    src={equipment.imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'}
                    alt={equipment.name}
                    className="w-full h-full object-cover"
                  />
                  {equipment.available ? (
                    <Badge className="absolute top-4 right-4 bg-green-500">Available</Badge>
                  ) : (
                    <Badge className="absolute top-4 right-4 bg-red-500">Booked</Badge>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-gray-900 mb-2">{equipment.name}</h1>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{equipment.rating || 0} ({equipment.totalBookings || 0} bookings)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{equipment.location?.address || 'Location not specified'}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-blue-600">
                      {equipment.category}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>{equipment.operatorName?.charAt(0) || 'O'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">Operated by</p>
                        <p className="text-sm text-gray-900">{equipment.operatorName || 'Equipment Owner'}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specs</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About this Equipment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{equipment.description}</p>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="text-gray-900">Features & Benefits</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Fully insured and regularly maintained</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Wrench className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Free training and operational support included</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span>Flexible booking - hourly or daily rates</span>
                        </li>
                      </ul>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="text-gray-900">Usage Guidelines</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        <li>Valid driving license required</li>
                        <li>Security deposit required at booking</li>
                        <li>Fuel charges included in hourly rate</li>
                        <li>Equipment must be returned in same condition</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Owner Location Section */}
                {equipment.location?.latitude && equipment.location?.longitude && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Equipment Owner Location
                      </CardTitle>
                      <CardDescription>
                        This equipment is located at the owner's registered address
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Thrissur District Map Display */}
                      <div className="rounded-lg overflow-hidden border">
                        <ThrissurMap
                          center={[equipment.location.latitude, equipment.location.longitude]}
                          markers={[
                            {
                              id: equipment.id,
                              lat: equipment.location.latitude,
                              lng: equipment.location.longitude,
                              title: equipment.name,
                              description: equipment.available ? 'Available for rent' : 'Currently Borrowed',
                              type: 'equipment',
                              status: equipment.available ? 'AVAILABLE' : 'BORROWED'
                            }
                          ]}
                          height="400px"
                          zoom={13}
                          showCurrentLocation={false}
                        />
                      </div>

                      {/* Coordinates Display */}
                      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                        <Navigation className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">GPS Coordinates</p>
                          <p className="text-sm text-gray-600 font-mono">
                            {equipment.location.latitude.toFixed(6)}, {equipment.location.longitude.toFixed(6)}
                          </p>
                          {equipment.location.address && (
                            <p className="text-sm text-gray-600 mt-2">
                              📍 {equipment.location.address}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Location Info Alert */}
                      <Alert>
                        <AlertDescription className="text-sm">
                          💡 This location was captured when the equipment owner registered this equipment. 
                          You can use these coordinates to navigate to the pickup location.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="specifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-gray-600">{key}</span>
                          <span className="text-sm text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <h4 className="text-gray-900">Equipment Health</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="text-gray-600">Engine Condition</span>
                            <span className="text-green-600">95%</span>
                          </div>
                          <Progress value={95} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="text-gray-600">Tire Condition</span>
                            <span className="text-green-600">90%</span>
                          </div>
                          <Progress value={90} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="text-gray-600">Hydraulics</span>
                            <span className="text-green-600">88%</span>
                          </div>
                          <Progress value={88} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                    <CardDescription>
                      {mockReviews.length} reviews • Average rating: {equipment.rating}/5
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="space-y-2">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>{review.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-gray-900">{review.userName}</p>
                              <p className="text-xs text-gray-500">{review.date}</p>
                            </div>
                            <div className="flex items-center gap-1 my-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating
                                      ? 'text-yellow-500 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">{review.comment}</p>
                          </div>
                        </div>
                        {review.id !== mockReviews.length && <Separator />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Availability Schedule</CardTitle>
                    <CardDescription>Current week availability</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {availabilitySchedule.map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                          <span className="text-gray-900">{item.day}</span>
                          <Badge
                            variant={
                              item.status === 'Available'
                                ? 'default'
                                : item.status.includes('Booked')
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Hourly Rate</span>
                    </div>
                    <span className="text-gray-900">₹{equipment.pricePerHour}/hr</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Daily Rate</span>
                    </div>
                    <span className="text-gray-900">₹{equipment.pricePerDay}/day</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="text-gray-900">₹50</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Insurance</span>
                    <span className="text-gray-900">Included</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Operator Support</span>
                    <span className="text-gray-900">Available</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleBookNow}
                    disabled={!equipment.available}
                  >
                    {equipment.available ? 'Book Now' : 'Currently Unavailable'}
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Ask a Question
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-blue-900">
                    <strong>Free Cancellation</strong>
                  </p>
                  <p className="text-xs text-blue-700">
                    Cancel up to 24 hours before your booking for a full refund
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
