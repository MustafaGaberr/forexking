import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import ar from './locales/ar.json';

const resources = {
  en: {
    translation: en
  },
  ar: {
    translation: ar
  }
};

// Get saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    // Don't set lng here - let LanguageDetector handle it
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
      lookupLocalStorage: 'i18nextLng',
      lookupCookie: 'i18nextLng',
    },
  });

// Set initial document attributes based on saved language
const initialLang = savedLanguage === 'ar' ? 'ar' : 'en';
document.documentElement.setAttribute('lang', initialLang);
document.documentElement.setAttribute('dir', initialLang === 'ar' ? 'rtl' : 'ltr');

// Listen for language changes and update document attributes
i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('lang', lng);
  document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
  // Save to localStorage to ensure persistence
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;