import { useEffect, useState } from 'react';
import '../styles/Sensors.css';
import { useTranslation } from 'react-i18next';

const Sensors = () => {
  const [sensors, setSensors] = useState([]);
  const [sensorName, setSensorName] = useState('');
  const [sensorType, setSensorType] = useState('');
  const [containerId, setContainerId] = useState('');
  const [containers, setContainers] = useState([]);

  const role = localStorage.getItem('role');
  const { t } = useTranslation();

  useEffect(() => {
    fetch('/api/sensors', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()).then(data => setSensors(data));

    fetch('/api/containers', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()).then(data => setContainers(data));
  }, []);

  const handleAddSensor = async () => {
    if (!sensorName || !sensorType || !containerId) {
      alert(t('alerts.fill_all'));
      return;
    }

    const selectedContainer = containers.find(
      c => c.container_id === parseInt(containerId)
    );
    const resolvedLocation = selectedContainer?.location || '';

    const res = await fetch('/api/sensors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        sensor_name: sensorName,
        sensor_type: sensorType,
        location: resolvedLocation,
        container_id: parseInt(containerId),
        created_by: 1
      })
    });

    if (res.ok) {
      alert(t('alerts.sensor_added'));
      setSensorName('');
      setSensorType('');
      setContainerId('');
      refreshList();
    } else {
      const data = await res.json();
      alert(data.message || t('alerts.add_error'));
    }
  };

  const handleDelete = async (id) => {
    try {
      const deletedBy = parseInt(localStorage.getItem('user_id'));

      const res = await fetch(`/api/sensors/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ deleted_by: deletedBy })
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || t('alerts.sensor_deleted'));
        refreshList();
      } else {
        alert(data.message || t('alerts.delete_error'));
      }
    } catch (err) {
      alert(t('alerts.server_error'));
      console.error(err);
    }
  };

  const refreshList = async () => {
    const res = await fetch('/api/sensors', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setSensors(data);
  };

  const grouped = sensors.reduce((acc, sensor) => {
    const groupKey = `${sensor.container_name || '—'}||${sensor.container_location || t('details.unknown_location')}`;
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(sensor);
    return acc;
  }, {});

  return (
    <div className="register-container">
      {role === 'owner' && (
        <div className="card form-card">
          <h2>{t('title.new_sensor')}</h2>
          <input
            placeholder={t('form.sensor_name')}
            value={sensorName}
            onChange={e => setSensorName(e.target.value)}
          />
          <select value={sensorType} onChange={e => setSensorType(e.target.value)}>
            <option value="">{t('form.select_type')}</option>
            <option value="temperature">{t('form.temperature')}</option>
            <option value="sugar">{t('form.sugar')}</option>
            <option value="alcohol">{t('form.alcohol')}</option>
          </select>
          <select value={containerId} onChange={e => setContainerId(e.target.value)}>
            <option value="">{t('form.select_container')}</option>
            {containers.map(c => (
              <option key={c.container_id} value={c.container_id}>
                {c.name} — {c.location}
              </option>
            ))}
          </select>
          <button onClick={handleAddSensor}>{t('buttons.add')}</button>
        </div>
      )}

      <div className="user-list">
        {Object.entries(grouped).map(([key, group]) => {
          const [name, location] = key.split('||');
          return (
            <div key={key} className="container-group" style={{
              border: '1px solid #fff3',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '20px',
              background: 'linear-gradient(145deg, #8a1c41, #9d294e)'
            }}>
              <div style={{
                fontWeight: 'bold',
                marginBottom: '10px',
                fontSize: '16px',
                color: '#fff',
              }}>
                <span style={{ color: '#ffcc66', fontWeight: 600 }}>{name}</span> —{' '}
                <span style={{ fontWeight: 600 }}>{location}</span>
              </div>

              {group.map((s) => (
                <div key={s.sensor_id} className="user-row">
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#fff' }}>{s.sensor_name}</div>
                    <div style={{ fontSize: '14px', color: '#ccc' }}>
                      {t('details.type')}: {t(`form.${s.sensor_type}`)} | {t('details.location')}: {s.location}
                    </div>
                  </div>
                  {role === 'owner' && (
                    <div className="user-buttons">
                      <button className="btn" onClick={() => handleDelete(s.sensor_id)}>
                        {t('buttons.delete')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sensors;
