/**
 * Helper function to check if a translation key exists in the current language
 * @param {object} i18n - The i18next instance
 * @param {string} key - The translation key to check
 * @returns {boolean} - Whether the key exists
 */
export const translationKeyExists = (i18n, key) => {
  const language = i18n.language;
  const namespaces = i18n.options.ns;
  
  // Check if the key exists in any namespace
  for (const ns of Array.isArray(namespaces) ? namespaces : [namespaces]) {
    if (i18n.exists(key, { lng: language, ns })) {
      return true;
    }
  }
  
  return false;
};

/**
 * Helper function to safely translate a key
 * If the key doesn't exist, it returns a fallback or empty string
 * @param {function} t - The translation function from useTranslation
 * @param {object} i18n - The i18next instance
 * @param {string} key - The translation key
 * @param {string} fallback - Optional fallback text
 * @param {object} options - Optional translation options (interpolation, etc.)
 * @returns {string} - The translated text or fallback
 */
export const safeTranslate = (t, i18n, key, fallback = '', options = {}) => {
  if (!key) return fallback;
  
  // Check if the key exists
  if (translationKeyExists(i18n, key)) {
    return t(key, options);
  }
  
  // Log missing key in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Translation key not found: ${key}`);
  }
  
  return fallback;
};
