import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ParticlesBackground from './ParticlesBackground';
import { Volume2, VolumeX } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return (
    <div className="relative h-[600px] overflow-hidden bg-black">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="\Assets\introVideo.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <ParticlesBackground />
      </div>

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className={`absolute top-4 z-30 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition ${
          i18n.language === 'ar' ? 'left-4' : 'right-4'
        }`}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center px-6 md:px-12">
        <div className={`max-w-2xl text-white ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} style={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-6 drop-shadow-md">
            {t('hero.subtitle')}
          </p>
          <button 
  onClick={() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      // يروح للسيكشن جوه نفس الصفحة
      const section = document.getElementById('video-tutorial');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // لو مش عامل لوجين يروح للتسجيل
      navigate('/register');
    }
  }}
  className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors shadow-md"
>
  {t('hero.startTrading')}
</button>

        </div>
      </div>
    </div>
  );
};

export default Hero;
