import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface OpenStreetMapProps {
  latitude?: number;
  longitude?: number;
  height?: string;
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    name: string;
    status?: string;
  }>;
  onLocationSelect?: (lat: number, lng: number) => void;
}

// Component to recenter map when coordinates change
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export default function OpenStreetMap({
  latitude,
  longitude,
  height = '400px',
  zoom = 13,
  markers = [],
  onLocationSelect,
}: OpenStreetMapProps) {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Get user's current location
  useEffect(() => {
    if (latitude && longitude) {
      setCurrentLocation({ lat: latitude, lng: longitude });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to a central location if geolocation fails
          setCurrentLocation({ lat: 20.5937, lng: 78.9629 }); // India center
        }
      );
    }
  }, [latitude, longitude]);

  if (!currentLocation) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center bg-gray-100 rounded-lg"
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  const displayMarkers = markers.length > 0 ? markers : [{ ...currentLocation, name: 'Current Location' }];

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden">
      <MapContainer
        center={[currentLocation.lat, currentLocation.lng] as [number, number]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap lat={currentLocation.lat} lng={currentLocation.lng} />
        
        {displayMarkers.map((marker, index) => (
          <Marker
            key={index}
            position={[marker.lat, marker.lng] as [number, number]}
            eventHandlers={{
              click: () => {
                if (onLocationSelect) {
                  onLocationSelect(marker.lat, marker.lng);
                }
              },
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong>{marker.name || 'Location'}</strong>
                {marker.status && (
                  <p className="text-xs text-gray-600">Status: {marker.status}</p>
                )}
                <p className="text-xs text-gray-500">
                  {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
