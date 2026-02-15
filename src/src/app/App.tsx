import { useState, useEffect, useCallback } from 'react';
import { HomeScreen } from '../components/HomeScreen';
import { ShiftScreen } from '../features/shift/ShiftScreen';
import { AddGigScreen } from '../features/shift/AddGigScreen';
import { MealsScreen } from '../features/meals/MealsScreen';
import { KidJournalScreen } from '../features/kid-journal/KidJournalScreen';
import { LoggingScreen } from '../components/LoggingScreen';
import { InternalNotesScreen } from '../features/internal-notes/InternalNotesScreen';
import { LocationManager } from '../features/locations/LocationManager';
import { WeeklyReport } from '../features/reports/WeeklyReport';
import type {
  AppScreen,
  SavedLocation,
  LogEntry,
  Gig,
  ShiftLog,
  MealNote,
  CareNote,
  InternalNote,
} from '../types';

const STORAGE_KEYS = {
  locations: 'nanny-locations',
  entries: 'nanny-entries',
  gigs: 'nanny-gigs',
  shiftLogs: 'nanny-shift-logs',
  mealNotes: 'nanny-meal-notes',
  careNotes: 'nanny-care-notes',
  internalNotes: 'nanny-internal-notes',
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* ignore */
  }
  return fallback;
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [addGigDate, setAddGigDate] = useState<string | null>(null);
  const [locations, setLocations] = useState<SavedLocation[]>(() => load(STORAGE_KEYS.locations, []));
  const [entries, setEntries] = useState<LogEntry[]>(() => load(STORAGE_KEYS.entries, []));
  const [gigs, setGigs] = useState<Gig[]>(() => load(STORAGE_KEYS.gigs, []));
  const [shiftLogs, setShiftLogs] = useState<ShiftLog[]>(() => load(STORAGE_KEYS.shiftLogs, []));
  const [mealNotes, setMealNotes] = useState<MealNote[]>(() => load(STORAGE_KEYS.mealNotes, []));
  const [careNotes, setCareNotes] = useState<CareNote[]>(() => load(STORAGE_KEYS.careNotes, []));
  const [internalNotes, setInternalNotes] = useState<InternalNote[]>(() =>
    load(STORAGE_KEYS.internalNotes, [])
  );

  useEffect(() => {
    save(STORAGE_KEYS.locations, locations);
  }, [locations]);
  useEffect(() => {
    save(STORAGE_KEYS.entries, entries);
  }, [entries]);
  useEffect(() => {
    save(STORAGE_KEYS.gigs, gigs);
  }, [gigs]);
  useEffect(() => {
    save(STORAGE_KEYS.shiftLogs, shiftLogs);
  }, [shiftLogs]);
  useEffect(() => {
    save(STORAGE_KEYS.mealNotes, mealNotes);
  }, [mealNotes]);
  useEffect(() => {
    save(STORAGE_KEYS.careNotes, careNotes);
  }, [careNotes]);
  useEffect(() => {
    save(STORAGE_KEYS.internalNotes, internalNotes);
  }, [internalNotes]);

  const handleSaveGig = useCallback((gig: Gig) => {
    setGigs((prev) => {
      const rest = prev.filter((g) => g.id !== gig.id);
      return [...rest, gig];
    });
  }, []);

  const handleSaveShiftLog = useCallback((log: ShiftLog) => {
    setShiftLogs((prev) => [...prev, log]);
  }, []);

  const handleSaveMealNote = useCallback((note: MealNote) => {
    setMealNotes((prev) => {
      const rest = prev.filter((n) => n.id !== note.id);
      return [...rest, note];
    });
  }, []);

  const handleSaveCareNote = useCallback((note: CareNote) => {
    setCareNotes((prev) => {
      const rest = prev.filter((n) => n.id !== note.id);
      return [...rest, note];
    });
  }, []);

  const handleSaveInternalNote = useCallback((note: InternalNote) => {
    setInternalNotes((prev) => {
      const rest = prev.filter((n) => n.id !== note.id);
      return [...rest, note];
    });
  }, []);

  const handleLogEntry = useCallback((entry: LogEntry) => {
    setEntries((prev) => [...prev, entry]);
  }, []);

  const handleSectionTap = useCallback((section: string) => {
    if (section === 'shift') setScreen('shift');
    else if (section === 'meals') setScreen('meals');
    else if (section === 'kid-journal') setScreen('kid-journal');
    else if (section === 'trip-log') setScreen('trip-log');
    else if (section === 'internal-notes') setScreen('internal-notes');
  }, []);

  if (screen === 'locations') {
    return (
      <LocationManager
        locations={locations}
        onSave={setLocations}
        onClose={() => setScreen('home')}
      />
    );
  }

  if (screen === 'report') {
    return <WeeklyReport entries={entries} onBack={() => setScreen('home')} />;
  }

  if (screen === 'add-gig' && addGigDate) {
    return (
      <AddGigScreen
        date={addGigDate}
        onBack={() => {
          setScreen('shift');
          setAddGigDate(null);
        }}
        onSave={(g) => {
          handleSaveGig(g);
          setAddGigDate(null);
        }}
      />
    );
  }

  if (screen === 'shift') {
    return (
      <ShiftScreen
        gigs={gigs}
        onBack={() => setScreen('home')}
        onAddGig={(date) => {
          setAddGigDate(date);
          setScreen('add-gig');
        }}
        onSaveShiftLog={handleSaveShiftLog}
      />
    );
  }

  if (screen === 'meals') {
    return (
      <MealsScreen
        mealNotes={mealNotes}
        onBack={() => setScreen('home')}
        onSave={handleSaveMealNote}
      />
    );
  }

  if (screen === 'kid-journal') {
    return (
      <KidJournalScreen
        notes={careNotes}
        locations={locations}
        entries={entries}
        onBack={() => setScreen('home')}
        onSave={handleSaveCareNote}
      />
    );
  }

  if (screen === 'trip-log') {
    return (
      <LoggingScreen
        locations={locations}
        onBack={() => setScreen('home')}
        onLog={handleLogEntry}
      />
    );
  }

  if (screen === 'internal-notes') {
    return (
      <InternalNotesScreen
        notes={internalNotes}
        shiftLogs={shiftLogs}
        gigs={gigs}
        onBack={() => setScreen('home')}
        onSave={handleSaveInternalNote}
      />
    );
  }

  return (
    <HomeScreen
      onLocations={() => setScreen('locations')}
      onSectionTap={handleSectionTap}
      onGenerateReport={() => setScreen('report')}
    />
  );
}
