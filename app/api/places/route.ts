import { NextResponse } from 'next/server';
import { getFallbackHotspotsByLocation } from '@/lib/places/fallback';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lat, lng, radius = 50000, category } = body;

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json({ error: 'Missing or invalid lat/lng' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    // Use fallback data if no API key is provided
    if (!apiKey) {
      console.log('No GOOGLE_PLACES_API_KEY found, using fallback data');
      const fallback = getFallbackHotspotsByLocation(lat, lng);
      // We return the raw fallback, client will filter by category/radius
      return NextResponse.json({ hotspots: fallback });
    }

    // Call Google Places API (New) - Nearby Search
    const requestBody: any = {
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: radius,
        }
      }
    };

    if (category && category !== 'all' && category !== 'transport') {
      // Map our simple categories to Google Places types
      const typeMap: Record<string, string[]> = {
        'attraction': ['tourist_attraction', 'amusement_park'],
        'restaurant': ['restaurant', 'cafe'],
        'museum': ['museum', 'art_gallery'],
        'park': ['park', 'national_park'],
        'shopping': ['shopping_mall', 'market'],
        'hotel': ['hotel', 'lodging'],
        'nightlife': ['bar', 'night_club']
      };
      const includedTypes = typeMap[category];
      if (includedTypes) {
        requestBody.includedTypes = includedTypes;
      }
    }

    const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.primaryType,places.rating,places.userRatingCount,places.priceLevel,places.currentOpeningHours.openNow,places.photos'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Places API error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch places data' }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.places || !Array.isArray(data.places)) {
       return NextResponse.json({ hotspots: [] });
    }

    // Map Google response to our Hotspot format
    const hotspots = data.places.map((place: any) => {
      // Calculate a rough distance in km
      const dLat = (place.location.latitude - lat) * 111;
      const dLng = (place.location.longitude - lng) * 111 * Math.cos(lat * (Math.PI / 180));
      const distanceKm = Math.sqrt(dLat * dLat + dLng * dLng);

      // Map price level
      let budgetLevel = 2; // default
      if (place.priceLevel === 'PRICE_LEVEL_INEXPENSIVE') budgetLevel = 1;
      else if (place.priceLevel === 'PRICE_LEVEL_MODERATE') budgetLevel = 2;
      else if (place.priceLevel === 'PRICE_LEVEL_EXPENSIVE') budgetLevel = 3;
      else if (place.priceLevel === 'PRICE_LEVEL_VERY_EXPENSIVE') budgetLevel = 4;

      // Extract photo
      let photoUrl = undefined;
      if (place.photos && place.photos.length > 0) {
        const photo = place.photos[0];
        // Point to our secure proxy instead of direct to Google
        photoUrl = `/api/places/photo?name=${encodeURIComponent(photo.name)}&maxWidthPx=400&maxHeightPx=400`;
      }

      // Map category
      let mappedCategory = 'attraction';
      if (place.primaryType) {
        if (place.primaryType.includes('restaurant') || place.primaryType.includes('cafe')) mappedCategory = 'restaurant';
        else if (place.primaryType.includes('museum') || place.primaryType.includes('gallery')) mappedCategory = 'museum';
        else if (place.primaryType.includes('park')) mappedCategory = 'park';
        else if (place.primaryType.includes('shopping') || place.primaryType.includes('market')) mappedCategory = 'shopping';
        else if (place.primaryType.includes('hotel') || place.primaryType.includes('lodging')) mappedCategory = 'hotel';
        else if (place.primaryType.includes('bar') || place.primaryType.includes('club')) mappedCategory = 'nightlife';
      }

      return {
        id: place.id,
        name: place.displayName?.text || 'Unknown Place',
        category: mappedCategory,
        coordinates: [place.location.latitude, place.location.longitude],
        rating: place.rating,
        ratingCount: place.userRatingCount,
        budgetLevel,
        openNow: place.currentOpeningHours?.openNow,
        photoUrl,
        distanceKm: Math.round(distanceKm * 10) / 10
      };
    });

    return NextResponse.json({ hotspots });
  } catch (error) {
    console.error('Error in /api/places:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
