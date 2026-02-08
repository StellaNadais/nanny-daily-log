import { useState } from 'react';
import { Trash2, Plus, MapPin } from 'lucide-react';
import type { SavedLocation } from '../../types';

type Props = {
  locations: SavedLocation[];
  onSave: (locations: SavedLocation[]) => void;
  onClose: () => void;
};

export function LocationManager({ locations, onSave, onClose }: Props) {
  const [editingLocations, setEditingLocations] = useState<SavedLocation[]>(locations);
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    roundTripMiles: '',
  });

  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.address || !newLocation.roundTripMiles) {
      return;
    }

    const location: SavedLocation = {
      id: Date.now().toString(),
      name: newLocation.name,
      address: newLocation.address,
      roundTripMiles: parseFloat(newLocation.roundTripMiles),
    };

    setEditingLocations([...editingLocations, location]);
    setNewLocation({ name: '', address: '', roundTripMiles: '' });
  };

  const handleDeleteLocation = (id: string) => {
    setEditingLocations(editingLocations.filter((loc) => loc.id !== id));
  };

  const handleSave = () => {
    onSave(editingLocations);
    onClose();
  };

  return (
    <div className="nanny-screen nanny-bg">
      <header className="nanny-header">
        <h1 className="nanny-title">MANAGE LOCATIONS</h1>
        <button type="button" onClick={onClose} className="nanny-btn">
          Cancel
        </button>
      </header>

      <main style={{ flex: 1, padding: '1.25rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '32rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="nanny-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <MapPin className="nanny-icon" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
              <div style={{ fontSize: '0.875rem' }}>
                <p className="nanny-label" style={{ marginBottom: '0.5rem' }}>
                  Add Frequently Visited Locations
                </p>
                <p style={{ fontSize: '0.75rem', color: '#444', lineHeight: 1.5 }}>
                  Save locations you visit regularly with their round-trip distance from home.
                  These will be available for quick selection when logging activities.
                </p>
              </div>
            </div>
          </div>

          <div className="nanny-card">
            <div className="nanny-card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus className="nanny-icon" />
              Add New Location
            </div>
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="nanny-label">Location Name</label>
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                  placeholder="e.g., Moraga Library"
                  className="nanny-input"
                />
              </div>
              <div>
                <label className="nanny-label">Address</label>
                <input
                  type="text"
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                  placeholder="e.g., 1500 St. Mary's Rd, Moraga, CA"
                  className="nanny-input"
                />
              </div>
              <div>
                <label className="nanny-label">Round-Trip Miles</label>
                <input
                  type="number"
                  step="0.1"
                  value={newLocation.roundTripMiles}
                  onChange={(e) => setNewLocation({ ...newLocation, roundTripMiles: e.target.value })}
                  placeholder="e.g., 4.0"
                  className="nanny-input"
                />
              </div>
              <button type="button" onClick={handleAddLocation} className="nanny-btn nanny-btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                Add Location
              </button>
            </div>
          </div>

          <div className="nanny-card">
            <div className="nanny-card-header">
              Saved Locations ({editingLocations.length})
            </div>
            <div style={{ borderTop: '2px solid #000' }}>
              {editingLocations.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  No locations saved yet
                </div>
              ) : (
                editingLocations.map((location) => (
                  <div
                    key={location.id}
                    style={{
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      borderBottom: '2px solid #e5e5e5',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div className="nanny-label" style={{ marginBottom: '0.25rem' }}>{location.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#444', marginBottom: '0.5rem' }}>{location.address}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{location.roundTripMiles} miles (round-trip)</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteLocation(location.id)}
                      className="nanny-btn"
                      style={{ padding: '0.5rem' }}
                    >
                      <Trash2 className="nanny-icon" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: '2px solid #000', padding: '1rem 1.25rem', background: '#fff' }}>
        <button type="button" onClick={handleSave} className="nanny-cta">
          Save & Close
        </button>
      </footer>
    </div>
  );
}
