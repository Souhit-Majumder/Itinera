"use client";

import { useEffect, useState } from "react";
import { useTrip } from "@/components/providers/TripProvider";
import { ItineraMap, ItineraMarker, ItineraRoute, TransportModeIcon } from "@/components/ui/Map";
import { ActiveQuest } from "@/components/journey/ActiveQuest";
import { JourneyHUD } from "@/components/journey/JourneyHUD";
import { SOSButton } from "@/components/safety/SOSButton";
import { AIGuide } from "@/components/ai/AIGuide";
import { BookingDrawer } from "@/components/booking/BookingDrawer";
import {
  getIntraCityRoute,
  getInterCityRoute,
  getRouteMidpoint,
} from "@/lib/map/routeGeometry";

/**
 * A single renderable route segment on the map.
 * Derived from the trip data — both inter-city legs and intra-city checkpoint
 * connections are normalised into this shape.
 */
interface ComputedRoute {
  id: string;
  points: [number, number][];
  variant: "completed" | "future";
  mode: string;
  midpoint: [number, number];
  /** Only set for inter-city legs so clicking opens the booking drawer */
  legId?: string;
}

export default function JourneyPage() {
  const { trip, setSelectedLegId } = useTrip();

  const [routes, setRoutes] = useState<ComputedRoute[]>([]);

  // ── Compute all route geometries ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function computeRoutes() {
      const result: ComputedRoute[] = [];

      // 1. Inter-city routes (from trip.legs — synchronous geometry)
      //    These connect different Destination objects, so the mode comes
      //    directly from the leg data.
      for (const leg of trip.legs) {
        const from = trip.destinations.find((d) => d.id === leg.fromDestinationId);
        const to = trip.destinations.find((d) => d.id === leg.toDestinationId);
        if (!from || !to) continue;

        const geometry = await getInterCityRoute(
          from.coordinates,
          to.coordinates,
          leg.mode
        );
        if (cancelled) return;

        result.push({
          id: `leg-${leg.id}`,
          points: geometry.points,
          variant: to.state === "locked" ? "future" : "completed",
          mode: leg.mode,
          midpoint: getRouteMidpoint(geometry.points),
          legId: leg.id,
        });
      }

      // 2. Intra-city routes (checkpoint → checkpoint within each Destination)
      //    Only for non-locked destinations, and only when ≥ 2 checkpoints exist.
      //    These are road-following (OSRM) and logically "walking" since the
      //    traveller explores tourist checkpoints on foot within a city.
      for (const dest of trip.destinations) {
        if (dest.state === "locked") continue;
        if (dest.checkpoints.length < 2) continue;

        for (let i = 0; i < dest.checkpoints.length - 1; i++) {
          if (cancelled) return;

          const cpFrom = dest.checkpoints[i];
          const cpTo = dest.checkpoints[i + 1];

          const geometry = await getIntraCityRoute(
            cpFrom.coordinates,
            cpTo.coordinates
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

      if (!cancelled) {
        setRoutes(result);
      }
    }

    computeRoutes();
    return () => {
      cancelled = true;
    };
  }, [trip.legs, trip.destinations]);

  // ── Derived values ───────────────────────────────────────────────────────
  const currentDestination = trip.destinations.find((d) => d.state === "current");

  // Include both destination coords and current-city checkpoint coords for viewport
  const fitPoints: [number, number][] = [
    ...trip.destinations.map((d) => d.coordinates),
    ...(currentDestination
      ? currentDestination.checkpoints.map((cp) => cp.coordinates)
      : []),
  ];

  const fallbackCenter: [number, number] = currentDestination
    ? currentDestination.coordinates
    : [12.9716, 77.5946];

  return (
    <div className="w-full h-full relative flex flex-col">
      <div className="absolute inset-0 z-0">
        <ItineraMap center={fallbackCenter} zoom={7} fitPoints={fitPoints}>
          {/* ── Destination markers ── */}
          {trip.destinations.map((dest) => {
            const color =
              dest.state === "completed"
                ? "emerald"
                : dest.state === "current"
                ? "amber"
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

          {/* ── Route polylines ── */}
          {routes.map((route) => (
            <ItineraRoute
              key={route.id}
              positions={route.points}
              variant={route.variant}
              onClick={
                route.legId
                  ? () => setSelectedLegId(route.legId!)
                  : undefined
              }
            />
          ))}

          {/* ── Transport mode icons ── */}
          {routes.map((route) => (
            <TransportModeIcon
              key={`icon-${route.id}`}
              position={route.midpoint}
              mode={route.mode}
            />
          ))}
        </ItineraMap>
      </div>

      {/* HUD overlay */}
      <div className="absolute top-0 left-0 w-full p-4 z-10 pointer-events-none">
        <JourneyHUD />
      </div>

      {/* Overlays */}
      <SOSButton />
      <AIGuide />
      <BookingDrawer />

      {/* Current Quest Bottom Sheet */}
      {currentDestination && (
        <div className="absolute bottom-20 md:bottom-6 left-0 w-full px-4 z-10 md:w-[400px]">
          <ActiveQuest destination={currentDestination} />
        </div>
      )}
    </div>
  );
}
