import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'
import { useUserStore } from '../stores/userStore'
import { supabase } from '../lib/supabaseClient'
import SafeTranslation from '../components/SafeTranslation'

const Dashboard = () => {
  const { t, i18n } = useTranslation()
  const { user } = useAuthStore()
  const { profile, fetchProfile, isLoading } = useUserStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        
        // Fetch the actual user profile from the database
        const userProfile = await fetchProfile(user.id)
        
        if (userProfile) {
          // Use real profile data combined with mock data for features not yet implemented
          const realUserData = {
            name: userProfile.full_name || user?.user_metadata?.full_name || 'User',
            email: user?.email || 'user@example.com',
            startDate: userProfile.created_at || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            stats: {
              daysOnKeto: Math.floor((new Date() - new Date(userProfile.created_at || Date.now() - 30 * 24 * 60 * 60 * 1000)) / (1000 * 60 * 60 * 24)),
              recipesCooked: 45,
              favoriteMeal: 'Keto Avocado Eggs',
              streakDays: 28
            },
            progress: [
              { date: '2023-05-01', weight: userProfile.weight || 85, ketones: 1.2 },
              { date: '2023-05-08', weight: (userProfile.weight || 85) - 2, ketones: 1.5 },
              { date: '2023-05-15', weight: (userProfile.weight || 85) - 4, ketones: 1.8 },
              { date: '2023-05-22', weight: (userProfile.weight || 85) - 5, ketones: 2.0 },
              { date: '2023-05-29', weight: (userProfile.weight || 85) - 6, ketones: 2.2 }
            ],
            goals: {
              targetWeight: userProfile.target_weight || 75,
              dailyCarbs: 20,
              dailyWater: 2.5,
              weeklyWorkouts: 3
            },
            mealPlan: {
              monday: [
                { meal: 'Keto Avocado Eggs', type: 'breakfast' },
                { meal: 'Keto Cauliflower Soup', type: 'lunch' },
                { meal: 'Keto Steak with Garlic Butter', type: 'dinner' }
              ],
              tuesday: [
                { meal: 'Keto Bacon and Cheese Omelette', type: 'breakfast' },
                { meal: 'Keto Zucchini Noodles with Pesto', type: 'lunch' },
                { meal: 'Keto Salmon with Asparagus', type: 'dinner' }
              ]
            }
          }
          
          setUserData(realUserData)
        } else {
          // If no profile found, create basic user data from auth
          const basicUserData = {
            name: user?.user_metadata?.full_name || 'User',
            email: user?.email || 'user@example.com',
            startDate: new Date().toISOString(),
            stats: {
              daysOnKeto: 0,
              recipesCooked: 0,
              favoriteMeal: 'None yet',
              streakDays: 0
            },
            progress: [],
            goals: {
              targetWeight: 75,
              dailyCarbs: 20,
              dailyWater: 2.5,
              weeklyWorkouts: 3
            },
            mealPlan: {
              monday: [],
              tuesday: []
            }
          }
          
          setUserData(basicUserData)
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError(t('dashboard.errorFetchingData', 'Error fetching your data. Please try again.'))
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [user, fetchProfile, t])
  
  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <SafeTranslation i18nKey="common.loading" fallback="Loading..." />
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          <SafeTranslation i18nKey="common.retry" fallback="Retry" />
        </button>
      </div>
    )
  }
  
  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <SafeTranslation i18nKey="dashboard.noData" fallback="No user data available. Please complete your profile." />
        </div>
        <button 
          onClick={() => navigate('/profile')} 
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          <SafeTranslation i18nKey="dashboard.setupProfile" fallback="Set Up Profile" />
        </button>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        <SafeTranslation i18nKey="dashboard.title" fallback="Dashboard" />
      </h1>
      
      {/* Dashboard Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          {['overview', 'progress', 'mealPlan', 'goals'].map(tab => (
            <li key={tab} className="mr-2">
              <button
                className={`inline-block py-4 px-4 text-sm font-medium ${
                  activeTab === tab
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <SafeTranslation i18nKey={`dashboard.tabs.${tab}`} fallback={tab.charAt(0).toUpperCase() + tab.slice(1)} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-xl p-6 mb-8 text-white shadow-lg">
            <h2 className="text-2xl font-bold mb-2">
              <SafeTranslation 
                i18nKey="dashboard.overview.welcome" 
                fallback={`Welcome back, ${userData.name.split(' ')[0]}`}
                options={{ name: userData.name.split(' ')[0] }}
              />
            </h2>
            <p className="mb-4">
              <SafeTranslation 
                i18nKey="dashboard.overview.welcomeMessage" 
                fallback={`You've been on your keto journey for ${userData.stats.daysOnKeto} days. Keep up the great work!`}
                options={{ days: userData.stats.daysOnKeto }}
              />
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="bg-white/20 rounded-lg p-4 flex-1">
                <div className="text-3xl font-bold">{userData.stats.daysOnKeto}</div>
                <div className="text-sm">
                  <SafeTranslation i18nKey="dashboard.overview.daysOnKeto" fallback="Days on Keto" />
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-4 flex-1">
                <div className="text-3xl font-bold">{userData.stats.recipesCooked}</div>
                <div className="text-sm">
                  <SafeTranslation i18nKey="dashboard.overview.recipesCooked" fallback="Recipes Cooked" />
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-4 flex-1">
                <div className="text-3xl font-bold">{userData.stats.streakDays}</div>
                <div className="text-sm">
                  <SafeTranslation i18nKey="dashboard.overview.currentStreak" fallback="Current Streak" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Today's Meal Plan */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">
                <SafeTranslation i18nKey="dashboard.overview.todaysMeals" fallback="Today's Meals" />
              </h3>
              <div className="space-y-4">
                {userData.mealPlan.monday.map((meal, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                      {meal.type === 'breakfast' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                      {meal.type === 'lunch' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {meal.type === 'dinner' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{meal.meal}</div>
                      <div className="text-sm text-gray-500">
                        <SafeTranslation i18nKey={`recipes.mealTypes.${meal.type}`} fallback={meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Progress Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">
                <SafeTranslation i18nKey="dashboard.overview.progressSummary" fallback="Progress Summary" />
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      <SafeTranslation i18nKey="dashboard.overview.weightProgress" fallback="Weight Progress" />
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {userData.progress.length > 0 ? 
                        `${userData.progress[0].weight - userData.progress[userData.progress.length - 1].weight} kg` : 
                        '0 kg'
                      }
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      <SafeTranslation i18nKey="dashboard.overview.ketoneLevel" fallback="Ketone Level" />
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {userData.progress.length > 0 ? 
                        `${userData.progress[userData.progress.length - 1].ketones} mmol/L` : 
                        '0 mmol/L'
                      }
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      <SafeTranslation i18nKey="dashboard.overview.streakProgress" fallback="Streak Progress" />
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {userData.stats.streakDays} <SafeTranslation i18nKey="dashboard.overview.days" fallback="days" />
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button 
                  onClick={() => setActiveTab('progress')}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                >
                  <SafeTranslation i18nKey="dashboard.overview.viewDetailedProgress" fallback="View Detailed Progress" />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Recommended Recipes */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                <SafeTranslation i18nKey="dashboard.overview.recommendedRecipes" fallback="Recommended Recipes" />
              </h3>
              <button className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                <SafeTranslation i18nKey="dashboard.overview.viewAll" fallback="View All" />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Recipe Cards would go here */}
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-4">
                    <h4 className="font-medium mb-1">Keto Recipe {item}</h4>
                    <p className="text-sm text-gray-500 mb-2">15 min • Easy</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        2g Net Carbs
                      </span>
                      <button className="text-primary-600 hover:text-primary-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            <SafeTranslation i18nKey="dashboard.progress.title" fallback="Your Progress" />
          </h2>
          <p className="text-gray-600 mb-6">
            <SafeTranslation i18nKey="dashboard.progress.description" fallback="Track your weight loss and ketone levels over time." />
          </p>
          
          {/* Progress Chart Placeholder */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 h-64 flex items-center justify-center">
            <p className="text-gray-500">
              <SafeTranslation i18nKey="dashboard.progress.weightChartPlaceholder" fallback="Weight chart will be displayed here" />
            </p>
          </div>
          
          {/* Progress Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SafeTranslation i18nKey="dashboard.progress.date" fallback="Date" />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SafeTranslation i18nKey="dashboard.progress.weight" fallback="Weight" />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SafeTranslation i18nKey="dashboard.progress.ketones" fallback="Ketones" />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SafeTranslation i18nKey="dashboard.progress.change" fallback="Change" />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userData.progress.map((entry, index) => {
                  const prevWeight = index < userData.progress.length - 1 ? userData.progress[index + 1].weight : entry.weight;
                  const weightChange = prevWeight - entry.weight;
                  
                  return (
                    <tr key={entry.date}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.weight} kg
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.ketones} mmol/L
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          weightChange > 0 
                            ? 'bg-green-100 text-green-800' 
                            : weightChange < 0 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {weightChange > 0 ? '+' : ''}{weightChange} kg
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Meal Plan Tab */}
      {activeTab === 'mealPlan' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            <SafeTranslation i18nKey="dashboard.mealPlan.title" fallback="Your Meal Plan" />
          </h2>
          <p className="text-gray-600 mb-6">
            <SafeTranslation i18nKey="dashboard.mealPlan.description" fallback="Plan your meals for the week to stay on track with your keto goals." />
          </p>
          
          {/* Week Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button className="flex items-center text-primary-600 hover:text-primary-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <SafeTranslation i18nKey="dashboard.mealPlan.previousWeek" fallback="Previous Week" />
            </button>
            <div className="font-medium">May 1 - May 7, 2023</div>
            <button className="flex items-center text-primary-600 hover:text-primary-700">
              <SafeTranslation i18nKey="dashboard.mealPlan.nextWeek" fallback="Next Week" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Meal Plan Grid */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
            {Object.entries(userData.mealPlan).map(([day, meals], index) => (
              <div key={day} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-primary-100 px-4 py-2 font-medium text-primary-800">
                  <SafeTranslation i18nKey={`dashboard.mealPlan.days.${day}`} fallback={day.charAt(0).toUpperCase() + day.slice(1)} />
                </div>
                <div className="p-4">
                  {meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="mb-3 last:mb-0">
                      <div className="text-xs text-gray-500 mb-1">
                        <SafeTranslation i18nKey={`recipes.mealTypes.${meal.type}`} fallback={meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} />
                      </div>
                      <div className="text-sm font-medium">{meal.meal}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            <SafeTranslation i18nKey="dashboard.goals.title" fallback="Your Goals" />
          </h2>
          <p className="text-gray-600 mb-6">
            <SafeTranslation i18nKey="dashboard.goals.description" fallback="Set and track your health and fitness goals." />
          </p>
          
          {/* Current Goals */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">
              <SafeTranslation i18nKey="dashboard.goals.currentGoals" fallback="Current Goals" />
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      <SafeTranslation i18nKey="dashboard.goals.targetWeight" fallback="Target Weight" />
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {userData.goals.targetWeight} kg
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, Math.max(0, 100 - ((userData.progress[0]?.weight || 85 - userData.goals.targetWeight) / (userData.progress[0]?.weight || 85 - userData.goals.targetWeight) * 100)))}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      <SafeTranslation i18nKey="dashboard.goals.dailyCarbs" fallback="Daily Carbs" />
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {userData.goals.dailyCarbs}g
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      <SafeTranslation i18nKey="dashboard.goals.dailyWater" fallback="Daily Water" />
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {userData.goals.dailyWater}L
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      <SafeTranslation i18nKey="dashboard.goals.weeklyWorkouts" fallback="Weekly Workouts" />
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      2/{userData.goals.weeklyWorkouts} <SafeTranslation i18nKey="dashboard.goals.workouts" fallback="workouts" />
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(2 / userData.goals.weeklyWorkouts) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
                <SafeTranslation i18nKey="dashboard.goals.setNewGoals" fallback="Set New Goals" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
