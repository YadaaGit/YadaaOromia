import React, { createContext, useContext, useEffect, useState } from "react";
import en from "./lang/en_new.json";
import am from "./lang/am_new.json";
import or from "./lang/or_new.json";

const translations = { en, am, or };
const LanguageContext = createContext();

export const LanguageProvider = ({ userLang = "am", children }) => {
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
