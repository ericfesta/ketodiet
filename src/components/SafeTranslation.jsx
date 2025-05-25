import React from 'react'
import { useTranslation } from 'react-i18next'
import { safeTranslate } from '../utils/translationHelpers'

/**
 * A component that safely handles translations with fallbacks
 * 
 * @param {Object} props - Component props
 * @param {string} props.i18nKey - Translation key
 * @param {string} props.fallback - Fallback text if translation doesn't exist
 * @param {Object} props.options - Translation options (interpolation, etc.)
 * @returns {React.ReactElement} - Rendered component
 */
const SafeTranslation = ({ i18nKey, fallback = '', options = {} }) => {
  const { t, i18n } = useTranslation()
  
  return (
    <>{safeTranslate(t, i18n, i18nKey, fallback, options)}</>
  )
}

export default SafeTranslation
