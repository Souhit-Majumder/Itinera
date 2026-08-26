import { useState, useEffect, useRef } from 'react';
import { Hotspot, HotspotCategory, BudgetLevel, TransportMode } from '@/types';

export function useHotspots(
  cityCoordinates: [number, number] | null,
  category: HotspotCategory | 'all',
  budgetFilter: BudgetLevel | null,
  transportFilter: TransportMode | null
) {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cache by coordinate string
  const cache = useRef<Map<string, Hotspot[]>>(new Map());

  useEffect(() => {
    if (!cityCoordinates) {
      setHotspots([]);
      return;
    }

    const [lat, lng] = cityCoordinates;
    const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    
    // Transport mode implies a rough radius for practicality.
    // walking: ~2km, bike: ~5km, car/taxi: ~50km, transit: ~20km, flight: ~100km
    let radius = 50000; // default 50km
    if (transportFilter === 'walking') radius = 2000;
    else if (transportFilter === 'bicycle') radius = 5000;
    else if (transportFilter === 'bus' || transportFilter === 'train') radius = 20000;
    else if (transportFilter === 'taxi' || transportFilter === 'car') radius = 50000;

    // We cache based on the radius as well because a different radius requires a new fetch
    const fullCacheKey = `${cacheKey}-${radius}`;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (cache.current.has(fullCacheKey)) {
          setHotspots(cache.current.get(fullCacheKey)!);
          setLoading(false);
          return;
        }

        // We fetch "all" categories and filter locally to avoid multiple API calls for the same location
        const res = await fetch('/api/places', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lng, radius, category: 'all' })
        });

        if (!res.ok) {
          throw new Error('Failed to fetch hotspots');
        }

        const data = await res.json();
        
        if (data.error) {
           throw new Error(data.error);
        }

        const items: Hotspot[] = data.hotspots || [];
        cache.current.set(fullCacheKey, items);
        setHotspots(items);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cityCoordinates, transportFilter]); // Only re-fetch if coordinates or transport (radius) changes

  // Filter client-side
  const filteredHotspots = hotspots.filter(h => {
    if (category !== 'all' && h.category !== category) return false;
    if (budgetFilter !== null && h.budgetLevel !== budgetFilter) return false;
    
    // Distance filter logic based on transport mode is already handled by the API radius for new fetches,
    // but for fallback data, we should also manually filter by distance if it exists.
    if (transportFilter && h.distanceKm) {
       if (transportFilter === 'walking' && h.distanceKm > 2.5) return false;
       if (transportFilter === 'bicycle' && h.distanceKm > 6.0) return false;
       if ((transportFilter === 'bus' || transportFilter === 'train') && h.distanceKm > 25.0) return false;
    }
    
    return true;
  });

  return { hotspots: filteredHotspots, loading, error };
}
