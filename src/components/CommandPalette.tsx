'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  UserPlus,
  CalendarPlus,
  Tv,
  FileText,
  X,
  ArrowRight,
  User,
  LayoutDashboard,
  Calendar,
  Stethoscope,
  BarChart3,
  Settings,
  CreditCard,
  Users,
} from 'lucide-react';
import { formatCNIC } from '@/lib/utils';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [patientResults, setPatientResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'F3') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('open-command-palette', handleOpen);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('open-command-palette', handleOpen);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setPatientResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setPatientResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/patients?q=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        setPatientResults(data.patients || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const pages = [
    { label: 'Admin Dashboard', href: '/dashboard', icon: LayoutDashboard, category: 'Pages' },
    { label: 'Reception Intake Desk', href: '/dashboard/reception', icon: UserPlus, category: 'Pages' },
    { label: 'Patients Directory', href: '/dashboard/patients', icon: Users, category: 'Pages' },
    { label: 'Appointments Roster', href: '/dashboard/appointments', icon: Calendar, category: 'Pages' },
    { label: 'Live Queue Kanban', href: '/dashboard/queue', icon: Tv, category: 'Pages' },
    { label: 'Doctor Consultation Panel', href: '/dashboard/doctor', icon: Stethoscope, category: 'Pages' },
    { label: 'Billing & Cash Closing', href: '/dashboard/billing', icon: CreditCard, category: 'Pages' },
    { label: 'Reports & Analytics', href: '/dashboard/reports', icon: BarChart3, category: 'Pages' },
    { label: 'Hospital Settings', href: '/dashboard/settings', icon: Settings, category: 'Pages' },
    { label: 'OPD TV Display Screen', href: '/display', icon: Tv, category: 'Pages' },
  ];

  const filteredPages = query.trim()
    ? pages.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()))
    : pages.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-[#0B233D]/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white border border-[#E3E9EF] rounded-2xl shadow-2xl overflow-hidden text-[#1B2733]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#F0F4F8] gap-3 bg-[#FBFDFF]">
          <Search className="w-5 h-5 text-[#0B4F8A] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient (MR #, Name, Mobile, CNIC) or page... (Esc to close)"
            className="flex-1 bg-transparent text-sm text-[#1B2733] placeholder-[#8A97A5] outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsOpen(false);
            }}
          />
          <span className="text-[10px] font-mono text-[#8A97A5] bg-[#F1F5F9] border border-[#D5DDE5] px-1.5 py-0.5 rounded">
            ESC
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-[#8A97A5] hover:text-[#1B2733] hover:bg-[#F1F5F9]"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results / Navigation Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Quick Actions if query is empty */}
          {!query && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B7B] px-2 block mb-2 font-heading">
                Quick Actions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => navigateTo('/dashboard/reception?action=new-patient')}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#E3E9EF] bg-white hover:border-[#1E9E8F] hover:bg-[#E6F5F3]/30 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#E6F5F3] text-[#167C70] flex items-center justify-center shrink-0">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1B2733] group-hover:text-[#167C70] block">
                      Register New Patient
                    </span>
                    <span className="text-[11px] text-[#8A97A5]">Shortcut: F2</span>
                  </div>
                </button>

                <button
                  onClick={() => navigateTo('/dashboard/reception?action=issue-token')}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#E3E9EF] bg-white hover:border-[#0B4F8A] hover:bg-[#E8F1F9]/30 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#E8F1F9] text-[#0B4F8A] flex items-center justify-center shrink-0">
                    <CalendarPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1B2733] group-hover:text-[#0B4F8A] block">
                      Issue OPD Token
                    </span>
                    <span className="text-[11px] text-[#8A97A5]">Shortcut: F4</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Patient Results */}
          {query.trim().length >= 2 && (
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B7B] font-heading">
                  Patients ({patientResults.length})
                </span>
                {loading && <span className="text-xs text-[#1E9E8F] animate-pulse">Searching...</span>}
              </div>

              {patientResults.length === 0 && !loading ? (
                <div className="p-4 text-center text-xs text-[#8A97A5] bg-[#F8FAFC] rounded-xl border border-dashed border-[#D5DDE5]">
                  No patients matching &ldquo;{query}&rdquo; found.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {patientResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => navigateTo(`/dashboard/patients?id=${p.id}`)}
                      className="flex items-center justify-between p-3 rounded-xl border border-[#E3E9EF] bg-white hover:border-[#0B4F8A] hover:bg-[#F8FAFC] cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E8F1F9] text-[#0B4F8A] font-bold text-xs flex items-center justify-center shrink-0">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#1B2733] flex items-center gap-2">
                            <span>{p.name}</span>
                            <span className="font-mono text-[10px] bg-[#E8F1F9] text-[#0B4F8A] px-1.5 py-0.2 rounded font-bold">
                              {p.mrNumber}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#5B6B7B] flex items-center gap-3 mt-0.5">
                            <span>{p.mobile}</span>
                            {p.cnic && <span>• {formatCNIC(p.cnic)}</span>}
                            <span>• {p.gender}, {p.age || '—'} yrs</span>
                          </div>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-[#8A97A5]" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pages & Navigation */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B7B] px-2 block mb-2 font-heading">
              Application Pages
            </span>
            <div className="space-y-1">
              {filteredPages.map((page) => {
                const Icon = page.icon;
                return (
                  <button
                    key={page.href}
                    onClick={() => navigateTo(page.href)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F8FAFC] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#5B6B7B] group-hover:text-[#0B4F8A]" />
                      <span className="text-xs font-medium text-[#1B2733] group-hover:text-[#0B4F8A]">
                        {page.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8A97A5] font-mono">{page.href}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="border-t border-[#F0F4F8] bg-[#FBFDFF] px-4 py-2.5 flex items-center justify-between text-[11px] text-[#8A97A5]">
          <span>Navigate with mouse or keyboard</span>
          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span><kbd className="px-1 py-0.5 rounded bg-[#F1F5F9] border border-[#D5DDE5]">F2</kbd> New Patient</span>
            <span><kbd className="px-1 py-0.5 rounded bg-[#F1F5F9] border border-[#D5DDE5]">F3</kbd> Search</span>
            <span><kbd className="px-1 py-0.5 rounded bg-[#F1F5F9] border border-[#D5DDE5]">F4</kbd> New Token</span>
          </div>
        </div>
      </div>
    </div>
  );
}
