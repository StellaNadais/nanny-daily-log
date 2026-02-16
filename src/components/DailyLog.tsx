import { MapPin } from 'lucide-react';

type Props = {
  onLocations: () => void;
  onGenerateReport: () => void;
  onSectionTap?: (section: string) => void;
};

const SECTIONS = [
  { id: 'meals', label: 'MEALS' },
  { id: 'rest', label: 'REST' },
  { id: 'activities', label: 'TRIP LOG' },
] as const;

export function DailyLog({ onLocations, onGenerateReport, onSectionTap }: Props) {
  return (
    <div className="nanny-screen nanny-bg">
      <header className="nanny-header">
        <h1 className="nanny-title">DAILY LOG</h1>
        <button type="button" onClick={onLocations} className="nanny-icon-btn" aria-label="Locations">
          <MapPin className="nanny-icon" />
        </button>
      </header>

      <main className="nanny-daily-main">
        <div className="nanny-grid">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className="nanny-section"
              onClick={() => onSectionTap?.(id)}
            >
              <span className="nanny-section-label">{label}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={onGenerateReport} className="nanny-cta">
          Generate weekly report
        </button>
      </main>
    </div>
  );
}

