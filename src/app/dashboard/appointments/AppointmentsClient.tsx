"use client";

import React, { useState } from "react";
import { formatMobile, formatPKR, formatDate } from "@/lib/utils";
import {
  Calendar,
  Clock,
  User,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface AppointmentsClientProps {
  initialAppointments: any[];
  doctors: any[];
  departments: any[];
}

export default function AppointmentsClient({
  initialAppointments,
  doctors,
  departments,
}: AppointmentsClientProps) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Booking Modal Form
  const [patientName, setPatientName] = useState("");
  const [patientMobile, setPatientMobile] = useState("");
  const [docId, setDocId] = useState(doctors[0]?.id || "");
  const [deptId, setDeptId] = useState(departments[0]?.id || "");
  const [slot, setSlot] = useState("10:00 AM");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedDoctor && apt.doctorId !== selectedDoctor) return false;
    if (selectedDate && apt.appointmentDate !== selectedDate) return false;
    return true;
  });

  const slots = [
    "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
    "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  ];

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: patientName.trim(),
          patientMobile: patientMobile.trim(),
          doctorId: docId,
          departmentId: deptId,
          appointmentDate: selectedDate,
          timeSlot: slot,
          notes: notes.trim() || undefined,
          type: "WALK_IN",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to book appointment.");
      }

      setAppointments([data.appointment, ...appointments]);
      setShowModal(false);
      setPatientName("");
      setPatientMobile("");
      setNotes("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const updated = appointments.map((a) =>
        a.id === id ? { ...a, status: newStatus } : a
      );
      setAppointments(updated);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* New Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-white/10">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                Schedule New Appointment
              </h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600">
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-500 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Ullah"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0300-1234567"
                  value={patientMobile}
                  onChange={(e) => setPatientMobile(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Doctor
                  </label>
                  <select
                    value={docId}
                    onChange={(e) => {
                      setDocId(e.target.value);
                      const d = doctors.find((doc) => doc.id === e.target.value);
                      if (d) setDeptId(d.departmentId);
                    }}
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Slot Time
                  </label>
                  <select
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
                  >
                    {slots.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Reason for visit or clinical notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-white/5 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-pill bg-teal-500 text-black text-xs font-bold"
                >
                  {loading ? "Booking..." : "Confirm & Send SMS"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight text-neutral-900 dark:text-white">
            Appointment Roster & Scheduling
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Doctor-wise calendar slots with double-booking prevention.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-pill bg-teal-500 hover:bg-teal-600 text-black text-xs font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </button>
      </div>

      {/* Filters Strip */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-500" />
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-neutral-900 dark:text-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-teal-500" />
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">Doctor:</span>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-neutral-900 dark:text-white outline-none"
          >
            <option value="">All Doctors ({doctors.length})</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.specialty})
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto text-xs text-neutral-400 font-mono">
          Showing {filteredAppointments.length} Bookings
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-white/10 text-neutral-400 bg-neutral-50 dark:bg-white/5">
                <th className="py-3 px-4 font-bold uppercase text-[10px]">Reference #</th>
                <th className="py-3 px-4 font-bold uppercase text-[10px]">Slot Time</th>
                <th className="py-3 px-4 font-bold uppercase text-[10px]">Patient Name</th>
                <th className="py-3 px-4 font-bold uppercase text-[10px]">Mobile</th>
                <th className="py-3 px-4 font-bold uppercase text-[10px]">Doctor / Dept</th>
                <th className="py-3 px-4 font-bold uppercase text-[10px]">Status</th>
                <th className="py-3 px-4 font-bold uppercase text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-neutral-400">
                    No appointments scheduled for this date and doctor filter.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-600 dark:text-teal-400">
                      {apt.referenceNo}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-500" />
                        <span>{apt.timeSlot}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-neutral-800 dark:text-neutral-100">
                      {apt.patientName}
                    </td>
                    <td className="py-3.5 px-4 font-mono">{apt.patientMobile}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-neutral-900 dark:text-white block">
                        {apt.doctor.name}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        Room {apt.doctor.roomNo} ({apt.department.name})
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          apt.status === "CONFIRMED"
                            ? "bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300"
                            : apt.status === "ATTENDED"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                            : "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            router.push(
                              `/dashboard/reception?action=new-visit&name=${encodeURIComponent(apt.patientName)}&mobile=${encodeURIComponent(apt.patientMobile)}&doctorId=${apt.doctorId}`
                            );
                          }}
                          className="px-2.5 py-1 rounded bg-teal-500 hover:bg-teal-600 text-black font-bold text-[11px]"
                          title="Issue OPD Token for this appointment"
                        >
                          Issue Token &rarr;
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(apt.id, "CANCELLED")}
                          className="p-1 rounded text-neutral-400 hover:text-red-500"
                          title="Cancel Booking"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
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
