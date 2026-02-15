// Home base for mileage calculations
export const HOME_ADDRESS = '278 Deerfield Drive, Moraga, CA';
export const MILEAGE_RATE_CENTS = 0.54; // per mile (roundtrip)

export type SavedLocation = {
  id: string;
  name: string;
  nickname?: string;
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
  parkingPrice?: number;
  ticketsPrice?: number;
};

// Allowed shift times (start: 8, 8:05, 8:10 / end: 5, 5:05, 5:10)
export type ShiftStartTime = '8' | '805' | '810';
export type ShiftEndTime = '5' | '505' | '510';

export type Gig = {
  id: string;
  date: string; // YYYY-MM-DD
  familyName: string;
  startTime: ShiftStartTime;
  endTime: ShiftEndTime;
  notes?: string;
};

export type ShiftLog = {
  id: string;
  date: string;
  startTime: ShiftStartTime;
  endTime: ShiftEndTime;
  familyName?: string;
};

export type MealNote = {
  id: string;
  date: string;
  notes: string;
  groceryList: string[];
};

export type CareNote = {
  id: string;
  date: string;
  content: string;
  gifUrl?: string;
};

export type InternalNote = {
  id: string;
  date: string;
  content: string;
};

export type AppScreen =
  | 'home'
  | 'shift'
  | 'meals'
  | 'kid-journal'
  | 'trip-log'
  | 'internal-notes'
  | 'locations'
  | 'report';
