import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const Home = () => {
  const { t, i18n } = useTranslation()
  const { user } = useAuthStore()

  return (
    <div className="container mx-auto px-4">
      {/* Added pt-20 class to create space for the fixed header */}
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-xl p-8 mb-12 text-white shadow-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl mb-8">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/recipes" 
                className="bg-white text-primary-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                {t('home.hero.exploreButton')}
              </Link>
              {!user && (
                <Link 
                  to="/register" 
                  className="bg-transparent hover:bg-white/10 border-2 border-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  {t('home.hero.joinButton')}
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">{t('home.features.title')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('home.features.recipes.title')}</h3>
            <p className="text-gray-600">{t('home.features.recipes.description')}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('home.features.tracking.title')}</h3>
            <p className="text-gray-600">{t('home.features.tracking.description')}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('home.features.education.title')}</h3>
            <p className="text-gray-600">{t('home.features.education.description')}</p>
          </div>
        </div>
      </section>

      {/* Popular Recipes Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">{t('home.popularRecipes.title')}</h2>
          <Link to="/recipes" className="text-primary-600 hover:text-primary-700 font-medium">
            {t('home.popularRecipes.viewAll')} →
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Recipe cards will be populated dynamically */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">Breakfast</span>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-sm text-gray-600">4.8</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Keto Avocado Eggs</h3>
              <p className="text-gray-600 text-sm mb-4">A delicious breakfast option with creamy avocados and perfectly cooked eggs.</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>15 min</span>
                <span>2g net carbs</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">Lunch</span>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-sm text-gray-600">4.6</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Keto Cauliflower Soup</h3>
              <p className="text-gray-600 text-sm mb-4">Creamy and satisfying soup that's perfect for a light lunch or starter.</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>30 min</span>
                <span>5g net carbs</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">Dinner</span>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-sm text-gray-600">4.9</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Keto Steak with Garlic Butter</h3>
              <p className="text-gray-600 text-sm mb-4">Juicy steak topped with herb-infused garlic butter for a perfect keto dinner.</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>25 min</span>
                <span>1g net carbs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">{t('home.testimonials.title')}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold">Maria Rossi</h4>
                <p className="text-gray-500 text-sm">Lost 15kg in 6 months</p>
              </div>
            </div>
            <p className="text-gray-600 italic">{t('home.testimonials.quote1')}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold">Marco Bianchi</h4>
                <p className="text-gray-500 text-sm">Improved energy levels</p>
              </div>
            </div>
            <p className="text-gray-600 italic">{t('home.testimonials.quote2')}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary-100 rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">{t('home.cta.title')}</h2>
        <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
          {t('home.cta.description')}
        </p>
        <Link 
          to={user ? "/dashboard" : "/register"} 
          className="bg-secondary-600 hover:bg-secondary-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 inline-block"
        >
          {user ? t('home.cta.dashboardButton') : t('home.cta.startButton')}
        </Link>
      </section>
    </div>
  )
}

export default Home
