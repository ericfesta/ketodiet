import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase, testSupabaseConnection } from '../lib/supabaseClient'
import { useAuthStore } from '../stores/authStore'
import { useUserStore } from '../stores/userStore'
import SafeTranslation from '../components/SafeTranslation'

const Register = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const { createProfile } = useUserStore()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('checking')
  
  // Test Supabase connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testSupabaseConnection()
        setConnectionStatus(result.success ? 'connected' : 'error')
      } catch (err) {
        console.error('Connection check error:', err)
        setConnectionStatus('error')
      }
    }
    
    checkConnection()
  }, [])
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  
  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError(t('register.passwordMismatch', 'Passwords do not match'))
      return false
    }
    
    if (formData.password.length < 6) {
      setError(t('register.passwordTooShort', 'Password must be at least 6 characters'))
      return false
    }
    
    if (!formData.agreeToTerms) {
      setError(t('register.mustAgreeToTerms', 'You must agree to the Terms of Service and Privacy Policy'))
      return false
    }
    
    return true
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      // Sign up the user with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name
          }
        }
      })
      
      if (signUpError) {
        throw signUpError
      }
      
      if (data?.user) {
        // Set user in auth store
        setUser(data.user)
        
        // Wait a moment for the trigger to potentially create the profile
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Try to create/update user profile using the store function
        try {
          const profileResult = await createProfile(data.user.id, {
            full_name: formData.name,
            username: formData.email.split('@')[0]
          })
          
          if (!profileResult.success) {
            console.warn('Profile creation/update failed:', profileResult.error)
            // Don't throw - user is already created, profile creation is secondary
          }
        } catch (profileError) {
          console.warn('Profile creation/update error:', profileError)
          // Don't throw - user is already created, profile creation is secondary
        }
        
        // Check if email confirmation is required
        if (!data.session) {
          setError(t('register.checkEmail', 'Please check your email to confirm your account before logging in.'))
          // Don't navigate to dashboard yet - user needs to confirm email
        } else {
          // User is immediately logged in (email confirmation disabled)
          navigate('/dashboard')
        }
      } else {
        setError(t('register.unexpectedError', 'Registration completed but something went wrong. Please try logging in.'))
      }
    } catch (error) {
      console.error('Error registering:', error)
      
      // Handle specific Supabase errors
      let errorMessage = t('register.genericError', 'Registration failed. Please try again.')
      
      if (error.message?.includes('User already registered')) {
        errorMessage = t('register.userExists', 'An account with this email already exists. Please try logging in.')
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = t('register.invalidEmail', 'Please enter a valid email address.')
      } else if (error.message?.includes('Password')) {
        errorMessage = t('register.passwordError', 'Password does not meet requirements.')
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  
  // If connection is still being checked, show loading
  if (connectionStatus === 'checking') {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <div className="animate-pulse">
          <SafeTranslation i18nKey="common.loading" fallback="Loading..." />
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <SafeTranslation i18nKey="register.title" fallback="Create Your Account" />
        </h1>
        <p className="text-gray-600">
          <SafeTranslation i18nKey="register.subtitle" fallback="Join KetoLife and start your keto journey" />
        </p>
      </div>
      
      {connectionStatus === 'error' && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <SafeTranslation i18nKey="common.supabaseConnectionError" fallback="Unable to connect to the database. Please try again later." />
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            <SafeTranslation i18nKey="register.nameLabel" fallback="Full Name" />
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder={t('register.namePlaceholder', 'Enter your full name')}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            <SafeTranslation i18nKey="register.emailLabel" fallback="Email Address" />
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder={t('register.emailPlaceholder', 'Enter your email address')}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            <SafeTranslation i18nKey="register.passwordLabel" fallback="Password" />
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder={t('register.passwordPlaceholder', 'Create a password (min. 6 characters)')}
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            <SafeTranslation i18nKey="register.confirmPasswordLabel" fallback="Confirm Password" />
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder={t('register.confirmPasswordPlaceholder', 'Confirm your password')}
          />
        </div>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="agreeToTerms" className="text-gray-600">
              <SafeTranslation i18nKey="register.agreeToTerms" fallback="I agree to the" />{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                <SafeTranslation i18nKey="register.termsLink" fallback="Terms of Service" />
              </a>{' '}
              <SafeTranslation i18nKey="register.andText" fallback="and" />{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                <SafeTranslation i18nKey="register.privacyLink" fallback="Privacy Policy" />
              </a>
            </label>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading || connectionStatus === 'error'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300"
          >
            {loading ? 
              <SafeTranslation i18nKey="register.registering" fallback="Creating account..." /> : 
              <SafeTranslation i18nKey="register.registerButton" fallback="Create Account" />
            }
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          <SafeTranslation i18nKey="register.alreadyHaveAccount" fallback="Already have an account?" />{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            <SafeTranslation i18nKey="register.loginLink" fallback="Log in" />
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
