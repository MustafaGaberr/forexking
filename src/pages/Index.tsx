import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Ticker from '@/components/Ticker';
import Hero from '@/components/Hero';
import ChatWidget from '@/components/ChatWidget';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import AboutUs from '@/components/AboutUs';
import VideoTutorial from '@/components/VideoTutorial';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Popup from '@/components/Popup';

const Index = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    let timer: number | undefined
    
    // Check URL params, localStorage, and navigation state
    const urlParams = new URLSearchParams(window.location.search)
    const fromURL = urlParams.get('welcome') === 'true'
    const fromOTP = location.state?.showWelcome === true
    const storedFlag = localStorage.getItem('showWelcomePopup') === 'true'
    
    console.log('Welcome popup check:', { fromURL, fromOTP, storedFlag })
    
    if (fromURL || fromOTP || storedFlag) {
      // Remove the flag so popup shows only once
      localStorage.removeItem('showWelcomePopup')
      
      // Clean URL if welcome param exists
      if (fromURL) {
        window.history.replaceState(null, '', '/')
      }
      
      // Clear navigation state
      if (fromOTP) {
        window.history.replaceState(null, document.title, window.location.pathname)
      }
      
      // Show popup after 5 seconds
      console.log('Setting timer for welcome popup (5 seconds)')
      timer = window.setTimeout(() => {
        console.log('Showing welcome popup!')
        setShowPopup(true)
      }, 5000)
    }

    return () => {
      if (timer) {
        console.log('Clearing welcome popup timer')
        clearTimeout(timer)
      }
    }
  }, [location])

  return (
    <div className={`flex flex-col min-h-screen bg-white dark:bg-gray-900 ${
      isArabic ? 'md:flex-row-reverse' : 'md:flex-row'
    }`}>
      <Navbar onToggle={setIsCollapsed} />
      <main
        className={`w-full transition-all duration-300 pt-[64px] md:pt-0 ${
          isArabic 
            ? (isCollapsed ? 'md:mr-24' : 'md:mr-72')
            : (isCollapsed ? 'md:ml-20' : 'md:ml-72')
        }`}
      >
        <Ticker />
        <Hero />
        <ChatWidget />
        <ScrollToTopButton />
        <AboutUs />
        <VideoTutorial />
        <Contact />
        <Footer />
      </main>
      {showPopup && (
        <Popup
          message={t('popup.welcomeMessage')}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default Index;
