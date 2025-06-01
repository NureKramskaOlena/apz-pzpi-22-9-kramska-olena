import { useState, useEffect } from 'react';
import '../styles/RegisterOperator.css';
import { useTranslation } from 'react-i18next';

const RegisterOperator = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetch('/api/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleRegister = async () => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        username,
        password,
        role: 'operator',
        created_by: 1
      })
    });

    if (res.ok) {
      alert(t('alerts.added'));
      setUsername('');
      setPassword('');
      await refreshList();
    } else {
      const errorData = await res.json();
      alert(errorData.message || t('alerts.error_add'));
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/users/${editingUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          initiator_id: 1,
          username,
          password,
          role: 'operator',
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(t('alerts.updated'));
        setIsEditing(false);
        setEditingUserId(null);
        setUsername('');
        setPassword('');
        await refreshList();
      } else {
        alert(result.message || t('alerts.error_update'));
      }
    } catch (err) {
      alert(t('alerts.server_error'));
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ initiator_id: 1 }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || t('alerts.deleted'));
        refreshList();
      } else {
        alert(data.message || t('alerts.error_delete'));
      }
    } catch (err) {
      alert(t('alerts.server_error'));
      console.error(err);
    }
  };

  const refreshList = async () => {
    try {
      const res = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(t('alerts.refresh_error'), err);
    }
  };

  return (
    <div className="register-container">
      <div className="card form-card">
        <h2>{isEditing ? t('title.update_operator') : t('title.register_worker')}</h2>
        <input
          type="text"
          placeholder={t('form.username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder={t('form.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={isEditing ? handleUpdate : handleRegister}>
          {isEditing ? t('buttons.update') : t('buttons.register')}
        </button>
      </div>

      <div className="card user-list">
        <h2>{t('title.operators')}</h2>
        {users.map((u) => (
          <div key={u.user_id} className="user-row">
            <span>{u.username}</span>
            <div className="user-buttons">
              <button
                className="btn"
                onClick={() => {
                  setIsEditing(true);
                  setEditingUserId(u.user_id);
                  setUsername(u.username);
                  setPassword('');
                }}
              >
                {t('buttons.update')}
              </button>
              <button
                className="btn"
                onClick={() => handleDelete(u.user_id)}
              >
                {t('buttons.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegisterOperator;
