import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'

const Dashboard = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')
  
  // Mock user data (will be replaced with actual data from Supabase)
  const mockUserData = {
    name: 'John Doe',
    email: user?.email || 'user@example.com',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    stats: {
      daysOnKeto: 30,
      recipesCooked: 45,
      favoriteMeal: 'Keto Avocado Eggs',
      streakDays: 28
    },
    progress: [
      { date: '2023-05-01', weight: 85, ketones: 1.2 },
      { date: '2023-05-08', weight: 83, ketones: 1.5 },
      { date: '2023-05-15', weight: 81, ketones: 1.8 },
      { date: '2023-05-22', weight: 80, ketones: 2.0 },
      { date: '2023-05-29', weight: 79, ketones: 2.2 }
    ],
    goals: {
      targetWeight: 75,
      dailyCarbs: 20,
      dailyWater: 2.5, // liters
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
      ],
      // Other days would be included here
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('dashboard.title')}</h1>
      
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
                {t(`dashboard.tabs.${tab}`)}
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
              {t('dashboard.overview.welcome', { name: mockUserData.name.split(' ')[0] })}
            </h2>
            <p className="mb-4">
              {t('dashboard.overview.welcomeMessage', { days: mockUserData.stats.daysOnKeto })}
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="bg-white/20 rounded-lg p-4 flex-1">
                <div className="text-3xl font-bold">{mockUserData.stats.daysOnKeto}</div>
                <div className="text-sm">{t('dashboard.overview.daysOnKeto')}</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4 flex-1">
                <div className="text-3xl font-bold">{mockUserData.stats.recipesCooked}</div>
                <div className="text-sm">{t('dashboard.overview.recipesCooked')}</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4 flex-1">
                <div className="text-3xl font-bold">{mockUserData.stats.streakDays}</div>
                <div className="text-sm">{t('dashboard.overview.currentStreak')}</div>
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Today's Meal Plan */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">{t('dashboard.overview.todaysMeals')}</h3>
              <div className="space-y-4">
                {mockUserData.mealPlan.monday.map((meal, index) => (
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
                      <div className="text-sm text-gray-500">{t(`recipes.mealTypes.${meal.type}`)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Progress Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">{t('dashboard.overview.progressSummary')}</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{t('dashboard.overview.weightProgress')}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {mockUserData.progress[0].weight - mockUserData.progress[mockUserData.progress.length - 1].weight} kg
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{t('dashboard.overview.ketoneLevel')}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {mockUserData.progress[mockUserData.progress.length - 1].ketones} mmol/L
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{t('dashboard.overview.streakProgress')}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {mockUserData.stats.streakDays} {t('dashboard.overview.days')}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                  {t('dashboard.overview.viewDetailedProgress')}
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
              <h3 className="text-xl font-semibold">{t('dashboard.overview.recommendedRecipes')}</h3>
              <button className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                {t('dashboard.overview.viewAll')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(id => (
                <div key={id} className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1">Keto Recipe {id}</h4>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>20 min</span>
                      <span>3g net carbs</span>
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
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6">{t('dashboard.progress.title')}</h3>
            <p className="text-gray-600 mb-4">{t('dashboard.progress.description')}</p>
            
            {/* Weight Chart Placeholder */}
            <div className="h-64 bg-gray-100 rounded-lg mb-8 flex items-center justify-center">
              <p className="text-gray-500">{t('dashboard.progress.weightChartPlaceholder')}</p>
            </div>
            
            {/* Progress Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('dashboard.progress.date')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('dashboard.progress.weight')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('dashboard.progress.ketones')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('dashboard.progress.change')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockUserData.progress.map((entry, index) => {
                    const prevEntry = index > 0 ? mockUserData.progress[index - 1] : null
                    const weightChange = prevEntry ? entry.weight - prevEntry.weight : 0
                    
                    return (
                      <tr key={entry.date}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.weight} kg
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.ketones} mmol/L
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {index > 0 && (
                            <span className={`${weightChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {weightChange < 0 ? '↓' : '↑'} {Math.abs(weightChange)} kg
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Meal Plan Tab */}
      {activeTab === 'mealPlan' && (
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6">{t('dashboard.mealPlan.title')}</h3>
            <p className="text-gray-600 mb-6">{t('dashboard.mealPlan.description')}</p>
            
            {/* Week Navigation */}
            <div className="flex justify-between items-center mb-6">
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('dashboard.mealPlan.previousWeek')}
              </button>
              
              <h4 className="font-medium">May 29 - June 4, 2023</h4>
              
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                {t('dashboard.mealPlan.nextWeek')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Meal Plan Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <div key={day} className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium mb-3">{t(`dashboard.mealPlan.days.${day}`)}</h5>
                  
                  <div className="space-y-3">
                    {mockUserData.mealPlan[day] ? (
                      mockUserData.mealPlan[day].map((meal, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">{t(`recipes.mealTypes.${meal.type}`)}</div>
                          <div className="font-medium text-sm">{meal.meal}</div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white p-3 rounded border border-gray-200 text-center">
                        <div className="text-sm text-gray-500">{t('dashboard.mealPlan.noMealsPlanned')}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6">{t('dashboard.goals.title')}</h3>
            <p className="text-gray-600 mb-6">{t('dashboard.goals.description')}</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Current Goals */}
              <div>
                <h4 className="font-medium mb-4">{t('dashboard.goals.currentGoals')}</h4>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{t('dashboard.goals.targetWeight')}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {mockUserData.goals.targetWeight} kg
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full" 
                        style={{ 
                          width: `${Math.round(
                            ((mockUserData.progress[0].weight - mockUserData.progress[mockUserData.progress.length - 1].weight) / 
                            (mockUserData.progress[0].weight - mockUserData.goals.targetWeight)) * 100
                          )}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{t('dashboard.goals.dailyCarbs')}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {mockUserData.goals.dailyCarbs}g
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{t('dashboard.goals.dailyWater')}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {mockUserData.goals.dailyWater}L
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{t('dashboard.goals.weeklyWorkouts')}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {mockUserData.goals.weeklyWorkouts} {t('dashboard.goals.workouts')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Set New Goals */}
              <div>
                <h4 className="font-medium mb-4">{t('dashboard.goals.setNewGoals')}</h4>
                
                <form className="space-y-4">
                  <div>
                    <label htmlFor="targetWeight" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('dashboard.goals.targetWeight')}
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        id="targetWeight"
                        className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        defaultValue={mockUserData.goals.targetWeight}
                      />
                      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                        kg
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="dailyCarbs" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('dashboard.goals.dailyCarbs')}
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        id="dailyCarbs"
                        className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        defaultValue={mockUserData.goals.dailyCarbs}
                      />
                      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                        g
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="dailyWater" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('dashboard.goals.dailyWater')}
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        id="dailyWater"
                        className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        defaultValue={mockUserData.goals.dailyWater}
                        step="0.1"
                      />
                      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                        L
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="weeklyWorkouts" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('dashboard.goals.weeklyWorkouts')}
                    </label>
                    <input
                      type="number"
                      id="weeklyWorkouts"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      defaultValue={mockUserData.goals.weeklyWorkouts}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                  >
                    {t('dashboard.goals.saveGoals')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
