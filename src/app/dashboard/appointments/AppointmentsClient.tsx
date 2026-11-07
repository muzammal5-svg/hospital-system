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
  X,
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
          <div className="bg-white border border-[#E3E9EF] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E9EF]">
              <h3 className="font-bold text-sm text-[#1B2733]">
                Schedule New Appointment
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-[#8A97A5] hover:text-[#1B2733] hover:bg-[#F6F9FC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                  Patient Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Ullah"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-white border border-[#E3E9EF] rounded-lg px-3.5 py-2.5 text-xs text-[#1B2733] outline-none focus:border-[#0B4F8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0300-1234567"
                  value={patientMobile}
                  onChange={(e) => setPatientMobile(e.target.value)}
                  className="w-full bg-white border border-[#E3E9EF] rounded-lg px-3.5 py-2.5 text-xs text-[#1B2733] outline-none focus:border-[#0B4F8A] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                    Doctor
                  </label>
                  <select
                    value={docId}
                    onChange={(e) => {
                      setDocId(e.target.value);
                      const d = doctors.find((doc) => doc.id === e.target.value);
                      if (d) setDeptId(d.departmentId);
                    }}
                    className="w-full bg-white border border-[#E3E9EF] rounded-lg px-3 py-2 text-xs text-[#1B2733] outline-none focus:border-[#0B4F8A]"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                    Slot Time
                  </label>
                  <select
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="w-full bg-white border border-[#E3E9EF] rounded-lg px-3 py-2 text-xs text-[#1B2733] outline-none focus:border-[#0B4F8A]"
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
                <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Reason for consultation"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-[#E3E9EF] rounded-lg px-3.5 py-2.5 text-xs text-[#1B2733] outline-none focus:border-[#0B4F8A]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#E3E9EF] text-[#5B6B7B] font-semibold hover:bg-[#F6F9FC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-[#0B4F8A] hover:bg-[#093F6E] text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? "Booking..." : "Confirm & Send SMS"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-[#E3E9EF]">
        <div>
          <h1 className="font-display font-bold text-2xl tracking-tight text-[#1B2733]">
            Appointment Roster & Scheduling
          </h1>
          <p className="text-sm text-[#5B6B7B] mt-0.5">
            Doctor consultation calendar slots with real-time double-booking prevention.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg bg-[#0B4F8A] hover:bg-[#093F6E] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </button>
      </div>

      {/* Filters Strip */}
      <div className="p-4 rounded-xl bg-white border border-[#E3E9EF] shadow-sm flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#0B4F8A]" />
          <span className="font-semibold text-[#1B2733]">Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#F6F9FC] border border-[#E3E9EF] rounded-lg px-3 py-1.5 text-[#1B2733] outline-none focus:border-[#0B4F8A]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#0B4F8A]" />
          <span className="font-semibold text-[#1B2733]">Doctor:</span>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="bg-[#F6F9FC] border border-[#E3E9EF] rounded-lg px-3 py-1.5 text-[#1B2733] outline-none focus:border-[#0B4F8A]"
          >
            <option value="">All Doctors ({doctors.length})</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.specialty})
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto text-xs text-[#5B6B7B] font-mono">
          Showing {filteredAppointments.length} Bookings
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="rounded-xl bg-white border border-[#E3E9EF] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E3E9EF] text-[#5B6B7B] bg-[#F6F9FC]">
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Reference #</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Slot Time</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Patient Name</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Mobile</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Doctor / Dept</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px]">Status</th>
                <th className="py-3 px-4 font-semibold uppercase text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E9EF]">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#8A97A5]">
                    No appointments scheduled for this date and doctor filter.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-[#F6F9FC] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0B4F8A]">
                      {apt.referenceNo}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1B2733]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#0B4F8A]" />
                        <span>{apt.timeSlot}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#1B2733]">
                      {apt.patientName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#5B6B7B]">{apt.patientMobile}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#1B2733] block">
                        {apt.doctor.name}
                      </span>
                      <span className="text-[11px] text-[#5B6B7B]">
                        Room {apt.doctor.roomNo} ({apt.department.name})
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          apt.status === "CONFIRMED"
                            ? "bg-[#E6F5F3] text-[#1E9E8F] border border-[#1E9E8F]/20"
                            : apt.status === "ATTENDED"
                            ? "bg-[#E8F1F9] text-[#0B4F8A] border border-[#0B4F8A]/20"
                            : "bg-red-50 text-red-700 border border-red-200"
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
                          className="px-2.5 py-1 rounded-md bg-[#1E9E8F] hover:bg-[#167C70] text-white font-semibold text-[11px] transition-colors"
                          title="Issue OPD Token for this appointment"
                        >
                          Issue Token &rarr;
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(apt.id, "CANCELLED")}
                          className="p-1 rounded text-[#8A97A5] hover:text-red-600"
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
