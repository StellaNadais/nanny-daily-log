import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { Gig, ShiftStartTime, ShiftEndTime } from '../../types';
import { formatDate } from '../../utils/date';

const START_OPTIONS: ShiftStartTime[] = ['8', '805', '810'];
const END_OPTIONS: ShiftEndTime[] = ['5', '505', '510'];

function formatTime(t: string): string {
  if (t === '8') return '8:00';
  if (t === '805') return '8:05';
  if (t === '810') return '8:10';
  if (t === '5') return '5:00';
  if (t === '505') return '5:05';
  if (t === '510') return '5:10';
  return t;
}

type Props = {
  date: string;
  onBack: () => void;
  onSave: (gig: Gig) => void;
};

export function AddGigScreen({ date, onBack, onSave }: Props) {
  const [familyName, setFamilyName] = useState('');
  const [startTime, setStartTime] = useState<ShiftStartTime>('8');
  const [endTime, setEndTime] = useState<ShiftEndTime>('5');
  const [notes, setNotes] = useState('');

  const canSubmit = familyName.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSave({
      id: Date.now().toString(),
      date,
      familyName: familyName.trim(),
      startTime,
      endTime,
      notes: notes.trim() || undefined,
    });
    onBack();
  };

  return (
    <div className="nanny-screen nanny-bg">
      <header className="nanny-header">
        <button type="button" onClick={onBack} className="nanny-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <ChevronLeft className="nanny-icon" />
          Back
        </button>
        <h1 className="nanny-title">Add Gig</h1>
        <div style={{ width: '5rem' }} />
      </header>

      <main style={{ flex: 1, padding: '1.25rem', overflowY: 'auto' }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: '32rem', margin: '0 auto' }}>
          <div className="nanny-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
            <div className="nanny-label" style={{ marginBottom: '0.25rem' }}>{formatDate(date)}</div>
          </div>

          <div className="nanny-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="nanny-label">Family / Client name</label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="e.g., Smith family"
                className="nanny-input"
                required
              />
            </div>

            <div>
              <label className="nanny-label">Start</label>
              <div className="nanny-time-circles">
                {START_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`nanny-time-circle ${startTime === opt ? 'nanny-time-circle-active' : ''}`}
                    onClick={() => setStartTime(opt)}
                  >
                    {formatTime(opt)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="nanny-label">End</label>
              <div className="nanny-time-circles">
                {END_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`nanny-time-circle ${endTime === opt ? 'nanny-time-circle-active' : ''}`}
                    onClick={() => setEndTime(opt)}
                  >
                    {formatTime(opt)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="nanny-label">Notes (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Park day"
                className="nanny-input"
              />
            </div>

            <button type="submit" disabled={!canSubmit} className="nanny-cta">
              Save Gig
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
