"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "./Providers";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { Phone, Clock, Mail, Calendar, Shield, Menu, X, Tv } from "lucide-react";

export function Navbar() {
  const { t } = useLanguage();
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
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#162638] shadow-sm">
      {/* 1. Thin Navy Top Info Bar */}
      <div className="bg-[#0B3A66] text-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-[#0B4F8A]/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Contact Details */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-slate-200">
            <a
              href="tel:+924235789999"
              className="flex items-center gap-1.5 hover:text-white transition-colors font-medium text-amber-300"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Emergency: +92 42 3578 9999</span>
            </a>
            <span className="hidden sm:inline text-slate-400">|</span>
            <a
              href="mailto:info@naseemijazhospital.pk"
              className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-slate-300" />
              <span>info@naseemijazhospital.pk</span>
            </a>
            <span className="hidden md:inline text-slate-400">|</span>
            <div className="flex items-center gap-1.5 text-slate-200">
              <Clock className="w-3.5 h-3.5 text-teal-300" />
              <span>OPD: Mon - Sat (9:00 AM - 9:00 PM)</span>
            </div>
          </div>

          {/* Right: Controls & TV Queue Shortcut */}
          <div className="flex items-center gap-3">
            <Link
              href="/display"
              target="_blank"
              className="hidden lg:flex items-center gap-1.5 text-xs text-teal-300 hover:text-white font-medium transition-colors"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Live TV Queue</span>
            </Link>
            <span className="hidden lg:inline text-slate-400">|</span>
            <LanguageToggle className="border-white/20 text-white hover:bg-white/10 text-xs py-1 px-2.5" />
            <ThemeToggle className="border-white/20 text-white hover:bg-white/10 w-7 h-7" />
          </div>
        </div>
      </div>

      {/* 2. Main White Sticky Navbar */}
      <div
        className={`transition-all duration-200 border-b border-[#E3E9EF] dark:border-[#23374D] ${
          scrolled ? "py-2.5 shadow-sm" : "py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Hospital Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-44 sm:w-56 h-10">
              <Image
                src="/images/logo.svg"
                alt="Naseem Ijaz Hospital Logo"
                fill
                priority
                className="object-contain object-left dark:hidden"
              />
              <Image
                src="/images/logo-white.svg"
                alt="Naseem Ijaz Hospital Logo"
                fill
                priority
                className="object-contain object-left hidden dark:block"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              href="/"
              className="text-sm font-semibold text-[#1B2733] dark:text-[#E6EEF5] hover:text-[#0B4F8A] dark:hover:text-[#64B5F6] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#about"
              className="text-sm font-medium text-[#5B6B7B] dark:text-[#94A7BA] hover:text-[#0B4F8A] dark:hover:text-[#64B5F6] transition-colors"
            >
              About
            </Link>
            <Link
              href="/#departments"
              className="text-sm font-medium text-[#5B6B7B] dark:text-[#94A7BA] hover:text-[#0B4F8A] dark:hover:text-[#64B5F6] transition-colors"
            >
              Departments
            </Link>
            <Link
              href="/#doctors"
              className="text-sm font-medium text-[#5B6B7B] dark:text-[#94A7BA] hover:text-[#0B4F8A] dark:hover:text-[#64B5F6] transition-colors"
            >
              Doctors
            </Link>
            <Link
              href="/appointments"
              className="text-sm font-medium text-[#5B6B7B] dark:text-[#94A7BA] hover:text-[#0B4F8A] dark:hover:text-[#64B5F6] transition-colors"
            >
              Appointments
            </Link>
            <Link
              href="/#contact"
              className="text-sm font-medium text-[#5B6B7B] dark:text-[#94A7BA] hover:text-[#0B4F8A] dark:hover:text-[#64B5F6] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTA Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/appointments"
              className="btn-teal text-sm py-2 px-4 shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>

            <Link
              href="/login"
              className="btn-secondary text-sm py-2 px-4"
            >
              <Shield className="w-4 h-4 text-[#0B4F8A]" />
              <span>Staff Login</span>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1B2733] dark:text-white hover:bg-[#F6F9FC] dark:hover:bg-[#1E3147] border border-[#E3E9EF] dark:border-[#23374D]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#162638] border-b border-[#E3E9EF] dark:border-[#23374D] px-6 py-5 space-y-4 shadow-lg animate-in fade-in">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-[#1B2733] dark:text-white hover:text-[#0B4F8A]"
          >
            Home
          </Link>
          <Link
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#5B6B7B] dark:text-[#94A7BA] hover:text-[#0B4F8A]"
          >
            About
          </Link>
          <Link
            href="/#departments"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#5B6B7B] dark:text-[#94A7BA] hover:text-[#0B4F8A]"
          >
            Departments
          </Link>
          <Link
            href="/#doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#5B6B7B] dark:text-[#94A7BA] hover:text-[#0B4F8A]"
          >
            Doctors
          </Link>
          <Link
            href="/appointments"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#5B6B7B] dark:text-[#94A7BA] hover:text-[#0B4F8A]"
          >
            Appointments
          </Link>
          <Link
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#5B6B7B] dark:text-[#94A7BA] hover:text-[#0B4F8A]"
          >
            Contact
          </Link>
          <Link
            href="/display"
            target="_blank"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-base font-medium text-[#1E9E8F]"
          >
            <Tv className="w-4 h-4" />
            <span>Live TV Display</span>
          </Link>

          <div className="pt-4 border-t border-[#E3E9EF] dark:border-[#23374D] flex flex-col gap-2.5">
            <Link
              href="/appointments"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-teal text-center w-full justify-center"
            >
              Book Appointment
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-secondary text-center w-full justify-center"
            >
              Staff Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
