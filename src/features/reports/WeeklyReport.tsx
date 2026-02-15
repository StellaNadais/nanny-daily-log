import { ChevronLeft } from 'lucide-react';
import type { LogEntry } from '../../types';
import { MILEAGE_RATE_CENTS } from '../../types';
import { formatDate, getWeekRange, todayISO, formatWeekLabel } from '../../utils/date';
import { exportWeeklyReportPDF } from '../../utils/pdf';

type Props = {
  entries: LogEntry[];
  onBack: () => void;
};

export function WeeklyReport({ entries, onBack }: Props) {
  const week = getWeekRange(todayISO());
  const weekEntries = entries.filter(
    (e) => e.date >= week.start && e.date <= week.end
  );
  const totalMiles = weekEntries.reduce((sum, e) => sum + e.roundTripMiles, 0);
  const totalParking = weekEntries.reduce((sum, e) => sum + (e.parkingPrice ?? 0), 0);
  const totalTickets = weekEntries.reduce((sum, e) => sum + (e.ticketsPrice ?? 0), 0);

  return (
    <div className="nanny-screen nanny-bg">
      <header className="nanny-header">
        <button type="button" onClick={onBack} className="nanny-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <ChevronLeft className="nanny-icon" />
          Back
        </button>
        <h1 className="nanny-title">WEEKLY REPORT</h1>
        <div style={{ width: '5rem' }} />
      </header>

      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '32rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="nanny-card" style={{ padding: '1rem' }}>
            <p className="nanny-label" style={{ color: '#666' }}>Week of</p>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0.25rem 0 0 0' }}>
              {formatWeekLabel(week.start, week.end)}
            </p>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, marginTop: '1rem' }}>
              Total miles: {totalMiles.toFixed(1)}
            </p>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, marginTop: '0.25rem' }}>
              Mileage (${MILEAGE_RATE_CENTS}/mi): ${(totalMiles * MILEAGE_RATE_CENTS).toFixed(2)}
            </p>
            {(totalParking > 0 || totalTickets > 0) && (
              <>
                {totalParking > 0 && (
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, marginTop: '0.25rem' }}>
                    Parking: ${totalParking.toFixed(2)}
                  </p>
                )}
                {totalTickets > 0 && (
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, marginTop: '0.25rem' }}>
                    Tickets: ${totalTickets.toFixed(2)}
                  </p>
                )}
              </>
            )}
            <button
              type="button"
              onClick={() => exportWeeklyReportPDF(weekEntries)}
              className="nanny-btn"
              style={{ marginTop: '1rem' }}
            >
              Print / Export
            </button>
          </div>

          <div className="nanny-card">
            <div className="nanny-card-header">
              Entries ({weekEntries.length})
            </div>
            <div style={{ borderTop: '2px solid #000' }}>
              {weekEntries.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  No entries this week
                </div>
              ) : (
                weekEntries
                  .sort((a, b) => (a.date < b.date ? -1 : 1))
                  .map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        padding: '1rem',
                        borderBottom: '2px solid #e5e5e5',
                      }}
                    >
                      <div className="nanny-label" style={{ marginBottom: '0.25rem' }}>
                        {formatDate(entry.date)}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#333', marginTop: '0.25rem' }}>
                        {entry.locationName} — {entry.roundTripMiles} mi
                      </div>
                      {(entry.parkingPrice != null || entry.ticketsPrice != null) && (
                        <div style={{ fontSize: '0.75rem', color: '#444', marginTop: '0.25rem' }}>
                          {entry.parkingPrice != null && `Parking: $${entry.parkingPrice.toFixed(2)}`}
                          {entry.parkingPrice != null && entry.ticketsPrice != null && ' · '}
                          {entry.ticketsPrice != null && `Tickets: $${entry.ticketsPrice.toFixed(2)}`}
                        </div>
                      )}
                      {entry.notes && (
                        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                          {entry.notes}
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
