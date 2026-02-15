import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import type { CareNote } from '../../types';
import type { SavedLocation } from '../../types';
import { todayISO, formatDate } from '../../utils/date';

type Props = {
  notes: CareNote[];
  locations: SavedLocation[];
  onBack: () => void;
  onSave: (note: CareNote) => void;
};

export function CareNotesScreen({ notes, locations, onBack, onSave }: Props) {
  const [date, setDate] = useState(todayISO());
  const [content, setContent] = useState('');
  const [locationsOpen, setLocationsOpen] = useState(false);

  const existingNote = notes.find((n) => n.date === date);

  useEffect(() => {
    const note = notes.find((n) => n.date === date);
    setContent(note?.content ?? '');
  }, [date, notes]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: existingNote?.id ?? Date.now().toString(),
      date,
      content,
    });
  };

  const recentNotes = notes
    .filter((n) => n.content.trim())
    .sort((a, b) => (b.date.localeCompare(a.date)))
    .slice(0, 10);

  return (
    <div className="nanny-screen nanny-bg">
      <header className="nanny-header">
        <button type="button" onClick={onBack} className="nanny-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <ChevronLeft className="nanny-icon" />
          Back
        </button>
        <h1 className="nanny-title">Care Notes</h1>
        <div style={{ width: '5rem' }} />
      </header>

      <main style={{ flex: 1, padding: '1.25rem', overflowY: 'auto' }}>
        <form onSubmit={handleSave} style={{ maxWidth: '32rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="nanny-card" style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label className="nanny-label">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="nanny-input"
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label className="nanny-label">Notes</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Care notes, observations, reminders..."
                rows={6}
                className="nanny-input"
                style={{ resize: 'none' }}
              />
            </div>
            <button type="submit" className="nanny-cta">
              Save
            </button>
          </div>

          {locations.length > 0 && (
            <div className="nanny-card">
              <button
                type="button"
                onClick={() => setLocationsOpen(!locationsOpen)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  borderBottom: locationsOpen ? '2px solid #000' : 'none',
                  background: '#f5f5f5',
                  font: 'inherit',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                }}
              >
                Location reference (nickname · miles)
                {locationsOpen ? <ChevronUp className="nanny-icon" /> : <ChevronDown className="nanny-icon" />}
              </button>
              {locationsOpen && (
                <div style={{ padding: '1rem', borderTop: '2px solid #000' }}>
                  {locations.map((loc) => (
                    <div
                      key={loc.id}
                      style={{
                        padding: '0.5rem 0',
                        borderBottom: '1px solid #eee',
                        fontSize: '0.875rem',
                      }}
                    >
                      <strong>{loc.nickname || loc.name}</strong>
                      {loc.nickname && loc.name !== loc.nickname && (
                        <span style={{ color: '#666', fontWeight: 400 }}> ({loc.name})</span>
                      )}
                      <span style={{ color: '#444', marginLeft: '0.5rem' }}> — {loc.roundTripMiles} mi</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {recentNotes.length > 0 && (
            <div className="nanny-card">
              <div className="nanny-card-header">Recent notes</div>
              <div style={{ borderTop: '2px solid #000' }}>
                {recentNotes.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '1rem',
                      borderBottom: '2px solid #e5e5e5',
                    }}
                  >
                    <div className="nanny-label" style={{ marginBottom: '0.25rem' }}>{formatDate(n.date)}</div>
                    <div style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{n.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
