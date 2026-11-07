"use client";

import React, { useState, useEffect } from "react";
import { formatPKR, formatDate } from "@/lib/utils";
import { PrintA4Prescription } from "@/components/PrintA4Prescription";
import {
  Stethoscope,
  Volume2,
  CheckCircle2,
  Plus,
  Trash2,
  Printer,
  ShieldAlert,
  Search,
  Activity,
  Calendar,
  Clock,
  User,
} from "lucide-react";

interface DoctorClientProps {
  initialVisits: any[];
  doctors: any[];
  currentDoctorId?: string | null;
}

export default function DoctorClient({
  initialVisits,
  doctors,
  currentDoctorId,
}: DoctorClientProps) {
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    currentDoctorId || doctors[0]?.id || ""
  );
  const [visits, setVisits] = useState(initialVisits);
  const [activeVisit, setActiveVisit] = useState<any | null>(null);

  // Prescription Form State
  const [diagnosis, setDiagnosis] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [bp, setBp] = useState("120/80");
  const [pulse, setPulse] = useState("76");
  const [temp, setTemp] = useState("98.6");
  const [weight, setWeight] = useState("70");
  const [spo2, setSpo2] = useState("98%");
  const [followUp, setFollowUp] = useState("In 7 days for review");

  // Prescription Items
  const [items, setItems] = useState<Array<{
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>>([
    {
      medicineName: "Panadol 500mg",
      dosage: "500mg",
      frequency: "1-1-1",
      duration: "3 days",
      instructions: "After meals",
    },
  ]);

  // Autocomplete medicine catalog
  const [medicines, setMedicines] = useState<any[]>([]);
  const [medicineQuery, setMedicineQuery] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState<any[]>([]);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  // Print Prescription Modal
  const [prescriptionToPrint, setPrescriptionToPrint] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  // Filter visits for current doctor
  const doctorVisits = visits.filter((v) => v.doctorId === selectedDoctorId);
  const waitingVisits = doctorVisits.filter((v) => v.status === "WAITING");
  const activeConsultation = doctorVisits.find((v) => v.status === "IN_CONSULTATION");

  useEffect(() => {
    if (activeConsultation) {
      setActiveVisit(activeConsultation);
    } else if (waitingVisits.length > 0 && !activeVisit) {
      setActiveVisit(waitingVisits[0]);
    }
  }, [selectedDoctorId, visits]);

  // Fetch medicines for autocomplete
  useEffect(() => {
    fetch("/api/medicines")
      .then((res) => res.json())
      .then((data) => setMedicines(data.medicines || []))
      .catch(console.error);
  }, []);

  const handleCallCurrent = async (visitId: string) => {
    try {
      const res = await fetch(`/api/visits/${visitId}/call`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        // Refresh visits
        const updated = visits.map((v) =>
          v.id === visitId ? { ...v, status: "IN_CONSULTATION" } : v
        );
        setVisits(updated);
        setActiveVisit(data.visit);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddMedicineRow = () => {
    setItems([
      ...items,
      { medicineName: "", dosage: "1 tab", frequency: "1-0-1", duration: "5 days", instructions: "After food" },
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleMedicineNameChange = (val: string, index: number) => {
    const updated = [...items];
    updated[index].medicineName = val;
    setItems(updated);

    if (val.length >= 2) {
      const matches = medicines.filter(
        (m) =>
          m.name.toLowerCase().includes(val.toLowerCase()) ||
          (m.genericName && m.genericName.toLowerCase().includes(val.toLowerCase()))
      );
      setAutocompleteResults(matches);
      setActiveItemIndex(index);
    } else {
      setAutocompleteResults([]);
      setActiveItemIndex(null);
    }
  };

  const handleSelectMedicineMatch = (med: any, index: number) => {
    const updated = [...items];
    updated[index].medicineName = med.name;
    if (med.commonDosage) {
      const parts = med.commonDosage.split(" ");
      if (parts[1]) updated[index].dosage = parts[0] + " " + parts[1];
    }
    setItems(updated);
    setAutocompleteResults([]);
    setActiveItemIndex(null);
  };

  const handleSavePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVisit) return;

    setIsSubmitting(true);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitId: activeVisit.id,
          patientId: activeVisit.patientId,
          doctorId: currentDoctor.id,
          diagnosis: diagnosis.trim() || "Clinical Examination",
          symptoms: symptoms.trim() || undefined,
          clinicalNotes: clinicalNotes.trim() || undefined,
          bloodPressure: bp,
          pulse,
          temperature: temp,
          weight,
          oxygenSaturation: spo2,
          followUpDate: followUp,
          items: items.filter((it) => it.medicineName.trim().length > 0),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save prescription.");
      }

      setPrescriptionToPrint(data.prescription);
      setSuccessMsg("Prescription saved and consultation marked complete.");

      // Refresh list
      const updated = visits.map((v) =>
        v.id === activeVisit.id ? { ...v, status: "COMPLETED" } : v
      );
      setVisits(updated);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Printable A4 Prescription Modal */}
      {prescriptionToPrint && (
        <PrintA4Prescription
          prescription={prescriptionToPrint}
          onClose={() => setPrescriptionToPrint(null)}
        />
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight text-neutral-900 dark:text-white">
            Physician Consultation Console
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Prescription writing with medicine autocomplete and hospital letterhead print.
          </p>
        </div>

        {/* Doctor Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-neutral-500">Doctor Room:</span>
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs font-bold text-neutral-900 dark:text-white outline-none"
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.specialty} • Room {d.roomNo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Console Split: Left Queue List / Right Active Prescription */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Today's Doctor Queue (Col 4) */}
        <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 p-5 shadow-card-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-white/10">
            <span className="font-bold text-xs uppercase text-neutral-400">
              Today’s Patient Queue ({doctorVisits.length})
            </span>
            <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-bold">
              {waitingVisits.length} Waiting
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {doctorVisits.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                No patients queued for {currentDoctor.name} today.
              </div>
            ) : (
              doctorVisits.map((v) => {
                const isActive = activeVisit?.id === v.id;
                const isEmergency = v.priority === "EMERGENCY";

                return (
                  <div
                    key={v.id}
                    onClick={() => setActiveVisit(v)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? "bg-teal-50 dark:bg-teal-950/40 border-teal-500 shadow-sm"
                        : "bg-neutral-50 dark:bg-[#11171E] border-neutral-200 dark:border-white/5 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-lg text-teal-600 dark:text-teal-400">
                          #{v.tokenNumber}
                        </span>
                        <div>
                          <span className="font-bold text-xs text-neutral-900 dark:text-white block">
                            {v.patient.fullName}
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            MR: {v.patient.mrNumber} • {v.patient.age || "—"} Yrs ({v.patient.gender})
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          v.status === "IN_CONSULTATION"
                            ? "bg-blue-500 text-white animate-pulse"
                            : v.status === "COMPLETED"
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                            : isEmergency
                            ? "bg-red-500 text-white font-black"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                        }`}
                      >
                        {v.status.replace("_", " ")}
                      </span>
                    </div>

                    {v.status === "WAITING" && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-200/50 dark:border-white/5 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallCurrent(v.id);
                          }}
                          className="px-2.5 py-1 rounded bg-teal-500 hover:bg-teal-600 text-black font-bold text-[11px] flex items-center gap-1"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Call Patient</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Consultation & Prescription Form (Col 8) */}
        <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 p-6 shadow-card-soft space-y-6">
          {!activeVisit ? (
            <div className="py-16 text-center text-xs text-neutral-400 space-y-2">
              <Stethoscope className="w-10 h-10 text-neutral-400 mx-auto" />
              <p>Select a patient from the left queue to begin consultation and prescription.</p>
            </div>
          ) : (
            <form onSubmit={handleSavePrescription} className="space-y-6 text-xs">
              {/* Patient Banner */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500 text-black font-bold text-sm flex items-center justify-center">
                    #{activeVisit.tokenNumber}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                      {activeVisit.patient.fullName}
                    </h3>
                    <span className="text-[11px] text-neutral-500">
                      MR: {activeVisit.patient.mrNumber} • {activeVisit.patient.gender} • {activeVisit.patient.age || "—"} Yrs • Phone: {activeVisit.patient.mobile}
                    </span>
                  </div>
                </div>

                {activeVisit.status === "WAITING" && (
                  <button
                    type="button"
                    onClick={() => handleCallCurrent(activeVisit.id)}
                    className="btn-pill bg-teal-500 hover:bg-teal-600 text-black text-xs font-bold gap-1.5 py-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Call to Room {currentDoctor.roomNo}</span>
                  </button>
                )}
              </div>

              {/* Allergies Alert Banner */}
              {activeVisit.patient.allergies && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
                  <span>CRITICAL ALLERGY ALERT: {activeVisit.patient.allergies}</span>
                </div>
              )}

              {/* Vitals Recording Row */}
              <div>
                <span className="font-bold uppercase text-[10px] tracking-wider text-neutral-400 block mb-2">
                  Patient Vitals
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <span className="text-[10px] text-neutral-500 block mb-0.5">BP (mmHg)</span>
                    <input
                      type="text"
                      value={bp}
                      onChange={(e) => setBp(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-black/30 border border-neutral-200 dark:border-white/10 rounded-lg p-2 font-mono text-center text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block mb-0.5">Pulse (bpm)</span>
                    <input
                      type="text"
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-black/30 border border-neutral-200 dark:border-white/10 rounded-lg p-2 font-mono text-center text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block mb-0.5">Temp (°F)</span>
                    <input
                      type="text"
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-black/30 border border-neutral-200 dark:border-white/10 rounded-lg p-2 font-mono text-center text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block mb-0.5">Weight (kg)</span>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-black/30 border border-neutral-200 dark:border-white/10 rounded-lg p-2 font-mono text-center text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block mb-0.5">SpO2 (%)</span>
                    <input
                      type="text"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-black/30 border border-neutral-200 dark:border-white/10 rounded-lg p-2 font-mono text-center text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Diagnosis & Symptoms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Provisional Diagnosis *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acute Pharyngitis / Type 2 Diabetes"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Symptoms & Complaints
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fever, dry cough, body aches for 3 days"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                  Clinical Examination & Laboratory Orders
                </label>
                <textarea
                  rows={2}
                  placeholder="Clinical notes, CBC, Blood Sugar Fasting, Chest X-Ray..."
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl p-3 text-neutral-900 dark:text-white outline-none focus:border-teal-500 resize-none"
                />
              </div>

              {/* Prescription Items (℞) with Autocomplete */}
              <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif italic font-bold text-lg text-teal-600">℞</span>
                    <span className="font-bold text-xs uppercase text-neutral-700 dark:text-neutral-300">
                      Prescription Medicines (Autocomplete Enabled)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500 text-teal-700 hover:text-black dark:text-teal-300 font-bold text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="relative p-3 rounded-xl bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 grid grid-cols-12 gap-2 items-center">
                      {/* Medicine Name with Autocomplete Dropdown */}
                      <div className="col-span-12 sm:col-span-4 relative">
                        <span className="text-[10px] text-neutral-400 block mb-0.5">Medicine Name</span>
                        <input
                          type="text"
                          required
                          placeholder="Type Panadol, Augmentin, Risek..."
                          value={item.medicineName}
                          onChange={(e) => handleMedicineNameChange(e.target.value, idx)}
                          className="w-full bg-white dark:bg-black/30 border border-neutral-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 dark:text-white outline-none focus:border-teal-500 font-semibold"
                        />

                        {/* Autocomplete Popup */}
                        {activeItemIndex === idx && autocompleteResults.length > 0 && (
                          <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                            {autocompleteResults.map((med) => (
                              <div
                                key={med.id}
                                onClick={() => handleSelectMedicineMatch(med, idx)}
                                className="p-2 hover:bg-teal-50 dark:hover:bg-teal-950/40 cursor-pointer border-b border-neutral-100 dark:border-white/5"
                              >
                                <span className="font-bold text-neutral-900 dark:text-white block">{med.name}</span>
                                <span className="text-[10px] text-neutral-500">
                                  {med.genericName} • {med.category}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Dosage */}
                      <div className="col-span-6 sm:col-span-2">
                        <span className="text-[10px] text-neutral-400 block mb-0.5">Dosage</span>
                        <input
                          type="text"
                          required
                          value={item.dosage}
                          onChange={(e) => {
                            const updated = [...items];
                            updated[idx].dosage = e.target.value;
                            setItems(updated);
                          }}
                          className="w-full bg-white dark:bg-black/30 border border-neutral-200 dark:border-white/10 rounded-lg px-2 py-1.5 text-xs text-neutral-900 dark:text-white outline-none"
                        />
                      </div>

                      {/* Frequency */}
                      <div className="col-span-6 sm:col-span-2">
                        <span className="text-[10px] text-neutral-400 block mb-0.5">Frequency</span>
                        <select
                          value={item.frequency}
                          onChange={(e) => {
                            const updated = [...items];
                            updated[idx].frequency = e.target.value;
                            setItems(updated);
                          }}
                          className="w-full bg-white dark:bg-black/30 border border-neutral-200 dark:border-white/10 rounded-lg px-2 py-1.5 text-xs text-neutral-900 dark:text-white outline-none font-semibold text-teal-600 dark:text-teal-400"
                        >
                          <option value="1-0-0">1-0-0 (Morning)</option>
                          <option value="0-0-1">0-0-1 (Night)</option>
                          <option value="1-0-1">1-0-1 (Morning & Night)</option>
                          <option value="1-1-1">1-1-1 (TDS - 3 times)</option>
                          <option value="PRN">PRN (As Needed)</option>
                        </select>
                      </div>

                      {/* Duration */}
                      <div className="col-span-8 sm:col-span-3">
                        <span className="text-[10px] text-neutral-400 block mb-0.5">Duration / Instructions</span>
                        <input
                          type="text"
                          value={item.duration}
                          placeholder="5 days - after food"
                          onChange={(e) => {
                            const updated = [...items];
                            updated[idx].duration = e.target.value;
                            setItems(updated);
                          }}
                          className="w-full bg-white dark:bg-black/30 border border-neutral-200 dark:border-white/10 rounded-lg px-2 py-1.5 text-xs text-neutral-900 dark:text-white outline-none"
                        />
                      </div>

                      {/* Delete */}
                      <div className="col-span-4 sm:col-span-1 flex justify-end pt-3">
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicineRow(idx)}
                          className="p-1.5 text-neutral-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-up Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Follow-Up Date / Advice
                  </label>
                  <input
                    type="text"
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    placeholder="e.g. Return in 5 days or if symptoms worsen"
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between">
                {successMsg && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{successMsg}</span>
                  </span>
                )}

                <div className="ml-auto flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-pill bg-teal-500 hover:bg-teal-600 text-black text-xs font-bold uppercase tracking-wider gap-2 shadow-glow-teal"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Save & Print A4 Prescription</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
