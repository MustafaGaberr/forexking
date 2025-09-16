import { useState } from 'react';
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

const Index = () => {
  const { i18n } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isArabic = i18n.language === 'ar';

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
    </div>
  );
};

export default Index;
