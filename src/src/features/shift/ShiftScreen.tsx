import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { Gig, ShiftLog, ShiftStartTime, ShiftEndTime } from '../../types';
import { todayISO, formatDate } from '../../utils/date';

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

function getMonthYear(d: Date) {
  return { year: d.getFullYear(), month: d.getMonth() };
}

function getDaysInMonth(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay(); // 0 = Sun
  const days = last.getDate();
  const result: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) result.push(null);
  for (let d = 1; d <= days; d++) result.push(d);
  return result;
}

function toDateStr(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

type Props = {
  gigs: Gig[];
  onBack: () => void;
  onAddGig?: (date: string) => void;
  onSaveShiftLog?: (log: ShiftLog) => void;
};

export function ShiftScreen({ gigs, onBack, onAddGig, onSaveShiftLog }: Props) {
  const today = todayISO();
  const [date, setDate] = useState(todayISO());
  const [startTime, setStartTime] = useState<ShiftStartTime | ''>('');
  const [endTime, setEndTime] = useState<ShiftEndTime | ''>('');
  const [view, setView] = useState(() => {
    const d = new Date();
    return getMonthYear(d);
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const days = getDaysInMonth(view.year, view.month);
  const prevMonth = () => setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 }));
  const nextMonth = () => setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 }));

  const gigsByDate = new Map<string, Gig[]>();
  for (const g of gigs) {
    const list = gigsByDate.get(g.date) ?? [];
    list.push(g);
    gigsByDate.set(g.date, list);
  }

  const selectedGigs = selectedDate ? gigsByDate.get(selectedDate) ?? [] : [];

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
          <form onSubmit={handleLogShift} className="nanny-card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
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

          <div className="nanny-calendar-nav">
            <button type="button" onClick={prevMonth} className="nanny-calendar-arrow" aria-label="Previous month">
              <ChevronLeft className="nanny-icon" />
            </button>
            <span className="nanny-calendar-month">
              {MONTHS[view.month]} {view.year}
            </span>
            <button type="button" onClick={nextMonth} className="nanny-calendar-arrow" aria-label="Next month">
              <ChevronRight className="nanny-icon" />
            </button>
          </div>

          <div className="nanny-calendar-weekdays">
            {WEEKDAYS.map((d) => (
              <span key={d} className="nanny-calendar-wd">{d}</span>
            ))}
          </div>

          <div className="nanny-calendar-grid">
            {days.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} className="nanny-calendar-cell nanny-calendar-empty" />;
              }
              const dateStr = toDateStr(view.year, view.month, day);
              const hasGig = gigsByDate.has(dateStr);
              const isToday = dateStr === today;
              const isSelected = dateStr === selectedDate;
              return (
                <button
                  key={dateStr}
                  type="button"
                  className={`nanny-calendar-cell ${hasGig ? 'nanny-calendar-has-gig' : ''} ${isToday ? 'nanny-calendar-today' : ''} ${isSelected ? 'nanny-calendar-selected' : ''}`}
                  onClick={() => setSelectedDate(dateStr)}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {selectedDate && (
            <div className="nanny-card" style={{ marginTop: '1.5rem' }}>
              <div className="nanny-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{formatDate(selectedDate)}</span>
                {onAddGig && (
                  <button type="button" onClick={() => onAddGig(selectedDate)} className="nanny-btn" style={{ padding: '0.25rem 0.5rem' }}>
                    <Plus className="nanny-icon" />
                  </button>
                )}
              </div>
              <div style={{ borderTop: '2px solid #000' }}>
                {selectedGigs.length === 0 ? (
                  <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: '#666' }}>
                    No gigs
                  </div>
                ) : (
                  selectedGigs.map((g) => (
                    <div key={g.id} style={{ padding: '1rem', borderBottom: '2px solid #e5e5e5' }}>
                      <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{g.familyName}</div>
                      <div style={{ fontSize: '0.875rem', color: '#444' }}>
                        {formatTime(g.startTime)} – {formatTime(g.endTime)}
                      </div>
                      {g.notes && (
                        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>{g.notes}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
