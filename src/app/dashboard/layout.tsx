"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/Providers";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandPalette } from "@/components/CommandPalette";
import {
  LayoutDashboard,
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
  Bell,
  ChevronRight,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const role = (session?.user as any)?.role || "RECEPTIONIST";
  const userName = session?.user?.name || "Staff Member";
  const userEmail = session?.user?.email || "";

  // Grouped Menu Structure
  const menuGroups = [
    {
      group: "Clinical & OPD",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          roles: ["ADMIN", "RECEPTIONIST", "DOCTOR", "ACCOUNTANT"],
          exact: true,
        },
        {
          label: "Reception",
          href: "/dashboard/reception",
          icon: UserPlus,
          shortcut: "F2 / F4",
          roles: ["ADMIN", "RECEPTIONIST"],
        },
        {
          label: "Patients",
          href: "/dashboard/patients",
          icon: Users,
          shortcut: "F3",
          roles: ["ADMIN", "RECEPTIONIST", "DOCTOR", "ACCOUNTANT"],
        },
        {
          label: "Appointments",
          href: "/dashboard/appointments",
          icon: Calendar,
          roles: ["ADMIN", "RECEPTIONIST", "DOCTOR"],
        },
        {
          label: "Live Queue",
          href: "/dashboard/queue",
          icon: Tv,
          roles: ["ADMIN", "RECEPTIONIST", "DOCTOR"],
        },
        {
          label: "Doctor Panel",
          href: "/dashboard/doctor",
          icon: Stethoscope,
          roles: ["ADMIN", "DOCTOR"],
        },
      ],
    },
    {
      group: "Administration",
      items: [
        {
          label: "Billing & Cash",
          href: "/dashboard/billing",
          icon: FileText,
          roles: ["ADMIN", "RECEPTIONIST", "ACCOUNTANT"],
        },
        {
          label: "Reports",
          href: "/dashboard/reports",
          icon: BarChart3,
          roles: ["ADMIN", "ACCOUNTANT"],
        },
        {
          label: "Settings",
          href: "/dashboard/settings",
          icon: Settings,
          roles: ["ADMIN"],
        },
      ],
    },
  ];

  const currentDateStr = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Calculate current page title for breadcrumb
  let pageTitle = "Dashboard";
  if (pathname === "/dashboard/reception") pageTitle = "Reception Intake";
  else if (pathname === "/dashboard/patients") pageTitle = "Patients Directory";
  else if (pathname === "/dashboard/appointments") pageTitle = "Appointments";
  else if (pathname === "/dashboard/queue") pageTitle = "Live OPD Queue";
  else if (pathname === "/dashboard/doctor") pageTitle = "Doctor Consultation Panel";
  else if (pathname === "/dashboard/billing") pageTitle = "Billing & Cash Closing";
  else if (pathname === "/dashboard/reports") pageTitle = "Reports & Analytics";
  else if (pathname === "/dashboard/settings") pageTitle = "Hospital Settings";

  return (
    <div className="min-h-screen bg-[#F6F9FC] dark:bg-[#0F1B2A] text-[#1B2733] dark:text-[#E6EEF5] flex flex-col md:flex-row">
      <CommandPalette />

      {/* Mobile Top App Bar */}
      <div className="md:hidden h-16 bg-[#0B3A66] text-white px-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="relative w-36 h-8">
            <Image
              src="/images/logo-white.svg"
              alt="Naseem Ijaz Hospital"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageToggle className="border-white/20 text-white" />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-white hover:bg-white/10"
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 1. Left Sidebar: Solid Navy #0B3A66, 240px */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 z-50 ${
          collapsed ? "w-20" : "w-60"
        } bg-[#0B3A66] text-white flex flex-col justify-between transition-all duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } border-r border-[#082C4D]`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo & Header */}
          <div className="h-16 px-4 border-b border-[#0E4980] flex items-center justify-between">
            {!collapsed ? (
              <Link href="/dashboard" className="relative w-44 h-8 block">
                <Image
                  src="/images/logo-white.svg"
                  alt="Naseem Ijaz Hospital"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </Link>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#1E9E8F] flex items-center justify-center font-bold text-white text-xs mx-auto">
                NIH
              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Grouped Nav Items */}
          <nav className="p-3 space-y-6 flex-1">
            {menuGroups.map((grp) => {
              const visibleItems = grp.items.filter((it) => it.roles.includes(role));
              if (visibleItems.length === 0) return null;

              return (
                <div key={grp.group} className="space-y-1">
                  {!collapsed && (
                    <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-teal-300/80 mb-1.5 font-heading">
                      {grp.group}
                    </div>
                  )}

                  {visibleItems.map((item) => {
                    const active = item.exact
                      ? pathname === item.href
                      : pathname === item.href || (pathname ? pathname.startsWith(item.href + "/") : false);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                          active
                            ? "bg-[#14538F] text-white border-l-[3px] border-[#1E9E8F] font-semibold"
                            : "text-slate-200 hover:bg-[#0E4980] hover:text-white"
                        }`}
                        title={collapsed ? item.label : undefined}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              active ? "text-[#1E9E8F]" : "text-slate-300 group-hover:text-white"
                            }`}
                          />
                          {!collapsed && <span>{item.label}</span>}
                        </div>

                        {!collapsed && item.shortcut && !active && (
                          <span className="text-[10px] font-mono text-slate-300 bg-black/20 px-1.5 py-0.5 rounded">
                            {item.shortcut}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </nav>

          {/* TV Display Link shortcut */}
          <div className="p-3 border-t border-[#0E4980]">
            <Link
              href="/display"
              target="_blank"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#1E9E8F]/20 hover:bg-[#1E9E8F]/30 text-teal-300 transition-colors"
            >
              <Tv className="w-4 h-4 text-teal-300 shrink-0" />
              {!collapsed && <span>Live TV Board</span>}
            </Link>
          </div>
        </div>

        {/* User Card at Bottom */}
        <div className="p-3 border-t border-[#0E4980] bg-[#092E52]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#1E9E8F] text-white font-bold text-xs flex items-center justify-center shrink-0">
                {userName.charAt(0)}
              </div>
              {!collapsed && (
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate leading-tight">
                    {userName}
                  </div>
                  <div className="text-[10px] text-teal-300 uppercase tracking-wider font-mono font-medium">
                    {role}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-1.5 rounded-md text-slate-300 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Workspace */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Bar (White, 64px, bottom border) */}
        <header className="hidden md:flex h-16 bg-white dark:bg-[#162638] border-b border-[#E3E9EF] dark:border-[#23374D] px-6 items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          {/* Breadcrumb & Title */}
          <div className="flex items-center gap-2.5 text-xs">
            <span className="font-medium text-[#5B6B7B] dark:text-[#94A7BA]">
              Naseem Ijaz Hospital
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#8A97A5]" />
            <h1 className="text-sm font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading">
              {pageTitle}
            </h1>
          </div>

          {/* Center Search (Ctrl+K) */}
          <div className="w-80">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] text-xs text-[#5B6B7B] dark:text-[#94A7BA] hover:border-[#0B4F8A] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#0B4F8A] dark:text-[#64B5F6]" />
                <span>Search patients, doctors...</span>
              </div>
              <span className="font-mono text-[10px] bg-white dark:bg-[#162638] border border-[#E3E9EF] dark:border-[#23374D] px-1.5 py-0.5 rounded text-[#5B6B7B] dark:text-[#94A7BA]">
                Ctrl+K
              </span>
            </button>
          </div>

          {/* Right Controls: Today Date, Bell, Language, Theme */}
          <div className="flex items-center gap-4 text-xs">
            <div className="text-[#5B6B7B] dark:text-[#94A7BA] font-medium hidden lg:block">
              {currentDateStr}
            </div>

            <div className="h-4 w-px bg-[#E3E9EF] dark:bg-[#23374D] hidden lg:block" />

            <LanguageToggle className="border-[#E3E9EF] dark:border-[#23374D]" />
            <ThemeToggle className="border-[#E3E9EF] dark:border-[#23374D]" />
          </div>
        </header>

        {/* Content Area: #F6F9FC with 24px padding */}
        <main className="flex-1 p-6 bg-[#F6F9FC] dark:bg-[#0F1B2A]">
          {children}
        </main>
      </div>
    </div>
  );
}
