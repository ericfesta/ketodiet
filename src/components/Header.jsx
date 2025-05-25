import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import LanguageSwitcher from './LanguageSwitcher';
import SafeTranslation from './SafeTranslation';

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, signOut } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  const handleSignOut = async () => {
    await signOut();
    closeMobileMenu();
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
            <span className="text-2xl font-bold text-primary-600">
              <SafeTranslation i18nKey="app.name" fallback="KetoLife" />
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium ${isActive('/') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`}
              onClick={closeMobileMenu}
            >
              <SafeTranslation i18nKey="nav.home" fallback="Home" />
            </Link>
            <Link 
              to="/recipes" 
              className={`text-sm font-medium ${isActive('/recipes') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`}
              onClick={closeMobileMenu}
            >
              <SafeTranslation i18nKey="nav.recipes" fallback="Recipes" />
            </Link>
            <Link 
              to="/education" 
              className={`text-sm font-medium ${isActive('/education') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`}
              onClick={closeMobileMenu}
            >
              <SafeTranslation i18nKey="nav.education" fallback="Learn" />
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium ${isActive('/dashboard') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`}
                  onClick={closeMobileMenu}
                >
                  <SafeTranslation i18nKey="nav.dashboard" fallback="Dashboard" />
                </Link>
                <Link 
                  to="/profile" 
                  className={`text-sm font-medium ${isActive('/profile') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`}
                  onClick={closeMobileMenu}
                >
                  <SafeTranslation i18nKey="nav.profile" fallback="Profile" />
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  <SafeTranslation i18nKey="nav.logout" fallback="Log Out" />
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`text-sm font-medium ${isActive('/login') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`}
                  onClick={closeMobileMenu}
                >
                  <SafeTranslation i18nKey="nav.login" fallback="Log In" />
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                  onClick={closeMobileMenu}
                >
                  <SafeTranslation i18nKey="nav.register" fallback="Sign Up" />
                </Link>
              </>
            )}
            
            <LanguageSwitcher />
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 py-2 space-y-3">
            <Link 
              to="/" 
              className={`block py-2 px-4 text-sm font-medium ${isActive('/') ? 'text-primary-600' : 'text-gray-700'}`}
              onClick={closeMobileMenu}
            >
              <SafeTranslation i18nKey="nav.home" fallback="Home" />
            </Link>
            <Link 
              to="/recipes" 
              className={`block py-2 px-4 text-sm font-medium ${isActive('/recipes') ? 'text-primary-600' : 'text-gray-700'}`}
              onClick={closeMobileMenu}
            >
              <SafeTranslation i18nKey="nav.recipes" fallback="Recipes" />
            </Link>
            <Link 
              to="/education" 
              className={`block py-2 px-4 text-sm font-medium ${isActive('/education') ? 'text-primary-600' : 'text-gray-700'}`}
              onClick={closeMobileMenu}
            >
              <SafeTranslation i18nKey="nav.education" fallback="Learn" />
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`block py-2 px-4 text-sm font-medium ${isActive('/dashboard') ? 'text-primary-600' : 'text-gray-700'}`}
                  onClick={closeMobileMenu}
                >
                  <SafeTranslation i18nKey="nav.dashboard" fallback="Dashboard" />
                </Link>
                <Link 
                  to="/profile" 
                  className={`block py-2 px-4 text-sm font-medium ${isActive('/profile') ? 'text-primary-600' : 'text-gray-700'}`}
                  onClick={closeMobileMenu}
                >
                  <SafeTranslation i18nKey="nav.profile" fallback="Profile" />
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="block w-full text-left py-2 px-4 text-sm font-medium text-gray-700"
                >
                  <SafeTranslation i18nKey="nav.logout" fallback="Log Out" />
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`block py-2 px-4 text-sm font-medium ${isActive('/login') ? 'text-primary-600' : 'text-gray-700'}`}
                  onClick={closeMobileMenu}
                >
                  <SafeTranslation i18nKey="nav.login" fallback="Log In" />
                </Link>
                <Link 
                  to="/register" 
                  className="block py-2 px-4 text-sm font-medium text-white bg-primary-600 rounded-md"
                  onClick={closeMobileMenu}
                >
                  <SafeTranslation i18nKey="nav.register" fallback="Sign Up" />
                </Link>
              </>
            )}
            
            <div className="py-2 px-4">
              <LanguageSwitcher />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
