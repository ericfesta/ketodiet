import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'
import { supabase } from '../lib/supabaseClient'

const Profile = () => {
  const { t } = useTranslation()
  const { user, setUser } = useAuthStore()
  
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: user?.email || '',
    height: 175,
    startingWeight: 85,
    currentWeight: 79,
    targetWeight: 75,
    birthDate: '1990-01-01',
    gender: 'male',
    activityLevel: 'moderate',
    dietaryRestrictions: ['dairy'],
    allergies: ''
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  
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
    setIsSaving(true)
    setMessage({ text: '', type: '' })
    
    try {
      // In a real app, this would update the user profile in Supabase
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage({
        text: t('profile.updateSuccess'),
        type: 'success'
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({
        text: t('profile.updateError'),
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('profile.title')}</h1>
        
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
                {formData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{formData.name}</h2>
                <p className="text-primary-100">{formData.email}</p>
              </div>
            </div>
          </div>
          
          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">{t('profile.personalInfo')}</h3>
              {!isEditing ? (
                <button
                  type="button"
                  className="bg-primary-100 text-primary-700 hover:bg-primary-200 font-medium py-2 px-4 rounded-md transition duration-300"
                  onClick={() => setIsEditing(true)}
                >
                  {t('profile.editProfile')}
                </button>
              ) : (
                <button
                  type="button"
                  className="text-gray-600 hover:text-gray-800 font-medium"
                  onClick={() => setIsEditing(false)}
                >
                  {t('profile.cancel')}
                </button>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.email')}
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
                  {t('profile.birthDate')}
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
                  {t('profile.gender')}
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="male">{t('profile.genderOptions.male')}</option>
                  <option value="female">{t('profile.genderOptions.female')}</option>
                  <option value="other">{t('profile.genderOptions.other')}</option>
                  <option value="prefer-not-to-say">{t('profile.genderOptions.preferNotToSay')}</option>
                </select>
              </div>
              
              {/* Height */}
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.height')}
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    disabled={!isEditing}
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
                  {t('profile.activityLevel')}
                </label>
                <select
                  id="activityLevel"
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="sedentary">{t('profile.activityOptions.sedentary')}</option>
                  <option value="light">{t('profile.activityOptions.light')}</option>
                  <option value="moderate">{t('profile.activityOptions.moderate')}</option>
                  <option value="active">{t('profile.activityOptions.active')}</option>
                  <option value="veryActive">{t('profile.activityOptions.veryActive')}</option>
                </select>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mt-8 mb-6">{t('profile.weightInfo')}</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Starting Weight */}
              <div>
                <label htmlFor="startingWeight" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.startingWeight')}
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="startingWeight"
                    name="startingWeight"
                    value={formData.startingWeight}
                    onChange={handleChange}
                    disabled={!isEditing}
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
                  {t('profile.currentWeight')}
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="currentWeight"
                    name="currentWeight"
                    value={formData.currentWeight}
                    onChange={handleChange}
                    disabled={!isEditing}
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
                  {t('profile.targetWeight')}
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="targetWeight"
                    name="targetWeight"
                    value={formData.targetWeight}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                    kg
                  </span>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mt-8 mb-6">{t('profile.dietaryPreferences')}</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('profile.dietaryRestrictions')}
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
                      {t(`profile.restrictionOptions.${restriction}`)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.allergies')}
              </label>
              <textarea
                id="allergies"
                name="allergies"
                rows="3"
                value={formData.allergies}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder={t('profile.allergiesPlaceholder')}
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
                  {isSaving ? t('profile.saving') : t('profile.saveChanges')}
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
              {t('profile.signOut')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
