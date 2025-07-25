import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { auth, db } from "#/firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import { useLanguage } from "@/LanguageContext.jsx";

const LANGUAGE_LABELS = {
  en: "English",
  am: "Amharic",
  or: "Affan Oromo",
};

export default function LanguageDropdown({
  options = ["en", "am", "or"],
  style_pass,
  placeholder = "Select Language",
  onUpdateStateChange,
  thisReg,
  setThis,
  ifThis
}) {
  const { lang, setLang } = useLanguage(); // use context
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    if (!updating) setOpen(!open);
  };

  const handleSelect = async (langCode) => {
    setOpen(false);
    setLang(langCode); // update local language immediately
    setUpdating(true);
    setError(null);
    onUpdateStateChange?.({ updating: true, error: null });

    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { lang: langCode });
      }
    } catch (err) {
      console.error("Error updating language in Firestore:", err.message);
      setError("Failed to update language online");
      onUpdateStateChange?.({
        updating: false,
        error: "Failed to update language online",
      });
    } finally {
      setUpdating(false);
      if (thisReg && ifThis) {
        let reg_lang_options = {
          am: "እባክዎ መጀመሪያ ሀገር ይምረጡ",
          en: "Please select a country first",
          or: "Bara biyya dura filadhu",
        };

        setThis([reg_lang_options[langCode] || "Please select a country first"]);
      }
      if (!error) onUpdateStateChange?.({ updating: false, error: null });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={style_pass}
      className={`relative w-full transition-opacity duration-200 ${
        updating ? "opacity-50 pointer-events-none" : "opacity-100"
      }`}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full border rounded-full px-6 py-3 text-sm text-left bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 flex justify-between items-center"
      >
        <span>{LANGUAGE_LABELS[lang] || placeholder}</span>
        {updating ? (
          <div className="ml-2 w-5 h-5 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-logo-400" />
        )}
      </button>

      {open && (
        <ul className="absolute z-10 mt-2 w-full bg-white border rounded-xl shadow-lg text-sm max-h-60 overflow-auto">
          {options.map((langCode) => (
            <li
              key={langCode}
              onClick={() => handleSelect(langCode)}
              className={`px-4 py-2 hover:bg-indigo-100 cursor-pointer ${
                langCode === lang ? "bg-indigo-50 font-medium" : ""
              }`}
            >
              {LANGUAGE_LABELS[langCode]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
