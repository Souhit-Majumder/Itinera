"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Trip, Destination, SOSResponder, Hotspot } from "@/types";
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
  addHotspotToJourney: (destinationId: string, hotspot: Hotspot) => void;
  removeHotspotFromJourney: (destinationId: string, hotspotId: string) => void;
  focusedCheckpointId: string | null;
  setFocusedCheckpointId: (id: string | null) => void;
  setArrivalMode: (destinationId: string, mode: 'walking' | 'car') => void;
  reorderCheckpoints: (destinationId: string, fromIndex: number, toIndex: number) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [selectedLegId, setSelectedLegId] = useState<string | null>(null);
  const [focusedCheckpointId, setFocusedCheckpointId] = useState<string | null>(null);

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

  // Terminal resolving effect + arrivalMode initialization
  useEffect(() => {
    if (!trip) return;

    let needsLegUpdate = false;
    const newLegs = trip.legs.map(leg => {
      if (!leg.fromTerminalCoordinates || !leg.toTerminalCoordinates) {
        needsLegUpdate = true;
      }
      return { ...leg };
    });

    let needsDestUpdate = false;
    const newDests = trip.destinations.map(d => {
      if (!d.arrivalMode) {
        needsDestUpdate = true;
      }
      return { ...d };
    });

    if (!needsLegUpdate && !needsDestUpdate) return;

    const resolve = async () => {
      // Resolve missing terminals
      for (let leg of newLegs) {
        if (leg.fromTerminalCoordinates && leg.toTerminalCoordinates) continue;

        const fromDest = newDests.find(d => d.id === leg.fromDestinationId);
        const toDest = newDests.find(d => d.id === leg.toDestinationId);

        if (!leg.fromTerminalCoordinates && fromDest) {
          const res = await fetch('/api/places/terminal', {
            method: 'POST',
            body: JSON.stringify({ cityName: fromDest.name, mode: leg.mode, lat: fromDest.coordinates[0], lng: fromDest.coordinates[1] })
          }).then(r => r.json()).catch(() => null);
          if (res?.terminal?.coordinates) leg.fromTerminalCoordinates = res.terminal.coordinates;
          else leg.fromTerminalCoordinates = fromDest.coordinates;
        }

        if (!leg.toTerminalCoordinates && toDest) {
          const res = await fetch('/api/places/terminal', {
            method: 'POST',
            body: JSON.stringify({ cityName: toDest.name, mode: leg.mode, lat: toDest.coordinates[0], lng: toDest.coordinates[1] })
          }).then(r => r.json()).catch(() => null);
          if (res?.terminal?.coordinates) leg.toTerminalCoordinates = res.terminal.coordinates;
          else leg.toTerminalCoordinates = toDest.coordinates;
        }
      }

      // Initialize arrivalMode if missing
      for (let i = 0; i < newDests.length; i++) {
        const d = newDests[i];
        if (!d.arrivalMode) {
          const arrivingLeg = newLegs.find(l => l.toDestinationId === d.id);
          const terminalCoords = arrivingLeg?.toTerminalCoordinates || d.coordinates;
          const firstCheckpoint = d.checkpoints[0];
          
          if (firstCheckpoint) {
            // Haversine distance
            const R = 6371; // km
            const dLat = (firstCheckpoint.coordinates[0] - terminalCoords[0]) * Math.PI / 180;
            const dLng = (firstCheckpoint.coordinates[1] - terminalCoords[1]) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(terminalCoords[0] * Math.PI / 180) * Math.cos(firstCheckpoint.coordinates[0] * Math.PI / 180) *
                      Math.sin(dLng/2) * Math.sin(dLng/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const dist = R * c;
            
            d.arrivalMode = dist <= 2 ? 'walking' : 'car';
          } else {
            d.arrivalMode = 'walking';
          }
        }
      }

      setTrip(prev => prev ? { ...prev, legs: newLegs, destinations: newDests } : prev);
    };

    resolve();
  }, [trip]);

  const completeObjective = (destinationId: string, objectiveId: string) => {
    if (!trip) return;
    setTrip((prev) => {
      if (!prev) return prev;
      const newTrip = { ...prev, destinations: [...prev.destinations] };
      
      const destIndex = newTrip.destinations.findIndex(d => d.id === destinationId);
      if (destIndex === -1) return prev;
      
      const dest = { ...newTrip.destinations[destIndex] };
      dest.quest = { ...dest.quest, objectives: [...dest.quest.objectives] };
      const objIndex = dest.quest.objectives.findIndex(o => o.id === objectiveId);
      
      if (objIndex > -1) {
        dest.quest.objectives[objIndex] = { ...dest.quest.objectives[objIndex], completed: true };
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
      const newTrip = { ...prev, legs: [...prev.legs] };
      const legIndex = newTrip.legs.findIndex(l => l.id === legId);
      if (legIndex > -1) {
        newTrip.legs[legIndex] = {
          ...newTrip.legs[legIndex],
          booked: true,
          ticketPayload: `TICKET-${newTrip.legs[legIndex].provider.toUpperCase().replace(/\s/g, '')}-${Date.now()}`
        };
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

  const addHotspotToJourney = (destinationId: string, hotspot: Hotspot) => {
    setTrip((prev) => {
      if (!prev) return prev;
      const targetIndex = prev.destinations.findIndex((d) => d.id === destinationId);
      if (targetIndex === -1) return prev;
      
      const newTrip = { ...prev, destinations: [...prev.destinations] };
      const dest = { ...newTrip.destinations[targetIndex] };
      const checkpoints = [...dest.checkpoints];
      const objectives = [...dest.quest.objectives];
      
      // Avoid duplicate adds
      if (checkpoints.some(c => c.hotspotId === hotspot.id)) return prev;

      checkpoints.push({
        id: `cp-${hotspot.id}`,
        name: hotspot.name,
        type: hotspot.category as any,
        coordinates: hotspot.coordinates,
        hotspotId: hotspot.id
      });
      
      objectives.push({
        id: `obj-${hotspot.id}`,
        title: `Visit ${hotspot.name}`,
        completed: false
      });
      
      dest.checkpoints = checkpoints;
      dest.quest = { ...dest.quest, objectives };
      newTrip.destinations[targetIndex] = dest;
      
      return newTrip;
    });
  };

  const removeHotspotFromJourney = (destinationId: string, hotspotId: string) => {
    setTrip((prev) => {
      if (!prev) return prev;
      const targetIndex = prev.destinations.findIndex((d) => d.id === destinationId);
      if (targetIndex === -1) return prev;
      
      const newTrip = { ...prev, destinations: [...prev.destinations] };
      const dest = { ...newTrip.destinations[targetIndex] };
      
      dest.checkpoints = dest.checkpoints.filter(c => c.hotspotId !== hotspotId);
      dest.quest = {
        ...dest.quest,
        objectives: dest.quest.objectives.filter(o => o.id !== `obj-${hotspotId}`)
      };
      
      // Also potentially fix dest state if we removed the last uncompleted objective
      const allCompleted = dest.quest.objectives.length > 0 && dest.quest.objectives.every(o => o.completed);
      if (allCompleted && dest.state === 'current') {
        dest.state = 'completed';
        if (targetIndex + 1 < newTrip.destinations.length) {
          newTrip.destinations[targetIndex + 1].state = 'current';
        }
      }
      
      newTrip.destinations[targetIndex] = dest;
      return newTrip;
    });
  };

  const setArrivalMode = (destinationId: string, mode: 'walking' | 'car') => {
    setTrip((prev) => {
      if (!prev) return prev;
      const targetIndex = prev.destinations.findIndex((d) => d.id === destinationId);
      if (targetIndex === -1) return prev;
      const newTrip = { ...prev, destinations: [...prev.destinations] };
      newTrip.destinations[targetIndex] = { ...newTrip.destinations[targetIndex], arrivalMode: mode };
      return newTrip;
    });
  };

  const reorderCheckpoints = (destinationId: string, fromIndex: number, toIndex: number) => {
    setTrip((prev) => {
      if (!prev) return prev;
      const targetIndex = prev.destinations.findIndex((d) => d.id === destinationId);
      if (targetIndex === -1) return prev;
      
      const newTrip = { ...prev, destinations: [...prev.destinations] };
      const dest = { ...newTrip.destinations[targetIndex] };
      
      if (fromIndex < 0 || fromIndex >= dest.checkpoints.length || toIndex < 0 || toIndex >= dest.checkpoints.length) {
        return prev;
      }

      const checkpoints = [...dest.checkpoints];
      const objectives = [...dest.quest.objectives];

      const [movedCp] = checkpoints.splice(fromIndex, 1);
      checkpoints.splice(toIndex, 0, movedCp);
      
      const [movedObj] = objectives.splice(fromIndex, 1);
      objectives.splice(toIndex, 0, movedObj);

      dest.checkpoints = checkpoints;
      dest.quest = { ...dest.quest, objectives };
      newTrip.destinations[targetIndex] = dest;
      
      return newTrip;
    });
  };

  if (!trip) return null; // Avoid hydration mismatch or show minimal loader

  return (
    <TripContext.Provider value={{ trip, responders: demoResponders, selectedLegId, setSelectedLegId, completeObjective, bookLeg, getPassportStamps, switchTrip, rollbackToStage, addHotspotToJourney, removeHotspotFromJourney, focusedCheckpointId, setFocusedCheckpointId, setArrivalMode, reorderCheckpoints }}>
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
