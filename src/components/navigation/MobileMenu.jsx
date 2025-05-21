import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { supabase } from '../../lib/supabaseClient'
import LanguageSwitcher from '../ui/LanguageSwitcher'

const MobileMenu = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Menu panel */}
      <div className="fixed right-0 top-0 bottom-0 w-64 bg-white shadow-xl flex flex-col">
        {/* Close button */}
        <div className="p-4 flex justify-end">
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
        
        {/* Menu items */}
        <div className="flex-1 px-4 py-2 space-y-4">
          <Link 
            to="/" 
            className="block py-2 text-base font-medium text-gray-700 hover:text-primary-600"
            onClick={onClose}
          >
            {t('nav.home')}
          </Link>
          <Link 
            to="/recipes" 
            className="block py-2 text-base font-medium text-gray-700 hover:text-primary-600"
            onClick={onClose}
          >
            {t('nav.recipes')}
          </Link>
          <Link 
            to="/education" 
            className="block py-2 text-base font-medium text-gray-700 hover:text-primary-600"
            onClick={onClose}
          >
            {t('nav.education')}
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="block py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                onClick={onClose}
              >
                {t('nav.dashboard')}
              </Link>
              <Link 
                to="/profile" 
                className="block py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                onClick={onClose}
              >
                {t('nav.profile')}
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 text-base font-medium text-gray-700 hover:text-primary-600"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="block py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                onClick={onClose}
              >
                {t('nav.login')}
              </Link>
              <Link 
                to="/register" 
                className="block py-2 text-base font-medium text-primary-600 hover:text-primary-700"
                onClick={onClose}
              >
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
        
        {/* Language switcher */}
        <div className="p-4 border-t border-gray-200">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
