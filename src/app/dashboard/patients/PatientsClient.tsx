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
      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#162638] border border-[#E3E9EF] dark:border-[#23374D] rounded-xl max-w-xl w-full p-6 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E9EF] dark:border-[#23374D]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0B4F8A] text-white font-bold flex items-center justify-center text-sm">
                  {selectedPatient.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1B2733] dark:text-white font-heading">
                    {selectedPatient.fullName}
                  </h3>
                  <span className="font-mono text-[#0B4F8A] dark:text-[#64B5F6] font-bold">
                    {selectedPatient.mrNumber}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-1 rounded-md text-[#5B6B7B] hover:text-[#1B2733] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Demographics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-[#F6F9FC] dark:bg-[#111B27] rounded-lg border border-[#E3E9EF] dark:border-[#23374D]">
              <div>
                <span className="text-[#8A97A5] block text-[10px]">Father / Husband</span>
                <span className="font-semibold text-[#1B2733] dark:text-white">{selectedPatient.fatherOrHusbandName || "—"}</span>
              </div>
              <div>
                <span className="text-[#8A97A5] block text-[10px]">Age / Gender</span>
                <span className="font-semibold text-[#1B2733] dark:text-white">{selectedPatient.age || "—"} Yrs / {selectedPatient.gender}</span>
              </div>
              <div>
                <span className="text-[#8A97A5] block text-[10px]">Mobile</span>
                <span className="font-mono font-semibold text-[#1B2733] dark:text-white">{selectedPatient.mobile}</span>
              </div>
              <div>
                <span className="text-[#8A97A5] block text-[10px]">CNIC ({userRole === "ADMIN" ? "Unmasked" : "Masked"})</span>
                <span className="font-mono font-semibold text-[#1B2733] dark:text-white">{selectedPatient.cnic || "—"}</span>
              </div>
              <div>
                <span className="text-[#8A97A5] block text-[10px]">Blood Group</span>
                <span className="font-semibold text-[#1B2733] dark:text-white">{selectedPatient.bloodGroup || "—"}</span>
              </div>
              <div>
                <span className="text-[#8A97A5] block text-[10px]">City</span>
                <span className="font-semibold text-[#1B2733] dark:text-white">{selectedPatient.city}</span>
              </div>
            </div>

            {/* Allergies Notice */}
            {selectedPatient.allergies && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                <span>Known Allergies: <strong>{selectedPatient.allergies}</strong></span>
              </div>
            )}

            {/* Recent Visits */}
            <div>
              <span className="font-bold text-[#1B2733] dark:text-white block mb-2 font-heading">
                Recent Hospital Visits
              </span>
              <div className="space-y-1.5">
                {selectedPatient.visits && selectedPatient.visits.length > 0 ? (
                  selectedPatient.visits.map((v: any) => (
                    <div
                      key={v.id}
                      className="p-2.5 rounded-lg bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-[#1B2733] dark:text-white block">{v.doctor?.name} ({v.department?.name})</span>
                        <span className="text-[10px] text-[#5B6B7B] dark:text-[#94A7BA]">{v.tokenDate} &bull; Token #{v.tokenNumber}</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E6F5F3] text-[#1E9E8F] border border-[#1E9E8F]/20">
                        {v.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-[#8A97A5]">No recorded prior visits.</div>
                )}
              </div>
            </div>

            {/* Action footer */}
            <div className="pt-3 border-t border-[#E3E9EF] dark:border-[#23374D] flex justify-end gap-2">
              <button
                onClick={() => {
                  router.push(`/dashboard/reception?action=new-visit&patientId=${selectedPatient.id}`);
                }}
                className="btn-primary text-xs py-2 px-4"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>Issue New OPD Token</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header & Search Bar */}
      <div className="hospital-card p-5 bg-white dark:bg-[#162638] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#0B4F8A] dark:text-white">
            Patients Master Directory
          </h1>
          <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-0.5">
            Centralized index of registered hospital patients with privacy masking.
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/reception?action=new-patient")}
          className="btn-primary text-xs py-2 px-4 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Patient (F2)</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="hospital-card p-4 bg-white dark:bg-[#162638]">
        <form onSubmit={handleSearch} className="flex gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8A97A5] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by MR Number, Patient Name, Mobile or CNIC..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-secondary text-xs px-6 font-bold h-11"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* Patients Table */}
      <div className="hospital-card bg-white dark:bg-[#162638] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs hospital-table text-left">
            <thead>
              <tr>
                <th>MR Number</th>
                <th>Full Name</th>
                <th>Age / Gender</th>
                <th>Mobile</th>
                <th>CNIC ({userRole === "ADMIN" ? "Full" : "Masked"})</th>
                <th>City</th>
                <th>Registered</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#8A97A5]">
                    No patient records found matching your query.
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className="font-mono font-bold text-[#0B4F8A] dark:text-[#64B5F6] bg-[#E8F1F9] dark:bg-[#1E3147] px-2 py-1 rounded">
                        {p.mrNumber}
                      </span>
                    </td>
                    <td className="font-semibold text-[#1B2733] dark:text-white">
                      {p.fullName}
                    </td>
                    <td className="text-[#5B6B7B] dark:text-[#94A7BA]">
                      {p.age || "—"} Yrs / {p.gender}
                    </td>
                    <td className="font-mono">{p.mobile}</td>
                    <td className="font-mono text-[#5B6B7B] dark:text-[#94A7BA]">{p.cnic || "—"}</td>
                    <td>{p.city}</td>
                    <td className="text-[#5B6B7B] dark:text-[#94A7BA]">{formatDate(p.createdAt)}</td>
                    <td className="text-right">
                      <button
                        onClick={() => setSelectedPatient(p)}
                        className="btn-secondary text-[11px] py-1 px-3"
                      >
                        Details &rarr;
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
