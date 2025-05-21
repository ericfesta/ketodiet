import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../stores/authStore'
import { supabase } from '../../lib/supabaseClient'
import LanguageSwitcher from '../ui/LanguageSwitcher'

const Navbar = ({ toggleMobileMenu }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const { user } = useAuthStore()
  const [scrolled, setScrolled] = useState(false)
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }
  
  const isActive = (path) => {
    return location.pathname === path
  }
  
  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">
              {t('app.name')}
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/recipes" 
              className={`text-sm font-medium transition-colors ${
                isActive('/recipes') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              {t('nav.recipes')}
            </Link>
            <Link 
              to="/education" 
              className={`text-sm font-medium transition-colors ${
                isActive('/education') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              {t('nav.education')}
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors ${
                    isActive('/dashboard') 
                      ? 'text-primary-600' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {t('nav.dashboard')}
                </Link>
                <Link 
                  to="/profile" 
                  className={`text-sm font-medium transition-colors ${
                    isActive('/profile') 
                      ? 'text-primary-600' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {t('nav.profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
            
            <LanguageSwitcher />
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none"
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
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
