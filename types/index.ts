export type TripState = 'locked' | 'current' | 'completed';

export type TransportMode = 'bus' | 'train' | 'flight' | 'taxi' | 'walking' | 'car' | 'bicycle';

export interface Objective {
  id: string;
  title: string;
  completed: boolean;
}

export type HotspotCategory =
  | 'attraction' | 'restaurant' | 'museum' | 'park'
  | 'shopping' | 'hotel' | 'nightlife' | 'transport';

export type BudgetLevel = 1 | 2 | 3 | 4;

export interface Hotspot {
  id: string;
  name: string;
  category: HotspotCategory;
  coordinates: [number, number];
  rating?: number;
  ratingCount?: number;
  budgetLevel?: BudgetLevel;
  openNow?: boolean;
  photoUrl?: string;
  description?: string;
  distanceKm?: number;
}

export interface Checkpoint {
  id: string;
  name: string;
  type: 'hotel' | 'monument' | 'attraction' | 'transit' | 'restaurant' | 'museum' | 'park' | 'shopping' | 'nightlife' | 'transport';
  coordinates: [number, number]; // [lat, lng]
  hotspotId?: string; // links back to the Hotspot ID if added dynamically
}

export interface Destination {
  id: string;
  name: string;
  coordinates: [number, number];
  state: TripState;
  arrivalMode?: 'walking' | 'car';
  checkpoints: Checkpoint[];
  quest: {
    title: string;
    description: string;
    objectives: Objective[];
  };
}

export interface TransportLeg {
  id: string;
  fromDestinationId: string;
  toDestinationId: string;
  mode: TransportMode;
  provider: string;
  departureTime: string;
  arrivalTime: string;
  fare: string;
  booked: boolean;
  ticketPayload?: string;
  fromTerminalCoordinates?: [number, number];
  toTerminalCoordinates?: [number, number];
}

export interface Trip {
  id: string;
  name: string;
  destinations: Destination[];
  legs: TransportLeg[];
}

export interface SOSResponder {
  id: string;
  name: string;
  type: 'Police' | 'Hospital' | 'Embassy' | 'Tourist Police';
  distance: string;
  phone: string;
}
