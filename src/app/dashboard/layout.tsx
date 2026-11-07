"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/Providers";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandPalette } from "@/components/CommandPalette";
import {
  Activity,
  Users,
  UserPlus,
  Calendar,
  Tv,
  Stethoscope,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
  Shield,
  HelpCircle,
  Bell,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = (session?.user as any)?.role || "RECEPTIONIST";
  const userName = session?.user?.name || "Staff Member";

  const navItems = [
    {
      label: "Reception Intake",
      href: "/dashboard/reception",
      icon: UserPlus,
      shortcut: "F2 / F4",
      roles: ["ADMIN", "RECEPTIONIST"],
    },
    {
      label: "Patients Directory",
      href: "/dashboard/patients",
      icon: Users,
      roles: ["ADMIN", "RECEPTIONIST", "DOCTOR", "ACCOUNTANT"],
    },
    {
      label: "Appointments",
      href: "/dashboard/appointments",
      icon: Calendar,
      roles: ["ADMIN", "RECEPTIONIST", "DOCTOR"],
    },
    {
      label: "Live OPD Queue",
      href: "/dashboard/queue",
      icon: Tv,
      roles: ["ADMIN", "RECEPTIONIST", "DOCTOR"],
    },
    {
      label: "Doctor Console",
      href: "/dashboard/doctor",
      icon: Stethoscope,
      roles: ["ADMIN", "DOCTOR"],
    },
    {
      label: "Billing & Cash",
      href: "/dashboard/billing",
      icon: FileText,
      roles: ["ADMIN", "RECEPTIONIST", "ACCOUNTANT"],
    },
    {
      label: "Reports & KPIs",
      href: "/dashboard/reports",
      icon: BarChart3,
      roles: ["ADMIN", "ACCOUNTANT"],
    },
    {
      label: "Hospital Settings",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["ADMIN"],
    },
  ];

  const visibleNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-[#F4F8FA] dark:bg-[#050505] text-[#0B1B26] dark:text-[#EDE8E0] flex flex-col md:flex-row transition-colors">
      <CommandPalette />

      {/* Mobile Header Bar */}
      <div className="md:hidden h-16 bg-white dark:bg-[#0B0F14] border-b border-neutral-200 dark:border-white/10 px-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-black font-bold">
            <Activity className="w-5 h-5 text-black" />
          </div>
          <span className="font-display font-bold text-sm">Naseem Ijaz Hospital</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Sidebar */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#0B0F14] border-r border-neutral-200 dark:border-white/10 flex flex-col justify-between transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="h-20 px-6 border-b border-neutral-200 dark:border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-black font-bold shadow-glow-teal">
              <Activity className="w-6 h-6 text-black stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display font-bold text-sm block leading-tight text-neutral-900 dark:text-white">
                Naseem Ijaz Hospital
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider block">
                {role} Console
              </span>
            </div>
          </div>

          {/* Quick Search Shortcut Bar */}
          <div className="p-4 border-b border-neutral-200 dark:border-white/10">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-teal-500" />
                <span>Quick Search...</span>
              </div>
              <span className="font-mono text-[10px] bg-neutral-200 dark:bg-white/10 px-1.5 py-0.5 rounded">
                Ctrl+K
              </span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {visibleNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-teal-500 text-black shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? "text-black" : "text-teal-500"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.shortcut && !active && (
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-200 dark:bg-white/10 px-1 py-0.5 rounded">
                      {item.shortcut}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Sign Out Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center">
                {userName.charAt(0)}
              </div>
              <div className="text-left">
                <span className="font-bold text-xs block text-neutral-900 dark:text-white truncate max-w-[120px]">
                  {userName}
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-mono">
                  {role}
                </span>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
            <Link href="/display" target="_blank" className="hover:text-teal-500 flex items-center gap-1 font-semibold">
              <Tv className="w-3.5 h-3.5" />
              <span>TV Queue</span>
            </Link>
            <div className="flex items-center gap-1.5">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Desktop App Bar */}
        <header className="hidden md:flex h-16 bg-white dark:bg-[#0B0F14] border-b border-neutral-200 dark:border-white/10 px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Reception & Patient Management System • Lahore
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/display"
              target="_blank"
              className="btn-pill bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs font-bold gap-2 py-1.5 px-3"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Open TV Display</span>
            </Link>

            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
