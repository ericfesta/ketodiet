import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/ui/LanguageSwitcher'

const AuthLayout = () => {
  const { user } = useAuthStore()
  const { t } = useTranslation()
  
  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold text-primary-600">
            {t('app.name')}
          </h1>
        </div>
        <h2 className="mt-2 text-center text-xl text-gray-600">
          {t('app.tagline')}
        </h2>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
        
        <div className="mt-6 text-center">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
