export type TripState = 'locked' | 'current' | 'completed';

export type TransportMode = 'bus' | 'train' | 'flight' | 'taxi' | 'walking' | 'car' | 'bicycle';

export interface Objective {
  id: string;
  title: string;
  completed: boolean;
}

export interface Checkpoint {
  id: string;
  name: string;
  type: 'hotel' | 'monument' | 'attraction' | 'transit';
  coordinates: [number, number]; // [lat, lng]
}

export interface Destination {
  id: string;
  name: string;
  coordinates: [number, number];
  state: TripState;
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
