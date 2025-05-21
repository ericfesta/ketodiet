import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NutritionFacts from '../components/recipes/NutritionFacts'
import { getRecipeImageById } from '../utils/recipeImages'

const RecipeDetail = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [servings, setServings] = useState(4)
  
  useEffect(() => {
    // Mock API call - will be replaced with Supabase query
    const fetchRecipe = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock recipe data
        const mockRecipe = {
          id: parseInt(id),
          title: 'Keto Avocado Eggs',
          description: 'A delicious breakfast option with creamy avocados and perfectly cooked eggs.',
          image_url: getRecipeImageById(parseInt(id)),
          prepTime: 15,
          cookTime: 10,
          servings: 2,
          difficulty: 'easy',
          mealType: 'breakfast',
          rating: 4.8,
          net_carbs: 2,
          total_carbs: 6,
          fiber: 4,
          sugars: 1,
          calories: 350,
          fat_grams: 30,
          saturated_fat: 8,
          protein_grams: 15,
          ingredients: [
            { id: 1, name: 'Avocado', amount: 1, unit: 'whole' },
            { id: 2, name: 'Eggs', amount: 2, unit: 'large' },
            { id: 3, name: 'Salt', amount: 0.25, unit: 'tsp' },
            { id: 4, name: 'Black pepper', amount: 0.25, unit: 'tsp' },
            { id: 5, name: 'Red pepper flakes', amount: 0.125, unit: 'tsp' },
            { id: 6, name: 'Olive oil', amount: 1, unit: 'tsp' }
          ],
          instructions: [
            { id: 1, step: 'Preheat oven to 425°F (220°C).' },
            { id: 2, step: 'Cut the avocado in half and remove the pit.' },
            { id: 3, step: 'Scoop out some of the avocado flesh to make room for the eggs.' },
            { id: 4, step: 'Place the avocado halves in a baking dish to keep them stable.' },
            { id: 5, step: 'Crack an egg into each avocado half.' },
            { id: 6, step: 'Season with salt, pepper, and red pepper flakes.' },
            { id: 7, step: 'Drizzle with olive oil.' },
            { id: 8, step: 'Bake for 15-20 minutes, until the eggs are cooked to your liking.' },
            { id: 9, step: 'Serve immediately while warm.' }
          ],
          tips: [
            'For a firmer yolk, bake for a few minutes longer.',
            'Add crumbled bacon or cheese on top for extra flavor.',
            'Garnish with fresh herbs like chives or cilantro.'
          ],
          author: 'Chef Maria',
          created_at: '2023-05-15T10:30:00Z'
        }
        
        setRecipe(mockRecipe)
        setServings(mockRecipe.servings)
      } catch (error) {
        console.error('Error fetching recipe:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRecipe()
  }, [id])
  
  const adjustIngredientAmount = (amount) => {
    if (!recipe) return 0
    const factor = servings / recipe.servings
    return (amount * factor).toFixed(amount >= 1 ? 1 : 2)
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="md:col-span-2 h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }
  
  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('recipeDetail.notFound.title')}</h2>
        <p className="text-gray-600 mb-6">{t('recipeDetail.notFound.message')}</p>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Recipe Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{recipe.title}</h1>
        <p className="text-xl text-gray-600 mb-6">{recipe.description}</p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{recipe.prepTime + recipe.cookTime} min</span>
          </div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{servings} {t('recipeDetail.servings')}</span>
          </div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>{t(`recipes.difficultyLevels.${recipe.difficulty}`)}</span>
          </div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{recipe.rating}</span>
          </div>
        </div>
      </div>
      
      {/* Recipe Image and Nutrition Facts */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <img 
            src={recipe.image_url} 
            alt={recipe.title}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
        </div>
        <div>
          <NutritionFacts recipe={recipe} />
        </div>
      </div>
      
      {/* Ingredients and Instructions */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Ingredients */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t('recipeDetail.ingredients')}</h2>
              <div className="flex items-center">
                <button 
                  className="p-1 rounded-full hover:bg-gray-100"
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  disabled={servings <= 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="mx-2">{servings}</span>
                <button 
                  className="p-1 rounded-full hover:bg-gray-100"
                  onClick={() => setServings(servings + 1)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
            
            <ul className="space-y-3">
              {recipe.ingredients.map(ingredient => (
                <li key={ingredient.id} className="flex justify-between">
                  <span>{ingredient.name}</span>
                  <span className="text-gray-600">
                    {adjustIngredientAmount(ingredient.amount)} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">{t('recipeDetail.instructions')}</h2>
            <ol className="space-y-6">
              {recipe.instructions.map(instruction => (
                <li key={instruction.id} className="flex">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-800 rounded-full flex items-center justify-center mr-4 font-bold">
                    {instruction.id}
                  </div>
                  <div>
                    <p>{instruction.step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      
      {/* Tips Section */}
      {recipe.tips && recipe.tips.length > 0 && (
        <div className="mb-12">
          <div className="bg-secondary-50 p-6 rounded-lg border border-secondary-200">
            <h2 className="text-2xl font-bold mb-4">{t('recipeDetail.tips')}</h2>
            <ul className="space-y-2 list-disc list-inside text-gray-700">
              {recipe.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Author and Date */}
      <div className="text-sm text-gray-500 flex justify-between items-center">
        <div>
          {t('recipeDetail.by')} {recipe.author}
        </div>
        <div>
          {new Date(recipe.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}

export default RecipeDetail
