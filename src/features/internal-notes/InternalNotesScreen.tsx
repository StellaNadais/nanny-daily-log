import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { InternalNote, ShiftLog } from '../../types';
import { todayISO, formatDate } from '../../utils/date';

// Punctuality: on-time = start within 0–10 min of scheduled (8, 805, 810)
function isOnTime(actual: string, scheduled: string): boolean {
  const toMinutes = (t: string) => {
    if (t === '8') return 8 * 60;
    if (t === '805') return 8 * 60 + 5;
    if (t === '810') return 8 * 60 + 10;
    return 0;
  };
  const diff = toMinutes(actual) - toMinutes(scheduled);
  return diff >= 0 && diff <= 10;
}

type Props = {
  notes: InternalNote[];
  shiftLogs: ShiftLog[];
  gigs: { date: string; startTime: string }[];
  onBack: () => void;
  onSave: (note: InternalNote) => void;
};

export function InternalNotesScreen({ notes, shiftLogs, gigs, onBack, onSave }: Props) {
  const [date, setDate] = useState(todayISO());
  const [content, setContent] = useState('');

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

  // Punctuality: compare shift logs to gigs (if we had scheduled start)
  // For now: count shifts where start was 8, 805, or 810 as "on time" (within window)
  const recentShifts = shiftLogs
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 14); // 2 weeks

  const onTimeCount = recentShifts.filter((s) =>
    ['8', '805', '810'].includes(s.startTime)
  ).length;
  const totalCount = recentShifts.length;
  const punctualityPct = totalCount > 0 ? Math.round((onTimeCount / totalCount) * 100) : null;

  return (
    <div className="nanny-screen nanny-bg">
      <header className="nanny-header">
        <button type="button" onClick={onBack} className="nanny-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <ChevronLeft className="nanny-icon" />
          Back
        </button>
        <h1 className="nanny-title">Internal Notes</h1>
        <div style={{ width: '5rem' }} />
      </header>

      <main style={{ flex: 1, padding: '1.25rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '32rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="nanny-card" style={{ padding: '1rem' }}>
            <div className="nanny-card-header" style={{ marginBottom: '1rem' }}>Punctuality stats</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
              {punctualityPct !== null ? (
                <>
                  <span style={{ fontSize: '2rem', fontWeight: 700 }}>{punctualityPct}%</span>
                  <span style={{ fontSize: '0.875rem', color: '#666' }}>
                    on-time ({onTimeCount}/{totalCount} shifts in last 2 weeks)
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '0.875rem', color: '#666' }}>No shifts logged yet</span>
              )}
            </div>
          </div>

          <form onSubmit={handleSave} className="nanny-card" style={{ padding: '1rem' }}>
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
                placeholder="Internal notes for yourself..."
                rows={4}
                className="nanny-input"
                style={{ resize: 'none' }}
              />
            </div>
            <button type="submit" className="nanny-cta">
              Save
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
