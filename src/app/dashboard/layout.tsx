'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/Providers';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CommandPalette } from '@/components/CommandPalette';
import { ToastProvider } from '@/components/ui-app/Toast';
import { Tooltip } from '@/components/ui-app/Tooltip';
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
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Clock,
  CalendarPlus,
  CreditCard,
  Building2,
  ExternalLink,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  roles: string[];
  exact?: boolean;
  shortcut?: string;
  badge?: number | string;
}

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
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [waitingCount, setWaitingCount] = useState<number>(0);
  const [timeString, setTimeString] = useState<string>('');

  // Persist sidebar state
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nih_sidebar_collapsed');
      if (saved !== null) {
        setCollapsed(saved === 'true');
      }
    } catch (e) {}
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem('nih_sidebar_collapsed', String(next));
    } catch (e) {}
  };

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Fetch waiting count for Live Queue badge
  useEffect(() => {
    const fetchQueueCount = async () => {
      try {
        const res = await fetch('/api/queue');
        if (res.ok) {
          const data = await res.json();
          const waiting = (data.waiting || []).length;
          setWaitingCount(waiting);
        }
      } catch (e) {}
    };
    fetchQueueCount();
    const interval = setInterval(fetchQueueCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const role = (session?.user as any)?.role || 'RECEPTIONIST';
  const userName = session?.user?.name || 'Staff Member';
  const userEmail = session?.user?.email || '';

  // 4 Grouped Sections: MAIN, CLINICAL, FINANCE, ADMIN
  const menuGroups: { group: string; items: NavItem[] }[] = [
    {
      group: 'MAIN',
      items: [
        {
          label: 'Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard,
          roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'ACCOUNTANT'],
          exact: true,
        },
      ],
    },
    {
      group: 'CLINICAL',
      items: [
        {
          label: 'Reception Intake',
          href: '/dashboard/reception',
          icon: UserPlus,
          shortcut: 'F2',
          roles: ['ADMIN', 'RECEPTIONIST'],
        },
        {
          label: 'Patients',
          href: '/dashboard/patients',
          icon: Users,
          shortcut: 'F3',
          roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'ACCOUNTANT'],
        },
        {
          label: 'Appointments',
          href: '/dashboard/appointments',
          icon: Calendar,
          roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR'],
        },
        {
          label: 'Live Queue',
          href: '/dashboard/queue',
          icon: Tv,
          badge: waitingCount > 0 ? waitingCount : undefined,
          roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR'],
        },
        {
          label: 'Doctor Panel',
          href: '/dashboard/doctor',
          icon: Stethoscope,
          roles: ['ADMIN', 'DOCTOR'],
        },
      ],
    },
    {
      group: 'FINANCE',
      items: [
        {
          label: 'Billing & Cash',
          href: '/dashboard/billing',
          icon: FileText,
          roles: ['ADMIN', 'RECEPTIONIST', 'ACCOUNTANT'],
        },
      ],
    },
    {
      group: 'ADMIN',
      items: [
        {
          label: 'Reports & Analytics',
          href: '/dashboard/reports',
          icon: BarChart3,
          roles: ['ADMIN', 'ACCOUNTANT'],
        },
        {
          label: 'Settings',
          href: '/dashboard/settings',
          icon: Settings,
          roles: ['ADMIN'],
        },
      ],
    },
  ];

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate current page title for breadcrumb
  let pageTitle = 'Dashboard';
  if (pathname === '/dashboard/reception') pageTitle = 'Reception Intake';
  else if (pathname === '/dashboard/patients') pageTitle = 'Patients Directory';
  else if (pathname === '/dashboard/appointments') pageTitle = 'Appointments Roster';
  else if (pathname === '/dashboard/queue') pageTitle = 'Live Queue Status';
  else if (pathname === '/dashboard/doctor') pageTitle = 'Doctor Consultation Panel';
  else if (pathname === '/dashboard/billing') pageTitle = 'Billing & Cash Closing';
  else if (pathname === '/dashboard/reports') pageTitle = 'Reports & Analytics';
  else if (pathname === '/dashboard/settings') pageTitle = 'Hospital Settings';

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F6F9FC] text-[#1B2733] flex flex-col md:flex-row antialiased">
        <CommandPalette />

        {/* Mobile Top App Bar */}
        <div className="md:hidden h-16 bg-[#0B3A66] text-white px-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
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

        {/* Mobile Drawer Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-[#0B233D]/60 backdrop-blur-xs md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* 1. Left Sidebar: Solid Navy #0B3A66, 248px or 72px icon rail */}
        <aside
          className={`fixed md:sticky top-0 bottom-0 left-0 z-50 ${
            collapsed ? 'w-[72px]' : 'w-[248px]'
          } bg-[#0B3A66] text-white flex flex-col justify-between transition-all duration-200 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } border-r border-[#082C4D] flex-shrink-0 select-none`}
        >
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Logo & Collapse Header */}
            <div className="h-16 px-4 border-b border-[#0E4980] flex items-center justify-between flex-shrink-0">
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
                <Link
                  href="/dashboard"
                  className="w-10 h-10 rounded-lg bg-[#1E9E8F] flex items-center justify-center font-bold text-white text-sm mx-auto shadow-xs"
                  title="Naseem Ijaz Hospital"
                >
                  NIH
                </Link>
              )}

              <button
                onClick={toggleCollapsed}
                className="hidden md:flex p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-label="Toggle sidebar collapse"
              >
                {collapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Quick Keyboard Hints strip */}
            {!collapsed && (
              <div className="px-4 py-2 bg-[#092E52] border-b border-[#0E4980] flex items-center justify-between text-[11px] text-teal-200/90 font-mono">
                <span>Shortcuts:</span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1 py-0.2 rounded bg-black/30">F2</kbd> Intake
                  <kbd className="px-1 py-0.2 rounded bg-black/30 ml-1">F4</kbd> Token
                </span>
              </div>
            )}

            {/* Grouped Nav Items */}
            <nav className="p-3 space-y-5 flex-1">
              {menuGroups.map((grp) => {
                const visibleItems = grp.items.filter((it) => it.roles.includes(role));
                if (visibleItems.length === 0) return null;

                return (
                  <div key={grp.group} className="space-y-1">
                    {!collapsed && (
                      <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-teal-300/80 mb-1 font-heading">
                        {grp.group}
                      </div>
                    )}

                    {visibleItems.map((item) => {
                      const active = item.exact
                        ? pathname === item.href
                        : pathname === item.href || (pathname ? pathname.startsWith(item.href + '/') : false);
                      const Icon = item.icon;

                      const navContent = (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`group relative flex items-center ${
                            collapsed ? 'justify-center px-2' : 'justify-between px-3'
                          } py-2.5 rounded-lg text-xs font-medium transition-all ${
                            active
                              ? 'bg-[#14538F] text-white border-l-[3px] border-[#1E9E8F] font-semibold shadow-xs'
                              : 'text-slate-200 hover:bg-[#0E4980] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={`w-4 h-4 flex-shrink-0 ${
                                active ? 'text-[#1E9E8F]' : 'text-slate-300 group-hover:text-white'
                              }`}
                            />
                            {!collapsed && <span>{item.label}</span>}
                          </div>

                          {!collapsed && (
                            <div className="flex items-center gap-1.5">
                              {item.badge !== undefined && (
                                <span className="rounded-full bg-[#1E9E8F] px-1.5 py-0.2 text-[10px] font-bold text-white">
                                  {item.badge}
                                </span>
                              )}
                              {item.shortcut && !active && (
                                <span className="text-[10px] font-mono text-slate-300 bg-black/25 px-1.5 py-0.5 rounded">
                                  {item.shortcut}
                                </span>
                              )}
                            </div>
                          )}

                          {collapsed && item.badge !== undefined && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1E9E8F] text-[10px] font-bold text-white">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );

                      if (collapsed) {
                        return (
                          <Tooltip key={item.href} content={item.label} position="right" className="w-full">
                            {navContent}
                          </Tooltip>
                        );
                      }

                      return navContent;
                    })}
                  </div>
                );
              })}
            </nav>

            {/* Waiting TV Display shortcut */}
            <div className="p-3 border-t border-[#0E4980]">
              <Link
                href="/display"
                target="_blank"
                className={`flex items-center ${
                  collapsed ? 'justify-center' : 'gap-2.5'
                } px-3 py-2 rounded-lg text-xs font-semibold bg-[#1E9E8F]/20 hover:bg-[#1E9E8F]/30 text-teal-300 transition-colors`}
                title={collapsed ? 'Open TV Display Board (/display)' : undefined}
              >
                <Tv className="w-4 h-4 text-teal-300 flex-shrink-0" />
                {!collapsed && (
                  <div className="flex items-center justify-between flex-1">
                    <span>Live TV Board</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </div>
                )}
              </Link>
            </div>
          </div>

          {/* User Profile Card at Bottom */}
          <div className="p-3 border-t border-[#0E4980] bg-[#092E52] flex-shrink-0">
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-2`}>
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-[#1E9E8F] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
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

              {!collapsed && (
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="p-1.5 rounded-md text-slate-300 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* 2. Main Workspace */}
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          {/* Top Bar (White, 64px, bottom border) */}
          <header className="hidden md:flex h-16 bg-white border-b border-[#E3E9EF] px-6 items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
            {/* Breadcrumb & Title */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-[#0B4F8A]">
                Naseem Ijaz Hospital
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8A97A5]" />
              <span className="text-[#5B6B7B]">OPD Clinic</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8A97A5]" />
              <h1 className="text-sm font-bold text-[#1B2733] font-heading">
                {pageTitle}
              </h1>
            </div>

            {/* Center: Global Search (Ctrl+K) */}
            <div className="w-72 lg:w-96">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#F6F9FC] border border-[#D5DDE5] text-xs text-[#5B6B7B] hover:border-[#0B4F8A] hover:bg-white transition-all shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-[#0B4F8A]" />
                  <span>Search patients, appointments, MR #...</span>
                </div>
                <span className="font-mono text-[10px] bg-white border border-[#D5DDE5] px-1.5 py-0.5 rounded text-[#5B6B7B]">
                  Ctrl+K
                </span>
              </button>
            </div>

            {/* Right Controls: Quick Add, Clock/Date, Notifications, Language, User */}
            <div className="flex items-center gap-3 text-xs">
              {/* Quick Add Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setQuickAddOpen(!quickAddOpen)}
                  className="flex items-center gap-1.5 rounded-lg bg-[#0B4F8A] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#093F6E] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Quick Add</span>
                  <ChevronDown className="h-3 w-3 opacity-80" />
                </button>

                {quickAddOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setQuickAddOpen(false)} />
                    <div className="absolute right-0 top-9 z-30 w-52 rounded-xl border border-[#E3E9EF] bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                      <button
                        type="button"
                        onClick={() => {
                          setQuickAddOpen(false);
                          router.push('/dashboard/reception?action=new-patient');
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#1B2733] hover:bg-[#E8F1F9] hover:text-[#0B4F8A] transition-colors"
                      >
                        <UserPlus className="h-4 w-4 text-[#0B4F8A]" />
                        <span>New Patient Registration</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setQuickAddOpen(false);
                          router.push('/dashboard/reception?action=issue-token');
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#1B2733] hover:bg-[#E6F5F3] hover:text-[#167C70] transition-colors"
                      >
                        <CalendarPlus className="h-4 w-4 text-[#1E9E8F]" />
                        <span>Issue OPD Token</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setQuickAddOpen(false);
                          router.push('/dashboard/appointments?action=new');
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#1B2733] hover:bg-[#F8FAFC] transition-colors"
                      >
                        <Calendar className="h-4 w-4 text-[#5B6B7B]" />
                        <span>Book Appointment</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Live Clock & Date */}
              <div className="hidden xl:flex items-center gap-2 text-[#5B6B7B] font-medium border-l border-[#E3E9EF] pl-3">
                <Clock className="w-3.5 h-3.5 text-[#8A97A5]" />
                <span>{timeString || '10:00 AM'}</span>
                <span className="text-[#CBD5E1]">•</span>
                <span>{currentDateStr}</span>
              </div>

              {/* Notifications Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-lg text-[#5B6B7B] hover:bg-[#F1F5F9] hover:text-[#1B2733] transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#1E9E8F]" />
                </button>

                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setNotifOpen(false)} />
                    <div className="absolute right-0 top-10 z-30 w-80 rounded-xl border border-[#E3E9EF] bg-white p-3 shadow-xl animate-in fade-in duration-100">
                      <div className="flex items-center justify-between border-b border-[#F0F4F8] pb-2 mb-2">
                        <span className="font-heading text-xs font-bold text-[#1B2733]">Notifications</span>
                        <span className="text-[10px] font-semibold text-[#0B4F8A] bg-[#E8F1F9] px-2 py-0.5 rounded-full">
                          2 New
                        </span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2 rounded-lg bg-[#E8F1F9]/50 hover:bg-[#E8F1F9] transition-colors cursor-pointer">
                          <p className="font-semibold text-[#0B4F8A]">New Online Booking</p>
                          <p className="text-[11px] text-[#5B6B7B]">Dr. Ahmed (Cardiology) booked for today at 4:30 PM.</p>
                          <span className="text-[10px] text-[#8A97A5] mt-1 block">5 mins ago</span>
                        </div>
                        <div className="p-2 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors cursor-pointer">
                          <p className="font-semibold text-[#1B2733]">OPD Queue Directive</p>
                          <p className="text-[11px] text-[#5B6B7B]">12 patients currently waiting across 4 doctor rooms.</p>
                          <span className="text-[10px] text-[#8A97A5] mt-1 block">15 mins ago</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Language Toggle */}
              <LanguageToggle className="border-[#D5DDE5]" />

              {/* User Dropdown */}
              <div className="relative border-l border-[#E3E9EF] pl-3">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#F1F5F9] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#0B4F8A] text-white font-bold text-xs flex items-center justify-center">
                    {userName.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-[#1B2733] leading-tight">{userName}</p>
                    <p className="text-[10px] text-[#8A97A5] font-mono leading-tight">{role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8A97A5]" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-10 z-30 w-56 rounded-xl border border-[#E3E9EF] bg-white p-2 shadow-xl animate-in fade-in duration-100">
                      <div className="px-3 py-2 border-b border-[#F0F4F8] mb-1">
                        <p className="text-xs font-bold text-[#1B2733]">{userName}</p>
                        <p className="text-[11px] text-[#5B6B7B] truncate">{userEmail}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[10px] text-emerald-700 font-medium">Shift Active</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          router.push('/dashboard/settings');
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-[#1B2733] hover:bg-[#F8FAFC]"
                      >
                        <Settings className="h-3.5 w-3.5 text-[#5B6B7B]" />
                        <span>Settings & Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="h-3.5 w-3.5 text-rose-600" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Content Area: #F6F9FC with 24px padding and max-w-[1440px] container */}
          <main className="flex-1 p-4 sm:p-6 bg-[#F6F9FC]">
            <div className="mx-auto max-w-[1440px] space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
