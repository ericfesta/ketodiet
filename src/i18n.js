import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translations
import enTranslation from './locales/en.json'
import itTranslation from './locales/it.json'

// Configure i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      it: {
        translation: itTranslation
      }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    // Debug mode to help identify missing translations
    debug: false,
    // Don't show keys in production
    keySeparator: '.',
    // Ensure we don't show the translation keys when translations are missing
    nsSeparator: false,
    // Return key if no translation was found
    returnNull: false,
    returnEmptyString: false
  })

export default i18n
