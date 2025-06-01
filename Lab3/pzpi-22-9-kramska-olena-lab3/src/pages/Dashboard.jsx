import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const { t } = useTranslation();

  return (
    <div className="dashboard">
      <div className="tiles">
        {role === 'owner' && (
          <div className="tile" onClick={() => navigate('/register')}>
            <h3>👥 {t('dashboard.employees')}</h3>
            <p>{t('dashboard.manage_employees')}</p>
          </div>
        )}
        <div className="tile" onClick={() => navigate('/recipes')}>
          <h3>🍷 {t('dashboard.recipes')}</h3>
          <p>{t('dashboard.tech_wine')}</p>
        </div>
        <div className="tile" onClick={() => navigate('/reports')}>
          <h3>📊 {t('dashboard.reports')}</h3>
          <p>{t('dashboard.view_analytics')}</p>
        </div>
        <div className="tile" onClick={() => navigate('/sensors')}>
          <h3>🌡️ {t('dashboard.sensors')}</h3>
          <p>{t('dashboard.env_status')}</p>
        </div>
        <div className="tile" onClick={() => navigate('/containers')}>
          <h3>🛢 {t('dashboard.containers')}</h3>
          <p>{t('dashboard.manage_containers')}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;