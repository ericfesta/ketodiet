import { supabase } from '../lib/supabaseClient'
import { getRandomRecipeImageByType, getRecipeImageById } from '../utils/recipeImages'

/**
 * Fetch all recipes from the database
 * @returns {Promise<Array>} Array of recipe objects
 */
export const fetchAllRecipes = async () => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
    
    if (error) throw error
    
    // Add images to recipes that don't have them
    const recipesWithImages = data.map(recipe => {
      if (!recipe.image_url) {
        return {
          ...recipe,
          image_url: getRandomRecipeImageByType(recipe.meal_type || 'breakfast')
        }
      }
      return recipe
    })
    
    return recipesWithImages
  } catch (error) {
    console.error('Error fetching recipes:', error)
    throw error
  }
}

/**
 * Fetch a single recipe by ID
 * @param {number} id - Recipe ID
 * @returns {Promise<Object>} Recipe object
 */
export const fetchRecipeById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    // Add image if recipe doesn't have one
    if (!data.image_url) {
      data.image_url = getRecipeImageById(id) || getRandomRecipeImageByType(data.meal_type || 'breakfast')
    }
    
    return data
  } catch (error) {
    console.error(`Error fetching recipe with ID ${id}:`, error)
    throw error
  }
}

/**
 * Fetch recipes by meal type
 * @param {string} mealType - Type of meal (breakfast, lunch, dinner, snack, dessert)
 * @returns {Promise<Array>} Array of recipe objects
 */
export const fetchRecipesByMealType = async (mealType) => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('meal_type', mealType)
    
    if (error) throw error
    
    // Add images to recipes that don't have them
    const recipesWithImages = data.map(recipe => {
      if (!recipe.image_url) {
        return {
          ...recipe,
          image_url: getRandomRecipeImageByType(mealType)
        }
      }
      return recipe
    })
    
    return recipesWithImages
  } catch (error) {
    console.error(`Error fetching recipes with meal type ${mealType}:`, error)
    throw error
  }
}

/**
 * Fetch user's favorite recipes
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of recipe objects
 */
export const fetchFavoriteRecipes = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('recipe_id')
      .eq('user_id', userId)
    
    if (error) throw error
    
    if (data.length === 0) return []
    
    const recipeIds = data.map(fav => fav.recipe_id)
    
    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select('*')
      .in('id', recipeIds)
    
    if (recipesError) throw recipesError
    
    // Add images to recipes that don't have them
    const recipesWithImages = recipes.map(recipe => {
      if (!recipe.image_url) {
        return {
          ...recipe,
          image_url: getRecipeImageById(recipe.id) || getRandomRecipeImageByType(recipe.meal_type || 'breakfast')
        }
      }
      return recipe
    })
    
    return recipesWithImages
  } catch (error) {
    console.error(`Error fetching favorite recipes for user ${userId}:`, error)
    throw error
  }
}

export default {
  fetchAllRecipes,
  fetchRecipeById,
  fetchRecipesByMealType,
  fetchFavoriteRecipes
}
