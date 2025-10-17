// Configuration for backend connection
// Set USE_MOCK_DATA to true to use mock data when backend is not available
// Set to false to use real backend API

export const config = {
  // Backend API URL (Spring Boot backend - no /api prefix)
  API_BASE_URL: import.meta?.env?.VITE_API_URL || 'http://localhost:8080',
  
  // Use mock data when backend is not available
  USE_MOCK_DATA: import.meta?.env?.VITE_USE_MOCK_DATA === 'true' || false,
  
  // Timeout for API requests (in milliseconds)
  API_TIMEOUT: 10000,
  
  // Razorpay Key (for frontend)
  RAZORPAY_KEY: import.meta?.env?.VITE_RAZORPAY_KEY || 'rzp_test_xxxxx',
  
  // Mapbox API Key (Get free token from https://www.mapbox.com/)
  // Sign up free (no credit card) → Account → Access Tokens → Copy Default public token
  MAPBOX_TOKEN: import.meta?.env?.VITE_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN_HERE',
  
  // Google Maps API Key (legacy - now using Mapbox)
  GOOGLE_MAPS_KEY: import.meta?.env?.VITE_GOOGLE_MAPS_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',
};

// Check if backend is available
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    console.log('Checking backend health at:', `${config.API_BASE_URL}/health`);
    const response = await fetch(`${config.API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};
