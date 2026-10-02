import { useState, useEffect } from 'react';
import { LocationContext } from './LocationContextValue';

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(() => {
    return localStorage.getItem('amzLocation') || 'New Delhi 110001';
  });

  const [coords, setCoords] = useState(() => {
    try {
      const saved = localStorage.getItem('amzCoords');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLiveDetected, setIsLiveDetected] = useState(() => {
    return localStorage.getItem('amzIsLiveGPS') === 'true';
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState('');
  const [detectSuccess, setDetectSuccess] = useState('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const updateLocation = (newLoc, newCoords = null, isLive = false) => {
    const trimmed = (newLoc || '').trim();
    if (!trimmed) return;
    
    setLocation(trimmed);
    localStorage.setItem('amzLocation', trimmed);
    
    if (newCoords) {
      setCoords(newCoords);
      localStorage.setItem('amzCoords', JSON.stringify(newCoords));
    }
    
    setIsLiveDetected(isLive);
    localStorage.setItem('amzIsLiveGPS', isLive ? 'true' : 'false');

    setDetectError('');
    setDetectSuccess(`Delivering to ${trimmed}`);
  };

  const detectLiveLocation = () => {
    if (!navigator.geolocation) {
      setDetectError('Geolocation is not supported by your browser. Please enter your PIN code manually.');
      return;
    }

    setIsDetecting(true);
    setDetectError('');
    setDetectSuccess('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const currentCoords = { lat: latitude, lon: longitude };

        try {
          let resolvedLocation = '';

          // 1. Try OpenStreetMap Nominatim reverse geocode
          try {
            const nomRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              { headers: { 'Accept-Language': 'en' } }
            );
            if (nomRes.ok) {
              const data = await nomRes.json();
              const addr = data.address || {};
              const city = addr.city || addr.town || addr.village || addr.suburb || addr.state_district || addr.county;
              const pincode = addr.postcode || '';
              
              if (city && pincode) {
                resolvedLocation = `${city} ${pincode}`;
              } else if (city) {
                resolvedLocation = `${city}${addr.state ? ', ' + addr.state : ''}`;
              }
            }
          } catch (nomErr) {
            console.warn('Nominatim reverse geocode failed, falling back to BigDataCloud', nomErr);
          }

          // 2. Fallback to BigDataCloud reverse geocode client API
          if (!resolvedLocation) {
            const bdcRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            if (bdcRes.ok) {
              const bdcData = await bdcRes.json();
              const city = bdcData.city || bdcData.locality || bdcData.principalSubdivision || 'Near You';
              const pincode = bdcData.postcode || '';
              resolvedLocation = pincode ? `${city} ${pincode}` : city;
            }
          }

          // 3. Fallback to generic Near Me if geocoders fail
          if (!resolvedLocation) {
            resolvedLocation = `Live Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
          }

          updateLocation(resolvedLocation, currentCoords, true);
          setDetectSuccess(`Live location detected: ${resolvedLocation}`);
          setTimeout(() => {
            setIsLocationModalOpen(false);
          }, 1200);

        } catch (fetchErr) {
          console.error('Error resolving coordinates:', fetchErr);
          setDetectError('Could not resolve your street address. Please enter PIN code manually.');
        } finally {
          setIsDetecting(false);
        }
      },
      (geoErr) => {
        setIsDetecting(false);
        switch (geoErr.code) {
          case geoErr.PERMISSION_DENIED:
            setDetectError('Location permission denied. Please enable location access in browser or choose your city below.');
            break;
          case geoErr.POSITION_UNAVAILABLE:
            setDetectError('Location information is currently unavailable. Please enter your PIN code.');
            break;
          case geoErr.TIMEOUT:
            setDetectError('Location request timed out. Please try again or select your city.');
            break;
          default:
            setDetectError('An unknown error occurred while retrieving location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const openLocationModal = () => {
    setDetectError('');
    setDetectSuccess('');
    setIsLocationModalOpen(true);
  };

  const closeLocationModal = () => {
    setIsLocationModalOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        coords,
        isLiveDetected,
        isDetecting,
        detectError,
        detectSuccess,
        isLocationModalOpen,
        openLocationModal,
        closeLocationModal,
        detectLiveLocation,
        updateLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
