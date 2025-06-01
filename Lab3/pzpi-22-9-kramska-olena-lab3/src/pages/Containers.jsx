import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Containers = () => {
  const [containers, setContainers] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [expandedLocations, setExpandedLocations] = useState({});
  const { t } = useTranslation();

  const role = localStorage.getItem('role');

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = async () => {
    const res = await fetch('/api/containers', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    const data = await res.json();
    setContainers(data);
  };

  const handleAddOrUpdate = async () => {
    if (!name || !location || !capacity) {
      alert(t('alerts.fill_all'));
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/containers/${editingId}` : '/api/containers';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ name, location, capacity: parseFloat(capacity) })
    });

    if (res.ok) {
      alert(editingId ? t('alerts.container_updated') : t('alerts.container_added'));
      resetForm();
      refreshList();
    } else {
      alert(t('alerts.save_error'));
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(t('alerts.confirm_delete'));
    if (!confirmDelete) return;

    const res = await fetch(`/api/containers/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (res.ok) {
      alert(t('alerts.container_deleted'));
      refreshList();
    } else {
      alert(t('alerts.delete_error'));
    }
  };

  const resetForm = () => {
    setName('');
    setLocation('');
    setCapacity('');
    setEditingId(null);
  };

  const groupedByLocation = containers.reduce((groups, container) => {
    const loc = container.location || t('details.unknown_location');
    if (!groups[loc]) groups[loc] = [];
    groups[loc].push(container);
    return groups;
  }, {});

  const toggleExpand = (locationKey) => {
    setExpandedLocations((prev) => ({
      ...prev,
      [locationKey]: !prev[locationKey]
    }));
  };

  return (
    <div className="register-container">
      <div className="card form-card">
        <h2>{editingId ? t('title.edit_container') : t('title.new_container')}</h2>
        <input placeholder={t('form.name')} value={name} onChange={e => setName(e.target.value)} />
        <input placeholder={t('form.location')} value={location} onChange={e => setLocation(e.target.value)} />
        <input type="number" placeholder={t('form.capacity')} value={capacity} onChange={e => setCapacity(e.target.value)} />
        <button onClick={handleAddOrUpdate}>{editingId ? t('buttons.update') : t('buttons.add')}</button>
        {editingId && <button onClick={resetForm} style={{ marginTop: '6px' }}>{t('buttons.cancel')}</button>}
      </div>

      <div className="user-list" style={{ marginTop: '20px' }}>
        {Object.entries(groupedByLocation).map(([locationKey, group]) => {
          const isExpanded = expandedLocations[locationKey] ?? false;
          return (
            <div key={locationKey} className="container-group" style={{
              border: '1px solid #fff3',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)'
            }}>
              <div
                onClick={() => toggleExpand(locationKey)}
                style={{
                  fontWeight: '600',
                  fontSize: '18px',
                  marginBottom: isExpanded ? '16px' : '0',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span><span style={{ color: '#ffca84' }}>{t('details.location')}:</span> {locationKey}</span>
                <span style={{ fontSize: '14px', color: '#aaa' }}>{isExpanded ? t('buttons.collapse') : t('buttons.expand')}</span>
              </div>

              {isExpanded && group.map(c => (
                <div key={c.container_id} className="user-row" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '12px',
                  borderBottom: '1px dashed rgba(255, 255, 255, 0.1)',
                  marginBottom: '14px'
                }}>
                  <div style={{ color: '#f0f0f0' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{c.name}</div>
                    <div style={{ fontSize: '14px', opacity: 0.85 }}>
                      {t('form.capacity')}: <strong>{c.capacity}</strong>
                    </div>
                  </div>

                  <div className="user-buttons" style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn" onClick={() => {
                      setEditingId(c.container_id);
                      setName(c.name);
                      setLocation(c.location);
                      setCapacity(c.capacity.toString());
                    }}>{t('buttons.edit')}</button>
                    <button className="btn" onClick={() => handleDelete(c.container_id)}>{t('buttons.delete')}</button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Containers;
