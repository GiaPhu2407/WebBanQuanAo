"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import hinh from "@/app/image/hinhlogo.png";
import { useRouter } from "next/navigation";
import { User } from "@/app/types/auth";
import { LanguageProvider, useLanguage } from "@/app/component/LanguageContext";
import LanguageSwitcher from "@/app/component/LanguageSwitcher";

// Tạo một context để quản lý theme
export const ThemeContext = React.createContext({
  theme: "light",
  setTheme: (theme: string) => {},
});

// Hook sử dụng theme
export const useTheme = () => React.useContext(ThemeContext);

// Provider component cho theme
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");

  // Lấy theme từ localStorage khi component được mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Cập nhật theme và lưu vào localStorage
  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Component chuyển đổi theme
const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
  ];

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost gap-1 normal-case"
      >
        <svg
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          ></path>
        </svg>
        <span className="hidden md:inline">Theme</span>
        <svg
          width="12px"
          height="12px"
          className="ml-1 hidden h-3 w-3 fill-current opacity-60 sm:inline-block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px max-h-96 h-[70vh] w-52 overflow-y-auto shadow-2xl mt-12"
      >
        <div className="grid grid-cols-1 gap-3 p-3">
          {themes.map((t) => (
            <div
              key={t}
              className={`outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 ${
                t === theme ? "outline" : ""
              }`}
              onClick={() => setTheme(t)}
            >
              <div
                data-theme={t}
                className="bg-base-100 text-base-content w-full cursor-pointer font-sans"
              >
                <div className="grid grid-cols-5 grid-rows-3">
                  <div className="col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4">
                    <div className="flex-grow text-sm font-bold">{t}</div>
                    <div className="flex flex-shrink-0 flex-wrap gap-1">
                      <div className="bg-primary w-2 rounded"></div>
                      <div className="bg-secondary w-2 rounded"></div>
                      <div className="bg-accent w-2 rounded"></div>
                      <div className="bg-neutral w-2 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// This is the inner component that uses the language context and theme context
const HeaderContent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    fetch("api/auth/session")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch session");
        return response.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Failed to fetch session", error);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-base-100 shadow fixed w-full z-50 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src={hinh}
                alt="Logo"
                width={150}
                height={100}
                className="h-auto w-auto max-h-12 md:max-h-16 animate-borderrun rounded-full"
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-base-content hover:bg-base-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/"
              className="text-base-content hover:text-primary font-medium"
            >
              {t("home")}
            </Link>
            <Link
              href="/ShowIntro"
              className="text-base-content hover:text-primary font-medium"
            >
              {t("about")}
            </Link>
            <Link
              href="/ShowBlog"
              className="text-base-content hover:text-primary font-medium"
            >
              {t("blog")}
            </Link>
            <Link
              href="/ShowContact"
              className="text-base-content hover:text-primary font-medium"
            >
              {t("contact")}
            </Link>
          </nav>

          {/* Auth buttons, Theme Switcher and Language Switcher */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/Login" className="btn btn-outline btn-primary">
              {t("login")}
            </Link>
            <Link href="/Register" className="btn btn-outline btn-secondary">
              {t("register")}
            </Link>
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-base-100">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-base-content hover:text-primary hover:bg-base-200"
            >
              {t("home")}
            </Link>
            <Link
              href="/ShowIntro"
              className="block px-3 py-2 rounded-md text-base font-medium text-base-content hover:text-primary hover:bg-base-200"
            >
              {t("about")}
            </Link>
            <Link
              href="/ShowBlog"
              className="block px-3 py-2 rounded-md text-base font-medium text-base-content hover:text-primary hover:bg-base-200"
            >
              {t("blog")}
            </Link>
            <Link
              href="/ShowContact"
              className="block px-3 py-2 rounded-md text-base font-medium text-base-content hover:text-primary hover:bg-base-200"
            >
              {t("contact")}
            </Link>
            <div className="pt-4 flex flex-col space-y-2">
              <Link
                href="/Login"
                className="btn btn-outline btn-primary w-full"
              >
                {t("login")}
              </Link>
              <Link
                href="/Register"
                className="btn btn-outline btn-secondary w-full"
              >
                {t("register")}
              </Link>
              <div className="mt-2">
                <ThemeSwitcher />
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// The wrapper component that provides both the language context and theme context
const Header = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HeaderContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Header;
