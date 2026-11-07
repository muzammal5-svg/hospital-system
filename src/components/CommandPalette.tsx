"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, UserPlus, CalendarPlus, Tv, FileText, X, ArrowRight, User } from "lucide-react";
import { formatCNIC } from "@/lib/utils";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-command-palette", handleOpen);
    return () => window.removeEventListener("open-command-palette", handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/patients?q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        setResults(data.patients || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0B0F14] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden text-neutral-900 dark:text-neutral-100">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-black/10 dark:border-white/10 gap-3">
          <Search className="w-5 h-5 text-teal-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient by MR #, Name, Mobile, or CNIC... (Esc to close)"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsOpen(false);
            }}
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results / Navigation Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Shortcuts */}
          {!query && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 block mb-2">
                Quick Actions
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/dashboard/reception?action=new-patient");
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-950/30 text-left text-xs font-semibold text-teal-700 dark:text-teal-300 border border-transparent hover:border-teal-200 dark:hover:border-teal-800 transition-all"
                >
                  <UserPlus className="w-4 h-4 text-teal-500" />
                  <div>
                    <span>Register New Patient</span>
                    <span className="text-[10px] text-neutral-400 block font-normal">Shortcut: F2</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/dashboard/reception?action=new-visit");
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 text-left text-xs font-semibold text-blue-700 dark:text-blue-300 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all"
                >
                  <CalendarPlus className="w-4 h-4 text-blue-500" />
                  <div>
                    <span>Issue OPD Token</span>
                    <span className="text-[10px] text-neutral-400 block font-normal">Shortcut: F4</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/display");
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left text-xs font-semibold"
                >
                  <Tv className="w-4 h-4 text-purple-500" />
                  <div>
                    <span>Open TV Queue Screen</span>
                    <span className="text-[10px] text-neutral-400 block font-normal">Waiting room display</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/dashboard/billing");
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left text-xs font-semibold"
                >
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <div>
                    <span>Cash Register & Closing</span>
                    <span className="text-[10px] text-neutral-400 block font-normal">Billing module</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Patient Search Results */}
          {query && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 block mb-2">
                Matching Patients ({results.length})
              </span>
              {loading ? (
                <div className="py-6 text-center text-xs text-neutral-400">Searching records...</div>
              ) : results.length === 0 ? (
                <div className="py-6 text-center text-xs text-neutral-400">
                  No matching patients found. Press F2 to register.
                </div>
              ) : (
                <div className="space-y-1">
                  {results.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setIsOpen(false);
                        router.push(`/dashboard/patients?id=${p.id}`);
                      }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-300 font-bold text-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">{p.fullName}</div>
                          <div className="text-[11px] text-neutral-500">
                            MR: <span className="font-mono text-teal-600 dark:text-teal-400">{p.mrNumber}</span> • Mobile: {p.mobile} • CNIC: {formatCNIC(p.cnic)}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Navigate with mouse or keyboard</span>
          <span className="font-mono">[F2] New Patient | [F4] New Visit | [Esc] Close</span>
        </div>
      </div>
    </div>
  );
}
