import { useLanguage } from "@/LanguageContext";

export const useTranslation = () => {
  const { dict } = useLanguage();

  const t = (key) => {
    return dict[key] || key;
  };

  return { t };
};
