export interface EventProgram {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  location: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  status: 'live' | 'upcoming' | 'ended';
  category: 'music' | 'tech' | 'art' | 'sports' | 'community';
  imageUrl: string;
  organizer: string;
}

export interface UserLocation {
  name: string;
  lat?: number;
  lng?: number;
}
