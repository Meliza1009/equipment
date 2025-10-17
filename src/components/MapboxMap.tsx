import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox access token - Get your free token from https://www.mapbox.com/
// Sign up for free (no credit card required) and get your token from Account → Access Tokens
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';

interface Marker {
  lat: number;
  lng: number;
  name: string;
  status?: string;
}

interface MapboxMapProps {
  latitude: number;
  longitude: number;
  markers?: Marker[];
  height?: string;
  zoom?: number;
  style?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  latitude,
  longitude,
  markers = [],
  height = '400px',
  zoom = 13,
  style = 'mapbox://styles/mapbox/streets-v12',
  onLocationSelect,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: style,
      center: [longitude, latitude],
      zoom: zoom,
    });

    // Add navigation controls (zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Add click handler if onLocationSelect is provided
    if (onLocationSelect) {
      map.current.on('click', (e) => {
        onLocationSelect(e.lngLat.lat, e.lngLat.lng);
      });
    }

    // Cleanup on unmount
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when they change
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      if (!map.current) return;

      // Create a custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)';
      el.style.backgroundSize = 'cover';
      el.style.cursor = 'pointer';

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<div style="padding: 8px;">
          <strong style="font-size: 14px; color: #1f2937;">${markerData.name}</strong>
          ${markerData.status ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: ${
            markerData.status === 'AVAILABLE' ? '#10b981' : '#ef4444'
          };">${markerData.status}</p>` : ''}
        </div>`
      );

      // Add marker to map
      const marker = new mapboxgl.Marker(el)
        .setLngLat([markerData.lng, markerData.lat])
        .setPopup(popup)
        .addTo(map.current);

      markersRef.current.push(marker);
    });
  }, [markers]);

  // Recenter map when coordinates change
  useEffect(() => {
    if (map.current) {
      map.current.flyTo({
        center: [longitude, latitude],
        zoom: zoom,
        duration: 1000,
      });
    }
  }, [latitude, longitude, zoom]);

  return (
    <div
      ref={mapContainer}
      style={{ 
        width: '100%', 
        height: height,
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  );
};

export default MapboxMap;
