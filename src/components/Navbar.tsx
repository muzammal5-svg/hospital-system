"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "./Providers";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { Activity, Tv, ArrowRight, Menu, X, Shield } from "lucide-react";

export function Navbar() {
  const { t, lang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050505]/90 backdrop-blur-md border-b border-white/10 shadow-lg"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-300 flex items-center justify-center text-black font-bold shadow-glow-teal group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <span className="font-display font-extrabold text-lg tracking-tight text-white block leading-tight">
              {t.hospitalName}
            </span>
            <span className="text-[11px] font-medium text-teal-400 tracking-wider uppercase block">
              {t.city}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#features"
            className="text-sm font-medium text-[#EDE8E0]/80 hover:text-white transition-colors"
          >
            {t.navFeatures}
          </Link>
          <Link
            href="/#departments"
            className="text-sm font-medium text-[#EDE8E0]/80 hover:text-white transition-colors"
          >
            {t.navDepartments}
          </Link>
          <Link
            href="/#doctors"
            className="text-sm font-medium text-[#EDE8E0]/80 hover:text-white transition-colors"
          >
            {t.navDoctors}
          </Link>
          <Link
            href="/appointments"
            className="text-sm font-medium text-[#EDE8E0]/80 hover:text-white transition-colors"
          >
            {t.navBookAppointment}
          </Link>
          <Link
            href="/display"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors"
          >
            <Tv className="w-4 h-4" />
            <span>{t.navLiveTvQueue}</span>
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          <LanguageToggle className="border-white/10 text-white hover:bg-white/10" />
          <ThemeToggle className="border-white/10 text-white hover:bg-white/10" />

          <Link
            href="/login"
            className="btn-pill bg-[#EDE8E0] hover:bg-white text-[#050505] text-xs font-bold tracking-wider uppercase gap-2 transition-all hover:shadow-glow-bone"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{t.navStaffLogin}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageToggle className="border-white/10 text-white hover:bg-white/10" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b border-white/10 px-6 py-6 space-y-4">
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#EDE8E0] hover:text-white"
          >
            {t.navFeatures}
          </Link>
          <Link
            href="/#departments"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#EDE8E0] hover:text-white"
          >
            {t.navDepartments}
          </Link>
          <Link
            href="/#doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#EDE8E0] hover:text-white"
          >
            {t.navDoctors}
          </Link>
          <Link
            href="/appointments"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-teal-400 hover:text-teal-300"
          >
            {t.navBookAppointment}
          </Link>
          <Link
            href="/display"
            target="_blank"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-base font-medium text-teal-400"
          >
            <Tv className="w-4 h-4" />
            <span>{t.navLiveTvQueue}</span>
          </Link>
          <div className="pt-4 border-t border-white/10">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-pill w-full bg-teal-500 hover:bg-teal-400 text-black text-center font-bold tracking-wider uppercase text-xs"
            >
              {t.navStaffLogin}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
