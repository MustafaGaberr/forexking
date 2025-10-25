import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    let timer: number | undefined
    try {
      const shouldShow = sessionStorage.getItem('showWelcomePopup') === 'true'
      if (shouldShow) {
        // Remove the flag so popup shows only once
        sessionStorage.removeItem('showWelcomePopup')
        // Show popup after 10 seconds
        timer = window.setTimeout(() => setShowPopup(true), 10000)
      }
    } catch (e) {
      // ignore sessionStorage errors
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [])

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
