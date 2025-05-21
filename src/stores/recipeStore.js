import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

export const useRecipeStore = create((set, get) => ({
  recipes: [],
  filteredRecipes: [],
  favorites: [],
  isLoading: false,
  error: null,
  filters: {
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
    searchQuery: '',
  },
  
  // Fetch all recipes
  fetchRecipes: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
      
      if (error) throw error
      
      set({ 
        recipes: data, 
        filteredRecipes: data,
        isLoading: false 
      })
    } catch (error) {
      console.error('Error fetching recipes:', error)
      set({ error: error.message, isLoading: false })
    }
  },
  
  // Fetch user's favorite recipes
  fetchFavorites: async (userId) => {
    if (!userId) return
    
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('recipe_id')
        .eq('user_id', userId)
      
      if (error) throw error
      
      const favoriteIds = data.map(fav => fav.recipe_id)
      set({ favorites: favoriteIds, isLoading: false })
    } catch (error) {
      console.error('Error fetching favorites:', error)
      set({ error: error.message, isLoading: false })
    }
  },
  
  // Toggle favorite status for a recipe
  toggleFavorite: async (recipeId, userId) => {
    if (!userId) return
    
    <pivotalAction type="file" filePath="src/stores/recipeStore.js">
import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

export const useRecipeStore = create((set, get) => ({
  recipes: [],
  filteredRecipes: [],
  favorites: [],
  isLoading: false,
  error: null,
  filters: {
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
    searchQuery: '',
  },
  
  // Fetch all recipes
  fetchRecipes: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
      
      if (error) throw error
      
      set({ 
        recipes: data, 
        filteredRecipes: data,
        isLoading: false 
      })
    } catch (error) {
      console.error('Error fetching recipes:', error)
      set({ error: error.message, isLoading: false })
    }
  },
  
  // Fetch user's favorite recipes
  fetchFavorites: async (userId) => {
    if (!userId) return
    
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('recipe_id')
        .eq('user_id', userId)
      
      if (error) throw error
      
      const favoriteIds = data.map(fav => fav.recipe_id)
      set({ favorites: favoriteIds, isLoading: false })
    } catch (error) {
      console.error('Error fetching favorites:', error)
      set({ error: error.message, isLoading: false })
    }
  },
  
  // Toggle favorite status for a recipe
  toggleFavorite: async (recipeId, userId) => {
    if (!userId) return
    
    const favorites = get().favorites
    const isFavorite = favorites.includes(recipeId)
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('recipe_id', recipeId)
        
        if (error) throw error
        
        set({ favorites: favorites.filter(id => id !== recipeId) })
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, recipe_id: recipeId })
        
        if (error) throw error
        
        set({ favorites: [...favorites, recipeId] })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      set({ error: error.message })
    }
  },
  
  // Update filters
  setFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters } })
    get().applyFilters()
  },
  
  // Reset filters
  resetFilters: () => {
    set({ 
      filters: {
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
        searchQuery: '',
      },
      filteredRecipes: get().recipes
    })
  },
  
  // Apply filters to recipes
  applyFilters: () => {
    const { recipes, filters } = get()
    
    let filtered = [...recipes]
    
    // Apply search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(recipe => 
        recipe.title.toLowerCase().includes(query) || 
        recipe.description.toLowerCase().includes(query)
      )
    }
    
    // Apply prep time filter
    if (filters.prepTime) {
      switch (filters.prepTime) {
        case 'quick':
          filtered = filtered.filter(recipe => recipe.prep_time < 15)
          break
        case 'medium':
          filtered = filtered.filter(recipe => recipe.prep_time >= 15 && recipe.prep_time <= 30)
          break
        case 'long':
          filtered = filtered.filter(recipe => recipe.prep_time > 30)
          break
      }
    }
    
    // Apply skill level filter
    if (filters.skillLevel) {
      filtered = filtered.filter(recipe => recipe.skill_level === filters.skillLevel)
    }
    
    // Apply meal type filter
    if (filters.mealType) {
      filtered = filtered.filter(recipe => recipe.meal_type === filters.mealType)
    }
    
    // Apply macros filters
    const { macros } = filters
    if (macros.minFat !== null) {
      filtered = filtered.filter(recipe => recipe.fat_grams >= macros.minFat)
    }
    if (macros.maxFat !== null) {
      filtered = filtered.filter(recipe => recipe.fat_grams <= macros.maxFat)
    }
    if (macros.minProtein !== null) {
      filtered = filtered.filter(recipe => recipe.protein_grams >= macros.minProtein)
    }
    if (macros.maxProtein !== null) {
      filtered = filtered.filter(recipe => recipe.protein_grams <= macros.maxProtein)
    }
    if (macros.minCarbs !== null) {
      filtered = filtered.filter(recipe => recipe.net_carbs <= macros.minCarbs)
    }
    if (macros.maxCarbs !== null) {
      filtered = filtered.filter(recipe => recipe.net_carbs <= macros.maxCarbs)
    }
    
    // Apply ingredients filter
    if (filters.ingredients && filters.ingredients.length > 0) {
      filtered = filtered.filter(recipe => {
        const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase())
        return filters.ingredients.every(ing => 
          recipeIngredients.includes(ing.toLowerCase())
        )
      })
    }
    
    set({ filteredRecipes: filtered })
  }
}))
