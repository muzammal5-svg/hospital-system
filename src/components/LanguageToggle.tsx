"use client";

import React from "react";
import { useLanguage } from "./Providers";
import { Languages } from "lucide-react";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "ur" : "en")}
      type="button"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 ${className}`}
      title="Toggle Language (English / اردو)"
    >
      <Languages className="w-3.5 h-3.5 text-teal-500" />
      <span>{lang === "en" ? "اردو" : "English"}</span>
    </button>
  );
}
