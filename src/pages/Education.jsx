import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const Education = () => {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('basics')
  
  // Mock articles data (will be replaced with actual data from Supabase)
  const mockArticles = {
    basics: [
      {
        id: 1,
        title: 'What is the Ketogenic Diet?',
        excerpt: 'Learn about the science behind the keto diet and how it works to help your body burn fat for fuel.',
        readTime: 5,
        image: null
      },
      {
        id: 2,
        title: 'Getting Started with Keto',
        excerpt: 'A beginner\'s guide to starting your ketogenic journey with practical tips and advice.',
        readTime: 8,
        image: null
      },
      {
        id: 3,
        title: 'Understanding Macros on Keto',
        excerpt: 'Learn how to calculate and track your macronutrients for optimal ketogenic results.',
        readTime: 6,
        image: null
      }
    ],
    science: [
      {
        id: 4,
        title: 'The Science of Ketosis',
        excerpt: 'Dive deep into the metabolic state of ketosis and how it affects your body at a cellular level.',
        readTime: 10,
        image: null
      },
      {
        id: 5,
        title: 'Keto and Brain Health',
        excerpt: 'Explore the research on how ketones can provide optimal fuel for your brain.',
        readTime: 7,
        image: null
      },
      {
        id: 6,
        title: 'Insulin Resistance and Keto',
        excerpt: 'Understanding how the ketogenic diet can help improve insulin sensitivity.',
        readTime: 9,
        image: null
      }
    ],
    tips: [
      {
        id: 7,
        title: 'Overcoming Keto Flu',
        excerpt: 'Practical strategies to minimize or avoid the symptoms of keto adaptation.',
        readTime: 4,
        image: null
      },
      {
        id: 8,
        title: 'Eating Out on Keto',
        excerpt: 'How to navigate restaurant menus and social situations while staying keto-compliant.',
        readTime: 6,
        image: null
      },
      {
        id: 9,
        title: 'Breaking Through Weight Loss Plateaus',
        excerpt: 'Strategies to overcome stalls in your weight loss journey on the ketogenic diet.',
        readTime: 7,
        image: null
      }
    ],
    myths: [
      {
        id: 10,
        title: 'Debunking Common Keto Myths',
        excerpt: 'Separating fact from fiction about the ketogenic diet and addressing common misconceptions.',
        readTime: 8,
        image: null
      },
      {
        id: 11,
        title: 'Is Keto Dangerous for Your Heart?',
        excerpt: 'Examining the research on ketogenic diets and cardiovascular health.',
        readTime: 9,
        image: null
      },
      {
        id: 12,
        title: 'Keto vs. Other Diets',
        excerpt: 'How the ketogenic diet compares to other popular dietary approaches like paleo, Mediterranean, and low-fat.',
        readTime: 10,
        image: null
      }
    ]
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('education.title')}</h1>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-8">
        {['basics', 'science', 'tips', 'myths'].map(category => (
          <button
            key={category}
            className={`py-3 px-6 text-sm font-medium border-b-2 ${
              activeCategory === category
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {t(`education.categories.${category}`)}
          </button>
        ))}
      </div>
      
      {/* Featured Article */}
      <div className="mb-12">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="md:flex">
            <div className="md:w-1/2 bg-gray-200 h-64 md:h-auto"></div>
            <div className="md:w-1/2 p-8">
              <div className="uppercase tracking-wide text-sm text-primary-600 font-semibold">
                {t('education.featuredArticle')}
              </div>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {t('education.featuredTitle')}
              </h2>
              <p className="mt-3 text-gray-600">
                {t('education.featuredExcerpt')}
              </p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{t('education.readTime', { minutes: 12 })}</span>
              </div>
              <button className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                {t('education.readMore')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Articles Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {t(`education.categoryTitles.${activeCategory}`)}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockArticles[activeCategory].map(article => (
            <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('education.readTime', { minutes: article.readTime })}</span>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    {t('education.readArticle')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Newsletter Signup */}
      <div className="mt-16 bg-primary-50 rounded-lg p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">{t('education.newsletter.title')}</h2>
          <p className="text-gray-600 mb-6">{t('education.newsletter.description')}</p>
          
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder={t('education.newsletter.emailPlaceholder')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('education.newsletter.subscribeButton')}
            </button>
          </form>
          
          <p className="mt-4 text-xs text-gray-500">
            {t('education.newsletter.privacyNotice')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Education
