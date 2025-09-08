import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Chat Widget
    'chat.header': 'Forex King Assistant',
    'chat.welcome': 'Welcome! How can I help you today?',
    'chat.placeholder': 'Type your message here...',
    'chat.backToOptions': 'Back to options',
    'chat.defaultResponse': 'Thank you for contacting us. You will receive a response shortly from one of our customer service representatives.',
    
    // Chat Questions & Answers
    'chat.question1': 'How do I open an account?',
    'chat.answer1': 'You can open an account by clicking the "Open Account" button on the homepage and filling out the required form.',
    'chat.question2': 'What is the minimum deposit?',
    'chat.answer2': 'The minimum deposit is $100 USD.',
    'chat.question3': 'How can I withdraw funds?',
    'chat.answer3': 'You can withdraw funds by going to the dashboard, then clicking "Withdraw" and following the instructions.',
    
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.performance': 'Deal Performance',
    'nav.openAccount': 'Open Account',
    'nav.contact': 'Contact',
    'nav.agreement': 'Customer Agreement',
    'nav.admin': 'Admin',
    
    // Hero Section
    'hero.title': 'Trade with Confidence',
    'hero.subtitle': 'Access global forex markets with a trusted leader',
    'hero.startTrading': 'Start Trading',
    
    // Auth
    'auth.signIn': 'Sign In',
    'auth.register': 'Register',
    'auth.signOut': 'Sign Out',
  },
  ar: {
    // Chat Widget
    'chat.header': 'مساعد Forex King',
    'chat.welcome': 'مرحباً بك! كيف يمكنني مساعدتك اليوم؟',
    'chat.placeholder': 'اكتب رسالتك هنا...',
    'chat.backToOptions': 'الرجوع للخيارات',
    'chat.defaultResponse': 'شكراً لتواصلك معنا. سيتم الرد عليك قريباً من قبل أحد ممثلي خدمة العملاء.',
    
    // Chat Questions & Answers
    'chat.question1': 'كيف أفتح حساب؟',
    'chat.answer1': 'يمكنك فتح حساب من خلال النقر على زر "فتح حساب" في الصفحة الرئيسية وملء النموذج المطلوب.',
    'chat.question2': 'ما هي الحد الأدنى للإيداع؟',
    'chat.answer2': 'الحد الأدنى للإيداع هو 100 دولار أمريكي.',
    'chat.question3': 'كيف يمكنني سحب الأموال؟',
    'chat.answer3': 'يمكنك سحب الأموال من خلال الذهاب إلى لوحة التحكم، ثم النقر على "سحب" واتباع التعليمات.',
    
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.performance': 'أداء الصفقات',
    'nav.openAccount': 'فتح حساب',
    'nav.contact': 'اتصل بنا',
    'nav.agreement': 'اتفاقية العميل',
    'nav.admin': 'الإدارة',
    
    // Hero Section
    'hero.title': 'تداول بثقة',
    'hero.subtitle': 'ادخل إلى أسواق الفوركس العالمية مع قائد موثوق',
    'hero.startTrading': 'ابدأ التداول',
    
    // Auth
    'auth.signIn': 'تسجيل الدخول',
    'auth.register': 'إنشاء حساب',
    'auth.signOut': 'تسجيل الخروج',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage);
    }
    
    // Set document direction and lang attribute
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};