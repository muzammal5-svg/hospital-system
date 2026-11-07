"use client";

import React, { useState } from "react";
import { formatPKR } from "@/lib/utils";
import { Calendar, Clock, CheckCircle2, AlertCircle, ArrowRight, Loader2, User, Phone, FileText } from "lucide-react";

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
      <div className="text-center py-6 space-y-4 animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-[#E6F5F3] text-[#1E9E8F] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold font-heading text-[#0B4F8A] dark:text-[#E6EEF5]">
          Appointment Confirmed!
        </h3>
        <p className="text-sm text-[#5B6B7B] dark:text-[#94A7BA] max-w-md mx-auto">
          A confirmation SMS has been sent to{" "}
          <span className="text-[#1B2733] dark:text-white font-semibold">
            {confirmation.patientMobile}
          </span>
          .
        </p>

        <div className="max-w-md mx-auto bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-xl p-5 text-sm text-left space-y-2.5">
          <div className="flex justify-between border-b border-[#E3E9EF] dark:border-[#23374D] pb-2">
            <span className="text-[#5B6B7B] dark:text-[#94A7BA]">Booking Reference:</span>
            <span className="font-mono font-bold text-[#0B4F8A] dark:text-[#64B5F6]">
              {confirmation.referenceNo}
            </span>
          </div>
          <div className="flex justify-between border-b border-[#E3E9EF] dark:border-[#23374D] pb-2">
            <span className="text-[#5B6B7B] dark:text-[#94A7BA]">Doctor:</span>
            <span className="font-semibold text-[#1B2733] dark:text-white">{confirmation.doctor.name}</span>
          </div>
          <div className="flex justify-between border-b border-[#E3E9EF] dark:border-[#23374D] pb-2">
            <span className="text-[#5B6B7B] dark:text-[#94A7BA]">Date & Slot:</span>
            <span className="text-[#1B2733] dark:text-white">
              {confirmation.appointmentDate} at {confirmation.timeSlot}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5B6B7B] dark:text-[#94A7BA]">Consultation Room:</span>
            <span className="text-[#1B2733] dark:text-white font-semibold">{confirmation.doctor.roomNo}</span>
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
          className="btn-primary mt-4"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-sm">
      {error && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-[#D64545] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-medium text-xs">{error}</span>
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
          <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
            1. Select Department
          </label>
          <select
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setSelectedDoctor("");
            }}
            className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11"
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} {d.nameUrdu ? `(${d.nameUrdu})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
            2. Select Consultant
          </label>
          <select
            value={selectedDoctor || (currentDoctor?.id || "")}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11"
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
          <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
            3. Appointment Date
          </label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
            4. Available Time Slot
          </label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11"
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
      <div className="pt-2 border-t border-[#E3E9EF] dark:border-[#23374D]">
        <label className="block text-xs font-bold text-[#0B4F8A] dark:text-[#64B5F6] uppercase tracking-wider mb-3">
          5. Patient Details
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] block mb-1">Full Name *</span>
            <input
              type="text"
              placeholder="e.g. Tariq Mehmood"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11"
              required
            />
          </div>

          <div>
            <span className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] block mb-1">Mobile (03XX-XXXXXXX) *</span>
            <input
              type="tel"
              placeholder="0300-1234567"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] font-mono h-11"
              required
            />
          </div>

          <div>
            <span className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] block mb-1">CNIC (Optional)</span>
            <input
              type="text"
              placeholder="35201-1234567-1"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] font-mono h-11"
            />
          </div>
        </div>
      </div>

      <div>
        <span className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] block mb-1">
          Brief Reason for Visit or Symptoms (Optional)
        </span>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Routine blood pressure checkup, joint pain..."
          className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg p-3 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] resize-none text-xs"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[#5B6B7B] dark:text-[#94A7BA]">
          Estimated Fee:{" "}
          <span className="font-bold text-[#0B4F8A] dark:text-[#64B5F6]">
            {formatPKR(currentDoctor?.fee || 2000)}
          </span>{" "}
          (Payable upon arrival at Reception)
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-teal w-full sm:w-auto px-6 py-2.5 font-bold"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Confirming Booking...</span>
            </>
          ) : (
            <>
              <span>Confirm Appointment</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
