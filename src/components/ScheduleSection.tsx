import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Check, X } from 'lucide-react';
import type { Gig, Request } from '../types';
import { todayISO, formatDate } from '../utils/date';

const START_OPTIONS = ['8', '805', '810'] as const;
const END_OPTIONS = ['5', '505', '510'] as const;

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
  const startPad = first.getDay();
  const last = new Date(year, month + 1, 0);
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
  requests: Request[];
  onAddGig?: (date: string) => void;
  onAddRequest?: () => void;
  onApproveRequest?: (req: Request) => void;
  onDeclineRequest?: (req: Request) => void;
};

export function ScheduleSection({ gigs, requests, onAddGig, onAddRequest, onApproveRequest, onDeclineRequest }: Props) {
  const today = todayISO();
  const [view, setView] = useState(() => getMonthYear(new Date()));
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

  return (
    <section className="nanny-home-page nanny-schedule-page">
      <h2 className="nanny-schedule-title">Schedule</h2>

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
        <div className="nanny-card" style={{ marginTop: '1rem' }}>
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
              <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: '#666' }}>No gigs</div>
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

      {requests.length > 0 && (
        <div className="nanny-card" style={{ marginTop: '1rem' }}>
          <div className="nanny-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Requests ({requests.length})</span>
            {onAddRequest && (
              <button type="button" onClick={onAddRequest} className="nanny-btn" style={{ padding: '0.25rem 0.5rem' }}>
                <Plus className="nanny-icon" />
              </button>
            )}
          </div>
          <div style={{ borderTop: '2px solid #000' }}>
            {requests
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((req) => (
                <div key={req.id} style={{ padding: '1rem', borderBottom: '2px solid #e5e5e5', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{req.familyName}</div>
                    <div style={{ fontSize: '0.875rem', color: '#444' }}>
                      {formatDate(req.date)} · {formatTime(req.startTime)} – {formatTime(req.endTime)}
                    </div>
                    {req.notes && (
                      <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>{req.notes}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    {onApproveRequest && (
                      <button type="button" onClick={() => onApproveRequest(req)} className="nanny-btn nanny-btn-primary" style={{ padding: '0.5rem' }} title="Approve">
                        <Check className="nanny-icon" />
                      </button>
                    )}
                    {onDeclineRequest && (
                      <button type="button" onClick={() => onDeclineRequest(req)} className="nanny-btn" style={{ padding: '0.5rem' }} title="Decline">
                        <X className="nanny-icon" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {onAddRequest && requests.length === 0 && (
        <div className="nanny-card" style={{ marginTop: '1rem', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem' }}>No requests yet</span>
            <button type="button" onClick={onAddRequest} className="nanny-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus className="nanny-icon" />
              Add request
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
