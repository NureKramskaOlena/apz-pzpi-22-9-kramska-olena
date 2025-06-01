import { useState, useEffect } from 'react';
import '../styles/RegisterOperator.css';
import { useTranslation } from 'react-i18next';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetTemp, setTargetTemp] = useState('');
  const [targetSugar, setTargetSugar] = useState('');
  const [targetAlcohol, setTargetAlcohol] = useState('');
  const [containerId, setContainerId] = useState('');
  const [editingId, setEditingId] = useState(null);

  const userId = parseInt(localStorage.getItem('user_id'));
  const { t } = useTranslation();

  useEffect(() => {
    fetch('/api/recipes', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => res.json())
      .then(data => setRecipes(data));
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setTargetTemp('');
    setTargetSugar('');
    setTargetAlcohol('');
    setContainerId('');
    setEditingId(null);
  };

  const refreshList = async () => {
    const res = await fetch('/api/recipes', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    const data = await res.json();
    setRecipes(data);
  };

  const handleSubmit = async () => {
    if (userId !== 1) {
      alert(t('alerts.owner_only_edit'));
      return;
    }

    const url = editingId ? `/api/recipes/${editingId}` : '/api/recipes';
    const method = editingId ? 'PUT' : 'POST';

    const payload = {
      name,
      description,
      target_temp: parseFloat(targetTemp),
      target_sugar: parseFloat(targetSugar),
      target_alcohol: parseFloat(targetAlcohol),
      container_id: parseInt(containerId),
      ...(editingId ? { updated_by: 1 } : { created_by: 1 })
    };

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      alert(editingId ? t('alerts.recipe_updated') : t('alerts.recipe_added'));
      resetForm();
      await refreshList();
    } else {
      alert(data.message || t('alerts.error'));
    }
  };

  const handleDelete = async (id) => {
    if (userId !== 1) {
      alert(t('alerts.owner_only_delete'));
      return;
    }

    const res = await fetch(`/api/recipes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ deleted_by: 1 }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(t('alerts.recipe_deleted'));
      await refreshList();
    } else {
      alert(data.message || t('alerts.delete_error'));
    }
  };

  return (
    <div className="register-container">
      {userId === 1 && (
        <div className="card form-card">
          <h2>{editingId ? t('title.update_recipe') : t('title.new_recipe')}</h2>
          <input placeholder={t('form.name')} value={name} onChange={e => setName(e.target.value)} />
          <input placeholder={t('form.description')} value={description} onChange={e => setDescription(e.target.value)} />
          <input placeholder={t('form.temp')} type="number" value={targetTemp} onChange={e => setTargetTemp(e.target.value)} />
          <input placeholder={t('form.sugar')} type="number" value={targetSugar} onChange={e => setTargetSugar(e.target.value)} />
          <input placeholder={t('form.alcohol')} type="number" value={targetAlcohol} onChange={e => setTargetAlcohol(e.target.value)} />
          <input placeholder={t('form.container_id')} type="number" value={containerId} onChange={e => setContainerId(e.target.value)} />
          <button onClick={handleSubmit}>{editingId ? t('buttons.update') : t('buttons.add')}</button>
        </div>
      )}

      <div className="card user-list">
        {recipes.map((r) => (
          <div key={r.recipe_id} className="user-row">
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{r.name}</div>
              <div style={{ fontSize: '14px', color: '#ccc' }}>{r.description}</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>
                {t('details.temp')}: <b>{r.target_temp}°C</b> | {t('details.sugar')}: <b>{r.target_sugar}%</b> | {t('details.alcohol')}: <b>{r.target_alcohol}%</b><br />
                {t('details.container')}: <b>{r.container_name ?? '—'}</b> — {r.container_location ?? t('details.unknown_location')}
              </div>
            </div>

            {userId === 1 && (
              <div className="user-buttons">
                <button className="btn" onClick={() => {
                  setEditingId(r.recipe_id);
                  setName(r.name);
                  setDescription(r.description);
                  setTargetTemp(r.target_temp);
                  setTargetSugar(r.target_sugar);
                  setTargetAlcohol(r.target_alcohol);
                  setContainerId(r.container_id);
                }}>
                  {t('buttons.update')}
                </button>
                <button className="btn" onClick={() => handleDelete(r.recipe_id)}>
                  {t('buttons.delete')}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
