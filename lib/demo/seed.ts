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

export const demoFlightTrip: Trip = {
  id: 'trip-2',
  name: 'Golden Triangle & West',
  destinations: [
    {
      id: 'dest-mumbai',
      name: 'Mumbai',
      coordinates: [19.0760, 72.8777],
      state: 'completed',
      checkpoints: [
        { id: 'cp-mumbai-gateway', name: 'Gateway of India', type: 'monument', coordinates: [18.9220, 72.8347] }
      ],
      quest: {
        title: 'Discover Mumbai',
        description: 'Explore the city of dreams.',
        objectives: [
          { id: 'obj-m1', title: 'Visit Gateway of India', completed: true }
        ]
      }
    },
    {
      id: 'dest-delhi',
      name: 'New Delhi',
      coordinates: [28.6139, 77.2090],
      state: 'current',
      checkpoints: [
        { id: 'cp-delhi-hotel', name: 'Check-in to hotel', type: 'hotel', coordinates: [28.6139, 77.2090] },
        { id: 'cp-delhi-indiagate', name: 'India Gate', type: 'monument', coordinates: [28.6129, 77.2295] },
        { id: 'cp-delhi-redfort', name: 'Red Fort', type: 'monument', coordinates: [28.6562, 77.2410] }
      ],
      quest: {
        title: 'Explore Capital',
        description: 'Complete these objectives to unlock your next destination.',
        objectives: [
          { id: 'obj-d1', title: 'Check-in to hotel', completed: true },
          { id: 'obj-d2', title: 'Visit India Gate', completed: false },
          { id: 'obj-d3', title: 'Explore Red Fort', completed: false }
        ]
      }
    },
    {
      id: 'dest-agra',
      name: 'Agra',
      coordinates: [27.1767, 78.0081],
      state: 'locked',
      checkpoints: [
        { id: 'cp-agra-taj', name: 'Taj Mahal', type: 'monument', coordinates: [27.1751, 78.0421] }
      ],
      quest: {
        title: 'Wonder of the World',
        description: 'Behold the Taj Mahal.',
        objectives: [
          { id: 'obj-a1', title: 'Visit Taj Mahal', completed: false }
        ]
      }
    }
  ],
  legs: [
    {
      id: 'leg-flight-1',
      fromDestinationId: 'dest-mumbai',
      toDestinationId: 'dest-delhi',
      mode: 'flight',
      provider: 'Air Itinera',
      departureTime: '10:00',
      arrivalTime: '12:15',
      fare: '₹5500',
      booked: true,
      ticketPayload: 'DEMO-TICKET-BOM-DEL'
    },
    {
      id: 'leg-train-2',
      fromDestinationId: 'dest-delhi',
      toDestinationId: 'dest-agra',
      mode: 'train',
      provider: 'Vande Bharat',
      departureTime: '06:00',
      arrivalTime: '07:30',
      fare: '₹1200',
      booked: false
    }
  ]
};
