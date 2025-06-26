import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function LanguageDropdown({
  options = ["English", "Amharic", "Oromifa"],
  value,
  onChange,
  style_pass,
  placeholder = "Select Language",
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen(!open);
  const handleSelect = (lang) => {
    onChange(lang);
    setOpen(false);
  };

  // Close when clicking outside
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
    <div style={style_pass} className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full border rounded-full px-6 py-3 text-sm text-left bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 flex justify-between items-center"
      >
        <span>{value || placeholder}</span>
        <ChevronDownIcon className="w-5 h-5 text-gray-400" />
      </button>

      {open && (
        <ul className="absolute z-10 mt-2 w-full bg-white border rounded-xl shadow-lg text-sm max-h-60 overflow-auto">
          {options.map((lang, index) => (
            <li
              key={index}
              onClick={() => handleSelect(lang)}
              className={`px-4 py-2 hover:bg-indigo-100 cursor-pointer ${
                lang === value ? "bg-indigo-50 font-medium" : ""
              }`}
            >
              {lang}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
