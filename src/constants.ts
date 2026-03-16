import { EventProgram } from './types';

export const MOCK_EVENTS: EventProgram[] = [
  {
    id: '1',
    title: 'Summer Jazz Festival',
    description: 'An evening of smooth jazz and soul under the stars.',
    startTime: '06:00 PM',
    endTime: '10:00 PM',
    date: '2026-03-16',
    location: {
      name: 'City Park Amphitheater',
      address: 'Main Street, Downtown',
    },
    status: 'live',
    category: 'music',
    imageUrl: 'https://images.unsplash.com/photo-1514525253361-bee8a19740c1?auto=format&fit=crop&q=80&w=800',
    organizer: 'Global Arts Council',
  },
  {
    id: '2',
    title: 'Tech Innovators Summit',
    description: 'Exploring the future of AI and sustainable technology.',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    date: '2026-03-16',
    location: {
      name: 'Innovation Hub',
      address: 'Tech Park, Sector 5',
    },
    status: 'live',
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1540575861501-7ad0582373f3?auto=format&fit=crop&q=80&w=800',
    organizer: 'FutureTech',
  },
  {
    id: '3',
    title: 'Modern Art Exhibition',
    description: 'A showcase of contemporary digital art and installations.',
    startTime: '10:00 AM',
    endTime: '06:00 PM',
    date: '2026-03-17',
    location: {
      name: 'National Gallery',
      address: 'Art District, Plaza Road',
    },
    status: 'upcoming',
    category: 'art',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
    organizer: 'Art Foundation',
  },
  {
    id: '4',
    title: 'Community Farmers Market',
    description: 'Fresh local produce and handmade crafts.',
    startTime: '08:00 AM',
    endTime: '02:00 PM',
    date: '2026-03-16',
    location: {
      name: 'Town Square',
      address: 'Market Lane, West Side',
    },
    status: 'live',
    category: 'community',
    imageUrl: 'https://images.unsplash.com/photo-1488459711635-de27a4a2f68b?auto=format&fit=crop&q=80&w=800',
    organizer: 'Local Growers',
  },
  {
    id: '5',
    title: 'Street Food Gala',
    description: 'Taste the best street food from around the world.',
    startTime: '12:00 PM',
    endTime: '09:00 PM',
    date: '2026-03-18',
    location: {
      name: 'Waterfront Promenade',
      address: 'Harbor Drive, East Coast',
    },
    status: 'upcoming',
    category: 'community',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
    organizer: 'Foodies United',
  }
];

export const LOCATIONS = [
  'Mumbai, India',
  'Delhi, India',
  'Bangalore, India',
  'Hyderabad, India',
  'Chennai, India',
  'Kolkata, India',
  'Pune, India',
  'Ahmedabad, India',
  'New York, NY',
  'London, UK',
  'Tokyo, Japan',
  'Dubai, UAE'
];
