import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { Request } from '../../types';
import { todayISO, formatDate } from '../../utils/date';

type Props = {
  date?: string;
  onBack: () => void;
  onSave: (req: Request) => void;
};

export function AddRequestScreen({ date: initialDate, onBack, onSave }: Props) {
  const [date, setDate] = useState(initialDate ?? todayISO());
  const [familyName, setFamilyName] = useState('');
  const [notes, setNotes] = useState('');

  const canSubmit = familyName.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSave({
      id: Date.now().toString(),
      date,
      familyName: familyName.trim(),
      startTime: '8',
      endTime: '5',
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
        <h1 className="nanny-title">Add Request</h1>
        <div style={{ width: '5rem' }} />
      </header>

      <main style={{ flex: 1, padding: '1.25rem', overflowY: 'auto' }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: '32rem', margin: '0 auto' }}>
          <div className="nanny-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>
              Family/client requested shift (from text, email, etc.)
            </p>
            <div className="nanny-label" style={{ marginBottom: 0, marginTop: '0.5rem' }}>{formatDate(date)}</div>
          </div>

          <div className="nanny-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="nanny-label">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="nanny-input"
              />
            </div>

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
              Add Request
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
