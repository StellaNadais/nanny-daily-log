export type SavedLocation = {
  id: string;
  name: string;
  address: string;
  roundTripMiles: number;
};

export type LogEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  locationId: string;
  locationName: string;
  roundTripMiles: number;
  notes?: string;
};

export type AppScreen = 'daily' | 'log' | 'locations' | 'report';
