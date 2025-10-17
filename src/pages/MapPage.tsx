import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import OpenStreetMap from '../components/OpenStreetMap';

interface Equipment {
  id: number;
  name: string;
  description: string;
  pricePerDay: number;
  status: string;
  location?: {
    latitude: number;
    longitude: number;
    city: string;
  };
}

export const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 10.5276, lng: 76.2144 });

  useEffect(() => {
    fetchEquipment();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setMapCenter(location);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const fetchEquipment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/equipment', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEquipment(data);
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const equipmentMarkers = equipment
    .filter((eq) => eq.location?.latitude && eq.location?.longitude)
    .map((eq) => ({
      lat: eq.location!.latitude,
      lng: eq.location!.longitude,
      name: eq.name,
      status: eq.status,
    }));

  const handleEquipmentClick = (eq: Equipment) => {
    if (eq.location) {
      setMapCenter({
        lat: eq.location.latitude,
        lng: eq.location.longitude,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-8 h-8 text-green-600" />
              Equipment Map
            </h1>
            <p className="text-gray-600 mt-1">
              Find available equipment near you
            </p>
          </div>
          <Button onClick={() => navigate('/equipment')}>
            <Package className="w-4 h-4 mr-2" />
            View List
          </Button>
        </div>

        <Card className="p-4 relative">
          <div className="absolute top-6 right-6 z-10">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-md">
              🗺️ OpenStreetMap (Free)
            </Badge>
          </div>
          <OpenStreetMap
            latitude={mapCenter.lat}
            longitude={mapCenter.lng}
            height="600px"
            zoom={13}
            markers={equipmentMarkers}
          />
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading equipment...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((eq) => (
              <Card
                key={eq.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleEquipmentClick(eq)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{eq.name}</h3>
                  <Badge
                    variant={eq.status === 'AVAILABLE' ? 'default' : 'secondary'}
                    className={
                      eq.status === 'AVAILABLE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {eq.status}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4">{eq.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{eq.pricePerDay}/day
                  </span>
                  {eq.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {eq.location.city}
                    </div>
                  )}
                </div>
                {!eq.location && (
                  <p className="text-sm text-gray-400 mt-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location not set
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};