import React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { config } from '@/utils/config';

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

/**
 * Google Maps Provider Component
 * Wraps the application with Google Maps API context
 */
export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
  const apiKey = config.GOOGLE_MAPS_KEY;

  // Show warning if API key is not configured
  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
    console.warn(
      '⚠️ Google Maps API key not configured. Map features will not work. ' +
      'Please set VITE_GOOGLE_MAPS_KEY in your .env.local file.'
    );
  }

  return (
    <APIProvider apiKey={apiKey || ''}>
      {children}
    </APIProvider>
  );
};
