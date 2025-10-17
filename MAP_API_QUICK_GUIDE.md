# Map API Quick Reference Guide

## 📍 Available Map Options in Your Project

Your Equipment Sharing Platform has **3 map implementations**:

| Map Type | API Required | Cost | Features |
|----------|-------------|------|----------|
| **Google Maps** ⭐ | Yes (API Key) | Free tier ($200/month credit) | Best features, places search, street view |
| **OpenStreetMap** | No | 100% Free | Basic mapping, no API key needed |
| **Thrissur Local Map** | No | Free | Pre-configured for Thrissur region |

---

## 🚀 Quick Start (Choose Your Map)

### Option 1: Google Maps (Recommended)
**Best for:** Production apps, rich features, location search

```bash
# 1. Get API key from Google Cloud Console
# 2. Add to .env.local:
VITE_GOOGLE_MAPS_KEY=AIzaSyB_YOUR_KEY_HERE

# 3. Restart dev server
npm run dev
```

**Files:** `GoogleMapsProvider.tsx`, `EquipmentMap.tsx`  
**Full guide:** See `GOOGLE_MAPS_SETUP.md`

---

### Option 2: OpenStreetMap (100% Free)
**Best for:** No API key, unlimited usage, open-source

**Already installed!** Uses Leaflet + React Leaflet libraries.

**To use:**
```tsx
// In MapPage.tsx, replace Google Maps with:
import { OpenStreetMap } from '../components/OpenStreetMap';

// Then use:
<OpenStreetMap 
  equipment={equipment}
  center={mapCenter}
  onEquipmentClick={handleEquipmentClick}
/>
```

**No configuration needed** - works immediately!

---

### Option 3: Thrissur Map (Local Focus)
**Best for:** Kerala/Thrissur region equipment

Pre-configured with Thrissur coordinates and styling.

---

## 🔑 Get Google Maps API Key (5 minutes)

### Quick Steps:
1. **Go to:** https://console.cloud.google.com/
2. **Create project:** "Equipment-Sharing"
3. **Enable APIs:**
   - Maps JavaScript API ✅
   - (Optional) Places API for search
4. **Create Credentials:**
   - Click "+ CREATE CREDENTIALS" → API key
   - Copy the key (starts with `AIzaSy...`)
5. **Add to project:**
   ```bash
   # .env.local file:
   VITE_GOOGLE_MAPS_KEY=AIzaSyB1234567890abcdefg...
   ```
6. **Restart server:**
   ```bash
   npm run dev
   ```

### Restrict Key (Security):
- **HTTP referrers:** `http://localhost:5173/*`
- **API restrictions:** Only "Maps JavaScript API"

---

## 🗺️ Map Component Comparison

### Google Maps (`EquipmentMap.tsx`)
```tsx
<GoogleMapsProvider>
  <EquipmentMap 
    equipment={equipmentList}
    center={{ lat: 28.6139, lng: 77.2090 }}
    zoom={12}
    onEquipmentClick={handleClick}
  />
</GoogleMapsProvider>
```

**Pros:**
- ✅ Rich UI and features
- ✅ Street View, satellite imagery
- ✅ Places search integration
- ✅ Better for production

**Cons:**
- ❌ Requires API key
- ❌ Usage limits (generous free tier)
- ❌ Requires Google account

---

### OpenStreetMap (`OpenStreetMap.tsx`)
```tsx
<OpenStreetMap 
  equipment={equipmentList}
  center={{ lat: 28.6139, lng: 77.2090 }}
  zoom={12}
  onEquipmentClick={handleClick}
/>
```

**Pros:**
- ✅ **100% free** - no API key
- ✅ **Unlimited usage** - no restrictions
- ✅ Open-source (Leaflet)
- ✅ Works offline-ready
- ✅ No account needed

**Cons:**
- ❌ Fewer features (no places search built-in)
- ❌ Less polished UI
- ❌ No street view

---

## 💰 Cost Comparison

### Google Maps Pricing
| Feature | Free Tier | After Free Tier |
|---------|-----------|-----------------|
| Monthly credit | **$200** | - |
| Map loads | ~28,000/month | $7 per 1,000 |
| Geocoding | 40,000/month | $5 per 1,000 |
| Places search | 17,000/month | $17 per 1,000 |

**Reality:** Most small apps stay 100% free due to generous credits.

### OpenStreetMap
- ✅ **$0 forever**
- ✅ No limits
- ✅ No credit card needed

---

## 📦 Installed Dependencies

Your project already has both libraries installed:

```json
{
  "@vis.gl/react-google-maps": "^1.5.5",    // Google Maps
  "leaflet": "^1.9.4",                       // OpenStreetMap
  "react-leaflet": "^4.2.1",                 // OpenStreetMap React
  "@types/leaflet": "^1.9.21"                // TypeScript types
}
```

---

## 🛠️ Current Configuration

### Environment Variables (`.env.local`)
```bash
# Backend
VITE_API_URL=http://localhost:8080

# Maps (choose one or both)
VITE_GOOGLE_MAPS_KEY=YOUR_GOOGLE_MAPS_API_KEY   # For Google Maps
# OpenStreetMap needs no key

# Optional
VITE_MAPBOX_TOKEN=YOUR_MAPBOX_TOKEN_HERE        # Alternative map
```

### Config File (`src/utils/config.ts`)
```typescript
export const config = {
  API_BASE_URL: 'http://localhost:8080',
  GOOGLE_MAPS_KEY: import.meta.env.VITE_GOOGLE_MAPS_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',
  MAPBOX_TOKEN: import.meta.env.VITE_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN_HERE',
};
```

---

## 🎯 Which Map Should You Use?

### Use **Google Maps** if:
- ✅ You want the best user experience
- ✅ You need places search / autocomplete
- ✅ You're building a production app
- ✅ You expect < 28,000 map loads/month (free)
- ✅ You can spend 5 minutes getting an API key

### Use **OpenStreetMap** if:
- ✅ You want **zero setup** (no API key)
- ✅ You want **100% free** with unlimited usage
- ✅ You're prototyping / testing
- ✅ You prefer open-source solutions
- ✅ You don't need advanced features

---

## 📝 Next Steps

### If using Google Maps:
1. ✅ Follow `GOOGLE_MAPS_SETUP.md` for detailed setup
2. ✅ Get API key from Google Cloud Console
3. ✅ Add to `.env.local`
4. ✅ Restart dev server
5. ✅ Test at http://localhost:5173/map

### If using OpenStreetMap:
1. ✅ It's already installed and ready!
2. ✅ Just use the `OpenStreetMap` component
3. ✅ No configuration needed
4. ✅ Start using immediately

---

## 🐛 Troubleshooting

### Google Maps not showing?
```bash
# Check console for errors
# Verify .env.local has correct key
# Ensure Maps JavaScript API is enabled in Google Cloud
```

### OpenStreetMap not showing?
```bash
# Check if equipment has location data:
# location: { latitude: 28.6139, longitude: 77.2090 }
```

### General map issues?
```bash
# Check backend is running:
curl http://localhost:8080/equipment

# Check equipment has location data in response
```

---

## 📚 Documentation Links

- **Google Maps:** https://developers.google.com/maps/documentation/javascript
- **vis.gl (React wrapper):** https://visgl.github.io/react-google-maps/
- **Leaflet (OpenStreetMap):** https://leafletjs.com/
- **React Leaflet:** https://react-leaflet.js.org/

---

## 🎉 Recommended Setup

**For development/testing:** Start with **OpenStreetMap** (zero config, works now)  
**For production:** Upgrade to **Google Maps** (better UX, still free for most apps)

Both are already integrated in your project! 🚀
