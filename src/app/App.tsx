import { useState, useEffect, useCallback } from 'react';
import { DailyLog } from '../components/DailyLog';
import { LoggingScreen } from '../components/LoggingScreen';
import { LocationManager } from '../features/locations/LocationManager';
import { WeeklyReport } from '../features/reports/WeeklyReport';
import type { AppScreen } from '../types';
import type { SavedLocation } from '../types';
import type { LogEntry } from '../types';

const STORAGE_KEY_LOCATIONS = 'nanny-log-locations';
const STORAGE_KEY_ENTRIES = 'nanny-log-entries';

function loadLocations(): SavedLocation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCATIONS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

function loadEntries(): LogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ENTRIES);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

function saveLocations(locations: SavedLocation[]) {
  localStorage.setItem(STORAGE_KEY_LOCATIONS, JSON.stringify(locations));
}

function saveEntries(entries: LogEntry[]) {
  localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('daily');
  const [locations, setLocations] = useState<SavedLocation[]>(loadLocations);
  const [entries, setEntries] = useState<LogEntry[]>(loadEntries);

  useEffect(() => {
    saveLocations(locations);
  }, [locations]);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const handleSaveLocations = useCallback((next: SavedLocation[]) => {
    setLocations(next);
  }, []);

  const handleLogEntry = useCallback((entry: LogEntry) => {
    setEntries((prev) => [...prev, entry]);
  }, []);

  if (screen === 'locations') {
    return (
      <LocationManager
        locations={locations}
        onSave={handleSaveLocations}
        onClose={() => setScreen('daily')}
      />
    );
  }

  if (screen === 'log') {
    return (
      <LoggingScreen
        locations={locations}
        onBack={() => setScreen('daily')}
        onLog={handleLogEntry}
      />
    );
  }

  if (screen === 'report') {
    return (
      <WeeklyReport
        entries={entries}
        onBack={() => setScreen('daily')}
      />
    );
  }

  return (
    <DailyLog
      onLocations={() => setScreen('locations')}
      onGenerateReport={() => setScreen('report')}
      onSectionTap={(section) => {
        if (section === 'schedule' || section === 'meals' || section === 'activities') {
          setScreen('log');
        }
      }}
    />
  );
}
