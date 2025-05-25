import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import RecipeCard from '../components/recipes/RecipeCard'
import mockRecipes from '../mocks/recipeData'

const Recipes = () => {
  const { t } = useTranslation()
  const [activeFilters, setActiveFilters] = useState({
    mealType: [],
    prepTime: [],
    difficulty: [],
    netCarbs: null
  })
  
  const toggleFilter = (category, value) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev }
      
      if (category === 'netCarbs') {
        // For net carbs, we just set the value directly
        newFilters.netCarbs = value === newFilters.netCarbs ? null : value
      } else {
        // For arrays, we toggle the presence of the value
        if (newFilters[category].includes(value)) {
          newFilters[category] = newFilters[category].filter(item => item !== value)
        } else {
          newFilters[category] = [...newFilters[category], value]
        }
      }
      
      return newFilters
    })
  }
  
  // Filter recipes based on active filters
  const filteredRecipes = mockRecipes.filter(recipe => {
    // If no filters are active in a category, don't filter by that category
    const mealTypeMatch = activeFilters.mealType.length === 0 || 
                          activeFilters.mealType.includes(recipe.meal_type)
    
    const prepTimeMatch = activeFilters.prepTime.length === 0 || 
                          (activeFilters.prepTime.includes('under15') && recipe.prep_time < 15) ||
                          (activeFilters.prepTime.includes('15to30') && recipe.prep_time >= 15 && recipe.prep_time <= 30) ||
                          (activeFilters.prepTime.includes('over30') && recipe.prep_time > 30)
    
    const difficultyMatch = activeFilters.difficulty.length === 0 || 
                            activeFilters.difficulty.includes(recipe.difficulty)
    
    const netCarbsMatch = activeFilters.netCarbs === null || 
                          (activeFilters.netCarbs === 'under3' && recipe.net_carbs < 3) ||
                          (activeFilters.netCarbs === '3to5' && recipe.net_carbs >= 3 && recipe.net_carbs <= 5) ||
                          (activeFilters.netCarbs === 'over5' && recipe.net_carbs > 5)
    
    return mealTypeMatch && prepTimeMatch && difficultyMatch && netCarbsMatch
  })
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('recipes.title')}</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{t('recipes.filters.title')}</h2>
            
            {/* Meal Type Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">{t('recipes.filters.mealType')}</h3>
              <div className="space-y-2">
                {['breakfast', 'lunch', 'dinner', 'snack', 'dessert'].map(type => (
                  <div key={type} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={`meal-${type}`} 
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      checked={activeFilters.mealType.includes(type)}
                      onChange={() => toggleFilter('mealType', type)}
                    />
                    <label htmlFor={`meal-${type}`} className="ml-2 text-sm text-gray-700">
                      {t(`recipes.mealTypes.${type}`)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Prep Time Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">{t('recipes.filters.prepTime')}</h3>
              <div className="space-y-2">
                {[
                  { id: 'under15', label: 'recipes.prepTimes.under15' },
                  { id: '15to30', label: 'recipes.prepTimes.15to30' },
                  { id: 'over30', label: 'recipes.prepTimes.over30' }
                ].map(time => (
                  <div key={time.id} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={`time-${time.id}`} 
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      checked={activeFilters.prepTime.includes(time.id)}
                      onChange={() => toggleFilter('prepTime', time.id)}
                    />
                    <label htmlFor={`time-${time.id}`} className="ml-2 text-sm text-gray-700">
                      {t(time.label)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Difficulty Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">{t('recipes.filters.difficulty')}</h3>
              <div className="space-y-2">
                {['easy', 'medium', 'hard'].map(level => (
                  <div key={level} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={`difficulty-${level}`} 
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      checked={activeFilters.difficulty.includes(level)}
                      onChange={() => toggleFilter('difficulty', level)}
                    />
                    <label htmlFor={`difficulty-${level}`} className="ml-2 text-sm text-gray-700">
                      {t(`recipes.difficultyLevels.${level}`)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Net Carbs Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">{t('recipes.filters.netCarbs')}</h3>
              <div className="space-y-2">
                {[
                  { id: 'under3', label: 'recipes.carbLevels.under3' },
                  { id: '3to5', label: 'recipes.carbLevels.3to5' },
                  { id: 'over5', label: 'recipes.carbLevels.over5' }
                ].map(carb => (
                  <div key={carb.id} className="flex items-center">
                    <input 
                      type="radio" 
                      id={`carb-${carb.id}`} 
                      name="netCarbs"
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      checked={activeFilters.netCarbs === carb.id}
                      onChange={() => toggleFilter('netCarbs', carb.id)}
                    />
                    <label htmlFor={`carb-${carb.id}`} className="ml-2 text-sm text-gray-700">
                      {t(carb.label)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Clear Filters Button */}
            <button 
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition duration-300"
              onClick={() => setActiveFilters({
                mealType: [],
                prepTime: [],
                difficulty: [],
                netCarbs: null
              })}
            >
              {t('recipes.filters.clearAll')}
            </button>
          </div>
        </div>
        
        {/* Recipe Grid */}
        <div className="lg:w-3/4">
          {filteredRecipes.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold mb-2">{t('recipes.noResults.title')}</h3>
              <p className="text-gray-600 mb-4">{t('recipes.noResults.message')}</p>
              <button 
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                onClick={() => setActiveFilters({
                  mealType: [],
                  prepTime: [],
                  difficulty: [],
                  netCarbs: null
                })}
              >
                {t('recipes.noResults.clearFilters')}
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map(recipe => (
                <div key={recipe.id} className="h-full">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Recipes
