import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { BookOpen, Users, TrendingUp, FileText, CreditCard, Shield } from "lucide-react";
import { useTranslation } from 'react-i18next';

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const VideoTutorial = () => {
  const { t, i18n } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [isPlaying, setIsPlaying] = useState(false);

  // Helper function to convert numbers to Arabic numerals
  const toArabicNumerals = (num: string) => {
    if (i18n.language !== 'ar') return num;
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section
      id="video-tutorial"
      className="relative overflow-hidden bg-background"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-1/2 w-[500px] sm:w-[700px] translate-x-1/2 translate-y-1/3">
          <div className="aspect-square w-full rounded-full bg-accent/10 dark:bg-accent/20 blur-[80px]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
        >
          {/* Section Header */}
          <motion.div variants={fadeIn} className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 md:mb-8 leading-tight">
              {t('videoTutorial.learnHow')}{" "}
              <span className="text-transparent bg-clip-text bg-primary">
                {t('videoTutorial.openYourAccount')}
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {t('videoTutorial.description')}
            </p>
          </motion.div>

          {/* Video Container */}
          <motion.div
            variants={fadeIn}
            className="relative max-w-4xl mx-auto mb-12 md:mb-16"
          >
            <Card className="overflow-hidden shadow-2xl bg-card border-border">
              <CardContent className="p-0 relative">
                <div className="relative aspect-video bg-background">
                  <video
                    ref={videoRef}
                    src="/Assets/openAcc.MP4"
                    controls
                    className="w-full h-full object-cover"
                    playsInline
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            variants={fadeIn}
            className="text-center mb-12 md:mb-16"
          >
            <div className="bg-gradient-to-r from-primary to-accent p-8 md:p-12 rounded-2xl shadow-2xl">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                {t('videoTutorial.openAccountNow')}
              </h3>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                {t('videoTutorial.openAccountDesc')}
              </p>
              <a 
                href="https://trade.swissquote.ch/signup/public/form/full/fx/com/individual?lang=en&partnerid=28105ebd-1a6c-4adc-8cd8-e9e55227abe7#full/fx/com/individual/step2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {t('videoTutorial.openAccountButton')}
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            variants={fadeIn}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12"
          >
            {[
              {
                icon: BookOpen,
                title: t('videoTutorial.stepByStep'),
                description: t('videoTutorial.stepByStepDesc'),
              },
              {
                icon: Users,
                title: t('videoTutorial.expertSupport'),
                description: t('videoTutorial.expertSupportDesc'),
              },
              {
                icon: TrendingUp,
                title: t('videoTutorial.startTrading'),
                description: t('videoTutorial.startTradingDesc'),
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div key={index} variants={fadeIn} className="text-center">
                  <Card className="p-6 h-full bg-card border-border hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
          
			{/* Note instead of downloadable PDF cards */}
			<motion.div
				variants={fadeIn}
				className="mt-12"
			>
				<Card className="p-6 bg-card border-border">
					<CardContent className="p-0">
						<div className="text-center space-y-2">
							{ i18n.language === 'ar' ? (
								<p className="text-lg text-foreground leading-relaxed">
									في حالة طلبك لأوراق فتح وتوثيق الحساب ، أو الرافعة المالية ، أو حساب الشريعة الإسلامية ، راسلنا على الإيميل{' '}
									<a href="mailto:contact@forexking.info" className="text-primary font-semibold">contact@forexking.info</a>{' '}
									أو الواتساب{' '}
									<a href="https://wa.me/+4367846433933" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold">+4367846433933</a>
								</p>
							) : (
								<p className="text-lg text-foreground leading-relaxed">
									If you need the account opening and verification documents, leverage request, or Islamic (Sharia-compliant) account forms, please contact us via email{' '}
									<a href="mailto:contact@forexking.info" className="text-primary font-semibold">contact@forexking.info</a>{' '}
									or WhatsApp{' '}
									<a href="https://wa.me/+4367846433933" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold">+4367846433933 </a>
                  |{' '}
									<a href="https://wa.me/+447308509557" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold">+447308509557</a>
								</p>
							) }
						</div>
					</CardContent>
				</Card>
			</motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoTutorial;
