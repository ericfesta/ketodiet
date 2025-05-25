import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-primary-400 mb-4">
              {t('app.name')}
            </h3>
            <p className="text-gray-300 mb-4">
              {t('app.tagline')}
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/recipes" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.recipes')}
                </Link>
              </li>
              <li>
                <Link to="/education" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.education')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Education */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t('footer.educationLinks')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/education#basics" className="text-gray-300 hover:text-white transition-colors">
                  {t('education.categories.basics')}
                </Link>
              </li>
              <li>
                <Link to="/education#science" className="text-gray-300 hover:text-white transition-colors">
                  {t('education.categories.science')}
                </Link>
              </li>
              <li>
                <Link to="/education#benefits" className="text-gray-300 hover:text-white transition-colors">
                  {t('education.categories.tips')}
                </Link>
              </li>
              <li>
                <Link to="/education#faq" className="text-gray-300 hover:text-white transition-colors">
                  {t('education.categories.myths')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t('footer.legalLinks')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.termsOfService')}
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.cookiePolicy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>
            Made with <span className="text-red-500">❤️</span> and{' '}
            <a 
              href="https://chatandbuild.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
            >
              ChatAndBuild
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
