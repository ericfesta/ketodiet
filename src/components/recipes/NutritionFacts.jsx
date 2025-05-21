import { useTranslation } from 'react-i18next'

const NutritionFacts = ({ recipe }) => {
  const { t } = useTranslation()
  
  // Calculate percentages based on keto diet recommendations
  const calculatePercentage = (value, total) => {
    return Math.round((value / total) * 100)
  }
  
  const totalCalories = recipe.calories
  const fatCalories = recipe.fat_grams * 9
  const proteinCalories = recipe.protein_grams * 4
  const carbCalories = recipe.net_carbs * 4
  
  const fatPercentage = calculatePercentage(fatCalories, totalCalories)
  const proteinPercentage = calculatePercentage(proteinCalories, totalCalories)
  const carbPercentage = calculatePercentage(carbCalories, totalCalories)
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold border-b-2 border-gray-800 pb-1 mb-4">
        {t('recipes.nutritionFacts')}
      </h3>
      
      <div className="mb-4">
        <div className="flex justify-between font-bold">
          <span>Calories</span>
          <span>{recipe.calories}</span>
        </div>
      </div>
      
      <div className="border-t border-gray-300 pt-2 mb-4">
        <div className="flex justify-between mb-1">
          <span className="font-bold">Total Fat</span>
          <span>{recipe.fat_grams}g</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full" 
              style={{ width: `${fatPercentage}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm text-gray-600">{fatPercentage}%</span>
        </div>
        
        <div className="pl-4 text-sm text-gray-600 mb-1">
          <div className="flex justify-between">
            <span>Saturated Fat</span>
            <span>{recipe.saturated_fat || 0}g</span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-300 pt-2 mb-4">
        <div className="flex justify-between mb-1">
          <span className="font-bold">Total Carbohydrate</span>
          <span>{recipe.total_carbs || 0}g</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-accent-500 h-2.5 rounded-full" 
              style={{ width: `${carbPercentage}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm text-gray-600">{carbPercentage}%</span>
        </div>
        
        <div className="pl-4 text-sm text-gray-600 mb-1">
          <div className="flex justify-between">
            <span>Dietary Fiber</span>
            <span>{recipe.fiber || 0}g</span>
          </div>
        </div>
        
        <div className="pl-4 text-sm text-gray-600 mb-1">
          <div className="flex justify-between font-medium">
            <span>Net Carbs</span>
            <span>{recipe.net_carbs}g</span>
          </div>
        </div>
        
        <div className="pl-4 text-sm text-gray-600 mb-1">
          <div className="flex justify-between">
            <span>Sugars</span>
            <span>{recipe.sugars || 0}g</span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-300 pt-2 mb-4">
        <div className="flex justify-between mb-1">
          <span className="font-bold">Protein</span>
          <span>{recipe.protein_grams}g</span>
        </div>
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-secondary-500 h-2.5 rounded-full" 
              style={{ width: `${proteinPercentage}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm text-gray-600">{proteinPercentage}%</span>
        </div>
      </div>
      
      <div className="border-t border-b border-gray-300 py-2">
        <div className="text-xs text-gray-500">
          * Percent Daily Values are based on a ketogenic diet. Your daily values may be higher or lower depending on your calorie needs.
        </div>
      </div>
      
      <div className="mt-4 flex justify-between text-sm">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
            <span className="font-bold">{fatPercentage}%</span>
          </div>
          <span className="mt-1 text-gray-600">Fat</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-secondary-500 flex items-center justify-center text-white">
            <span className="font-bold">{proteinPercentage}%</span>
          </div>
          <span className="mt-1 text-gray-600">Protein</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-white">
            <span className="font-bold">{carbPercentage}%</span>
          </div>
          <span className="mt-1 text-gray-600">Carbs</span>
        </div>
      </div>
    </div>
  )
}

export default NutritionFacts
