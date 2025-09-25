import React, { createContext, useContext, useEffect, useState } from "react";
import en from "./lang/en_new.json";
import am from "./lang/am_new.json";
import or from "./lang/or_new.json";
import useUserData from "./hooks/get_user_data.js";

const translations = { en, am, or };
const LanguageContext = createContext();

export const LanguageProvider = ({ userLang = "am", children }) => {
  const { user } = useUserData();

  // prefer user.lang when available, otherwise fall back to prop or "am"
  const initialLang = user?.lang || userLang || "am";
  const [lang, setLang] = useState(initialLang);
  const [dict, setDict] = useState(translations[initialLang] || translations.en);

  // if user.lang becomes available later, adopt it
  useEffect(() => {
    if (user?.lang && user.lang !== lang) {
      setLang(user.lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.lang]);

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
