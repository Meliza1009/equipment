import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Set default icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Thrissur district center coordinates
const THRISSUR_CENTER: [number, number] = [10.5276, 76.2144];
const DEFAULT_ZOOM = 11;

// Thrissur district boundaries (approximate)
const THRISSUR_BOUNDS: L.LatLngBoundsExpression = [
  [10.25, 75.95], // Southwest corner
  [10.85, 76.45]  // Northeast corner
];

interface MarkerData {
  id: string | number;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  type?: 'operator' | 'user' | 'equipment';
  status?: string;
}

interface ThrissurMapProps {
  markers?: MarkerData[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
  showCurrentLocation?: boolean;
}

// Custom green operator marker icon
const operatorIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48">
      <path fill="#22c55e" stroke="#16a34a" stroke-width="2" d="M16 0C9.373 0 4 5.373 4 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z"/>
      <circle fill="white" cx="16" cy="12" r="5"/>
    </svg>
  `),
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

// Custom blue user marker icon
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48">
      <path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M16 0C9.373 0 4 5.373 4 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z"/>
      <circle fill="white" cx="16" cy="12" r="5"/>
    </svg>
  `),
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

// Custom orange equipment marker icon
const equipmentIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48">
      <path fill="#f97316" stroke="#ea580c" stroke-width="2" d="M16 0C9.373 0 4 5.373 4 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z"/>
      <circle fill="white" cx="16" cy="12" r="5"/>
    </svg>
  `),
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

// Component to handle map bounds restriction
const MapBoundsController: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    // Set max bounds to restrict panning outside Thrissur
    map.setMaxBounds(THRISSUR_BOUNDS);
    map.on('drag', () => {
      map.panInsideBounds(THRISSUR_BOUNDS, { animate: false });
    });
  }, [map]);

  return null;
};

// Component to handle current location
const CurrentLocationMarker: React.FC = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // Check if location is within Thrissur bounds
          if (
            latitude >= 10.25 && latitude <= 10.85 &&
            longitude >= 75.95 && longitude <= 76.45
          ) {
            setPosition([latitude, longitude]);
            map.flyTo([latitude, longitude], 13, { duration: 1.5 });
          }
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, [map]);

  return position ? (
    <Marker position={position} icon={userIcon as any}>
      <Popup>
        <div className="text-center">
          <strong>Your Location</strong>
          <br />
          <span className="text-sm text-gray-600">
            {position[0].toFixed(4)}, {position[1].toFixed(4)}
          </span>
        </div>
      </Popup>
    </Marker>
  ) : null;
};

export const ThrissurMap: React.FC<ThrissurMapProps> = ({
  markers = [],
  center = THRISSUR_CENTER,
  zoom = DEFAULT_ZOOM,
  height = '400px',
  onLocationSelect,
  showCurrentLocation = false,
}) => {
  const getMarkerIcon = (type?: string) => {
    switch (type) {
      case 'operator':
        return operatorIcon;
      case 'user':
        return userIcon;
      case 'equipment':
        return equipmentIcon;
      default:
        return DefaultIcon;
    }
  };

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden border-2 border-green-200">
      <MapContainer
        center={center as any}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        maxBounds={THRISSUR_BOUNDS}
        maxBoundsViscosity={1.0}
        minZoom={10}
        maxZoom={16}
      >
        {/* Light green themed OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />

        {/* Bounds controller */}
        <MapBoundsController />

        {/* Show current location if enabled */}
        {showCurrentLocation && <CurrentLocationMarker />}

        {/* Render custom markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={getMarkerIcon(marker.type) as any}
            eventHandlers={{
              click: () => {
                if (onLocationSelect) {
                  onLocationSelect(marker.lat, marker.lng);
                }
              },
            }}
          >
            <Popup>
              <div className="text-center min-w-[150px]">
                <strong className="text-lg text-green-700">{marker.title}</strong>
                {marker.description && (
                  <>
                    <br />
                    <span className="text-sm text-gray-600">{marker.description}</span>
                  </>
                )}
                {marker.status && (
                  <>
                    <br />
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${
                        marker.status === 'available'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {marker.status}
                    </span>
                  </>
                )}
                <br />
                <span className="text-xs text-gray-500">
                  {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Custom CSS for light green theme */}
      <style>{`
        .leaflet-container {
          background: #f0fdf4 !important;
          font-family: inherit;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
        }
        
        .leaflet-popup-tip {
          background: white;
        }
        
        .leaflet-control-zoom a {
          background: #22c55e !important;
          color: white !important;
          border: none !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: #16a34a !important;
        }
        
        .leaflet-bar {
          border: 2px solid #22c55e !important;
        }
        
        /* Light green tint overlay for rural theme */
        .map-tiles {
          filter: sepia(0.1) hue-rotate(60deg) saturate(1.1);
        }
        
        .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.9) !important;
          font-size: 10px;
        }
      `}</style>
    </div>
  );
};

export default ThrissurMap;
