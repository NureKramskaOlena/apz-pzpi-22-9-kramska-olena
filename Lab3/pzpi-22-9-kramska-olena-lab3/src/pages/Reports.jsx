import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [containers, setContainers] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [recipeId, setRecipeId] = useState('');
  const [containerId, setContainerId] = useState('');
  const [expandedReports, setExpandedReports] = useState([]);

  const userId = localStorage.getItem('user_id');
  const { t } = useTranslation();

  useEffect(() => {
    refreshAll();
  }, []);

  const refreshAll = async () => {
    const [repRes, recRes, conRes] = await Promise.all([
      fetch('/api/reports', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }),
      fetch('/api/recipes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }),
      fetch('/api/containers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
    ]);

    setReports(await repRes.json());
    setRecipes(await recRes.json());
    setContainers(await conRes.json());
  };

  const handleSubmit = async () => {
    if (!name || !content || !recipeId || !containerId) {
      alert(t('alerts.fill_all'));
      return;
    }

    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        name,
        content,
        container_id: parseInt(containerId),
        generated_by: parseInt(userId),
        recipe_id: parseInt(recipeId)
      })
    });

    if (res.ok) {
      alert(t('alerts.report_created'));
      setName('');
      setContent('');
      setContainerId('');
      setRecipeId('');
      refreshAll();
    } else {
      alert(t('alerts.report_error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('alerts.confirm_delete'))) return;

    const res = await fetch(`/api/reports/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    if (res.ok) {
      alert(t('alerts.report_deleted'));
      refreshAll();
    } else {
      alert(t('alerts.delete_error'));
    }
  };

  const handleDownload = (id) => {
    window.open(`/api/reports/${id}/download`, '_blank');
  };

  const toggleExpand = (id) => {
    setExpandedReports(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="register-container">
      <div className="card form-card">
        <h2>{t('title.new_report')}</h2>
        <input
          placeholder={t('form.report_name')}
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <textarea
          placeholder={t('form.report_content')}
          value={content}
          onChange={e => setContent(e.target.value)}
          style={{
            backgroundColor: '#3a0b1e',
            color: '#fff',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '10px',
            resize: 'vertical',
            fontFamily: 'inherit',
            fontSize: '14px',
            minHeight: '80px',
            outline: 'none'
          }}
        />

        <select value={recipeId} onChange={e => setRecipeId(e.target.value)}>
          <option value="">{t('form.select_recipe')}</option>
          {recipes.map(r => (
            <option key={r.recipe_id} value={r.recipe_id}>{r.name}</option>
          ))}
        </select>
        <select value={containerId} onChange={e => setContainerId(e.target.value)}>
          <option value="">{t('form.select_container')}</option>
          {containers.map(c => (
            <option key={c.container_id} value={c.container_id}>
              {c.name} — {c.location}
            </option>
          ))}
        </select>
        <button onClick={handleSubmit}>{t('buttons.add')}</button>
      </div>

      <div className="user-list" style={{ marginTop: '20px' }}>
        {reports.map(r => (
          <div key={r.report_id} className="container-group" style={{
            border: '1px solid #fff3',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)'
          }}>
            <div onClick={() => toggleExpand(r.report_id)} style={{
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                📄 {r.name}
              </div>
              <span style={{ fontSize: '14px', color: '#ccc' }}>
                {expandedReports.includes(r.report_id) ? t('buttons.collapse') : t('buttons.expand')}
              </span>
            </div>

            {expandedReports.includes(r.report_id) && (
              <div style={{ color: '#ccc', fontSize: '14px', marginTop: '12px' }}>
                <p><strong>{t('details.recipe')}:</strong> {r.recipe_name || t('details.unknown')}</p>
                <p><strong>{t('details.container')}:</strong> {r.container_name} — {r.container_location} ({t('details.volume')}: {r.capacity})</p>
                <p><strong>{t('details.created_at')}:</strong> {new Date(r.created_at).toLocaleString()}</p>
                <p><strong>{t('details.author')}:</strong> {r.generated_by}</p>
                <p><strong>{t('details.content')}:</strong> {r.content}</p>

                <div className="user-buttons" style={{ marginTop: '10px' }}>
                  <button className="btn" onClick={() => handleDownload(r.report_id)}>{t('buttons.download')}</button>
                  <button className="btn" onClick={() => handleDelete(r.report_id)}>{t('buttons.delete')}</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
