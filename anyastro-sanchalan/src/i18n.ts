import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: { translation: { dashboard: "Home", business: "Work", projects: "Projects", finance: "Money", security: "Safety", settings: "Settings", new_record: "Add New" } },
  hi: { translation: { dashboard: "मुख्य पृष्ठ", business: "काम", projects: "प्रोजेक्ट", finance: "पैसा", security: "सुरक्षा", settings: "सेटिंग्स", new_record: "नया जोड़ें" } },
  mr: { translation: { dashboard: "मुख्य पृष्ठ", business: "काम", projects: "प्रकल्प", finance: "पैसे", security: "सुरक्षा", settings: "सेटिंग्ज", new_record: "नवीन जोडा" } },
  te: { translation: { dashboard: "హోమ్", business: "పని", projects: "ప్రాజెక్టులు", finance: "డబ్బు", security: "భద్రత", settings: "సెట్టింగులు", new_record: "కొత్తది చేర్చు" } },
  ta: { translation: { dashboard: "முகப்பு", business: "வேலை", projects: "திட்டங்கள்", finance: "பணம்", security: "பாதுகாப்பு", settings: "அமைப்புகள்", new_record: "புதியதைச் சேர்" } },
  kn: { translation: { dashboard: "ಮುಖಪುಟ", business: "ಕೆಲಸ", projects: "ಯೋಜನೆಗಳು", finance: "ಹಣ", security: "ಭದ್ರತೆ", settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", new_record: "ಹೊಸ ಸೇರಿಸಿ" } },
  ml: { translation: { dashboard: "ഹോം", business: "ജോലി", projects: "പദ്ധതികൾ", finance: "പണം", security: "സുരക്ഷ", settings: "ക്രമീകരണങ്ങൾ", new_record: "പുതിയത് ചേർക്കുക" } },
  gu: { translation: { dashboard: "મુખ્ય પૃષ્ઠ", business: "કામ", projects: "પ્રોજેક્ટ્સ", finance: "પૈસા", security: "સુરક્ષા", settings: "સેટિંગ્સ", new_record: "નવું ઉમેરો" } },
  pa: { translation: { dashboard: "ਮੁੱਖ ਪੰਨਾ", business: "ਕੰਮ", projects: "ਪ੍ਰੋਜੈਕਟ", finance: "ਪੈਸਾ", security: "ਸੁਰੱਖਿਆ", settings: "ਸੈਟਿੰਗਾਂ", new_record: "ਨਵਾਂ ਜੋੜੋ" } },
  bn: { translation: { dashboard: "হোম", business: "কাজ", projects: "প্রকল্প", finance: "টাকা", security: "নিরাপত্তা", settings: "সেটিংস", new_record: "নতুন যোগ করুন" } },
  or: { translation: { dashboard: "ହୋମ୍", business: "କାମ", projects: "ପ୍ରକଳ୍ପ", finance: "ଟଙ୍କା", security: "ସୁରକ୍ଷା", settings: "ସେଟିଂସ୍", new_record: "ନୂଆ ଯୋଡନ୍ତୁ" } },
  as: { translation: { dashboard: "হোম", business: "কাম", projects: "প্ৰকল্প", finance: "টকা", security: "সুৰক্ষা", settings: "ছেটিংছ", new_record: "নতুন যোগ কৰক" } },
  ur: { translation: { dashboard: "ہوم", business: "کام", projects: "پروجیکٹس", finance: "پیسہ", security: "حفاظت", settings: "ترتیبات", new_record: "نیا شامل کریں" } }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;