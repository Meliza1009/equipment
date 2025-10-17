import React, { useState } from 'react';
import { Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { Equipment } from '../services/equipmentService';

interface EquipmentMapProps {
  equipment: Equipment[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onEquipmentClick?: (equipment: Equipment) => void;
}

/**
 * Equipment Map Component
 * Displays equipment locations on Google Maps with markers and info windows
 */
export const EquipmentMap: React.FC<EquipmentMapProps> = ({
  equipment,
  center = { lat: 28.6139, lng: 77.2090 }, // Default: New Delhi
  zoom = 12,
  height = '500px',
  onEquipmentClick,
}) => {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  const handleMarkerClick = (equip: Equipment) => {
    setSelectedEquipment(equip);
    if (onEquipmentClick) {
      onEquipmentClick(equip);
    }
  };

  return (
    <div style={{ height, width: '100%' }}>
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        mapId="equipment-map"
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        {equipment.map((equip) => {
          if (!equip.location?.latitude || !equip.location?.longitude) {
            return null;
          }

          return (
            <Marker
              key={equip.id}
              position={{
                lat: equip.location.latitude,
                lng: equip.location.longitude,
              }}
              onClick={() => handleMarkerClick(equip)}
              title={equip.name}
            />
          );
        })}

        {selectedEquipment && selectedEquipment.location && (
          <InfoWindow
            position={{
              lat: selectedEquipment.location.latitude,
              lng: selectedEquipment.location.longitude,
            }}
            onCloseClick={() => setSelectedEquipment(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-semibold text-lg mb-1">{selectedEquipment.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedEquipment.category}</p>
              {selectedEquipment.imageUrl && (
                <img
                  src={selectedEquipment.imageUrl}
                  alt={selectedEquipment.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              <p className="text-sm font-semibold text-green-600">
                ${selectedEquipment.pricePerDay}/day
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedEquipment.location.address}, {selectedEquipment.location.city}
              </p>
              <div className="mt-2">
                <span
                  className={`inline-block px-2 py-1 text-xs rounded ${
                    selectedEquipment.available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedEquipment.available ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
};
