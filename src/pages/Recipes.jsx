import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const Recipes = () => {
  const { t } = useTranslation()
  const [activeFilters, setActiveFilters] = useState({
    mealType: [],
    prepTime: [],
    difficulty: [],
    netCarbs: null
  })
  
  // Mock recipes data (will be replaced with actual data from Supabase)
  const mockRecipes = [
    {
      id: 1,
      title: 'Keto Avocado Eggs',
      description: 'A delicious breakfast option with creamy avocados and perfectly cooked eggs.',
      image: null,
      prepTime: 15,
      cookTime: 10,
      difficulty: 'easy',
      mealType: 'breakfast',
      rating: 4.8,
      net_carbs: 2,
      calories: 350,
      fat_grams: 30,
      protein_grams: 15
    },
    {
      id: 2,
      title: 'Keto Cauliflower Soup',
      description: 'Creamy and satisfying soup that\'s perfect for a light lunch or starter.',
      image: null,
      prepTime: 15,
      cookTime: 25,
      difficulty: 'medium',
      mealType: 'lunch',
      rating: 4.6,
      net_carbs: 5,
      calories: 280,
      fat_grams: 22,
      protein_grams: 10
    },
    {
      id: 3,
      title: 'Keto Steak with Garlic Butter',
      description: 'Juicy steak topped with herb-infused garlic butter for a perfect keto dinner.',
      image: null,
      prepTime: 10,
      cookTime: 15,
      difficulty: 'medium',
      mealType: 'dinner',
      rating: 4.9,
      net_carbs: 1,
      calories: 450,
      fat_grams: 35,
      protein_grams: 30
    },
    {
      id: 4,
      title: 'Keto Chocolate Fat Bombs',
      description: 'Sweet treats that are perfect for satisfying cravings while staying in ketosis.',
      image: null,
      prepTime: 15,
      cookTime: 0,
      difficulty: 'easy',
      mealType: 'snack',
      rating: 4.7,
      net_carbs: 2,
      calories: 180,
      fat_grams: 18,
      protein_grams: 2
    },
    {
      id: 5,
      title: 'Keto Zucchini Noodles with Pesto',
      description: 'A light and refreshing alternative to pasta that\'s packed with flavor.',
      image: null,
      prepTime: 20,
      cookTime: 10,
      difficulty: 'easy',
      mealType: 'lunch',
      rating: 4.5,
      net_carbs: 4,
      calories: 320,
      fat_grams: 28,
      protein_grams: 8
    },
    {
      id: 6,
      title: 'Keto Bacon and Cheese Omelette',
      description: 'A protein-packed breakfast that will keep you full until lunch.',
      image: null,
      prepTime: 5,
      cookTime: 10,
      difficulty: 'easy',
      mealType: 'breakfast',
      rating: 4.6,
      net_carbs: 1,
      calories: 400,
      fat_grams: 32,
      protein_grams: 25
    }
  ]
  
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
                          activeFilters.mealType.includes(recipe.mealType)
    
    const prepTimeMatch = activeFilters.prepTime.length === 0 || 
                          (activeFilters.prepTime.includes('under15') && recipe.prepTime < 15) ||
                          (activeFilters.prepTime.includes('15to30') && recipe.prepTime >= 15 && recipe.prepTime <= 30) ||
                          (activeFilters.prepTime.includes('over30') && recipe.prepTime > 30)
    
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
                <Link 
                  key={recipe.id} 
                  to={`/recipes/${recipe.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {t(`recipes.mealTypes.${recipe.mealType}`)}
                      </span>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-sm text-gray-600">{recipe.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{recipe.prepTime + recipe.cookTime} min</span>
                      <span>{recipe.net_carbs}g {t('recipes.netCarbs')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Recipes
