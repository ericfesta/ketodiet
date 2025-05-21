import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

export const useUserStore = create((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,
  
  // Fetch user profile
  fetchProfile: async (userId) => {
    if (!userId) return
    
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      
      set({ profile: data, isLoading: false })
    } catch (error) {
      console.error('Error fetching profile:', error)
      set({ error: error.message, isLoading: false })
    }
  },
  
  // Update user profile
  updateProfile: async (userId, updates) => {
    if (!userId) return
    
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
      
      if (error) throw error
      
      set({ 
        profile: { ...get().profile, ...updates },
        isLoading: false 
      })
      
      return { success: true }
    } catch (error) {
      console.error('Error updating profile:', error)
      set({ error: error.message, isLoading: false })
      return { success: false, error: error.message }
    }
  },
  
  // Track user weight
  trackWeight: async (userId, weight, date = new Date()) => {
    if (!userId) return
    
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
      await get().updateProfile(userId, { current_weight: weight })
      
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
      return data
    } catch (error) {
      console.error('Error fetching weight history:', error)
      set({ error: error.message, isLoading: false })
      return []
    }
  }
}))
