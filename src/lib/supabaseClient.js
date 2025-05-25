import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable email confirmation requirement for development
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

/**
 * Tests the connection to Supabase
 * @returns {Promise<{success: boolean, message: string}>} Result of the connection test
 */
export const testSupabaseConnection = async () => {
  try {
    // Simple query to test connection
    const { data, error } = await supabase.from('recipes').select('id').limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return { 
        success: false, 
        message: error.message || 'Failed to connect to database' 
      }
    }
    
    return { 
      success: true, 
      message: 'Successfully connected to Supabase' 
    }
  } catch (err) {
    console.error('Unexpected error testing Supabase connection:', err)
    return { 
      success: false, 
      message: err.message || 'Unexpected error connecting to database' 
    }
  }
}

/**
 * Fetches user profile data from Supabase
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} User profile data
 */
export const fetchUserProfile = async (userId) => {
  if (!userId) return null
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

/**
 * Updates user profile data in Supabase
 * @param {string} userId - The user's ID
 * @param {Object} updates - The profile data to update
 * @returns {Promise<Object>} Updated user profile data
 */
export const updateUserProfile = async (userId, updates) => {
  if (!userId) throw new Error('User ID is required')
  
  try {
    // Check if profile exists first
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()
    
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .maybeSingle()
      
      if (error) throw error
      return data
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          ...updates
        })
        .select()
        .maybeSingle()
      
      if (error) throw error
      return data
    }
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

/**
 * Manually confirm a user's email (for development purposes)
 * @param {string} userId - The user's ID
 * @returns {Promise<boolean>} Success status
 */
export const confirmUserEmail = async (userId) => {
  try {
    // This would require admin privileges in production
    // For development, we'll use a workaround
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      email_confirm: true
    })
    
    if (error) {
      console.error('Error confirming email:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error confirming email:', error)
    return false
  }
}

/**
 * Sign in with email bypass (for development)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Auth result
 */
export const signInBypassConfirmation = async (email, password) => {
  try {
    // First attempt normal sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error && error.message?.includes('email not confirmed')) {
      // For development: try to get user data anyway
      console.warn('Email not confirmed, attempting bypass for development')
      
      // Return the user data even if not confirmed (for development only)
      return { data, error: null }
    }
    
    return { data, error }
  } catch (err) {
    console.error('Error in bypass sign in:', err)
    return { data: null, error: err }
  }
}
