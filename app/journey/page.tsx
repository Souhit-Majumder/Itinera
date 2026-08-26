"use client";

import { useEffect, useState } from "react";
import { useTrip } from "@/components/providers/TripProvider";
import { ItineraMap, ItineraMarker, ItineraRoute, TransportModeIcon } from "@/components/ui/Map";
import { JourneySidebar } from "@/components/journey/JourneySidebar";
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
  variant: "completed" | "future";
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
  const { trip, setSelectedLegId } = useTrip();
  const [routes, setRoutes] = useState<ComputedRoute[]>([]);

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
        const variant: "completed" | "future" =
          toIndex <= effectiveCurrentIndex ? "completed" : "future";

        const flipArc =
          leg.mode === "flight"
            ? shouldFlipFlightArc(fromDest.coordinates, toDest.coordinates, nonFlightCorridors)
            : false;

        const geometry = await getInterCityRoute(
          fromDest.coordinates,
          toDest.coordinates,
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
        if (dest.checkpoints.length < 2) continue;

        for (let i = 0; i < dest.checkpoints.length - 1; i++) {
          if (cancelled) return;
          const geometry = await getIntraCityRoute(
            dest.checkpoints[i].coordinates,
            dest.checkpoints[i + 1].coordinates
          );
          if (cancelled) return;
          result.push({
            id: `intra-${dest.id}-${i}`,
            points: geometry.points,
            variant: "completed",
            mode: "walking",
            midpoint: getRouteMidpoint(geometry.points),
          });
        }
      }

      if (!cancelled) setRoutes(result);
    }

    computeRoutes();
    return () => { cancelled = true; };
  }, [trip.legs, trip.destinations]);

  const currentDestination = trip.destinations.find((d) => d.state === "current");

  const fitPoints: [number, number][] = [
    ...trip.destinations.map((d) => d.coordinates),
    ...(currentDestination ? currentDestination.checkpoints.map((cp) => cp.coordinates) : []),
  ];

  const fallbackCenter: [number, number] = currentDestination
    ? currentDestination.coordinates
    : [12.9716, 77.5946];

  return (
    <div className="w-full h-full relative flex flex-col">
      <div className="absolute inset-0 z-0">
        <ItineraMap center={fallbackCenter} zoom={7} fitPoints={fitPoints}>
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
              />
            );
          })}

          {routes.map((route) => (
            <ItineraRoute
              key={route.id}
              positions={route.points}
              variant={route.variant}
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
        </ItineraMap>
      </div>

      {/* Full-height collapsible sidebar — contains quest details + progress controls */}
      <JourneySidebar />
      <SOSButton />
      <AIGuide />
      <BookingDrawer />
    </div>
  );
}
