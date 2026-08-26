import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cityName, mode, lat, lng } = body;

    if (!cityName || !mode || typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    // Fallback if no API key
    if (!apiKey) {
      console.log('No GOOGLE_PLACES_API_KEY found, using fallback terminal coords');
      return NextResponse.json({
        terminal: {
          coordinates: [lat, lng], // Fall back to city center (do not use arbitrary offset per user request)
          name: `${cityName} Center (Fallback)`
        }
      });
    }

    // Google Places TextSearch
    let query = '';
    if (mode === 'flight') query = `airport in ${cityName}`;
    else if (mode === 'train') query = `railway station in ${cityName}`;
    else if (mode === 'bus') query = `bus terminal in ${cityName}`;
    else {
      // For car/taxi etc, just use city center
      return NextResponse.json({
        terminal: {
          coordinates: [lat, lng],
          name: `${cityName} Center`
        }
      });
    }

    const requestBody = {
      textQuery: query,
      maxResultCount: 1,
      locationBias: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 20000, // 20km
        }
      }
    };

    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.location,places.displayName'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Places API error:', errorText);
      // Fall back to city center
      return NextResponse.json({
        terminal: {
          coordinates: [lat, lng],
          name: `${cityName} Center`
        }
      });
    }

    const data = await response.json();
    
    if (data.places && data.places.length > 0) {
      const place = data.places[0];
      return NextResponse.json({
        terminal: {
          coordinates: [place.location.latitude, place.location.longitude],
          name: place.displayName?.text || `${cityName} Terminal`
        }
      });
    }

    // Default fallback
    return NextResponse.json({
      terminal: {
        coordinates: [lat, lng],
        name: `${cityName} Center`
      }
    });

  } catch (err) {
    console.error('Failed to resolve terminal:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
