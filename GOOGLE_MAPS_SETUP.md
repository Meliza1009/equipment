# Google Maps API Setup Guide

## Overview
Your Equipment Sharing Platform uses **Google Maps JavaScript API** via `@vis.gl/react-google-maps` to display equipment locations on an interactive map.

## Current Status
- ✅ Google Maps library installed: `@vis.gl/react-google-maps` (v1.5.5)
- ✅ Map components created: `EquipmentMap.tsx`, `GoogleMapsProvider.tsx`
- ✅ Map page implemented: `MapPage.tsx`
- ⚠️ API key not configured (showing placeholder)

## Step 1: Get Your Google Maps API Key

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click **"Select a project"** → **"New Project"**
4. Enter project name: `Equipment-Sharing-Platform`
5. Click **"Create"**

### 1.2 Enable Required APIs
Once your project is created:

1. In the sidebar, go to **APIs & Services** → **Library**
2. Search and enable the following APIs:
   - ✅ **Maps JavaScript API** (required for map display)
   - ✅ **Places API** (optional, for location search)
   - ✅ **Geocoding API** (optional, for address to coordinates)
   - ✅ **Geolocation API** (optional, for user location)

### 1.3 Create API Key
1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"API key"**
3. Copy the generated API key (it looks like: `AIzaSyB...`)
4. Click **"RESTRICT KEY"** (recommended for security)

### 1.4 Restrict API Key (Recommended)
**Application restrictions:**
- For development: Choose **"HTTP referrers (web sites)"**
- Add: `http://localhost:5173/*` and `http://localhost:3000/*`
- For production: Add your deployed domain (e.g., `https://yourdomain.com/*`)

**API restrictions:**
- Select **"Restrict key"**
- Choose only the APIs you enabled (Maps JavaScript API, Places API, etc.)
- Click **"Save"**

## Step 2: Configure Your Application

### 2.1 Update `.env.local` File
Open the file at project root and add your API key:

```bash
# Google Maps API Key
VITE_GOOGLE_MAPS_KEY=AIzaSyB_YOUR_ACTUAL_API_KEY_HERE
```

**Example:**
```bash
# Backend API Configuration
VITE_API_URL=http://localhost:8080
VITE_USE_MOCK_DATA=false

# Payment Gateway (Razorpay)
VITE_RAZORPAY_KEY=rzp_test_xxxxx

# Google Maps API Key
VITE_GOOGLE_MAPS_KEY=AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz
```

### 2.2 Restart Development Server
After updating `.env.local`:
```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 3: Test the Map

1. Start your backend (if not running):
   ```bash
   cd backend
   java -jar target/equipment-sharing-backend-0.0.1-SNAPSHOT.jar
   ```

2. Start your frontend:
   ```bash
   npm run dev
   ```

3. Navigate to the Map page: `http://localhost:5173/map`

4. You should see:
   - ✅ Interactive Google Map
   - ✅ Equipment markers on the map
   - ✅ Info windows when clicking markers
   - ✅ Location search (if Places API enabled)

## Step 4: Add Equipment Location Data

Equipment needs `location` data to appear on the map. Make sure your equipment items have:

```json
{
  "id": 1,
  "name": "Mahindra Tractor",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "address": "New Delhi, India"
  }
}
```

## Troubleshooting

### Map Not Showing
- ✅ Check browser console for API errors
- ✅ Verify API key is correct in `.env.local`
- ✅ Ensure Maps JavaScript API is enabled in Google Cloud Console
- ✅ Check API key restrictions (referrer URLs)

### "For development purposes only" Watermark
- This appears when using an unrestricted API key
- Add billing account to Google Cloud project (you get $200 free credit)
- Most small projects stay within free tier limits

### Equipment Markers Not Showing
- ✅ Verify equipment items have `location.latitude` and `location.longitude`
- ✅ Check backend is returning location data
- ✅ Open browser DevTools → Network tab to inspect API responses

### Search Not Working
- ✅ Enable "Places API" in Google Cloud Console
- ✅ Verify API key has Places API access

## Cost & Free Tier

Google Maps provides generous free tier:
- **$200 monthly credit** (covers ~28,000 map loads/month)
- Maps loads: **$7 per 1,000 loads** (after free credit)
- Most small projects stay free

### Free Tier Limits:
- Dynamic Maps: 28,000+ loads/month
- Static Maps: 100,000+ loads/month
- Geocoding: 40,000+ requests/month

## Alternative: Use OpenStreetMap (Free, No API Key)

Your project also has `OpenStreetMap.tsx` component using Leaflet (no API key needed):

### Switch to OpenStreetMap:
1. Update `MapPage.tsx` to use `OpenStreetMap` component instead
2. No API key required
3. Fully free and open-source

**Trade-offs:**
- ❌ Less detailed than Google Maps
- ❌ Fewer features (no Street View, Places API, etc.)
- ✅ Completely free
- ✅ No usage limits

## Security Best Practices

1. **Never commit API keys** to Git
   - `.env.local` is in `.gitignore`
   - Use environment variables in production

2. **Restrict your API key**
   - Limit to specific domains/IPs
   - Restrict to only needed APIs

3. **Monitor usage**
   - Set up billing alerts in Google Cloud
   - Review API usage regularly

4. **Rotate keys periodically**
   - Generate new keys every 6-12 months
   - Delete old unused keys

## Next Steps

1. ✅ Get your Google Maps API key
2. ✅ Add it to `.env.local`
3. ✅ Restart dev server
4. ✅ Test the map at `/map`
5. ✅ Add location data to equipment items
6. ✅ (Optional) Enable Places API for location search

## Need Help?

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [vis.gl React Google Maps Docs](https://visgl.github.io/react-google-maps/)
- [Google Cloud Console](https://console.cloud.google.com/)

---

**Current Configuration Files:**
- Environment variables: `.env.local`
- Map provider: `src/components/GoogleMapsProvider.tsx`
- Map component: `src/components/EquipmentMap.tsx`
- Map page: `src/pages/MapPage.tsx`
- Config utility: `src/utils/config.ts`
