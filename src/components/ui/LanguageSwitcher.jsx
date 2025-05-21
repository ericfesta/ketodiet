import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'it', name: 'Italiano' }
  ]
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]
  
  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('language', code)
    setIsOpen(false)
  }
  
  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{currentLanguage.name}</span>
        <svg 
          className="ml-1 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  language.code === currentLanguage.code
                    ? 'bg-gray-100 text-primary-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => changeLanguage(language.code)}
                role="menuitem"
              >
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
