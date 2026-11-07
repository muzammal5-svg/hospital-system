"use client";

import React, { useState } from "react";
import { formatPKR } from "@/lib/utils";
import { Calendar, Clock, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

interface PublicBookingFormProps {
  departments: Array<{ id: string; name: string; code: string; nameUrdu?: string | null }>;
  doctors: Array<{
    id: string;
    name: string;
    specialty: string;
    fee: number;
    roomNo: string;
    departmentId: string;
  }>;
}

export default function PublicBookingForm({ departments, doctors }: PublicBookingFormProps) {
  const [selectedDept, setSelectedDept] = useState(departments[0]?.id || "");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [timeSlot, setTimeSlot] = useState("10:00 AM");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [cnic, setCnic] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<any | null>(null);

  const filteredDoctors = doctors.filter((d) => !selectedDept || d.departmentId === selectedDept);
  const currentDoctor = doctors.find((d) => d.id === selectedDoctor) || filteredDoctors[0];

  const slots = [
    "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
    "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const docId = selectedDoctor || currentDoctor?.id;
    if (!docId) {
      setError("Please select a doctor.");
      return;
    }

    if (!fullName.trim() || fullName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, "");
    if (cleanMobile.length !== 11 || !cleanMobile.startsWith("03")) {
      setError("Please enter a valid Pakistani mobile number (03XX-XXXXXXX).");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: docId,
          departmentId: currentDoctor?.departmentId || selectedDept,
          appointmentDate: date,
          timeSlot,
          patientName: fullName.trim(),
          patientMobile: mobile.trim(),
          patientCnic: cnic.trim() || undefined,
          notes: notes.trim() || undefined,
          type: "ONLINE",
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to book appointment.");
      }

      setConfirmation(data.appointment);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (confirmation) {
    return (
      <div className="text-center py-8 space-y-4 animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold font-display text-white">Appointment Confirmed!</h3>
        <p className="text-xs text-[#9A958C] max-w-md mx-auto">
          A confirmation SMS has been sent to <span className="text-white font-semibold">{confirmation.patientMobile}</span>.
        </p>

        <div className="max-w-md mx-auto bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-left space-y-2">
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-neutral-400">Booking Reference:</span>
            <span className="font-mono font-bold text-teal-400">{confirmation.referenceNo}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-neutral-400">Doctor:</span>
            <span className="font-semibold text-white">{confirmation.doctor.name}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-neutral-400">Date & Slot:</span>
            <span className="text-white">{confirmation.appointmentDate} at {confirmation.timeSlot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Consultation Room:</span>
            <span className="text-white font-semibold">{confirmation.doctor.roomNo}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setConfirmation(null);
            setFullName("");
            setMobile("");
            setCnic("");
            setNotes("");
          }}
          className="btn-pill bg-teal-500 text-black text-xs font-bold uppercase tracking-wider mt-4"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hidden Honeypot for Bot Prevention */}
      <input
        type="text"
        name="honeypot"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Step 1: Department & Doctor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-neutral-300 font-bold mb-1.5 uppercase text-[11px] tracking-wider">
            1. Select Department
          </label>
          <select
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setSelectedDoctor("");
            }}
            className="w-full bg-[#11171E] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-teal-500"
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} {d.nameUrdu ? `(${d.nameUrdu})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-neutral-300 font-bold mb-1.5 uppercase text-[11px] tracking-wider">
            2. Select Consultant
          </label>
          <select
            value={selectedDoctor || (currentDoctor?.id || "")}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full bg-[#11171E] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-teal-500"
          >
            {filteredDoctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} - {doc.specialty} ({formatPKR(doc.fee)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Step 2: Date & Slot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-neutral-300 font-bold mb-1.5 uppercase text-[11px] tracking-wider">
            3. Appointment Date
          </label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-[#11171E] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-teal-500"
            required
          />
        </div>

        <div>
          <label className="block text-neutral-300 font-bold mb-1.5 uppercase text-[11px] tracking-wider">
            4. Available Time Slot
          </label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full bg-[#11171E] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-teal-500"
          >
            {slots.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Step 3: Patient Information */}
      <div className="pt-2 border-t border-white/10">
        <label className="block text-neutral-300 font-bold mb-3 uppercase text-[11px] tracking-wider">
          5. Patient Details
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-[11px] text-neutral-400 block mb-1">Full Name *</span>
            <input
              type="text"
              placeholder="e.g. Tariq Mehmood"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#11171E] border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-teal-500"
              required
            />
          </div>

          <div>
            <span className="text-[11px] text-neutral-400 block mb-1">Mobile (03XX-XXXXXXX) *</span>
            <input
              type="tel"
              placeholder="0300-1234567"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full bg-[#11171E] border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-teal-500 font-mono"
              required
            />
          </div>

          <div>
            <span className="text-[11px] text-neutral-400 block mb-1">CNIC (Optional)</span>
            <input
              type="text"
              placeholder="35201-1234567-1"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              className="w-full bg-[#11171E] border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-teal-500 font-mono"
            />
          </div>
        </div>
      </div>

      <div>
        <span className="text-[11px] text-neutral-400 block mb-1">Brief Symptoms or Reason for Visit (Optional)</span>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. High blood pressure checkup, joint pain for 2 weeks..."
          className="w-full bg-[#11171E] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-teal-500 resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex items-center justify-between">
        <div className="text-[11px] text-[#9A958C]">
          Estimated Consultation Fee: <span className="font-bold text-teal-400">{formatPKR(currentDoctor?.fee || 2000)}</span> (Pay at Reception)
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-pill bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-xs tracking-wider uppercase shadow-glow-teal flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Confirming Booking...</span>
            </>
          ) : (
            <>
              <span>Confirm Appointment</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
