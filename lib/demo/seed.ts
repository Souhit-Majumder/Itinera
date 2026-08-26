import { Trip, SOSResponder } from '@/types';

export const demoTrip: Trip = {
  id: 'trip-1',
  name: 'South India Explorer',
  destinations: [
    {
      id: 'dest-mysuru',
      name: 'Mysuru',
      coordinates: [12.2958, 76.6394],
      state: 'completed',
      checkpoints: [
        { id: 'cp-mysuru-palace', name: 'Mysuru Palace', type: 'monument', coordinates: [12.3051, 76.6551] }
      ],
      quest: {
        title: 'Discover Mysuru',
        description: 'Explore the city of palaces.',
        objectives: [
          { id: 'obj-m1', title: 'Visit Mysuru Palace', completed: true }
        ]
      }
    },
    {
      id: 'dest-bengaluru',
      name: 'Bengaluru',
      coordinates: [12.9716, 77.5946],
      state: 'current',
      checkpoints: [
        { id: 'cp-blr-hotel', name: 'Check-in to hotel', type: 'hotel', coordinates: [12.9716, 77.5946] },
        { id: 'cp-blr-cubbon', name: 'Cubbon Park', type: 'attraction', coordinates: [12.9774, 77.5913] },
        { id: 'cp-blr-palace', name: 'Bengaluru Palace', type: 'monument', coordinates: [12.9988, 77.5921] }
      ],
      quest: {
        title: 'Explore Bengaluru',
        description: 'Complete these objectives to unlock your next destination.',
        objectives: [
          { id: 'obj-b1', title: 'Check-in to hotel', completed: true },
          { id: 'obj-b2', title: 'Visit Cubbon Park', completed: false },
          { id: 'obj-b3', title: 'Explore Bengaluru Palace', completed: false }
        ]
      }
    },
    {
      id: 'dest-goa',
      name: 'Goa',
      coordinates: [15.2993, 74.1240],
      state: 'locked',
      checkpoints: [
        { id: 'cp-goa-beach', name: 'Baga Beach', type: 'attraction', coordinates: [15.5523, 73.7517] }
      ],
      quest: {
        title: 'Relax in Goa',
        description: 'Enjoy the coastal vibes.',
        objectives: [
          { id: 'obj-g1', title: 'Visit Baga Beach', completed: false }
        ]
      }
    }
  ],
  legs: [
    {
      id: 'leg-1',
      fromDestinationId: 'dest-mysuru',
      toDestinationId: 'dest-bengaluru',
      mode: 'train',
      provider: 'SWR',
      departureTime: '08:00',
      arrivalTime: '10:30',
      fare: '₹450',
      booked: true,
      ticketPayload: 'DEMO-TICKET-MYS-BLR'
    },
    {
      id: 'leg-2',
      fromDestinationId: 'dest-bengaluru',
      toDestinationId: 'dest-goa',
      mode: 'bus',
      provider: 'Itinera Express',
      departureTime: '22:30',
      arrivalTime: '06:15',
      fare: '₹850',
      booked: false
    }
  ]
};

export const demoResponders: SOSResponder[] = [
  { id: 'sos-1', name: 'Central Police Station', type: 'Police', distance: '1.2 km', phone: '100' },
  { id: 'sos-2', name: 'City Hospital', type: 'Hospital', distance: '2.5 km', phone: '108' },
  { id: 'sos-3', name: 'Tourist Helpline', type: 'Tourist Police', distance: '0.8 km', phone: '1363' }
];

export const getAIContextualResponse = (state: 'initial' | 'bengaluru-progress' | 'goa-unlocked') => {
  switch (state) {
    case 'bengaluru-progress':
      return "You're in Bengaluru! You've checked into the hotel. Next, head over to Cubbon Park for a nice walk, and don't forget Bengaluru Palace. Once done, your transport to Goa awaits!";
    case 'goa-unlocked':
      return "Congratulations on completing the Bengaluru quest! Goa is now unlocked. Check your passport for the new stamp and book your bus to Goa.";
    default:
      return "Welcome to Itinera. You have completed Mysuru and are currently exploring Bengaluru.";
  }
};
