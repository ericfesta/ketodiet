import React from 'react';
import { useTranslation } from 'react-i18next';

// This component is for development only
// It helps identify missing translations
const TranslationDebugger = () => {
  const { t, i18n } = useTranslation();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  const currentLanguage = i18n.language;
  const availableLanguages = Object.keys(i18n.options.resources);
  
  return (
    <div className="fixed bottom-0 right-0 bg-gray-800 text-white p-4 m-4 rounded-lg z-50 text-xs">
      <h3 className="font-bold mb-2">Translation Debugger</h3>
      <div>
        <p>Current language: <span className="font-mono">{currentLanguage}</span></p>
        <p>Available languages: {availableLanguages.join(', ')}</p>
      </div>
      <div className="mt-2">
        <button 
          onClick={() => {
            // Toggle debug mode
            i18n.options.debug = !i18n.options.debug;
            console.log(`i18n debug mode: ${i18n.options.debug ? 'ON' : 'OFF'}`);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
        >
          Toggle Debug
        </button>
        <button 
          onClick={() => {
            // Reload the page to clear any cached translations
            window.location.reload();
          }}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Reload
        </button>
      </div>
    </div>
  );
};

export default TranslationDebugger;
