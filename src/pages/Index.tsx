import { useState } from 'react';
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900">
      <Navbar onToggle={setIsCollapsed} />
      <main
        className={`w-full transition-all duration-300 pt-[64px] md:pt-0 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
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
