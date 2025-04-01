// components/Header.tsx
"use client";

import Link from "next/link";

import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "./LanguageContext";

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="bg-amber-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        {/* Social Media Icons */}
        <a href="#" className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18.5 2h-13c-1.93 0-3.5 1.57-3.5 3.5v13c0 1.93 1.57 3.5 3.5 3.5h13c1.93 0 3.5-1.57 3.5-3.5v-13c0-1.93-1.57-3.5-3.5-3.5zm-2.5 5h-2c-.83 0-1 .17-1 1v1.5h3l-.5 3h-2.5v7h-3v-7h-1.5v-3h1.5v-2.5c0-1.67.83-2.5 2.5-2.5h3.5v2.5z" />
          </svg>
        </a>
        <a href="#" className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm5.2 7h-2.1c-.2-.8-.5-1.5-.8-2.2.8.5 1.6 1.3 2.1 2.2zm-5.2-3.1c.5.7.9 1.6 1.2 2.7h-2.4c.3-1.1.7-2 1.2-2.7zm-4.3.9c-.3.7-.6 1.4-.8 2.2h-2.1c.5-.9 1.3-1.7 2.1-2.2zm-3.1 3.1h2.6c-.1.5-.1 1-.1 1.5 0 .5 0 1 .1 1.5h-2.6c-.1-.5-.2-1-.2-1.5s.1-1 .2-1.5zm1.1 3.9h2c.2.9.5 1.6.9 2.3-.8-.6-1.6-1.4-2.1-2.3zm4.3 3.2c-.5-.7-.9-1.5-1.2-2.3h2.4c-.3.8-.7 1.6-1.2 2.3zm1.2-3.2h-2.4c-.1-.5-.2-1-.2-1.5s.1-1 .2-1.5h2.4c.1.5.2 1 .2 1.5s-.1 1-.2 1.5zm.4 3c.3-.7.6-1.4.9-2.3h2c-.5.9-1.3 1.7-2.1 2.3zm1.3-3.9c.1-.5.1-1 .1-1.5s0-1-.1-1.5h2.6c.1.5.2 1 .2 1.5s-.1 1-.2 1.5h-2.6z" />
          </svg>
        </a>
        <a href="#" className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05-.78-.83-1.89-1.36-3.12-1.36-2.36 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.71-1.89-8.82-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.13.15-.27 0-.54-.03-.8-.08.54 1.69 2.12 2.95 4 2.98-1.46 1.16-3.31 1.84-5.33 1.84-.35 0-.7-.02-1.04-.06 1.9 1.22 4.16 1.93 6.58 1.93 7.88 0 12.2-6.54 12.2-12.23 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
          </svg>
        </a>
        <a href="#" className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20 4h-16c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2zm0 4l-8 5-8-5v-2l8 5 8-5v2z" />
          </svg>
        </a>
      </div>

      <div className="text-center text-xl font-bold">
        {t("parmglasn.living")}
      </div>

      <div className="flex items-center">
        <LanguageSwitcher />
      </div>
    </header>
  );
}
