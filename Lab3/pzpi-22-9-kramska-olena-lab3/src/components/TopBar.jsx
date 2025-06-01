import './TopBar.css';
import LanguageSwitcher from './LanguageSwitcher';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TopBar = () => {
  const { t } = useTranslation();
  const username = localStorage.getItem('username') || t('user.default');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  return (
    <header className="topbar">
      <Link to="/dashboard" className="logo">🍷 WineControl</Link>
      <div className="topbar-right">
        <span className="username">{username}</span>
        <button className="logout-button" onClick={handleLogout}>
          {t('buttons.logout')}
        </button>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default TopBar;
