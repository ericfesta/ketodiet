import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecipeStore } from '../../stores/recipeStore'

const RecipeSearch = () => {
  const { t } = useTranslation()
  const { filters, setFilters } = useRecipeStore()
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '')
  
  const handleSearch = (e) => {
    e.preventDefault()
    setFilters({ searchQuery })
  }
  
  return (
    <form onSubmit={handleSearch} className="mb-6">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('recipes.search')}
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <button
          type="submit"
          className="absolute inset-y-0 right-0 px-4 text-white bg-primary-600 rounded-r-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {t('common.search')}
        </button>
      </div>
    </form>
  )
}

export default RecipeSearch
