import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useEffect, useState } from 'react'
import { mockRecipes } from '../mocks/recipeData'
import { getRandomRecipeImageByType } from '../utils/recipeImages'

const Home = () => {
  const { t, i18n } = useTranslation()
  const { user } = useAuthStore()
  const [popularRecipes, setPopularRecipes] = useState([])

  useEffect(() => {
    // In a real app, we would fetch from API/Supabase
    // For now, use mock data and select 3 random recipes
    const randomRecipes = [...mockRecipes]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    
    setPopularRecipes(randomRecipes)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 min-h-screen flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-accent-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-secondary-300 rounded-full opacity-30 animate-bounce delay-500"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-accent-300 rounded-full opacity-25 animate-bounce delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-5 h-5 bg-white rounded-full opacity-15 animate-bounce delay-1500"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-white space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-sm font-medium">{t('home.hero.badge')}</span>
                </div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                    <span className="block bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                      {t('home.hero.titleLine1')}
                    </span>
                    <span className="block text-white">
                      {t('home.hero.titleLine2')}
                    </span>
                    <span className="block bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
                      {t('home.hero.titleLine3')}
                    </span>
                  </h1>
                </div>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-green-100 leading-relaxed max-w-lg">
                  {t('home.hero.subtitle')}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 py-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{t('home.hero.stats.recipes.number')}</div>
                    <div className="text-green-200 text-sm">{t('home.hero.stats.recipes.label')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{t('home.hero.stats.users.number')}</div>
                    <div className="text-green-200 text-sm">{t('home.hero.stats.users.label')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{t('home.hero.stats.success.number')}</div>
                    <div className="text-green-200 text-sm">{t('home.hero.stats.success.label')}</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link 
                    to="/recipes" 
                    className="group relative px-8 py-4 bg-white text-primary-700 hover:bg-green-50 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  >
                    <span className="relative z-10">{t('home.hero.buttons.exploreRecipes')}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </Link>
                  {!user && (
                    <Link 
                      to="/register" 
                      className="group px-8 py-4 bg-transparent hover:bg-white/10 border-2 border-white/30 hover:border-white font-bold rounded-xl transition-all duration-300 backdrop-blur-sm"
                    >
                      <span className="bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                        {t('home.hero.buttons.startFree')}
                      </span>
                    </Link>
                  )}
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-4 pt-6">
                  <div className="flex -space-x-2">
                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" alt="User" />
                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" alt="User" />
                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" alt="User" />
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-white">+</div>
                  </div>
                  <div className="text-green-200 text-sm">
                    <span className="font-semibold">{t('home.hero.trustIndicator.join')}</span> {t('home.hero.trustIndicator.message')}
                  </div>
                </div>
              </div>

              {/* Right Content - Visual Elements */}
              <div className="relative lg:block hidden">
                {/* Main Image Container */}
                <div className="relative">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-3xl blur-3xl opacity-20 scale-110"></div>
                  
                  {/* Main Card */}
                  <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                    <div className="space-y-6">
                      {/* Recipe Preview */}
                      <div className="bg-white rounded-2xl p-6 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            🥑
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">{t('home.hero.recipeCard.title')}</h3>
                            <p className="text-gray-600 text-sm">{t('home.hero.recipeCard.carbs')}</p>
                          </div>
                        </div>
                        <div className="h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mb-4 flex items-center justify-center">
                          <span className="text-4xl">🥗</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{t('home.hero.recipeCard.time')}</span>
                          <span>{t('home.hero.recipeCard.rating')}</span>
                          <span>{t('home.hero.recipeCard.servings')}</span>
                        </div>
                      </div>

                      {/* Progress Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-gray-800">{t('home.hero.progressCard.title')}</h3>
                          <span className="text-2xl">📈</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('home.hero.progressCard.weightLost')}</span>
                            <span className="font-bold text-green-600">{t('home.hero.progressCard.weightValue')}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full w-3/4"></div>
                          </div>
                          <div className="text-sm text-gray-500">{t('home.hero.progressCard.goal')}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl animate-bounce">
                    ⚡
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center text-xl animate-pulse">
                    💪
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-20">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
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
            {popularRecipes.map(recipe => (
              <div key={recipe.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={recipe.image_url || getRandomRecipeImageByType(recipe.meal_type)} 
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {recipe.meal_type}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm text-gray-600">{recipe.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {recipe.description.length > 100 
                      ? `${recipe.description.substring(0, 100)}...` 
                      : recipe.description}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{recipe.prep_time} min</span>
                    <span>{recipe.net_carbs}g net carbs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">{t('home.testimonials.title')}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
                    alt="Maria Rossi"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Maria Rossi</h4>
                  <p className="text-gray-500 text-sm">Lost 15kg in 6 months</p>
                </div>
              </div>
              <p className="text-gray-600 italic">{t('home.testimonials.quote1')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
                    alt="Marco Bianchi"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
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
    </div>
  )
}

export default Home
