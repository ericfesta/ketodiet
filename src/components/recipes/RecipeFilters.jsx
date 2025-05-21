import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecipeStore } from '../../stores/recipeStore'

const RecipeFilters = () => {
  const { t } = useTranslation()
  const { filters, setFilters, resetFilters } = useRecipeStore()
  
  const [localFilters, setLocalFilters] = useState({
    prepTime: filters.prepTime,
    macros: { ...filters.macros },
    ingredients: [...filters.ingredients],
    skillLevel: filters.skillLevel,
    mealType: filters.mealType,
  })
  
  const [ingredientInput, setIngredientInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Update local filters when store filters change
  useEffect(() => {
    setLocalFilters({
      prepTime: filters.prepTime,
      macros: { ...filters.macros },
      ingredients: [...filters.ingredients],
      skillLevel: filters.skillLevel,
      mealType: filters.mealType,
    })
  }, [filters])
  
  const handlePrepTimeChange = (value) => {
    setLocalFilters({ ...localFilters, prepTime: value })
  }
  
  const handleSkillLevelChange = (value) => {
    setLocalFilters({ ...localFilters, skillLevel: value })
  }
  
  const handleMealTypeChange = (value) => {
    setLocalFilters({ ...localFilters, mealType: value })
  }
  
  const handleMacroChange = (macro, value) => {
    setLocalFilters({
      ...localFilters,
      macros: {
        ...localFilters.macros,
        [macro]: value === '' ? null : Number(value)
      }
    })
  }
  
  const addIngredient = () => {
    if (ingredientInput.trim() && !localFilters.ingredients.includes(ingredientInput.trim())) {
      setLocalFilters({
        ...localFilters,
        ingredients: [...localFilters.ingredients, ingredientInput.trim()]
      })
      setIngredientInput('')
    }
  }
  
  const removeIngredient = (ingredient) => {
    setLocalFilters({
      ...localFilters,
      ingredients: localFilters.ingredients.filter(ing => ing !== ingredient)
    })
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addIngredient()
    }
  }
  
  const applyFilters = () => {
    setFilters(localFilters)
  }
  
  const handleReset = () => {
    resetFilters()
    setLocalFilters({
      prepTime: null,
      macros: {
        minFat: null,
        maxFat: null,
        minProtein: null,
        maxProtein: null,
        minCarbs: null,
        maxCarbs: null,
      },
      ingredients: [],
      skillLevel: null,
      mealType: null,
    })
    setIngredientInput('')
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {t('recipes.filters.title')}
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-primary-600 hover:text-primary-700 focus:outline-none"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        {/* Preparation Time */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {t('recipes.filters.time')}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePrepTimeChange('quick')}
              className={`px-3 py-1 text-sm rounded-full ${
                localFilters.prepTime === 'quick'
                  ? 'bg-primary-100 text-primary-800 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {t('recipes.time.quick')}
            </button>
            <button
              onClick={() => handlePrepTimeChange('medium')}
              className={`px-3 py-1 text-sm rounded-full ${
                localFilters.prepTime === 'medium'
                  ? 'bg-primary-100 text-primary-800 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {t('recipes.time.medium')}
            </button>
            <button
              onClick={() => handlePrepTimeChange('long')}
              className={`px-3 py-1 text-sm rounded-full ${
                localFilters.prepTime === 'long'
                  ? 'bg-primary-100 text-primary-800 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {t('recipes.time.long')}
            </button>
          </div>
        </div>
        
        {/* Skill Level */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {t('recipes.filters.skill')}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSkillLevelChange('beginner')}
              className={`px-3 py-1 text-sm rounded-full ${
                localFilters.skillLevel === 'beginner'
                  ? 'bg-primary-100 text-primary-800 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {t('recipes.skill.beginner')}
            </button>
            <button
              onClick={() => handleSkillLevelChange('intermediate')}
              className={`px-3 py-1 text-sm rounded-full ${
                localFilters.skillLevel === 'intermediate'
                  ? 'bg-primary-100 text-primary-800 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {t('recipes.skill.intermediate')}
            </button>
            <button
              onClick={() => handleSkillLevelChange('advanced')}
              className={`px-3 py-1 text-sm rounded-full ${
                localFilters.skillLevel === 'advanced'
                  ? 'bg-primary-100 text-primary-800 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {t('recipes.skill.advanced')}
            </button>
          </div>
        </div>
        
        {/* Meal Type */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {t('recipes.filters.mealType')}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleMealTypeChange('breakfast')}
              className={`px-3 py-1 text-sm rounded-full ${
                localFilters.mealType === 'breakfast'
                  ? 'bg-primary-100 text-primary-800 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {t('recipes.mealType.breakfast')}
            </button>
            <button
              onClick={() => handleMealTypeChange('lunch')}
              className={`px-3 py-1 text-sm rounded-full ${
                localFilters.mealType === 'lunch'
                  ? 'bg-primary-100 text-primary-800 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {t('recipes.mealType.lunch')}
            </button>
            <button
              onClick={() => handleMealTypeChange('dinner')}
              className={`px-3 py-1 text-sm rounded-full ${
                localFilters.mealType === 'dinner'
                  ? 'bg-primary-100 text-primary-800 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {t('recipes.mealType.dinner')}
            </button>
            <button
              onClick={() => handleMealTypeChange('snack')}
              className={`px-3 py-1 text-sm rounded-full ${
                localFilters.mealType === 'snack'
                  ? 'bg-primary-100 text-primary-800 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {t('recipes.mealType.snack')}
            </button>
            <button
              onClick={() => handleMealTypeChange('dessert')}
              className={`px-3 py-1 text-sm rounded-full ${
                localFilters.mealType === 'dessert'
                  ? 'bg-primary-100 text-primary-800 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {t('recipes.mealType.dessert')}
            </button>
          </div>
        </div>
        
        {/* Macronutrients */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {t('recipes.filters.macros')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Fat */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {t('recipes.macros.fat')} (g)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={localFilters.macros.minFat === null ? '' : localFilters.macros.minFat}
                  onChange={(e) => handleMacroChange('minFat', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <span>-</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={localFilters.macros.maxFat === null ? '' : localFilters.macros.maxFat}
                  onChange={(e) => handleMacroChange('maxFat', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
            
            {/* Protein */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {t('recipes.macros.protein')} (g)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={localFilters.macros.minProtein === null ? '' : localFilters.macros.minProtein}
                  onChange={(e) => handleMacroChange('minProtein', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <span>-</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={localFilters.macros.maxProtein === null ? '' : localFilters.macros.maxProtein}
                  onChange={(e) => handleMacroChange('maxProtein', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
            
            {/* Net Carbs */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {t('recipes.macros.netCarbs')} (g)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={localFilters.macros.minCarbs === null ? '' : localFilters.macros.minCarbs}
                  onChange={(e) => handleMacroChange('minCarbs', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <span>-</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={localFilters.macros.maxCarbs === null ? '' : localFilters.macros.maxCarbs}
                  onChange={(e) => handleMacroChange('maxCarbs', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Ingredients */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {t('recipes.filters.ingredients')}
          </h3>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add ingredient..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              onClick={addIngredient}
              className="px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add
            </button>
          </div>
          
          {localFilters.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {localFilters.ingredients.map((ingredient) => (
                <span 
                  key={ingredient}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {ingredient}
                  <button
                    type="button"
                    onClick={() => removeIngredient(ingredient)}
                    className="ml-1 inline-flex text-primary-500 hover:text-primary-700 focus:outline-none"
                  >
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          {t('recipes.filters.clear')}
        </button>
        <button
          onClick={applyFilters}
          className="btn btn-primary"
        >
          {t('recipes.filters.apply')}
        </button>
      </div>
    </div>
  )
}

export default RecipeFilters
