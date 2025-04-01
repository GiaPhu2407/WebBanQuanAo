// app/component/LanguageContext.tsx
"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    home: "HOME",
    about: "ABOUT",
    blog: "BLOG",
    contact: "CONTACT",
    login: "Login",
    register: "Register",
    languages: "Languages",
  },
  vi: {
    home: "TRANG CHỦ",
    about: "GIỚI THIỆU",
    blog: "BLOG",
    contact: "LIÊN HỆ",
    login: "Đăng nhập",
    register: "Đăng ký",
    languages: "Ngôn ngữ",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("vi");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "vi";
    setLanguage(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    if (
      translations[language as keyof typeof translations] &&
      translations[language as keyof typeof translations][
        key as keyof typeof translations.en
      ]
    ) {
      return translations[language as keyof typeof translations][
        key as keyof typeof translations.en
      ];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
