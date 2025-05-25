import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../stores/authStore'
import SafeTranslation from '../components/SafeTranslation'

const Login = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showResendConfirmation, setShowResendConfirmation] = useState(false)
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleResendConfirmation = async () => {
    if (!formData.email) {
      setError(t('login.emailRequired', 'Please enter your email address first'))
      return
    }
    
    setLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email
      })
      
      if (error) throw error
      
      setError(null)
      setShowResendConfirmation(false)
      alert(t('login.confirmationSent', 'Confirmation email sent! Please check your inbox.'))
    } catch (err) {
      console.error('Error resending confirmation:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setShowResendConfirmation(false)
    setLoading(true)
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })
      
      if (authError) {
        // Check if it's an email confirmation error
        if (authError.message?.includes('email not confirmed') || 
            authError.message?.includes('Email not confirmed')) {
          setShowResendConfirmation(true)
          setError(t('login.emailNotConfirmed', 'Your email address has not been confirmed. Please check your inbox for a confirmation email, or click below to resend it.'))
          return
        }
        throw authError
      }
      
      if (data?.user) {
        // Check if user is confirmed
        if (!data.user.email_confirmed_at) {
          setShowResendConfirmation(true)
          setError(t('login.emailNotConfirmed', 'Your email address has not been confirmed. Please check your inbox for a confirmation email, or click below to resend it.'))
          return
        }
        
        setUser(data.user)
        navigate('/dashboard')
      } else {
        throw new Error(t('login.genericError', 'Login failed. Please check your credentials and try again.'))
      }
    } catch (err) {
      console.error('Error logging in:', err)
      setError(err.message || t('login.genericError', 'Login failed. Please check your credentials and try again.'))
    } finally {
      setLoading(false)
    }
  }
  
  // Alternative login method that bypasses email confirmation (for development)
  const handleDevLogin = async () => {
    setError(null)
    setLoading(true)
    
    try {
      // First try to sign in normally
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })
      
      if (authError && authError.message?.includes('email not confirmed')) {
        // For development: manually confirm the user
        const { data: adminData, error: adminError } = await supabase.auth.admin.updateUserById(
          data?.user?.id || '',
          { email_confirm: true }
        )
        
        if (adminError) {
          console.error('Admin update error:', adminError)
          // Fallback: proceed with unconfirmed user for development
          if (data?.user) {
            setUser(data.user)
            navigate('/dashboard')
            return
          }
        } else {
          // Try login again after confirmation
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
          })
          
          if (retryData?.user) {
            setUser(retryData.user)
            navigate('/dashboard')
            return
          }
        }
      }
      
      if (data?.user) {
        setUser(data.user)
        navigate('/dashboard')
      } else {
        throw new Error('Login failed')
      }
    } catch (err) {
      console.error('Error in dev login:', err)
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <SafeTranslation i18nKey="login.title" fallback="Welcome Back" />
        </h1>
        <p className="text-gray-600">
          <SafeTranslation i18nKey="login.subtitle" fallback="Log in to your KetoLife account" />
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          {showResendConfirmation && (
            <div className="mt-3">
              <button
                onClick={handleResendConfirmation}
                disabled={loading}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:bg-red-300"
              >
                {loading ? 
                  <SafeTranslation i18nKey="login.resending" fallback="Resending..." /> :
                  <SafeTranslation i18nKey="login.resendConfirmation" fallback="Resend Confirmation Email" />
                }
              </button>
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            <SafeTranslation i18nKey="login.emailLabel" fallback="Email Address" />
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder={t('login.emailPlaceholder', 'Enter your email')}
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              <SafeTranslation i18nKey="login.passwordLabel" fallback="Password" />
            </label>
            <Link to="/reset-password" className="text-sm text-primary-600 hover:text-primary-500">
              <SafeTranslation i18nKey="login.forgotPassword" fallback="Forgot Password?" />
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
            placeholder={t('login.passwordPlaceholder', 'Enter your password')}
          />
        </div>
        
        <div className="space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300"
          >
            {loading ? 
              <SafeTranslation i18nKey="login.loggingIn" fallback="Logging in..." /> : 
              <SafeTranslation i18nKey="login.loginButton" fallback="Log In" />
            }
          </button>
          
          {/* Development bypass button */}
          <button
            type="button"
            onClick={handleDevLogin}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-100"
          >
            {loading ? 
              <SafeTranslation i18nKey="login.loggingIn" fallback="Logging in..." /> : 
              <SafeTranslation i18nKey="login.devLogin" fallback="Login (Skip Email Confirmation)" />
            }
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          <SafeTranslation i18nKey="login.noAccount" fallback="Don't have an account?" />{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            <SafeTranslation i18nKey="login.registerLink" fallback="Sign up now" />
          </Link>
        </p>
      </div>
      
      <div className="mt-8 border-t border-gray-200 pt-6">
        <p className="text-xs text-center text-gray-500">
          <SafeTranslation i18nKey="login.termsText" fallback="By logging in, you agree to our" />{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">
            <SafeTranslation i18nKey="login.termsLink" fallback="Terms of Service" />
          </a>{' '}
          <SafeTranslation i18nKey="login.andText" fallback="and" />{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">
            <SafeTranslation i18nKey="login.privacyLink" fallback="Privacy Policy" />
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
