
"use client"

import { useState, useEffect } from 'react';
import { IndianStates } from '@/lib/indian-states';

type GeolocationState = {
  latitude: number | null;
  longitude: number | null;
  state: string | null;
  error: string | null;
  isLoading: boolean;
};

// A very simple reverse geocoding approach. For production, use a dedicated API.
const statesCoordinates: { [key: string]: { lat: number, lon: number } } = {
    "Andhra Pradesh": { lat: 15.91, lon: 79.74 },
    "Arunachal Pradesh": { lat: 28.21, lon: 94.72 },
    "Assam": { lat: 26.20, lon: 92.93 },
    "Bihar": { lat: 25.09, lon: 85.31 },
    "Chhattisgarh": { lat: 21.27, lon: 81.86 },
    "Goa": { lat: 15.29, lon: 74.12 },
    "Gujarat": { lat: 22.25, lon: 71.19 },
    "Haryana": { lat: 29.05, lon: 76.08 },
    "Himachal Pradesh": { lat: 31.10, lon: 77.17 },
    "Jharkhand": { lat: 23.61, lon: 85.27 },
    "Karnataka": { lat: 15.31, lon: 75.71 },
    "Kerala": { lat: 10.85, lon: 76.27 },
    "Madhya Pradesh": { lat: 22.97, lon: 78.65 },
    "Maharashtra": { lat: 19.75, lon: 75.71 },
    "Manipur": { lat: 24.66, lon: 93.90 },
    "Meghalaya": { lat: 25.46, lon: 91.36 },
    "Mizoram": { lat: 23.16, lon: 92.93 },
    "Nagaland": { lat: 26.15, lon: 94.56 },
    "Odisha": { lat: 20.95, lon: 85.09 },
    "Punjab": { lat: 31.14, lon: 75.34 },
    "Rajasthan": { lat: 27.02, lon: 74.21 },
    "Sikkim": { lat: 27.53, lon: 88.51 },
    "Tamil Nadu": { lat: 11.12, lon: 78.65 },
    "Telangana": { lat: 18.11, lon: 79.01 },
    "Tripura": { lat: 23.94, lon: 91.98 },
    "Uttar Pradesh": { lat: 26.84, lon: 80.94 },
    "Uttarakhand": { lat: 30.06, lon: 79.01 },
    "West Bengal": { lat: 22.98, lon: 87.85 },
};


function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function findNearestState(latitude: number, longitude: number): string | null {
    let closestState: string | null = null;
    let minDistance = Infinity;

    for (const state of IndianStates) {
        if (statesCoordinates[state]) {
            const { lat, lon } = statesCoordinates[state];
            const distance = getDistance(latitude, longitude, lat, lon);
            if (distance < minDistance) {
                minDistance = distance;
                closestState = state;
            }
        }
    }
    return closestState;
}


export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    state: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      const onSuccess = (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        const nearestState = findNearestState(latitude, longitude);
        setLocation({
          latitude,
          longitude,
          state: nearestState,
          error: null,
          isLoading: false,
        });
      };

      const onError = (error: GeolocationPositionError) => {
        setLocation({
          latitude: null,
          longitude: null,
          state: null,
          error: `Geolocation error: ${error.message}`,
          isLoading: false,
        });
      };

      navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        state: null,
        error: 'Geolocation is not supported by your browser.',
        isLoading: false,
      });
    }
  }, []);

  return location;
}

    