import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, Download } from 'lucide-react';
import type { CareNote } from '../../types';
import type { SavedLocation } from '../../types';
import type { LogEntry } from '../../types';
import { todayISO, formatDate, getWeekRange, formatWeekLabel } from '../../utils/date';
import { MILEAGE_RATE_CENTS } from '../../types';

type Props = {
  notes: CareNote[];
  locations: SavedLocation[];
  entries: LogEntry[];
  onBack: () => void;
  onSave: (note: CareNote) => void;
};

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function KidJournalScreen({ notes, locations, entries, onBack, onSave }: Props) {
  const [date, setDate] = useState(todayISO());
  const [content, setContent] = useState('');
  const [gifUrl, setGifUrl] = useState('');
  const [locationsOpen, setLocationsOpen] = useState(false);

  const existingNote = notes.find((n) => n.date === date);

  useEffect(() => {
    const note = notes.find((n) => n.date === date);
    setContent(note?.content ?? '');
    setGifUrl(note?.gifUrl ?? '');
  }, [date, notes]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: existingNote?.id ?? Date.now().toString(),
      date,
      content,
      gifUrl: gifUrl.trim() || undefined,
    });
  };

  const dayEntries = entries.filter((e) => e.date === date);
  const dayMiles = dayEntries.reduce((sum, e) => sum + e.roundTripMiles, 0);

  const handleDownloadDay = () => {
    const note = notes.find((n) => n.date === date);
    const lines: string[] = [
      `Kid Journal — ${formatDate(date)}`,
      '',
      '--- Info of the day ---',
      dayEntries.length > 0
        ? dayEntries
            .map((e) => `${e.locationName}: ${e.roundTripMiles} mi${e.notes ? ` — ${e.notes}` : ''}`)
            .join('\n')
        : 'No trips logged',
      dayMiles > 0 ? `Total miles: ${dayMiles.toFixed(1)}` : '',
      '',
      '--- Journal ---',
      note?.content || content || '(No notes saved)',
    ];
    downloadText(`kid-journal-${date}.txt`, lines.join('\n'));
  };

  const week = getWeekRange(date);
  const weekNotes = notes.filter((n) => n.date >= week.start && n.date <= week.end && n.content.trim());

  const handleReleaseWeek = () => {
    const lines: string[] = [
      `Kid Journal — Week of ${formatWeekLabel(week.start, week.end)}`,
      '',
      ...weekNotes
        .sort((a, b) => a.date.localeCompare(b.date))
        .flatMap((n) => {
          const dayEntriesForNote = entries.filter((e) => e.date === n.date);
          const miles = dayEntriesForNote.reduce((s, e) => s + e.roundTripMiles, 0);
          return [
            '═══════════════════════',
            formatDate(n.date),
            '',
            'Trips / miles:',
            dayEntriesForNote.length > 0
              ? dayEntriesForNote.map((e) => `  ${e.locationName}: ${e.roundTripMiles} mi`).join('\n')
              : '  None',
            miles > 0 ? `  Total: ${miles.toFixed(1)} mi` : '',
            '',
            'Journal:',
            n.content,
            '',
          ];
        }),
    ];
    downloadText(`kid-journal-week-${week.start}-${week.end}.txt`, lines.join('\n'));
  };

  return (
    <div className="nanny-screen nanny-bg">
      <header className="nanny-header">
        <button type="button" onClick={onBack} className="nanny-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <ChevronLeft className="nanny-icon" />
          Back
        </button>
        <h1 className="nanny-title">Kid Journal</h1>
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
              <label className="nanny-label">GIF URL (optional)</label>
              <input
                type="url"
                value={gifUrl}
                onChange={(e) => setGifUrl(e.target.value)}
                placeholder="Paste a GIF link"
                className="nanny-input"
              />
              {gifUrl && (
                <div style={{ marginTop: '0.5rem' }}>
                  <img src={gifUrl} alt="" style={{ maxWidth: '6rem', maxHeight: '6rem', objectFit: 'cover', border: '2px solid #000' }} />
                </div>
              )}
            </div>

            <div className="nanny-card" style={{ padding: '0.75rem', marginBottom: '1rem', background: '#f9f9f9', border: '2px solid #e5e5e5' }}>
              <div className="nanny-label" style={{ marginBottom: '0.5rem' }}>Info of the day</div>
              {dayEntries.length > 0 ? (
                <>
                  {dayEntries.map((e) => (
                    <div key={e.id} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      {e.locationName} — {e.roundTripMiles} mi
                    </div>
                  ))}
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, marginTop: '0.25rem' }}>
                    Total: {dayMiles.toFixed(1)} mi · ${(dayMiles * MILEAGE_RATE_CENTS).toFixed(2)}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: '0.875rem', color: '#666' }}>No trips logged for this date</div>
              )}
            </div>

            {locations.length > 0 && (
              <div className="nanny-card" style={{ marginBottom: '1rem' }}>
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
                  Nickname locations (miles)
                  {locationsOpen ? <ChevronUp className="nanny-icon" /> : <ChevronDown className="nanny-icon" />}
                </button>
                {locationsOpen && (
                  <div style={{ padding: '1rem', borderTop: '2px solid #000' }}>
                    {locations.map((loc) => (
                      <div key={loc.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee', fontSize: '0.875rem' }}>
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

            <div style={{ marginBottom: '1rem' }}>
              <label className="nanny-label">Journal</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Notes, activities, observations..."
                rows={6}
                className="nanny-input"
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button type="submit" className="nanny-cta">
                Save
              </button>
              <button
                type="button"
                onClick={handleDownloadDay}
                className="nanny-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Download className="nanny-icon" />
                Download journal of the day
              </button>
              <button
                type="button"
                onClick={handleReleaseWeek}
                className="nanny-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Download className="nanny-icon" />
                Release week ({weekNotes.length} entries)
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
