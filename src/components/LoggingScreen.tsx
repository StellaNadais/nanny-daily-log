import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { SavedLocation } from '../types';
import type { LogEntry } from '../types';
import { todayISO } from '../utils/date';

type Props = {
  locations: SavedLocation[];
  onBack: () => void;
  onLog: (entry: LogEntry) => void;
};

export function LoggingScreen({ locations, onBack, onLog }: Props) {
  const [date, setDate] = useState(todayISO());
  const [locationId, setLocationId] = useState('');
  const [notes, setNotes] = useState('');
  const [parkingPrice, setParkingPrice] = useState('');
  const [ticketsPrice, setTicketsPrice] = useState('');

  const selectedLocation = locations.find((l) => l.id === locationId);

  const parseNum = (s: string): number | undefined => {
    const n = parseFloat(s.replace(/[^0-9.]/g, ''));
    return isNaN(n) ? undefined : n;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;
    onLog({
      id: Date.now().toString(),
      date,
      locationId: selectedLocation.id,
      locationName: selectedLocation.nickname || selectedLocation.name,
      roundTripMiles: selectedLocation.roundTripMiles,
      notes: notes.trim() || undefined,
      parkingPrice: parseNum(parkingPrice),
      ticketsPrice: parseNum(ticketsPrice),
    });
    setLocationId('');
    setNotes('');
    setParkingPrice('');
    setTicketsPrice('');
    onBack();
  };

  return (
    <div className="nanny-screen nanny-bg">
      <header className="nanny-header">
        <button type="button" onClick={onBack} className="nanny-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <ChevronLeft className="nanny-icon" />
          Back
        </button>
        <h1 className="nanny-title">Trip Log</h1>
        <div style={{ width: '5rem' }} />
      </header>

      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: '32rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="nanny-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="nanny-label">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="nanny-input"
              />
            </div>
            <div>
              <label className="nanny-label">Location</label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                required
                className="nanny-input"
                style={{ background: '#fff' }}
              >
                <option value="">Select a location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.nickname ? `${loc.nickname} (${loc.roundTripMiles} mi)` : `${loc.name} (${loc.roundTripMiles} mi round-trip)`}
                  </option>
                ))}
              </select>
              {locations.length === 0 && (
                <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
                  Add locations via the map icon on the home screen.
                </p>
              )}
            </div>
            <div>
              <label className="nanny-label">Parking (optional)</label>
              <input
                type="text"
                inputMode="decimal"
                value={parkingPrice}
                onChange={(e) => setParkingPrice(e.target.value)}
                placeholder="e.g., 5.00"
                className="nanny-input"
              />
            </div>
            <div>
              <label className="nanny-label">Tickets for events (optional)</label>
              <input
                type="text"
                inputMode="decimal"
                value={ticketsPrice}
                onChange={(e) => setTicketsPrice(e.target.value)}
                placeholder="e.g., 12.50"
                className="nanny-input"
              />
            </div>
            <div>
              <label className="nanny-label">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., park playdate"
                rows={3}
                className="nanny-input"
                style={{ resize: 'none' }}
              />
            </div>
            <button
              type="submit"
              disabled={!locationId}
              className="nanny-cta"
              style={{ opacity: locationId ? 1 : 0.5, cursor: locationId ? 'pointer' : 'not-allowed' }}
            >
              Save Entry
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

