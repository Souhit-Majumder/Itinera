"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Trip, Destination, SOSResponder } from "@/types";
import { demoTrip, demoResponders } from "@/lib/demo/seed";

interface TripContextType {
  trip: Trip;
  responders: SOSResponder[];
  selectedLegId: string | null;
  setSelectedLegId: (id: string | null) => void;
  completeObjective: (destinationId: string, objectiveId: string) => void;
  bookLeg: (legId: string) => void;
  getPassportStamps: () => Destination[];
  switchTrip: (newTrip: Trip) => void;
  rollbackToStage: (destinationId: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [selectedLegId, setSelectedLegId] = useState<string | null>(null);

  useEffect(() => {
    // Load from local storage if available, otherwise use seed
    const saved = localStorage.getItem("itinera_trip");
    if (saved) {
      try {
        setTrip(JSON.parse(saved));
      } catch {
        setTrip(demoTrip);
      }
    } else {
      setTrip(demoTrip);
    }
  }, []);

  useEffect(() => {
    if (trip) {
      localStorage.setItem("itinera_trip", JSON.stringify(trip));
    }
  }, [trip]);

  const completeObjective = (destinationId: string, objectiveId: string) => {
    if (!trip) return;
    setTrip((prev) => {
      if (!prev) return prev;
      const newTrip = { ...prev };
      
      const destIndex = newTrip.destinations.findIndex(d => d.id === destinationId);
      if (destIndex === -1) return prev;
      
      const dest = { ...newTrip.destinations[destIndex] };
      const objIndex = dest.quest.objectives.findIndex(o => o.id === objectiveId);
      
      if (objIndex > -1) {
        dest.quest.objectives[objIndex].completed = true;
      }
      
      // Check if all objectives are completed
      const allCompleted = dest.quest.objectives.every(o => o.completed);
      if (allCompleted && dest.state === 'current') {
        dest.state = 'completed';
        
        // Unlock next destination if exists
        if (destIndex + 1 < newTrip.destinations.length) {
          newTrip.destinations[destIndex + 1].state = 'current';
        }
      }
      
      newTrip.destinations[destIndex] = dest;
      return newTrip;
    });
  };

  const bookLeg = (legId: string) => {
    if (!trip) return;
    setTrip((prev) => {
      if (!prev) return prev;
      const newTrip = { ...prev };
      const legIndex = newTrip.legs.findIndex(l => l.id === legId);
      if (legIndex > -1) {
        newTrip.legs[legIndex].booked = true;
        // Mock ticket payload generated
        newTrip.legs[legIndex].ticketPayload = `TICKET-${newTrip.legs[legIndex].provider.toUpperCase().replace(/\s/g, '')}-${Date.now()}`;
      }
      return newTrip;
    });
  };

  const getPassportStamps = () => {
    if (!trip) return [];
    return trip.destinations.filter(d => d.state === 'completed');
  };

  const switchTrip = (newTrip: Trip) => {
    setTrip(newTrip);
    setSelectedLegId(null);
  };

  /**
   * Roll the journey back to (or forward to) the destination with the given id.
   *
   * Rules applied to each destination in order:
   *  - index < targetIndex  → 'completed'  (preserve objective completion as-is)
   *  - index === targetIndex → 'current'    (reset all objectives to incomplete so
   *                                          the user can replay the stage)
   *  - index > targetIndex  → 'locked'     (reset objectives so future stages start
   *                                          fresh when they are reached again)
   *
   * Only destination.state and objective completion flags are touched.
   * Leg booking status, ticket payloads, and all other journey data are preserved.
   */
  const rollbackToStage = (destinationId: string) => {
    setTrip((prev) => {
      if (!prev) return prev;
      const targetIndex = prev.destinations.findIndex((d) => d.id === destinationId);
      if (targetIndex === -1) return prev;

      const newDestinations = prev.destinations.map((d, idx) => {
        if (idx < targetIndex) {
          // Keep as completed; preserve objectives
          return { ...d, state: 'completed' as const };
        }
        if (idx === targetIndex) {
          // This becomes the current (active) stage; reset its objectives
          return {
            ...d,
            state: 'current' as const,
            quest: {
              ...d.quest,
              objectives: d.quest.objectives.map((o) => ({ ...o, completed: false })),
            },
          };
        }
        // Future stages become locked and objectives reset
        return {
          ...d,
          state: 'locked' as const,
          quest: {
            ...d.quest,
            objectives: d.quest.objectives.map((o) => ({ ...o, completed: false })),
          },
        };
      });

      return { ...prev, destinations: newDestinations };
    });
    setSelectedLegId(null);
  };

  if (!trip) return null; // Avoid hydration mismatch or show minimal loader

  return (
    <TripContext.Provider value={{ trip, responders: demoResponders, selectedLegId, setSelectedLegId, completeObjective, bookLeg, getPassportStamps, switchTrip, rollbackToStage }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
}
