import { useLanguage } from "@/LanguageContext";

// Lightweight translator that supports dot-path keys (e.g. "questions.title").
export const useTranslation = () => {
  const { dict } = useLanguage();

  const t = (key) => {
    if (!key) return "";

    // allow dot-paths to access nested objects in the dict
    if (key.indexOf(".") === -1) return dict?.[key] ?? key;

    return key.split(".").reduce((acc, part) => {
      if (acc && typeof acc === "object" && part in acc) return acc[part];
      return undefined;
    }, dict) ?? key;
  };

  return { t };
};
