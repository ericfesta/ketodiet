import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/navigation/Navbar'
import Footer from '../components/navigation/Footer'
import MobileMenu from '../components/navigation/MobileMenu'

const MainLayout = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} 
      />
      
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
      
      {/* Added pt-16 class to create space for the fixed header */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  )
}

export default MainLayout
