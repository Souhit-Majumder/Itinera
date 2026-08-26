import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const maxHeightPx = searchParams.get('maxHeightPx') || '400';
    const maxWidthPx = searchParams.get('maxWidthPx') || '400';

    if (!name || typeof name !== 'string') {
      return new NextResponse('Missing photo name', { status: 400 });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return new NextResponse('API key missing', { status: 500 });
    }

    // Google Places API New photo endpoint
    const url = `https://places.googleapis.com/v1/${name}/media?maxHeightPx=${maxHeightPx}&maxWidthPx=${maxWidthPx}&key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error('Google Places Photo API error:', response.statusText);
      return new NextResponse('Failed to fetch photo', { status: response.status });
    }

    // Proxy the image data directly
    const imageBuffer = await response.arrayBuffer();

    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=86400'); // cache for 1 day

    return new NextResponse(imageBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error proxying photo:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
