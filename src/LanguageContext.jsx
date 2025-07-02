import React, { createContext, useContext, useEffect, useState } from "react";
import en from "./lang/en.json";
import am from "./lang/am.json";
import or from "./lang/or.json";

const translations = { en, am, or };
const LanguageContext = createContext();

export const LanguageProvider = ({ userLang = "en", children }) => {
  const [lang, setLang] = useState(userLang);
  const [dict, setDict] = useState(translations[lang]);

  useEffect(() => {
    setDict(translations[lang] || translations.en);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, dict, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
