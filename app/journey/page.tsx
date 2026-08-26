"use client";

import { useEffect, useState } from "react";
import { useTrip } from "@/components/providers/TripProvider";
import { ItineraMap, ItineraMarker, ItineraRoute, TransportModeIcon, HotspotMarker, CheckpointMarker } from "@/components/ui/Map";
import { JourneySidebar } from "@/components/journey/JourneySidebar";
import { HotspotPanel } from "@/components/hotspots/HotspotPanel";
import { Hotspot } from "@/types";
import { SOSButton } from "@/components/safety/SOSButton";
import { AIGuide } from "@/components/ai/AIGuide";
import { BookingDrawer } from "@/components/booking/BookingDrawer";
import {
  getIntraCityRoute,
  getInterCityRoute,
  getRouteMidpoint,
} from "@/lib/map/routeGeometry";

interface ComputedRoute {
  id: string;
  points: [number, number][];
  variant: "completed" | "current" | "future";
  mode: string;
  midpoint: [number, number];
  legId?: string;
}

/**
 * Determine whether a flight arc should be mirrored to the opposite side of
 * its chord to avoid visually colliding with another route segment.
 *
 * Strategy (deterministic — same journey always produces the same result):
 * For every non-flight route segment in the trip, test whether its midpoint
 * falls "near" the default arc's bounding corridor. If any non-flight route
 * shares the same general geographic corridor (start/end within 2° of the
 * flight's chord midpoint), flip the arc.
 */
function shouldFlipFlightArc(
  from: [number, number],
  to: [number, number],
  otherRoutes: { from: [number, number]; to: [number, number]; mode: string }[]
): boolean {
  const chordMidLat = (from[0] + to[0]) / 2;
  const chordMidLng = (from[1] + to[1]) / 2;
  const corridorRadius = Math.sqrt(
    (to[0] - from[0]) ** 2 + (to[1] - from[1]) ** 2
  ) * 0.5;

  for (const r of otherRoutes) {
    if (r.mode === "flight") continue;
    // Check if the other route's midpoint is within the flight's corridor
    const otherMidLat = (r.from[0] + r.to[0]) / 2;
    const otherMidLng = (r.from[1] + r.to[1]) / 2;
    const dist = Math.sqrt(
      (otherMidLat - chordMidLat) ** 2 + (otherMidLng - chordMidLng) ** 2
    );
    if (dist < corridorRadius * 0.8) return true;
  }
  return false;
}

export default function JourneyPage() {
  const { trip, setSelectedLegId, focusedCheckpointId, setFocusedCheckpointId } = useTrip();
  const [routes, setRoutes] = useState<ComputedRoute[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);

  const focusedCheckpoint = trip.destinations
    .flatMap((d) => d.checkpoints)
    .find((cp) => cp.id === focusedCheckpointId);
  
  // Track map bounds explicitly so we only refit when the city actually changes
  const [mapFitPoints, setMapFitPoints] = useState<[number, number][]>([]);

  const currentDestination = trip.destinations.find((d) => d.state === "current") || trip.destinations[0];

  useEffect(() => {
    if (currentDestination) {
      setMapFitPoints([
        currentDestination.coordinates,
        ...currentDestination.checkpoints.map((cp) => cp.coordinates)
      ]);
    }
  }, [currentDestination?.id]); // Only refit map when the city changes


  useEffect(() => {
    let cancelled = false;

    async function computeRoutes() {
      const result: ComputedRoute[] = [];

      // Effective current index for route state derivation
      const currentIndex = trip.destinations.findIndex((d) => d.state === "current");
      const effectiveCurrentIndex =
        currentIndex === -1 ? trip.destinations.length - 1 : currentIndex;

      // Build a lookup of all non-flight leg corridors for arc-flip detection
      const nonFlightCorridors = trip.legs
        .filter((l) => l.mode !== "flight")
        .map((l) => {
          const f = trip.destinations.find((d) => d.id === l.fromDestinationId);
          const t2 = trip.destinations.find((d) => d.id === l.toDestinationId);
          return f && t2
            ? { from: f.coordinates, to: t2.coordinates, mode: l.mode }
            : null;
        })
        .filter(Boolean) as { from: [number, number]; to: [number, number]; mode: string }[];

      // Inter-city legs
      for (const leg of trip.legs) {
        const fromDest = trip.destinations.find((d) => d.id === leg.fromDestinationId);
        const toDest   = trip.destinations.find((d) => d.id === leg.toDestinationId);
        if (!fromDest || !toDest) continue;

        const toIndex = trip.destinations.findIndex((d) => d.id === leg.toDestinationId);
        const variant: "completed" | "current" | "future" =
          toIndex < effectiveCurrentIndex ? "completed"
          : toIndex === effectiveCurrentIndex ? "current"
          : "future";

        const flipArc =
          leg.mode === "flight"
            ? shouldFlipFlightArc(fromDest.coordinates, toDest.coordinates, nonFlightCorridors)
            : false;

        const fromCoords = leg.fromTerminalCoordinates || fromDest.coordinates;
        const toCoords = leg.toTerminalCoordinates || toDest.coordinates;

        const geometry = await getInterCityRoute(
          fromCoords,
          toCoords,
          leg.mode,
          flipArc
        );
        if (cancelled) return;

        result.push({
          id: `leg-${leg.id}`,
          points: geometry.points,
          variant,
          mode: leg.mode,
          midpoint: getRouteMidpoint(geometry.points),
          legId: leg.id,
        });
      }

      // Intra-city checkpoint routes
      for (const dest of trip.destinations) {
        if (dest.state === "locked") continue;
        if (dest.state === "completed" && selectedDestinationId !== dest.id) continue;
        if (dest.checkpoints.length === 0) continue;

        const arrivingLeg = trip.legs.find(l => l.toDestinationId === dest.id);
        const arrivalTerminal = arrivingLeg?.toTerminalCoordinates || dest.coordinates;
        
        let pathNodes = [arrivalTerminal, ...dest.checkpoints.map(c => c.coordinates)];
        let modes = dest.checkpoints.map((_, i) => i === 0 ? (dest.arrivalMode || 'walking') : 'walking');
        
        if (dest.state === "current") {
           // Render from arrival up to the FIRST uncompleted checkpoint
           const firstUncompletedIndex = dest.quest.objectives.findIndex(o => !o.completed);
           if (firstUncompletedIndex > -1) {
             pathNodes = pathNodes.slice(0, firstUncompletedIndex + 2); 
             modes = modes.slice(0, firstUncompletedIndex + 1);
           }
        }
        
        if (pathNodes.length < 2) continue;

        for (let i = 0; i < pathNodes.length - 1; i++) {
          if (cancelled) return;
          const geometry = await getIntraCityRoute(
            pathNodes[i],
            pathNodes[i + 1],
            modes[i] as 'walking' | 'car'
          );
          if (cancelled) return;
          result.push({
            id: `intra-${dest.id}-${i}`,
            points: geometry.points,
            variant: dest.state === "completed" ? "completed"
                     : dest.state === "current" ? "current"
                     : "future",
            mode: modes[i],
            midpoint: getRouteMidpoint(geometry.points),
          });
        }
      }

      if (!cancelled) setRoutes(result);
    }

    computeRoutes();
    return () => { cancelled = true; };
  }, [trip.legs, trip.destinations, selectedDestinationId]);

  const fallbackCenter: [number, number] = currentDestination
    ? currentDestination.coordinates
    : [12.9716, 77.5946];

  return (
    <div className="w-full h-full relative flex flex-col">
      <div className="absolute inset-0 z-0">
        <ItineraMap 
          center={fallbackCenter} 
          zoom={12} 
          fitPoints={mapFitPoints.length > 0 ? mapFitPoints : undefined}
          focusPoint={selectedHotspot ? selectedHotspot.coordinates : focusedCheckpoint ? focusedCheckpoint.coordinates : null}
        >
          {trip.destinations.map((dest) => {
            const color =
              dest.state === "completed" ? "emerald"
              : dest.state === "current"  ? "amber"
              : "slate";
            return (
              <ItineraMarker
                key={dest.id}
                position={dest.coordinates}
                label={dest.name}
                color={color}
                onClick={() => setSelectedDestinationId(dest.id)}
              />
            );
          })}

          {trip.destinations.flatMap((dest) =>
            dest.checkpoints.map((cp) => (
              <CheckpointMarker
                key={cp.id}
                position={cp.coordinates}
                name={cp.name}
                type={cp.type}
                isSelected={focusedCheckpointId === cp.id}
                onClick={() => {
                  setFocusedCheckpointId(cp.id);
                }}
              />
            ))
          )}

          {routes.map((route) => (
            <ItineraRoute
              key={route.id}
              positions={route.points}
              variant={route.variant}
              mode={route.mode}
              onClick={route.legId ? () => setSelectedLegId(route.legId!) : undefined}
            />
          ))}

          {routes.map((route) => (
            <TransportModeIcon
              key={`icon-${route.id}`}
              position={route.midpoint}
              mode={route.mode}
            />
          ))}

          {selectedHotspot && (
            <HotspotMarker
              position={selectedHotspot.coordinates}
              name={selectedHotspot.name}
              category={selectedHotspot.category}
              isSelected
            />
          )}
        </ItineraMap>
      </div>

      {/* Full-height collapsible sidebar — contains quest details + progress controls */}
      <JourneySidebar />
      <HotspotPanel 
        selectedHotspot={selectedHotspot} 
        onHotspotSelect={setSelectedHotspot} 
      />
      <SOSButton />
      <AIGuide />
      <BookingDrawer />
    </div>
  );
}
