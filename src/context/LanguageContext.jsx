import { createContext, useContext, useState } from 'react';
import translations from '../translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('gu');
  const t = translations[lang];
  const toggleLang = () => setLang(l => l === 'en' ? 'gu' : 'en');
  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      <div className={lang === 'gu' ? 'font-gujarati' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
