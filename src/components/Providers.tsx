"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Language, translations } from "@/lib/i18n";
import { useRouter } from "next/navigation";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
  isRTL: false,
});

export const useLanguage = () => useContext(LanguageContext);

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const router = useRouter();

  useEffect(() => {
    // Check saved language
    const savedLang = localStorage.getItem("nih_lang") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "ur")) {
      setLangState(savedLang);
    }

    // Check saved theme - default to light
    const savedTheme = localStorage.getItem("nih_theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("nih_lang", newLang);
    document.documentElement.setAttribute("dir", newLang === "ur" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", newLang);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("nih_theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  // Global Keyboard shortcuts (F2, F3, F4, Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in input unless it's a dedicated function key
      if (e.key === "F2") {
        e.preventDefault();
        router.push("/dashboard/reception?action=new-patient");
      } else if (e.key === "F3") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-command-palette"));
      } else if (e.key === "F4") {
        e.preventDefault();
        router.push("/dashboard/reception?action=new-visit");
      } else if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-command-palette"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const isRTL = lang === "ur";
  const t = translations[lang] || translations.en;

  return (
    <SessionProvider>
      <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <div className={isRTL ? "font-urdu" : "font-sans"} dir={isRTL ? "rtl" : "ltr"}>
            {children}
          </div>
        </ThemeContext.Provider>
      </LanguageContext.Provider>
    </SessionProvider>
  );
}
