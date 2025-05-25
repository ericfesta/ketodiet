import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'
import { useUserStore } from '../stores/userStore'
import { supabase } from '../lib/supabaseClient'

const Profile = () => {
  const { t } = useTranslation()
  const { user, setUser } = useAuthStore()
  const { profile, fetchProfile, updateProfile, isLoading } = useUserStore()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    height: 175,
    startingWeight: 85,
    currentWeight: 79,
    targetWeight: 75,
    birthDate: '1990-01-01',
    gender: 'male',
    activityLevel: 'moderate',
    dietaryRestrictions: [],
    allergies: ''
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(true)
  
  // Load user profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        
        // Fetch the actual user profile from the database
        const userProfile = await fetchProfile(user.id)
        
        if (userProfile) {
          // Update form data with real profile data
          setFormData({
            name: userProfile.full_name || user?.user_metadata?.full_name || '',
            email: user?.email || '',
            height: userProfile.height || 175,
            startingWeight: userProfile.starting_weight || 85,
            currentWeight: userProfile.weight || 79,
            targetWeight: userProfile.target_weight || 75,
            birthDate: userProfile.birth_date || '1990-01-01',
            gender: userProfile.gender || 'male',
            activityLevel: userProfile.activity_level || 'moderate',
            dietaryRestrictions: Array.isArray(userProfile.dietary_restrictions) ? userProfile.dietary_restrictions : [],
            allergies: userProfile.allergies || ''
          })
        } else {
          // Use auth data as fallback
          setFormData(prev => ({
            ...prev,
            name: user?.user_metadata?.full_name || '',
            email: user?.email || ''
          }))
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        setMessage({
          text: t('profile.loadError', 'Error loading profile data'),
          type: 'error'
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadProfileData()
  }, [user, fetchProfile, t])
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      // Handle dietary restrictions checkboxes
      if (name === 'dietaryRestrictions') {
        setFormData(prev => {
          const updatedRestrictions = checked
            ? [...prev.dietaryRestrictions, value]
            : prev.dietaryRestrictions.filter(item => item !== value)
          
          return {
            ...prev,
            dietaryRestrictions: updatedRestrictions
          }
        })
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if user exists first
    if (!user?.id) {
      setMessage({
        text: t('profile.userNotFound', 'User not found. Please log in again.'),
        type: 'error'
      })
      return
    }
    
    setIsSaving(true)
    setMessage({ text: '', type: '' })
    
    try {
      // Validate required fields
      if (!formData.name || !formData.name.trim()) {
        throw new Error(t('profile.nameRequired', 'Name is required'))
      }
      
      // Safe numeric conversion with fallbacks
      const safeNumber = (value, fallback = null) => {
        if (value === '' || value === null || value === undefined) return fallback
        const num = Number(value)
        return isNaN(num) ? fallback : num
      }
      
      // Prepare update data with safe parsing and validation
      const updateData = {
        full_name: String(formData.name).trim(),
        height: safeNumber(formData.height, 175),
        starting_weight: safeNumber(formData.startingWeight),
        weight: safeNumber(formData.currentWeight),
        target_weight: safeNumber(formData.targetWeight),
        birth_date: formData.birthDate || null,
        gender: formData.gender || 'male',
        activity_level: formData.activityLevel || 'moderate',
        dietary_restrictions: Array.isArray(formData.dietaryRestrictions) ? formData.dietaryRestrictions : [],
        allergies: String(formData.allergies || '')
      }
      
      // Validate numeric fields with safe checks
      if (updateData.height !== null && (updateData.height < 100 || updateData.height > 250)) {
        throw new Error(t('profile.invalidHeight', 'Height must be between 100 and 250 cm'))
      }
      
      if (updateData.starting_weight !== null && (updateData.starting_weight < 30 || updateData.starting_weight > 300)) {
        throw new Error(t('profile.invalidWeight', 'Weight must be between 30 and 300 kg'))
      }
      
      if (updateData.weight !== null && (updateData.weight < 30 || updateData.weight > 300)) {
        throw new Error(t('profile.invalidWeight', 'Weight must be between 30 and 300 kg'))
      }
      
      if (updateData.target_weight !== null && (updateData.target_weight < 30 || updateData.target_weight > 300)) {
        throw new Error(t('profile.invalidWeight', 'Weight must be between 30 and 300 kg'))
      }
      
      // Update the user profile in the database
      const result = await updateProfile(user.id, updateData)
      
      if (result?.success) {
        setMessage({
          text: t('profile.updateSuccess', 'Profile updated successfully!'),
          type: 'success'
        })
        setIsEditing(false)
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage({ text: '', type: '' })
        }, 3000)
      } else {
        const errorMessage = result?.error || 'Update failed'
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({
        text: error?.message || t('profile.updateError', 'Error updating profile. Please try again.'),
        type: 'error'
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }
  
  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          {t('common.loading', 'Loading...')}
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('profile.title', 'Profile')}</h1>
        
        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-primary-600 p-6 text-white">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold mr-6">
                {formData.name ? formData.name.split(' ').map(n => n[0]).join('') : 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{formData.name || 'User'}</h2>
                <p className="text-primary-100">{formData.email}</p>
              </div>
            </div>
          </div>
          
          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">{t('profile.personalInfo', 'Personal Information')}</h3>
              {!isEditing ? (
                <button
                  type="button"
                  className="bg-primary-100 text-primary-700 hover:bg-primary-200 font-medium py-2 px-4 rounded-md transition duration-300"
                  onClick={() => setIsEditing(true)}
                >
                  {t('profile.editProfile', 'Edit Profile')}
                </button>
              ) : (
                <button
                  type="button"
                  className="text-gray-600 hover:text-gray-800 font-medium"
                  onClick={() => {
                    setIsEditing(false)
                    setMessage({ text: '', type: '' })
                  }}
                >
                  {t('common.cancel', 'Cancel')}
                </button>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.name', 'Name')} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.email', 'Email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true} // Email can't be changed directly
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              
              {/* Birth Date */}
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.birthDate', 'Birth Date')}
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              
              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.gender', 'Gender')}
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="male">{t('profile.genderOptions.male', 'Male')}</option>
                  <option value="female">{t('profile.genderOptions.female', 'Female')}</option>
                  <option value="other">{t('profile.genderOptions.other', 'Other')}</option>
                  <option value="prefer-not-to-say">{t('profile.genderOptions.preferNotToSay', 'Prefer not to say')}</option>
                </select>
              </div>
              
              {/* Height */}
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.height', 'Height')}
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    disabled={!isEditing}
                    min="100"
                    max="250"
                    className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                    cm
                  </span>
                </div>
              </div>
              
              {/* Activity Level */}
              <div>
                <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.activityLevel', 'Activity Level')}
                </label>
                <select
                  id="activityLevel"
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="sedentary">{t('profile.activityOptions.sedentary', 'Sedentary')}</option>
                  <option value="light">{t('profile.activityOptions.light', 'Light')}</option>
                  <option value="moderate">{t('profile.activityOptions.moderate', 'Moderate')}</option>
                  <option value="active">{t('profile.activityOptions.active', 'Active')}</option>
                  <option value="veryActive">{t('profile.activityOptions.veryActive', 'Very Active')}</option>
                </select>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mt-8 mb-6">{t('profile.weightInfo', 'Weight Information')}</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Starting Weight */}
              <div>
                <label htmlFor="startingWeight" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.startingWeight', 'Starting Weight')}
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="startingWeight"
                    name="startingWeight"
                    value={formData.startingWeight}
                    onChange={handleChange}
                    disabled={!isEditing}
                    min="30"
                    max="300"
                    step="0.1"
                    className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                    kg
                  </span>
                </div>
              </div>
              
              {/* Current Weight */}
              <div>
                <label htmlFor="currentWeight" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.currentWeight', 'Current Weight')}
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="currentWeight"
                    name="currentWeight"
                    value={formData.currentWeight}
                    onChange={handleChange}
                    disabled={!isEditing}
                    min="30"
                    max="300"
                    step="0.1"
                    className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                    kg
                  </span>
                </div>
              </div>
              
              {/* Target Weight */}
              <div>
                <label htmlFor="targetWeight" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.targetWeight', 'Target Weight')}
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="targetWeight"
                    name="targetWeight"
                    value={formData.targetWeight}
                    onChange={handleChange}
                    disabled={!isEditing}
                    min="30"
                    max="300"
                    step="0.1"
                    className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                    kg
                  </span>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mt-8 mb-6">{t('profile.dietaryPreferences', 'Dietary Preferences')}</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('profile.dietaryRestrictions', 'Dietary Restrictions')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['vegetarian', 'vegan', 'gluten-free', 'dairy', 'nuts', 'shellfish'].map(restriction => (
                  <div key={restriction} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`restriction-${restriction}`}
                      name="dietaryRestrictions"
                      value={restriction}
                      checked={formData.dietaryRestrictions.includes(restriction)}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`restriction-${restriction}`} className="ml-2 text-sm text-gray-700">
                      {t(`profile.restrictionOptions.${restriction}`, restriction.charAt(0).toUpperCase() + restriction.slice(1))}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.allergies', 'Allergies')}
              </label>
              <textarea
                id="allergies"
                name="allergies"
                rows="3"
                value={formData.allergies}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder={t('profile.allergiesPlaceholder', 'List any food allergies or intolerances...')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
              ></textarea>
            </div>
            
            {isEditing && (
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-primary-400"
                >
                  {isSaving ? t('profile.saving', 'Saving...') : t('profile.saveChanges', 'Save Changes')}
                </button>
              </div>
            )}
          </form>
          
          <div className="border-t border-gray-200 p-6">
            <button
              type="button"
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              {t('profile.signOut', 'Sign Out')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
