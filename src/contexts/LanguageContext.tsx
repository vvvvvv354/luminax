import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Supported languages
export type Language = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml' | 'bn' | 'gu' | 'mr' | 'pa';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: { code: Language; name: string; nativeName: string }[];
}

// Available languages
const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ta' as Language, name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te' as Language, name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn' as Language, name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml' as Language, name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'bn' as Language, name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu' as Language, name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'mr' as Language, name: 'Marathi', nativeName: 'मराठी' },
  { code: 'pa' as Language, name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
];

// Translation data (example: only 'en' and 'hi' shown; you can expand others)
const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: 'Welcome',
    login: 'Login',
    logout: 'Logout',
    dashboard: 'Dashboard',
    profile: 'Profile',
    settings: 'Settings',
    help: 'Help',
    chat: 'Chat Assistant',
    voice_assistant: 'Voice Assistant',
    language: 'Language',
    save: 'Save',
    cancel: 'Cancel',
    get_started: 'Get Started',
    learn_more: 'Learn More',
    // Add all keys from your previous code here...
  },
  hi: {
    welcome: 'स्वागत है',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    dashboard: 'डैशबोर्ड',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्स',
    help: 'सहायता',
    chat: 'चैट सहायक',
    voice_assistant: 'आवाज सहायक',
    language: 'भाषा',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    get_started: 'शुरू करें',
    learn_more: 'और जानें',
    // Add all keys from your previous code here...
  },
  ta: { welcome: 'வரவேற்கிறோம்', login: 'உள்நுழைய', logout: 'வெளியேறு', dashboard: 'டாஷ்போர்டு', profile: 'சுயவிவரம்', settings: 'அமைப்புகள்', help: 'உதவி', chat: 'அரட்டை உதவியாளர்', voice_assistant: 'குரல் உதவியாளர்', language: 'மொழி', fitness_tests: 'உடல்நலப் பரிசோதனைகள்', start_test: 'சோதனையைத் தொடங்கு', sport_recommendations: 'விளையாட்டு பரிந்துரைகள்' },
  te: { welcome: 'స్వాగతం', login: 'లాగిన్', logout: 'లాగ్అవుట్', dashboard: 'డ్యాష్‌బోర్డ్', profile: 'ప్రొఫైల్', settings: 'సెట్టింగులు', help: 'సహాయం', chat: 'చాట్ అసిస్టెంట్', voice_assistant: 'వాయిస్ అసిస్టెంట్', language: 'భాష', accessibility: 'యాక్సెసిబిలిటీ' },
  kn: { welcome: 'ಸ್ವಾಗತ', login: 'ಲಾಗಿನ್', logout: 'ಲಾಗ್ಔಟ್', dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', profile: 'ಪ್ರೊಫೈಲ್', settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', help: 'ಸಹಾಯ', chat: 'ಚಾಟ್ ಸಹಾಯಕ', voice_assistant: 'ಧ್ವನಿ ಸಹಾಯಕ', language: 'ಭಾಷೆ', accessibility: 'ಪ್ರವೇಶಸಾಧ್ಯತೆ' },
  ml: { welcome: 'സ്വാഗതം', login: 'ലോഗിൻ', logout: 'ലോഗ്ഔട്ട്', dashboard: 'ഡാഷ്ബോർഡ്', profile: 'പ്രൊഫൈൽ', settings: 'ക്രമീകരണങ്ങൾ', help: 'സഹായം', chat: 'ചാറ്റ് അസിസ്റ്റന്റ്', voice_assistant: 'വോയ്സ് അസിസ്റ്റന്റ്', language: 'ഭാഷ', accessibility: 'പ്രവേശനക്ഷമത' },
  bn: { welcome: 'স্বাগতম', login: 'লগইন', logout: 'লগআউট', dashboard: 'ড্যাশবোর্ড', profile: 'প্রোফাইল', settings: 'সেটিংস', help: 'সাহায্য', chat: 'চ্যাট সহায়ক', voice_assistant: 'ভয়েস সহায়ক', language: 'ভাষা', accessibility: 'অ্যাক্সেসিবিলিটি' },
  gu: { welcome: 'સ્વાગત છે', login: 'લોગિન', logout: 'લોગઆઉટ', dashboard: 'ડેશબોર્ડ', profile: 'પ્રોફાઇલ', settings: 'સેટિંગ્સ', help: 'મદદ', chat: 'ચેટ આસિસ્ટન્ટ', voice_assistant: 'વૉઇસ આસિસ્ટન્ટ', language: 'ભાષા', accessibility: 'પહોંચ' },
  mr: { welcome: 'स्वागत', login: 'लॉगिन', logout: 'लॉगआउट', dashboard: 'डॅशबोर्ड', profile: 'प्रोफाइल', settings: 'सेटिंग्स', help: 'मदत', chat: 'चॅट असिस्टंट', voice_assistant: 'व्हॉईस असिस्टंट', language: 'भाषा', accessibility: 'प्रवेशयोग्यता' },
  pa: { welcome: 'ਸੁਆਗਤ ਹੈ', login: 'ਲਾਗਇਨ', logout: 'ਲਾਗਆਉਟ', dashboard: 'ਡੈਸ਼ਬੋਰਡ', profile: 'ਪ੍ਰੋਫਾਈਲ', settings: 'ਸੈਟਿੰਗਾਂ', help: 'ਮਦਦ', chat: 'ਚੈਟ ਸਹਾਇਕ', voice_assistant: 'ਆਵਾਜ਼ ਸਹਾਇਕ', language: 'ਭਾਸ਼ਾ', accessibility: 'ਪਹੁੰਚਯੋਗਤਾ' }
};

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Custom hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('sai-language') as Language;
    if (savedLanguage && languages.some(l => l.code === savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('sai-language', lang);
  };

  const t = (key: string) => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};
