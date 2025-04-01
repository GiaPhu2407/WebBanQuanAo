// app/component/LanguageSwitcher.tsx
"use client";

import { useState } from "react";
import { useLanguage } from "./LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const switchLanguage = (lang: string) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="btn btn-outline btn-primary flex items-center gap-1"
      >
        {t("languages")}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-40 bg-white rounded shadow-lg z-50">
          <button
            onClick={() => switchLanguage("en")}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
          >
            English
          </button>
          <button
            onClick={() => switchLanguage("vi")}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
          >
            Tiếng Việt
          </button>
        </div>
      )}
    </div>
  );
}
