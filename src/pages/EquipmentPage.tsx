import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Clock, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { equipmentService, Equipment } from '../services/equipmentService';
import { toast } from 'sonner';

export const EquipmentPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const data = await equipmentService.getAllEquipment();
      setEquipment(data);
    } catch (error) {
      console.error('Failed to load equipment:', error);
      toast.error('Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(equipment.map(e => e.category)))];

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (eq.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || eq.category === categoryFilter;
    const matchesAvailability = availabilityFilter === 'all' || 
                               (availabilityFilter === 'available' && eq.available) ||
                               (availabilityFilter === 'unavailable' && !eq.available);
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Browse Equipment</h1>
          <p className="text-gray-600">Find the perfect equipment for your farming needs</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            {filteredEquipment.length} equipment found
          </p>
          <Button variant="outline" onClick={() => navigate('/map')}>
            <MapPin className="mr-2 h-4 w-4" />
            View on Map
          </Button>
        </div>

        {/* Equipment Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">Loading equipment...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((eq) => (
              <Card key={eq.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gray-200">
                  <ImageWithFallback
                    src={eq.imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'}
                    alt={eq.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    {eq.available ? (
                      <Badge className="bg-green-600">Available</Badge>
                    ) : (
                      <Badge variant="secondary">Unavailable</Badge>
                    )}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{eq.name}</CardTitle>
                  <CardDescription>{eq.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {eq.description || 'No description available'}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{eq.location?.address || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                      <span>{eq.rating || 0} ({eq.totalBookings || 0} bookings)</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <div className="text-gray-900 font-semibold">₹{eq.pricePerHour}/hour</div>
                        <div className="text-gray-600">₹{eq.pricePerDay}/day</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    variant="outline"
                    className="flex-1" 
                    onClick={() => navigate(`/equipment/${eq.id}`)}
                  >
                    View Details
                  </Button>
                  <Button 
                    className="flex-1" 
                    disabled={!eq.available}
                    onClick={() => navigate(`/booking/${eq.id}`)}
                  >
                    {eq.available ? 'Book Now' : 'Unavailable'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No equipment found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
};
