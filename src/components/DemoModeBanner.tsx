import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../context/AuthContext';

export const DemoModeBanner: React.FC = () => {
  const { isDemoMode } = useAuth();
  const [dismissed, setDismissed] = React.useState(false);

  // Check if banner was previously dismissed
  React.useEffect(() => {
    const wasDismissed = localStorage.getItem('demoBannerDismissed') === 'true';
    setDismissed(wasDismissed);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('demoBannerDismissed', 'true');
  };

  if (!isDemoMode || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white py-2 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">
            <strong>Demo Mode:</strong> Backend not connected. Using mock data for demonstration. 
            Data will not persist. To connect backend, see{' '}
            <a href="/BACKEND_INTEGRATION.md" className="underline hover:text-amber-100">
              Backend Integration Guide
            </a>
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-amber-600 rounded transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
