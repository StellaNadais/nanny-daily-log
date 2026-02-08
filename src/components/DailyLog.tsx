import { MapPin, Camera } from 'lucide-react';
import { todayISO } from '../utils/date';
import { formatDayName } from '../utils/date';

type Props = {
  onLocations: () => void;
  onGenerateReport: () => void;
  onSectionTap?: (section: string) => void;
};

const SECTIONS = [
  { id: 'schedule', label: 'SCHEDULE' },
  { id: 'meals', label: 'MEALS' },
  { id: 'nap', label: 'NAP' },
  { id: 'activities', label: 'ACTIVITIES' },
  { id: 'care', label: 'CARE NOTES' },
  { id: 'summary', label: 'DAILY SUMMARY' },
  { id: 'internal', label: 'INTERNAL NOTES' },
] as const;

export function DailyLog({ onLocations, onGenerateReport, onSectionTap }: Props) {
  const date = todayISO();
  const dayName = formatDayName(date);

  return (
    <div className="nanny-screen nanny-bg">
      {/* Header */}
      <header className="nanny-header">
        <h1 className="nanny-title">
          DAILY LOG — {dayName}
        </h1>
        <button
          type="button"
          onClick={onLocations}
          className="nanny-icon-btn"
          aria-label="Locations"
        >
          <MapPin className="nanny-icon" />
        </button>
      </header>

      {/* Grid of sections */}
      <main className="nanny-daily-main">
        <div className="nanny-grid">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`nanny-section ${id === 'internal' ? 'nanny-section-internal' : ''}`}
              onClick={() => onSectionTap?.(id)}
            >
              <span className="nanny-section-label">{label}</span>
            </button>
          ))}
          <button
            type="button"
            className="nanny-section nanny-section-photo"
            onClick={() => onSectionTap?.('photo')}
          >
            <Camera className="nanny-icon nanny-icon-photo" />
            <span className="nanny-section-label">ADD PHOTO</span>
          </button>
        </div>

        <button
          type="button"
          className="nanny-cta"
          onClick={onGenerateReport}
        >
          GENERATE WEEKLY REPORT
        </button>
        <p className="nanny-hint">TAP A SECTION TO BEGIN LOGGING</p>
      </main>
    </div>
  );
}
