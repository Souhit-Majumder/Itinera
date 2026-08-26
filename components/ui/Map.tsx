"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LatLngTuple, LatLngBoundsExpression } from 'leaflet';
import { getTransportSVGPath } from "@/components/ui/TransportIcon";

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import('react-leaflet').then((mod) => mod.Tooltip),
  { ssr: false }
);

// Ensure leaflet CSS is loaded globally
import 'leaflet/dist/leaflet.css';

// ─── Helper: fit map to bounds ─────────────────────────────────────────────

/**
 * A small wrapper component that fits the map to given bounds once mounted.
 * We dynamically import `useMap` from react-leaflet to avoid SSR issues.
 */
const FitBoundsComponent = dynamic(
  () =>
    import('react-leaflet').then((mod) => {
      const { useMap } = mod;

      function FitBounds({ bounds, padding }: { bounds: LatLngBoundsExpression; padding: [number, number] }) {
        const map = useMap();

        useEffect(() => {
          if (bounds) {
            map.fitBounds(bounds, {
              padding,
              maxZoom: 12,
              animate: true,
              duration: 0.8,
            });
          }
        }, [map, bounds, padding]);

        return null;
      }

      FitBounds.displayName = 'FitBounds';
      return FitBounds;
    }),
  { ssr: false }
);

// ─── ItineraMap ─────────────────────────────────────────────────────────────

interface ItineraMapProps {
  /** Fallback center if no bounds are provided */
  center: [number, number];
  /** Fallback zoom if no bounds are provided */
  zoom: number;
  /**
   * An array of [lat, lng] points the map should fit around.
   * When provided, `center` and `zoom` become initial fallbacks only.
   */
  fitPoints?: [number, number][];
  children: React.ReactNode;
}

export function ItineraMap({ center, zoom, fitPoints, children }: ItineraMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Initialize leaflet default icon on client
    import('leaflet').then((L) => {
      const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
      });
      L.Marker.prototype.options.icon = DefaultIcon;
    });
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">
        Loading Map...
      </div>
    );
  }

  // Compute bounds from fitPoints
  let bounds: LatLngBoundsExpression | null = null;
  if (fitPoints && fitPoints.length >= 2) {
    bounds = fitPoints.map((p) => [p[0], p[1]] as LatLngTuple) as LatLngBoundsExpression;
  }

  return (
    <MapContainer
      center={center as LatLngTuple}
      zoom={zoom}
      scrollWheelZoom={true}
      className="w-full h-full z-0"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {bounds && <FitBoundsComponent bounds={bounds} padding={[60, 60]} />}
      {children}
    </MapContainer>
  );
}

// ─── ItineraMarker ──────────────────────────────────────────────────────────

export function ItineraMarker({
  position,
  label,
  color = 'blue',
}: {
  position: [number, number];
  label?: string;
  color?: string;
}) {
  const [L, setL] = useState<typeof import('leaflet') | null>(null);

  useEffect(() => {
    import('leaflet').then((leaflet) => setL(leaflet));
  }, []);

  if (!L) return null;

  const bgClass =
    color === 'amber'
      ? 'bg-amber-400'
      : color === 'emerald'
      ? 'bg-emerald-500'
      : color === 'slate'
      ? 'bg-slate-300'
      : 'bg-indigo-500';

  const sizeClass =
    color === 'slate' ? 'w-3 h-3' : 'w-4 h-4';

  const CustomIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div class="${sizeClass} rounded-full border-2 border-white shadow-md ${bgClass}" style="box-shadow: 0 1px 4px rgba(0,0,0,0.18);"></div>`,
    iconSize: color === 'slate' ? [12, 12] : [16, 16],
    iconAnchor: color === 'slate' ? [6, 6] : [8, 8],
  });

  return (
    <Marker position={position as LatLngTuple} icon={CustomIcon}>
      {label && (
        <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
          <span className="font-sans font-medium text-slate-800">{label}</span>
        </Tooltip>
      )}
    </Marker>
  );
}

// ─── ItineraRoute (3D-depth route with shadow) ─────────────────────────────

/**
 * Renders a route with a layered 3D-depth effect:
 *  1. A wide, blurred shadow line (offset slightly south) for depth
 *  2. An outer "casing" line for definition
 *  3. The main colored route line on top
 *
 * For dashed (future/locked) routes, the shadow is subtler and the main
 * line uses a gray dashed pattern.
 */
export function ItineraRoute({
  positions,
  variant = 'completed',
  onClick,
}: {
  positions: [number, number][];
  variant?: 'completed' | 'future';
  onClick?: () => void;
}) {
  if (!positions || positions.length < 2) return null;

  const latLngPositions = positions as LatLngTuple[];

  // Create a very slight southward offset for the shadow to simulate depth
  const shadowOffset = 0.0008;
  const shadowPositions: LatLngTuple[] = latLngPositions.map(([lat, lng]) => [
    lat - shadowOffset,
    lng + shadowOffset * 0.5,
  ]);

  if (variant === 'future') {
    return (
      <>
        {/* Shadow layer — very faint for future routes */}
        <Polyline
          positions={shadowPositions}
          pathOptions={{
            color: '#94a3b8',
            weight: 6,
            opacity: 0.08,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
        {/* Main dashed line */}
        <Polyline
          positions={latLngPositions}
          eventHandlers={{ click: onClick }}
          pathOptions={{
            color: '#94a3b8',
            weight: 3,
            opacity: 0.45,
            dashArray: '8, 12',
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      </>
    );
  }

  // Completed route — solid with 3D depth
  return (
    <>
      {/* Shadow layer — soft, wide, offset for 3D depth */}
      <Polyline
        positions={shadowPositions}
        pathOptions={{
          color: '#1e1b4b',
          weight: 8,
          opacity: 0.07,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
      {/* Casing layer — slightly darker outline for definition */}
      <Polyline
        positions={latLngPositions}
        pathOptions={{
          color: '#312e81',
          weight: 6,
          opacity: 0.15,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
      {/* Main route line */}
      <Polyline
        positions={latLngPositions}
        eventHandlers={{ click: onClick }}
        pathOptions={{
          color: '#6366f1',
          weight: 3.5,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
    </>
  );
}

// ─── Transport Mode Icon ────────────────────────────────────────────────────


/**
 * Renders a small circular badge with a transport-mode icon at a given map position.
 * Uses Material Design-inspired SVGs matching Google Maps iconography.
 */
export function TransportModeIcon({
  position,
  mode,
}: {
  position: [number, number];
  mode: string;
}) {
  const [L, setL] = useState<typeof import('leaflet') | null>(null);

  useEffect(() => {
    import('leaflet').then((leaflet) => setL(leaflet));
  }, []);

  if (!L) return null;

  const svgPath = getTransportSVGPath(mode);

  const icon = L.divIcon({
    className: 'transport-mode-icon',
    html: `<div style="
      width: 26px; height: 26px;
      background: #fff;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04);
    "><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#475569">${svgPath}</svg></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });

  return <Marker position={position as LatLngTuple} icon={icon} />;
}

// Legacy export for backward compatibility
export function ItineraPath({
  positions,
  dashed = false,
  onClick,
}: {
  positions: [number, number][];
  dashed?: boolean;
  onClick?: () => void;
}) {
  return (
    <ItineraRoute
      positions={positions}
      variant={dashed ? 'future' : 'completed'}
      onClick={onClick}
    />
  );
}

