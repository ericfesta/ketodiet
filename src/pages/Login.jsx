import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../stores/authStore'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })
      
      if (error) throw error
      
      setUser(data.user)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error logging in:', error)
      setError(error.message || t('login.genericError'))
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('login.title')}</h1>
        <p className="text-gray-600">{t('login.subtitle')}</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('login.emailLabel')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder={t('login.emailPlaceholder')}
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t('login.passwordLabel')}
            </label>
            <Link to="/reset-password" className="text-sm text-primary-600 hover:text-primary-500">
              {t('login.forgotPassword')}
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder={t('login.passwordPlaceholder')}
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300"
          >
            {loading ? t('login.loggingIn') : t('login.loginButton')}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {t('login.noAccount')}{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            {t('login.registerLink')}
          </Link>
        </p>
      </div>
      
      <div className="mt-8 border-t border-gray-200 pt-6">
        <p className="text-xs text-center text-gray-500">
          {t('login.termsText')}{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">
            {t('login.termsLink')}
          </a>{' '}
          {t('login.andText')}{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">
            {t('login.privacyLink')}
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
