"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "./Providers";
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0B3A66] text-white pt-16 pb-10 border-t border-[#092E52]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Logo & About */}
          <div className="space-y-4">
            <div className="relative w-56 h-11">
              <Image
                src="/images/logo-white.svg"
                alt="Naseem Ijaz Hospital"
                fill
                loading="lazy"
                className="object-contain object-left"
              />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Naseem Ijaz Hospital is a premier private healthcare center in Lahore, committed to compassionate patient care, expert clinical consultations, diagnostic accuracy, and 24/7 emergency response.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600/20 border border-red-400/30 text-amber-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span>24/7 Emergency & Ambulance Active</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 font-heading">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  About Our Hospital
                </Link>
              </li>
              <li>
                <Link href="/#departments" className="hover:text-white transition-colors">
                  Clinical Departments
                </Link>
              </li>
              <li>
                <Link href="/#doctors" className="hover:text-white transition-colors">
                  Consultant Directory
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="hover:text-white transition-colors">
                  Book Doctor Appointment
                </Link>
              </li>
              <li>
                <Link href="/display" target="_blank" className="hover:text-white transition-colors">
                  Waiting Room TV Display
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Staff Login Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Clinical Departments */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 font-heading">
              Clinical Departments
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/#departments" className="hover:text-white transition-colors">
                  Cardiology & Heart Care
                </Link>
              </li>
              <li>
                <Link href="/#departments" className="hover:text-white transition-colors">
                  Orthopedics & Spine Center
                </Link>
              </li>
              <li>
                <Link href="/#departments" className="hover:text-white transition-colors">
                  Pediatrics & Neonatology
                </Link>
              </li>
              <li>
                <Link href="/#departments" className="hover:text-white transition-colors">
                  Gynecology & Obstetrics
                </Link>
              </li>
              <li>
                <Link href="/#departments" className="hover:text-white transition-colors">
                  Internal Medicine & Diabetes
                </Link>
              </li>
              <li>
                <Link href="/#departments" className="hover:text-white transition-colors">
                  General & Laparoscopic Surgery
                </Link>
              </li>
              <li>
                <Link href="/#departments" className="hover:text-white transition-colors">
                  Neurology & Neurosciences
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & OPD Timings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 font-heading">
              Contact & Timings
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                <span>Plot 14-B, Medical Enclave, Jail Road, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-300 shrink-0" />
                <span>Helpline: +92 42 3578 9000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-amber-300 font-medium">ER: +92 42 3578 9999</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-300 shrink-0" />
                <span>info@naseemijazhospital.pk</span>
              </li>
              <li className="flex items-start gap-2.5 pt-1 border-t border-white/10">
                <Clock className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">OPD Timings</div>
                  <div className="text-[11px] text-slate-300">Monday - Saturday: 9:00 AM - 9:00 PM</div>
                  <div className="text-[11px] text-slate-400">Emergency & Pharmacy: 24/7 Open</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-300 gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-300" />
            <span>
              &copy; {new Date().getFullYear()} Naseem Ijaz Hospital. Registered with Punjab Healthcare Commission (PHC).
            </span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <span className="hover:text-white transition-colors cursor-pointer">Patient Rights</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Notice</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
