import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { BookOpen, Users, TrendingUp, FileText, CreditCard, Shield } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useAuth } from "@/hooks/useAuth";

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
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const handleOpenAccount = () => {
    // Check if user is logged in
    if (user) {
      // User is logged in - open Swissquote link in new tab
      window.open(
        "https://trade.swissquote.ch/signup/public/form/full/fx/com/individual?lang=en&partnerid=28105ebd-1a6c-4adc-8cd8-e9e55227abe7#full/fx/com/individual/step2",
        "_blank",
        "noopener,noreferrer"
      );
    } else {
      // User is not logged in - redirect to register page
      navigate("/register");
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
          key={i18n.language} 
          ref={videoRef}
          src={i18n.language === 'ar' ? '/Assets/openAccAr.mp4' : '/Assets/openAccEn.mp4'}
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
              <Button 
                onClick={handleOpenAccount}
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t('videoTutorial.openAccountButton')}
              </Button>
              
              {/* Important Note - Only shown for logged in users */}
              {user && (
              <div className="mt-8 max-w-3xl mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className={`space-y-4 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-3 text-sm sm:text-base">
                      <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                        {i18n.language === 'ar' 
                          ? 'بعد اتمام التسجيل، يرجي التواصل مع خدمة عملاء Forex King لإرسال اوراق توثيق الحساب و الحساب الاسلامى و الرافعة المالية'
                          : 'After completing registration, please contact Forex King customer service to send account verification documents, Islamic account and leverage forms'}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">
                          {i18n.language === 'ar' ? 'عبر الواتساب:' : 'Via WhatsApp:'}
                        </span>
                        <a 
                          href="https://wa.me/447308509557" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          +447308509557
                        </a>
                        <span className="text-gray-400">/</span>
                        <a 
                          href="https://wa.me/4367846433933" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          +4367846433933
                        </a>
                      </div>

                      <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                        {i18n.language === 'ar' 
                          ? 'وبعد التوقيع عليها يتم أرسالها علي الايميل:'
                          : 'After signing them, send them to:'}
                        {' '}
                        <a 
                          href="mailto:o.a.f.forexking@gmail.com"
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          o.a.f.forexking@gmail.com
                        </a>
                      </p>

                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {i18n.language === 'ar' 
                            ? 'بعد اتمام ارسال الاوراق، سيتواصل معك احد ممثلينا خلال ساعتين لانهاء عقد ادارة المحافظ و هذا العقد يوضح تفاصيل التعاون و ادارة الحساب بينك و بين فريق Forex King'
                            : 'After completing the document submission, one of our representatives will contact you within two hours to finalize the portfolio management contract'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}
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
          
			{/* Note instead of downloadable PDF cards - Enhanced UI */}
			<motion.div
				variants={fadeIn}
				className="mt-12"
			>
				<div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 dark:from-primary/10 dark:via-accent/10 dark:to-primary/20 rounded-2xl p-8 shadow-lg border border-primary/20">
					{/* Decorative elements */}
					<div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
					<div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl"></div>
					
					<div className={`relative z-10 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
						<div className="flex items-start gap-4 mb-6">
							<div className="flex-shrink-0 w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
								<FileText className="w-6 h-6 text-white" />
							</div>
							<div className="flex-1">
								<h3 className="text-2xl font-bold text-foreground mb-2">
									{i18n.language === 'ar' ? 'هل تحتاج إلى المستندات؟' : 'Need Documents?'}
								</h3>
								<p className="text-base text-muted-foreground">
									{i18n.language === 'ar' 
										? 'نحن هنا لمساعدتك في الحصول على جميع المستندات المطلوبة'
										: 'We\'re here to help you get all the required documents'}
								</p>
							</div>
						</div>

						<div className="space-y-4">
							<p className="text-lg text-foreground leading-relaxed">
								{i18n.language === 'ar' 
									? 'في حالة طلبك لأوراق فتح وتوثيق الحساب، أو الرافعة المالية، أو حساب الشريعة الإسلامية:'
									: 'If you need account opening and verification documents, leverage request, or Islamic (Sharia-compliant) account forms:'}
							</p>

							<div className="grid md:grid-cols-2 gap-4">
								{/* Email Section */}
								<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-primary/10">
									<div className="flex items-center gap-3 mb-3">
										<div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
											<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
											</svg>
										</div>
										<span className="font-semibold text-foreground">
											{i18n.language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
										</span>
									</div>
									<a 
										href="mailto:contact@forexking.info"
										className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors group"
									>
										<span className="group-hover:underline">contact@forexking.info</span>
										<svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
										</svg>
									</a>
								</div>

								{/* WhatsApp Section */}
								<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-primary/10">
									<div className="flex items-center gap-3 mb-3">
										<div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
											<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
												<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
											</svg>
										</div>
										<span className="font-semibold text-foreground">
											{i18n.language === 'ar' ? 'الواتساب' : 'WhatsApp'}
										</span>
									</div>
									<div className="flex flex-wrap gap-3">
										<a 
											href="https://wa.me/4367846433933" 
											target="_blank" 
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
										>
											<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
												<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
											</svg>
											+4367846433933
										</a>
										<a 
											href="https://wa.me/447308509557" 
											target="_blank" 
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
										>
											<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
												<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
											</svg>
											+447308509557
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoTutorial;
