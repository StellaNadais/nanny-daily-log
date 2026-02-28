import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { ShiftLog, ShiftStartTime, ShiftEndTime } from '../../types';
import { todayISO } from '../../utils/date';

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
  onBack: () => void;
  onSaveShiftLog?: (log: ShiftLog) => void;
};

export function ShiftScreen({ onBack, onSaveShiftLog }: Props) {
  const [date, setDate] = useState(todayISO());
  const [startTime, setStartTime] = useState<ShiftStartTime | ''>('');
  const [endTime, setEndTime] = useState<ShiftEndTime | ''>('');

  const canLogShift = startTime !== '' && endTime !== '';

  const handleLogShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canLogShift || startTime === '' || endTime === '' || !onSaveShiftLog) return;
    onSaveShiftLog({
      id: Date.now().toString(),
      date,
      startTime: startTime as ShiftStartTime,
      endTime: endTime as ShiftEndTime,
    });
    setStartTime('');
    setEndTime('');
  };

  return (
    <div className="nanny-screen nanny-bg">
      <header className="nanny-header">
        <button type="button" onClick={onBack} className="nanny-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <ChevronLeft className="nanny-icon" />
          Back
        </button>
        <h1 className="nanny-title">Shift</h1>
        <div style={{ width: '5rem' }} />
      </header>

      <main style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
          <form onSubmit={handleLogShift} className="nanny-card" style={{ padding: '1rem' }}>
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
              <label className="nanny-label">Start of shift</label>
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
            <div style={{ marginBottom: '1rem' }}>
              <label className="nanny-label">End of shift</label>
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
            {onSaveShiftLog && (
              <button
                type="submit"
                disabled={!canLogShift}
                className="nanny-cta"
                style={{ opacity: canLogShift ? 1 : 0.5, cursor: canLogShift ? 'pointer' : 'not-allowed' }}
              >
                Log Shift
              </button>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
