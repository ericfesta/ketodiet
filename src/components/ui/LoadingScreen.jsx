import { useTranslation } from 'react-i18next'

const LoadingScreen = () => {
  const { t } = useTranslation()
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">
          {t('common.loading')}
        </h2>
      </div>
    </div>
  )
}

export default LoadingScreen
