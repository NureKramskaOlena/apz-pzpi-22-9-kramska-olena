import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className="lang-switcher-topbar">
      <button onClick={() => i18n.changeLanguage('uk')}>UA</button>
      <button onClick={() => i18n.changeLanguage('en')}>ENG</button>
    </div>
  );
};

export default LanguageSwitcher;
