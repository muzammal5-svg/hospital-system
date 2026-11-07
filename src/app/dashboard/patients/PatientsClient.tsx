"use client";

import React, { useState } from "react";
import { formatCNIC, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Search, UserPlus, CalendarPlus, FileText, ChevronRight, X, ShieldAlert, User } from "lucide-react";

interface PatientsClientProps {
  initialPatients: any[];
  userRole: string;
}

export default function PatientsClient({ initialPatients, userRole }: PatientsClientProps) {
  const [patients, setPatients] = useState(initialPatients);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setPatients(data.patients || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Detail Drawer / Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500 text-black font-bold flex items-center justify-center text-sm">
                  {selectedPatient.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    {selectedPatient.fullName}
                  </h3>
                  <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">
                    {selectedPatient.mrNumber}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Vitals & Demographics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-neutral-50 dark:bg-white/5 rounded-xl">
              <div>
                <span className="text-neutral-400 block text-[10px]">Father / Husband</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedPatient.fatherOrHusbandName || "—"}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">Age / Gender</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedPatient.age || "—"} Yrs / {selectedPatient.gender}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">Mobile</span>
                <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">{selectedPatient.mobile}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">CNIC ({userRole === "ADMIN" ? "Unmasked" : "Masked"})</span>
                <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">{selectedPatient.cnic || "—"}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">Blood Group</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedPatient.bloodGroup || "—"}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">City</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedPatient.city}</span>
              </div>
            </div>

            {/* Allergies Notice */}
            {selectedPatient.allergies && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Known Allergies: <strong>{selectedPatient.allergies}</strong></span>
              </div>
            )}

            {/* Visit History */}
            <div>
              <span className="font-bold text-neutral-700 dark:text-neutral-300 block mb-2">
                Recent OPD Visits ({selectedPatient.visits?.length || 0})
              </span>
              {selectedPatient.visits && selectedPatient.visits.length > 0 ? (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {selectedPatient.visits.map((v: any) => (
                    <div key={v.id} className="p-2.5 rounded-lg bg-neutral-100 dark:bg-white/5 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-neutral-900 dark:text-white block">{v.doctor?.name}</span>
                        <span className="text-[10px] text-neutral-500">{v.department?.name} • {formatDate(v.createdAt)}</span>
                      </div>
                      <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">
                        Token #{v.tokenNumber}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-neutral-400 text-center bg-neutral-50 dark:bg-white/5 rounded-lg">
                  No prior OPD visits recorded.
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedPatient(null);
                  router.push(`/dashboard/reception?action=new-visit`);
                }}
                className="btn-pill bg-teal-500 text-black text-xs font-bold"
              >
                Issue New Token
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight text-neutral-900 dark:text-white">
            Patients Master Directory
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Search 50+ registered patients by Name, MR #, Phone or CNIC.
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/reception?action=new-patient")}
          className="btn-pill bg-teal-500 hover:bg-teal-600 text-black text-xs font-bold flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Patient (F2)</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft">
        <form onSubmit={handleSearch} className="flex gap-2 text-xs">
          <input
            type="text"
            placeholder="Search by Patient Name, MR Number, Mobile (03XX), or CNIC..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-pill bg-teal-500 text-black text-xs font-bold px-6"
          >
            {loading ? "Searching..." : "Search Records"}
          </button>
        </form>
      </div>

      {/* Patients Table */}
      <div className="rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-white/10 text-neutral-400 bg-neutral-50 dark:bg-white/5">
                <th className="py-3 px-4 font-bold uppercase text-[10px]">MR Number</th>
                <th className="py-3 px-4 font-bold uppercase text-[10px]">Patient Name</th>
                <th className="py-3 px-4 font-bold uppercase text-[10px]">Age / Gender</th>
                <th className="py-3 px-4 font-bold uppercase text-[10px]">Mobile</th>
                <th className="py-3 px-4 font-bold uppercase text-[10px]">CNIC</th>
                <th className="py-3 px-4 font-bold uppercase text-[10px]">City</th>
                <th className="py-3 px-4 font-bold uppercase text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-neutral-400">
                    No matching patients found.
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedPatient(p)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-teal-600 dark:text-teal-400">
                      {p.mrNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">
                      {p.fullName}
                    </td>
                    <td className="py-3 px-4">
                      {p.age || "—"} Yrs / {p.gender}
                    </td>
                    <td className="py-3 px-4 font-mono">{p.mobile}</td>
                    <td className="py-3 px-4 font-mono">
                      {p.cnic || "—"}
                    </td>
                    <td className="py-3 px-4">{p.city}</td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedPatient(p)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-white/10 hover:bg-teal-500 hover:text-black font-semibold text-xs transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
