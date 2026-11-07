"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "./Providers";
import { Activity, MapPin, Phone, Mail, Clock, Heart } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#050505] text-[#EDE8E0] border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-black font-bold">
                <Activity className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
              <span className="font-display font-extrabold text-lg text-white">
                {t.hospitalName}
              </span>
            </div>
            <p className="text-xs text-[#9A958C] leading-relaxed">
              {t.tagline}. Providing round-the-clock emergency, outpatient, and inpatient surgical services with modern digital clinical systems.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Emergency Services: Open 24/7</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-[#9A958C]">
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  OPD Digital Features
                </Link>
              </li>
              <li>
                <Link href="/#departments" className="hover:text-white transition-colors">
                  Clinical Departments
                </Link>
              </li>
              <li>
                <Link href="/#doctors" className="hover:text-white transition-colors">
                  Consultants & Specialists
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="hover:text-white transition-colors">
                  Book Online Appointment
                </Link>
              </li>
              <li>
                <Link href="/display" target="_blank" className="hover:text-white transition-colors">
                  Live Waiting TV Display
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Lahore Facility Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Hospital Location</h4>
            <ul className="space-y-2.5 text-xs text-[#9A958C]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Plot 14-B, Medical Enclave, Jail Road, Lahore, Punjab, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>UAN: +92 42 3578 9000</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <span>ER Hotline: +92 42 3578 9999</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>info@naseemijazhospital.pk</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Staff Gateway */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Hospital Staff Portal</h4>
            <p className="text-xs text-[#9A958C]">
              Authorized clinical, administrative, and cashier personnel access only.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-semibold hover:bg-teal-500/20 transition-all"
            >
              <span>Access Staff Console</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5C5852] gap-4">
          <p>© {new Date().getFullYear()} Naseem Ijaz Hospital. All rights reserved. Registered with Punjab Healthcare Commission (PHC).</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#9A958C] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#9A958C] cursor-pointer">Patient Terms & Conditions</span>
            <span className="hover:text-[#9A958C] cursor-pointer">Billing & Refunds Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
