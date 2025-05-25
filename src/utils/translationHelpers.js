/**
 * Safely translates a key with fallback
 * 
 * @param {Function} t - i18next translation function
 * @param {Object} i18n - i18next instance
 * @param {string} key - Translation key
 * @param {string} fallback - Fallback text if translation doesn't exist
 * @param {Object} options - Translation options (interpolation, etc.)
 * @returns {string} - Translated text or fallback
 */
export const safeTranslate = (t, i18n, key, fallback = '', options = {}) => {
  // Check if the key exists in the current language
  const exists = i18n.exists(key);
  
  // If the key exists, use the translation, otherwise use the fallback
  return exists ? t(key, options) : fallback;
}
