import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';
import type { MealNote } from '../../types';
import { todayISO } from '../../utils/date';
import { colorizeFoodText } from '../../utils/foodColors';

function MealTextWithColors({ text }: { text: string }) {
  const segments = colorizeFoodText(text);
  return (
    <span style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
      {segments.map((seg, i) =>
        seg.type === 'food' ? (
          <span key={i} style={{ color: seg.color, fontWeight: 600 }}>
            {seg.content}
          </span>
        ) : (
          <span key={i}>{seg.content}</span>
        )
      )}
    </span>
  );
}

type Props = {
  mealNotes: MealNote[];
  onBack: () => void;
  onSave: (note: MealNote) => void;
};

export function MealsScreen({ mealNotes, onBack, onSave }: Props) {
  const [date, setDate] = useState(todayISO());
  const [notes, setNotes] = useState('');
  const [groceryItem, setGroceryItem] = useState('');
  const [groceryList, setGroceryList] = useState<string[]>([]);

  const existingNote = mealNotes.find((n) => n.date === date);

  useEffect(() => {
    const note = mealNotes.find((n) => n.date === date);
    if (note) {
      setNotes(note.notes);
      setGroceryList([...note.groceryList]);
    } else {
      setNotes('');
      setGroceryList([]);
    }
  }, [date, mealNotes]);

  const handleAddGrocery = () => {
    const item = groceryItem.trim();
    if (item && !groceryList.includes(item)) {
      setGroceryList([...groceryList, item]);
      setGroceryItem('');
    }
  };

  const handleRemoveGrocery = (idx: number) => {
    setGroceryList(groceryList.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const note: MealNote = {
      id: existingNote?.id ?? Date.now().toString(),
      date,
      notes,
      groceryList,
    };
    onSave(note);
  };

  return (
    <div className="nanny-screen nanny-bg">
      <header className="nanny-header">
        <button type="button" onClick={onBack} className="nanny-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <ChevronLeft className="nanny-icon" />
          Back
        </button>
        <h1 className="nanny-title">Meals</h1>
        <div style={{ width: '5rem' }} />
      </header>

      <main style={{ flex: 1, padding: '1.25rem', overflowY: 'auto' }}>
        <form onSubmit={handleSave} style={{ maxWidth: '32rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="nanny-card" style={{ padding: '1rem' }}>
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. cheese, banana, yogurt..."
                rows={4}
                className="nanny-input"
                style={{ resize: 'none' }}
              />
              {notes.trim() && (
                <div className="nanny-meals-color-preview" style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', border: '1px dashed #ccc', background: '#fafafa', minHeight: '2rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  <MealTextWithColors text={notes} />
                </div>
              )}
            </div>

            <div>
              <label className="nanny-label">Grocery list</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={groceryItem}
                  onChange={(e) => setGroceryItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGrocery())}
                  placeholder="Add item"
                  className="nanny-input"
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={handleAddGrocery} className="nanny-btn">
                  <Plus className="nanny-icon" />
                </button>
              </div>
              {groceryList.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {groceryList.map((item, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid #eee',
                      }}
                    >
                      <span>{item}</span>
                      <button type="button" onClick={() => handleRemoveGrocery(idx)} className="nanny-btn" style={{ padding: '0.25rem' }}>
                        <Trash2 className="nanny-icon" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button type="submit" className="nanny-cta" style={{ marginTop: '1rem' }}>
              Save
            </button>
          </div>

          {existingNote && (existingNote.notes || existingNote.groceryList.length > 0) && (
            <div className="nanny-card">
              <div className="nanny-card-header">Saved for {date}</div>
              <div style={{ padding: '1rem', borderTop: '2px solid #000' }}>
                {existingNote.notes && (
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    <MealTextWithColors text={existingNote.notes} />
                  </p>
                )}
                {existingNote.groceryList.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                    {existingNote.groceryList.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

