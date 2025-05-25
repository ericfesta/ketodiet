import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../utils/translationHelpers';

/**
 * A component that allows users to switch between available languages
 * @returns {React.ReactElement}
 */
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'it', name: 'Italiano' }
  ];
  
  const handleLanguageChange = (lang) => {
    changeLanguage(i18n, lang);
  };
  
  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-2 py-1 text-sm rounded ${
            currentLanguage === lang.code
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          aria-label={`Switch to ${lang.name}`}
        >
          {lang.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
