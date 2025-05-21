import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../stores/authStore'
import { useRecipeStore } from '../../stores/recipeStore'
import { getRandomRecipeImageByType } from '../../utils/recipeImages'

const RecipeCard = ({ recipe }) => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { favorites, toggleFavorite } = useRecipeStore()
  
  const isFavorite = favorites.includes(recipe.id)
  
  // If recipe doesn't have an image_url, generate one based on meal type
  const recipeImage = recipe.image_url || getRandomRecipeImageByType(recipe.meal_type || 'breakfast')
  
  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (user) {
      toggleFavorite(recipe.id, user.id)
    } else {
      // Redirect to login or show login modal
      alert('Please log in to save favorites')
    }
  }
  
  return (
    <div className="card h-full flex flex-col transition-transform hover:scale-[1.02]">
      <Link to={`/recipes/${recipe.id}`} className="flex flex-col h-full">
        <div className="relative">
          <img 
            src={recipeImage} 
            alt={recipe.title} 
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2">
            <button
              onClick={handleFavoriteClick}
              className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill={isFavorite ? "currentColor" : "none"} 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={isFavorite ? "0" : "2"}
                color={isFavorite ? "#f97316" : "#374151"}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
            </button>
          </div>
          
          {/* Recipe badges */}
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
            <span className="px-2 py-1 text-xs font-medium bg-primary-500 text-white rounded">
              {recipe.meal_type}
            </span>
            <span className="px-2 py-1 text-xs font-medium bg-secondary-500 text-white rounded">
              {recipe.prep_time} min
            </span>
          </div>
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            {recipe.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4 flex-grow">
            {recipe.description.length > 100 
              ? `${recipe.description.substring(0, 100)}...` 
              : recipe.description
            }
          </p>
          
          <div className="flex justify-between items-center mt-auto">
            <div className="flex space-x-3 text-xs text-gray-500">
              <div>
                <span className="font-medium text-primary-600">{recipe.fat_grams}g</span> {t('recipes.macros.fat')}
              </div>
              <div>
                <span className="font-medium text-primary-600">{recipe.protein_grams}g</span> {t('recipes.macros.protein')}
              </div>
              <div>
                <span className="font-medium text-primary-600">{recipe.net_carbs}g</span> {t('recipes.macros.netCarbs')}
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              <span className="font-medium">{recipe.calories}</span> kcal
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default RecipeCard
