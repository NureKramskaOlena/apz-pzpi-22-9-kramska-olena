import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import '../styles/Login.css';

const Login = () => {
  const { t, i18n } = useTranslation();
const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

const handleLogin = async () => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

if (res.ok) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('role', data.user.role); 
  localStorage.setItem('username', username);
  localStorage.setItem('user_id', data.user.id);

  navigate('/dashboard');
}

else {
      alert(data.message || 'Невірні дані');
    }
  } catch (err) {
    alert('Помилка підключення до сервера');
    console.error(err);
  }
};


  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
<div className="login-wrapper">
  {/* Перемикач мов */}
  <div className="lang-switcher">
    <button onClick={() => changeLanguage('uk')}>UA</button>
    <button onClick={() => changeLanguage('en')}>ENG</button>
  </div>

  <div className="login-box">
    <h2>{t('login_title')}</h2>
    <input
      type="text"
      placeholder={t('username')}
      value={username}
      onChange={e => setUsername(e.target.value)}
    />
    <input
      type="password"
      placeholder={t('password')}
      value={password}
      onChange={e => setPassword(e.target.value)}
    />
    <button onClick={handleLogin}>{t('submit')}</button>
  </div>
</div>

  );
};

export default Login;
