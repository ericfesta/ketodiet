import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

export const useUserStore = create((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,
  
  // Fetch user profile
  fetchProfile: async (userId) => {
    if (!userId) {
      console.warn('fetchProfile called without userId')
      return null
    }
    
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle() // Use maybeSingle instead of single to handle no rows gracefully
      
      if (error) {
        console.error('Error fetching profile:', error)
        throw error
      }
      
      set({ profile: data, isLoading: false })
      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      set({ error: error.message, isLoading: false })
      return null
    }
  },
  
  // Create user profile (called during registration)
  createProfile: async (userId, profileData) => {
    if (!userId) {
      console.error('createProfile: User ID is required')
      return { success: false, error: 'User ID is required' }
    }
    
    set({ isLoading: true, error: null })
    try {
      // First check if profile already exists (trigger might have created it)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      
      if (existingProfile) {
        // Profile already exists, just update it
        const { data, error } = await supabase
          .from('profiles')
          .update({
            ...profileData,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select()
          .maybeSingle()
        
        if (error) throw error
        
        set({ profile: data, isLoading: false })
        return { success: true, data }
      }
      
      // Profile doesn't exist, create it
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .maybeSingle()
      
      if (error) throw error
      
      set({ profile: data, isLoading: false })
      return { success: true, data }
    } catch (error) {
      console.error('Error creating profile:', error)
      set({ error: error.message, isLoading: false })
      return { success: false, error: error.message }
    }
  },
  
  // Update user profile
  updateProfile: async (userId, updates) => {
    if (!userId) {
      console.error('updateProfile: User ID is required')
      return { success: false, error: 'User ID is required' }
    }
    
    if (!updates || typeof updates !== 'object') {
      console.error('updateProfile: Updates object is required')
      return { success: false, error: 'Updates object is required' }
    }
    
    set({ isLoading: true, error: null })
    try {
      // Clean the updates object - remove any undefined values
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      )
      
      // First, check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle()
      
      if (fetchError) {
        console.error('Error checking existing profile:', fetchError)
        throw fetchError
      }
      
      let result
      
      if (existingProfile) {
        // Profile exists, update it
        const { data, error } = await supabase
          .from('profiles')
          .update({
            ...cleanUpdates,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select()
          .maybeSingle()
        
        if (error) {
          console.error('Supabase update error:', error)
          throw error
        }
        
        result = data
      } else {
        // Profile doesn't exist, create it
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            ...cleanUpdates,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .maybeSingle()
        
        if (error) {
          console.error('Supabase insert error:', error)
          throw error
        }
        
        result = data
      }
      
      // Update the local state
      set({ 
        profile: result,
        isLoading: false 
      })
      
      return { success: true, data: result }
    } catch (error) {
      console.error('Error updating profile:', error)
      set({ error: error.message, isLoading: false })
      return { success: false, error: error.message }
    }
  },
  
  // Track user weight
  trackWeight: async (userId, weight, date = new Date()) => {
    if (!userId) return { success: false, error: 'User ID is required' }
    
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase
        .from('weight_logs')
        .insert({
          user_id: userId,
          weight,
          date: date.toISOString().split('T')[0]
        })
      
      if (error) throw error
      
      // Update profile with latest weight
      await get().updateProfile(userId, { weight: weight })
      
      set({ isLoading: false })
      return { success: true }
    } catch (error) {
      console.error('Error tracking weight:', error)
      set({ error: error.message, isLoading: false })
      return { success: false, error: error.message }
    }
  },
  
  // Get weight history
  getWeightHistory: async (userId) => {
    if (!userId) return []
    
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true })
      
      if (error) throw error
      
      set({ isLoading: false })
      return data || []
    } catch (error) {
      console.error('Error fetching weight history:', error)
      set({ error: error.message, isLoading: false })
      return []
    }
  },
  
  // Clear profile data (for logout)
  clearProfile: () => set({ profile: null, error: null })
}))
