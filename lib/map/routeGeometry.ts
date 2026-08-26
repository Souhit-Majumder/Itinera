/**
 * Route geometry utilities for the Itinera map.
 *
 * Classification (derived from the data model, not hardcoded):
 *  - Intra-city: sequential checkpoint connections within a Destination → OSRM walking
 *  - Inter-city: TransportLeg connecting different Destinations:
 *      - flight → smooth parabolic arc (strongly curved 3D-looking)
 *      - bus/train/taxi/car/bike → OSRM road-following (mapped to appropriate profile)
 *
 * OSRM expects longitude,latitude order (reversed from our [lat, lng] convention).
 */

// ─── OSRM (road-following) ─────────────────────────────────────────────────

async function fetchOSRMRoute(
  from: [number, number],
  to: [number, number],
  profile: 'driving' | 'walking' | 'cycling' = 'driving'
): Promise<[number, number][] | null> {
  try {
    const coords = `${from[1]},${from[0]};${to[1]},${to[0]}`;
    const url = `https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=full&geometries=geojson`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.code !== 'Ok' || !data.routes?.[0]?.geometry?.coordinates) {
      return null;
    }

    // GeoJSON coordinates are [lng, lat] → convert to [lat, lng]
    return data.routes[0].geometry.coordinates.map(
      (c: [number, number]) => [c[1], c[0]] as [number, number]
    );
  } catch {
    return null;
  }
}

// ─── Geometry generators ───────────────────────────────────────────────────

/**
 * Generate a smooth, symmetric 3D-looking flight arc between two points.
 *
 * The arc is displaced perpendicularly to the chord (the straight line between
 * the two endpoints) using a parabolic `4t(1-t)` weight. This guarantees:
 *  - Both endpoints are exactly anchored (displacement = 0 at t=0 and t=1).
 *  - The apex is exactly at the midpoint (t=0.5).
 *  - The arc is perfectly symmetric regardless of compass heading.
 *
 * @param flipArc  Mirror the arc to the opposite side of the chord.
 *                 Use when the default arc visually conflicts with another route.
 */
function generateFlightArc(
  from: [number, number],
  to: [number, number],
  segments = 60,
  flipArc = false
): [number, number][] {
  const dLat = to[0] - from[0];
  const dLng = to[1] - from[1];
  const chordLength = Math.sqrt(dLat * dLat + dLng * dLng);

  const arcHeight = Math.max(chordLength * 0.35, 1.5);

  // Unit perpendicular: rotate chord 90° CCW. Negate to flip to opposite side.
  const side = flipArc ? 1 : -1;
  const perpLat = chordLength > 0 ? side * (-dLng / chordLength) : 0;
  const perpLng = chordLength > 0 ? side * ( dLat / chordLength) : 0;

  const points: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const offset = arcHeight * 4 * t * (1 - t);
    points.push([
      from[0] + dLat * t + perpLat * offset,
      from[1] + dLng * t + perpLng * offset,
    ]);
  }
  return points;
}

/**
 * Generate a gentle quadratic bezier curve between two points.
 * Fallback for non-flight inter-city routes if OSRM fails.
 */
function generateDirectCurve(
  from: [number, number],
  to: [number, number],
  segments = 32
): [number, number][] {
  const points: [number, number][] = [];
  const midLat = (from[0] + to[0]) / 2;
  const midLng = (from[1] + to[1]) / 2;
  const dLat = to[0] - from[0];
  const dLng = to[1] - from[1];
  // Small perpendicular offset for a gentle, natural-looking curve
  const offsetScale = 0.035;
  const perpLat = -dLng * offsetScale;
  const perpLng = dLat * offsetScale;
  const controlLat = midLat + perpLat;
  const controlLng = midLng + perpLng;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lat =
      (1 - t) * (1 - t) * from[0] +
      2 * (1 - t) * t * controlLat +
      t * t * to[0];
    const lng =
      (1 - t) * (1 - t) * from[1] +
      2 * (1 - t) * t * controlLng +
      t * t * to[1];
    points.push([lat, lng]);
  }
  return points;
}

/**
 * Generate a simple straight line with intermediate points.
 * Fallback for short-distance intra-city when OSRM is unavailable.
 */
function generateStraightLine(
  from: [number, number],
  to: [number, number],
  segments = 8
): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    points.push([
      from[0] + (to[0] - from[0]) * t,
      from[1] + (to[1] - from[1]) * t,
    ]);
  }
  return points;
}

// ─── Public API ────────────────────────────────────────────────────────────

export interface RouteGeometry {
  points: [number, number][];
  source: 'osrm' | 'arc' | 'curve' | 'interpolated';
}

/**
 * Get road-following geometry for an intra-city route (checkpoint → checkpoint).
 * Uses OSRM walking profile, falls back to a straight line.
 */
export async function getIntraCityRoute(
  from: [number, number],
  to: [number, number]
): Promise<RouteGeometry> {
  const osrmRoute = await fetchOSRMRoute(from, to, 'walking');
  if (osrmRoute && osrmRoute.length > 2) {
    return { points: osrmRoute, source: 'osrm' };
  }
  return { points: generateStraightLine(from, to), source: 'interpolated' };
}

/**
 * Get geometry for an inter-city route based on transport mode.
 * Flights get a 3D parabolic arc. Other modes use OSRM road-following mapped to
 * the closest available profile (train/bus/car -> driving, bike -> cycling).
 */
export async function getInterCityRoute(
  from: [number, number],
  to: [number, number],
  mode: string,
  flipArc = false
): Promise<RouteGeometry> {
  if (mode === 'flight' || mode === 'plane') {
    return { points: generateFlightArc(from, to, 60, flipArc), source: 'arc' };
  }

  // Map transport mode to OSRM profile
  let profile: 'driving' | 'walking' | 'cycling' = 'driving';
  if (mode === 'bicycle' || mode === 'bike') profile = 'cycling';
  if (mode === 'walking') profile = 'walking';
  
  // Note: OSRM doesn't have a native train profile, so we use driving 
  // to ensure road/path/rail transport follows relevant map geometry 
  // rather than drawing arbitrary straight lines.
  const osrmRoute = await fetchOSRMRoute(from, to, profile);
  if (osrmRoute && osrmRoute.length > 2) {
    return { points: osrmRoute, source: 'osrm' };
  }

  // Fallback if OSRM is unreachable
  return { points: generateDirectCurve(from, to), source: 'curve' };
}

/**
 * Find the geographic midpoint of a route (by index).
 */
export function getRouteMidpoint(points: [number, number][]): [number, number] {
  if (points.length === 0) return [0, 0];
  const mid = Math.floor(points.length / 2);
  return points[mid];
}
