import React from 'react';
import { useTranslation } from 'react-i18next';
import { safeTranslate } from '../utils/translationHelpers';

/**
 * A component that safely renders translate<pivotalAction type="file" filePath="src/components/SafeTranslation.jsx">import React from 'react';
import { useTranslation } from 'react-i18next';
import { safeTranslate } from '../utils/translationHelpers';

/**
 * A component that safely renders translated text
 * If the translation key doesn't exist, it renders a fallback or empty string
 * @param {Object} props
 * @param {string} props.i18nKey - The translation key
 * @param {string} props.fallback - Optional fallback text
 * @param {Object} props.options - Optional translation options (interpolation, etc.)
 * @returns {React.ReactElement}
 */
const SafeTranslation = ({ i18nKey, fallback = '', options = {} }) => {
  const { t, i18n } = useTranslation();
  
  return (
    <>{safeTranslate(t, i18n, i18nKey, fallback, options)}</>
  );
};

export default SafeTranslation;
