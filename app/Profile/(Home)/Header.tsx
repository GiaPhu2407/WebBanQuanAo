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

  // Add proper index signature to the type
  interface ThemeColorMap {
    [key: string]: string[];
  }

  // Theme-specific color configurations for the dots
  const themeColors: ThemeColorMap = {
    light: ["#2563eb", "#9333ea", "#16a34a", "#000000"],
    dark: ["#38bdf8", "#818cf8", "#fb7185", "#ffffff"],
    cupcake: ["#65c3c8", "#ef9fbc", "#eeaf3a", "#291334"],
    bumblebee: ["#e0a82e", "#181830", "#f9d72f", "#000000"],
    emerald: ["#66cc8a", "#377cfb", "#f49e0b", "#333333"],
    corporate: ["#4b6bfb", "#7b92b2", "#3abff8", "#282828"],
    synthwave: ["#e779c1", "#58c7f3", "#f3cc30", "#d8a0df"],
    retro: ["#ef9995", "#2cb67d", "#7d5ba6", "#16161a"],
    cyberpunk: ["#ff7598", "#75d1f0", "#ffea00", "#301934"],
    valentine: ["#e96d7b", "#a991f7", "#85d3f2", "#1f2937"],
    halloween: ["#f28c18", "#6d3a9c", "#51a800", "#000000"],
    garden: ["#5c7f67", "#ecf4e7", "#e5d9b6", "#285e61"],
    forest: ["#1eb854", "#1fd65f", "#d27444", "#171212"],
    // Additional theme colors
    aqua: ["#09ecf3", "#0c9ebb", "#59c4d4", "#111827"],
    lofi: ["#808080", "#c0c0c0", "#d9d9d9", "#1f2937"],
    pastel: ["#d1c1d7", "#f2cdcd", "#c9e4de", "#1f2937"],
    fantasy: ["#6e0b75", "#007552", "#8c7851", "#191d24"],
    wireframe: ["#b8b8b8", "#d1d1d1", "#e9e9e9", "#333333"],
    black: ["#333333", "#555555", "#777777", "#000000"],
    luxury: ["#917543", "#cda583", "#372f3c", "#000000"],
    dracula: ["#ff79c6", "#bd93f9", "#8be9fd", "#282a36"],
    cmyk: ["#00bcd4", "#ec407a", "#ffeb3b", "#111111"],
    autumn: ["#d58c32", "#a15c38", "#4e6e4e", "#1f2937"],
    business: ["#1c4f82", "#2d7ecb", "#94b9ed", "#f5f7fa"],
    acid: ["#00ff9d", "#ff7600", "#c1ff00", "#101010"],
    lemonade: ["#519903", "#e2d96e", "#f5f5f5", "#311402"],
    night: ["#3a60bf", "#7084cc", "#c3d7ff", "#05031a"],
    coffee: ["#6e4a2c", "#93725e", "#e1bc8e", "#20120c"],
    winter: ["#0f6cbd", "#88abda", "#d6e8ff", "#ffffff"],
  };

  // Default colors if theme isn't specifically defined
  const defaultColors = ["#3b82f6", "#ec4899", "#22c55e", "#6b7280"];

  // Function to get theme-specific colors
  const getThemeColors = (themeName: string) => {
    return themeColors[themeName] || defaultColors;
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-sm bg-base-300 rounded-md border-none h-8 min-h-8 w-10"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
          </div>
          <svg
            width="10"
            height="10"
            className="fill-current opacity-60"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048"
          >
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
          </svg>
        </div>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content bg-base-200 text-base-content rounded-box top-px max-h-96 h-[70vh] w-64 overflow-y-auto shadow-2xl mt-4"
      >
        <div className="p-3">
          <h3 className="font-bold text-lg mb-2">Theme</h3>
          <div className="grid grid-cols-1 gap-2">
            {themes.map((t) => {
              const colors = getThemeColors(t);
              return (
                <div
                  key={t}
                  className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-base-300 ${
                    t === theme ? "bg-base-300" : ""
                  }`}
                  onClick={() => setTheme(t)}
                >
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 rounded-md border border-base-content/20 overflow-hidden bg-neutral-900">
                      <div className="grid grid-cols-2 grid-rows-2 gap-0 h-full">
                        <div style={{ backgroundColor: colors[0] }}></div>
                        <div style={{ backgroundColor: colors[1] }}></div>
                        <div style={{ backgroundColor: colors[2] }}></div>
                        <div style={{ backgroundColor: colors[3] }}></div>
                      </div>
                    </div>
                  </div>
                  <span className="ml-3 text-sm">{t}</span>
                  {t === theme && (
                    <span className="ml-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
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
