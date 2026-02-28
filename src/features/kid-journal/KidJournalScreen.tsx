import { useState, useEffect } from 'react';
import { ChevronLeft, Download } from 'lucide-react';
import type { CareNote, Mood } from '../../types';
import type { LogEntry } from '../../types';

const MOODS: Mood[] = ['grumpy', 'happy', 'sad', 'quiet', 'sleepy', 'sick'];
import { todayISO, formatDate, getWeekRange, formatWeekLabel } from '../../utils/date';

type Props = {
  notes: CareNote[];
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

function downloadReceiptHTML(filename: string, title: string, mood: string | undefined, journalContent: string, dateLabel: string) {
  const moodLine = mood ? `<p class="receipt-line">Mood: ${mood}</p>` : '';
  const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 1rem; min-height: 100vh; display: flex; justify-content: center; align-items: flex-start; background: #eee; font-family: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace; }
    .receipt { max-width: 20rem; padding: 1rem 1.25rem 1rem 1.5rem; background-image: linear-gradient(to bottom, #fafaf8, #f5f5f0), linear-gradient(to bottom, #e74c3c, #f39c12, #f1c40f, #2ecc71, #3498db, #9b59b6); background-size: 100% 100%, 4px 100%; background-position: 0 0, left top; background-repeat: no-repeat, no-repeat; border: 2px dashed #bbb; font-size: 0.875rem; }
    .receipt-title { font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 0.5rem 0; background: linear-gradient(to bottom, #e74c3c, #f39c12, #f1c40f, #2ecc71, #3498db, #9b59b6); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .receipt-line { margin: 0.25rem 0; color: #333; white-space: pre-wrap; word-break: break-word; }
    .receipt-divider { border: none; border-top: 1px dashed #ccc; margin: 0.75rem 0; }
    .receipt-meta { font-size: 0.75rem; color: #666; margin-bottom: 0.5rem; }
  </style>
</head>
<body>
  <div class="receipt">
    <h1 class="receipt-title">Journal of the day</h1>
    <p class="receipt-meta">${dateLabel}</p>
    ${moodLine}
    <hr class="receipt-divider" />
    <div class="receipt-line">${journalContent.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')}</div>
  </div>
</body>
</html>`;
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function KidJournalScreen({ notes, entries, onBack, onSave }: Props) {
  const [date, setDate] = useState(todayISO());
  const [content, setContent] = useState('');
  const [gifUrl, setGifUrl] = useState('');
  const [mood, setMood] = useState<Mood | ''>('');
  const existingNote = notes.find((n) => n.date === date);

  useEffect(() => {
    const note = notes.find((n) => n.date === date);
    setContent(note?.content ?? '');
    setGifUrl(note?.gifUrl ?? '');
    setMood(note?.mood ?? '');
  }, [date, notes]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: existingNote?.id ?? Date.now().toString(),
      date,
      content,
      gifUrl: gifUrl.trim() || undefined,
      mood: mood || undefined,
    });
  };

  const dayEntries = entries.filter((e) => e.date === date);
  const dayMiles = dayEntries.reduce((sum, e) => sum + e.roundTripMiles, 0);

  const handleDownloadDay = () => {
    const note = notes.find((n) => n.date === date);
    const dateLabel = formatDate(date);
    const journalContent = note?.content || content || '(No notes saved)';
    downloadReceiptHTML(
      `journal-of-the-day-${date}.html`,
      `Journal of the day — ${dateLabel}`,
      note?.mood,
      journalContent,
      dateLabel
    );
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
            n.mood ? `Mood: ${n.mood}` : '',
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
            <div className="nanny-mood-bar">
              <span className="nanny-mood-label">Today's mood</span>
              <div className="nanny-mood-options">
                {MOODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`nanny-mood-chip ${mood === m ? 'nanny-mood-chip-active' : ''}`}
                    onClick={() => setMood(mood === m ? '' : m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
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

            <div className="nanny-journal-receipt">
              <label className="nanny-journal-receipt-label">Journal of the day</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Notes, activities, observations..."
                rows={6}
                className="nanny-input nanny-journal-receipt-text"
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

