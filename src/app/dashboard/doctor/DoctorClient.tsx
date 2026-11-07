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
  HeartPulse,
  FileText,
  Pill,
  History,
  AlertTriangle,
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
  const [activeTab, setActiveTab] = useState<"vitals" | "consultation" | "prescription" | "history">("vitals");

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-[#E3E9EF]">
        <div>
          <h1 className="font-display font-bold text-2xl tracking-tight text-[#1B2733]">
            Doctor Consultation Console
          </h1>
          <p className="text-sm text-[#5B6B7B] mt-0.5">
            Examine patients, record vitals, write electronic prescriptions, and print official A4 letterheads.
          </p>
        </div>

        {/* Doctor Selector */}
        <div className="flex items-center gap-3">
          <label htmlFor="doctorSelect" className="text-xs font-semibold text-[#5B6B7B]">
            Consulting Physician:
          </label>
          <select
            id="doctorSelect"
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="bg-white border border-[#E3E9EF] rounded-lg px-3.5 py-2 text-xs font-semibold text-[#1B2733] shadow-sm outline-none focus:border-[#0B4F8A]"
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.specialty} • Room {d.roomNo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Console Split: Left Queue List / Right Active Consultation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Today's Patient Queue (Col 4) */}
        <div className="lg:col-span-4 rounded-xl bg-white border border-[#E3E9EF] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3E9EF]">
            <span className="font-semibold text-xs uppercase tracking-wider text-[#5B6B7B]">
              Today’s Queue ({doctorVisits.length})
            </span>
            <span className="text-xs font-bold text-[#0B4F8A] bg-[#E8F1F9] px-2.5 py-0.5 rounded-full">
              {waitingVisits.length} Waiting
            </span>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {doctorVisits.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#8A97A5]">
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
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isActive
                        ? "bg-[#E8F1F9] border-[#0B4F8A] shadow-sm"
                        : "bg-white border-[#E3E9EF] hover:border-[#0B4F8A]/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-lg text-[#0B4F8A] bg-white border border-[#E3E9EF] w-9 h-9 rounded-lg flex items-center justify-center shrink-0">
                          #{v.tokenNumber}
                        </span>
                        <div>
                          <span className="font-semibold text-sm text-[#1B2733] block">
                            {v.patient.fullName}
                          </span>
                          <span className="text-xs text-[#5B6B7B]">
                            MR: {v.patient.mrNumber} • {v.patient.age || "—"} Yrs ({v.patient.gender})
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          v.status === "IN_CONSULTATION"
                            ? "bg-[#0B4F8A] text-white"
                            : v.status === "COMPLETED"
                            ? "bg-[#E6F5F3] text-[#1E9E8F]"
                            : isEmergency
                            ? "bg-red-600 text-white font-bold"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {v.status.replace("_", " ")}
                      </span>
                    </div>

                    {v.status === "WAITING" && (
                      <div className="mt-3 pt-2.5 border-t border-[#E3E9EF] flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallCurrent(v.id);
                          }}
                          className="px-3 py-1 rounded-lg bg-[#1E9E8F] hover:bg-[#167C70] text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
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

        {/* Right Side: Active Consultation Console (Col 8) */}
        <div className="lg:col-span-8 rounded-xl bg-white border border-[#E3E9EF] p-6 shadow-sm space-y-6">
          {!activeVisit ? (
            <div className="py-20 text-center text-sm text-[#8A97A5] space-y-3">
              <Stethoscope className="w-12 h-12 text-[#8A97A5] mx-auto" />
              <p className="font-medium text-[#1B2733]">No patient selected</p>
              <p className="text-xs text-[#5B6B7B]">Select a patient from the queue on the left to start consultation.</p>
            </div>
          ) : (
            <form onSubmit={handleSavePrescription} className="space-y-6">
              {/* Patient Header Banner */}
              <div className="p-4 rounded-xl bg-[#F6F9FC] border border-[#E3E9EF] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#0B4F8A] text-white font-bold text-base flex items-center justify-center shadow-sm">
                    #{activeVisit.tokenNumber}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#1B2733]">
                      {activeVisit.patient.fullName}
                    </h3>
                    <span className="text-xs text-[#5B6B7B]">
                      MR No: <strong className="text-[#1B2733]">{activeVisit.patient.mrNumber}</strong> • {activeVisit.patient.gender} • {activeVisit.patient.age || "—"} Years • Phone: {activeVisit.patient.mobile}
                    </span>
                  </div>
                </div>

                {activeVisit.status === "WAITING" && (
                  <button
                    type="button"
                    onClick={() => handleCallCurrent(activeVisit.id)}
                    className="px-4 py-2 rounded-lg bg-[#1E9E8F] hover:bg-[#167C70] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Call to Room {currentDoctor.roomNo}</span>
                  </button>
                )}
              </div>

              {/* Critical Allergy Alert Banner */}
              {activeVisit.patient.allergies && activeVisit.patient.allergies.toLowerCase() !== "none" && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 font-semibold text-xs flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                  <span>
                    <strong>CRITICAL ALLERGY ALERT:</strong> {activeVisit.patient.allergies}
                  </span>
                </div>
              )}

              {/* Tabs Navigation for Doctor Detail Sections */}
              <div className="border-b border-[#E3E9EF] flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("vitals")}
                  className={`pb-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                    activeTab === "vitals"
                      ? "border-[#0B4F8A] text-[#0B4F8A]"
                      : "border-transparent text-[#5B6B7B] hover:text-[#1B2733]"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Vitals & Examination</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("consultation")}
                  className={`pb-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                    activeTab === "consultation"
                      ? "border-[#0B4F8A] text-[#0B4F8A]"
                      : "border-transparent text-[#5B6B7B] hover:text-[#1B2733]"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Consultation Notes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("prescription")}
                  className={`pb-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                    activeTab === "prescription"
                      ? "border-[#0B4F8A] text-[#0B4F8A]"
                      : "border-transparent text-[#5B6B7B] hover:text-[#1B2733]"
                  }`}
                >
                  <Pill className="w-3.5 h-3.5" />
                  <span>Prescription (Rx)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("history")}
                  className={`pb-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                    activeTab === "history"
                      ? "border-[#0B4F8A] text-[#0B4F8A]"
                      : "border-transparent text-[#5B6B7B] hover:text-[#1B2733]"
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Patient History</span>
                </button>
              </div>

              {/* Section 1: Vitals & Examination */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5B6B7B]">
                    Vitals & Examination
                  </h4>
                  <span className="text-[11px] text-[#8A97A5]">Recorded during triage</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-[#F6F9FC] p-3 rounded-lg border border-[#E3E9EF]">
                    <span className="text-[11px] font-semibold text-[#5B6B7B] block mb-1">BP (mmHg)</span>
                    <input
                      type="text"
                      value={bp}
                      onChange={(e) => setBp(e.target.value)}
                      className="w-full bg-white border border-[#E3E9EF] rounded-md py-1.5 px-2 font-mono text-center text-xs font-semibold text-[#1B2733] outline-none focus:border-[#0B4F8A]"
                    />
                  </div>
                  <div className="bg-[#F6F9FC] p-3 rounded-lg border border-[#E3E9EF]">
                    <span className="text-[11px] font-semibold text-[#5B6B7B] block mb-1">Pulse (bpm)</span>
                    <input
                      type="text"
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value)}
                      className="w-full bg-white border border-[#E3E9EF] rounded-md py-1.5 px-2 font-mono text-center text-xs font-semibold text-[#1B2733] outline-none focus:border-[#0B4F8A]"
                    />
                  </div>
                  <div className="bg-[#F6F9FC] p-3 rounded-lg border border-[#E3E9EF]">
                    <span className="text-[11px] font-semibold text-[#5B6B7B] block mb-1">Temp (°F)</span>
                    <input
                      type="text"
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                      className="w-full bg-white border border-[#E3E9EF] rounded-md py-1.5 px-2 font-mono text-center text-xs font-semibold text-[#1B2733] outline-none focus:border-[#0B4F8A]"
                    />
                  </div>
                  <div className="bg-[#F6F9FC] p-3 rounded-lg border border-[#E3E9EF]">
                    <span className="text-[11px] font-semibold text-[#5B6B7B] block mb-1">Weight (kg)</span>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-white border border-[#E3E9EF] rounded-md py-1.5 px-2 font-mono text-center text-xs font-semibold text-[#1B2733] outline-none focus:border-[#0B4F8A]"
                    />
                  </div>
                  <div className="bg-[#F6F9FC] p-3 rounded-lg border border-[#E3E9EF]">
                    <span className="text-[11px] font-semibold text-[#5B6B7B] block mb-1">SpO2 (%)</span>
                    <input
                      type="text"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      className="w-full bg-white border border-[#E3E9EF] rounded-md py-1.5 px-2 font-mono text-center text-xs font-semibold text-[#1B2733] outline-none focus:border-[#0B4F8A]"
                    />
                  </div>
                </div>
              </div>

              {/* Diagnosis & Symptoms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                    Provisional Diagnosis <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acute Pharyngitis / Type 2 Diabetes"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full bg-white border border-[#E3E9EF] rounded-lg px-3.5 py-2.5 text-xs text-[#1B2733] outline-none focus:border-[#0B4F8A] shadow-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                    Symptoms & Complaints
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fever, dry cough, body aches for 3 days"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full bg-white border border-[#E3E9EF] rounded-lg px-3.5 py-2.5 text-xs text-[#1B2733] outline-none focus:border-[#0B4F8A] shadow-sm font-medium"
                  />
                </div>
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                  Clinical Examination & Laboratory Orders
                </label>
                <textarea
                  rows={2}
                  placeholder="Clinical notes, chest examination, CBC, Blood Sugar Fasting, Chest X-Ray..."
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full bg-white border border-[#E3E9EF] rounded-lg p-3 text-xs text-[#1B2733] outline-none focus:border-[#0B4F8A] shadow-sm resize-none"
                />
              </div>

              {/* Prescription Items (℞) with Autocomplete */}
              <div className="space-y-3 pt-3 border-t border-[#E3E9EF]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif italic font-bold text-xl text-[#0B4F8A]">℞</span>
                    <span className="font-semibold text-xs uppercase tracking-wider text-[#1B2733]">
                      Prescribed Medications (Search catalog)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="px-3 py-1.5 rounded-lg bg-[#E8F1F9] hover:bg-[#0B4F8A] text-[#0B4F8A] hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative p-3 rounded-lg bg-[#F6F9FC] border border-[#E3E9EF] grid grid-cols-12 gap-2.5 items-center"
                    >
                      {/* Medicine Name with Autocomplete */}
                      <div className="col-span-12 sm:col-span-4 relative">
                        <span className="text-[10px] font-semibold text-[#5B6B7B] block mb-1">Medicine Name</span>
                        <input
                          type="text"
                          required
                          placeholder="Type Panadol, Augmentin, Risek..."
                          value={item.medicineName}
                          onChange={(e) => handleMedicineNameChange(e.target.value, idx)}
                          className="w-full bg-white border border-[#E3E9EF] rounded-md px-2.5 py-1.5 text-xs text-[#1B2733] outline-none focus:border-[#0B4F8A] font-medium"
                        />

                        {/* Autocomplete Popup */}
                        {activeItemIndex === idx && autocompleteResults.length > 0 && (
                          <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-[#E3E9EF] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {autocompleteResults.map((med) => (
                              <div
                                key={med.id}
                                onClick={() => handleSelectMedicineMatch(med, idx)}
                                className="p-2.5 hover:bg-[#E8F1F9] cursor-pointer border-b border-[#E3E9EF] last:border-none"
                              >
                                <span className="font-semibold text-xs text-[#1B2733] block">{med.name}</span>
                                <span className="text-[10px] text-[#5B6B7B]">
                                  {med.genericName} • {med.category}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Dosage */}
                      <div className="col-span-6 sm:col-span-2">
                        <span className="text-[10px] font-semibold text-[#5B6B7B] block mb-1">Dosage</span>
                        <input
                          type="text"
                          required
                          value={item.dosage}
                          onChange={(e) => {
                            const updated = [...items];
                            updated[idx].dosage = e.target.value;
                            setItems(updated);
                          }}
                          className="w-full bg-white border border-[#E3E9EF] rounded-md px-2 py-1.5 text-xs text-[#1B2733] outline-none focus:border-[#0B4F8A]"
                        />
                      </div>

                      {/* Frequency */}
                      <div className="col-span-6 sm:col-span-2">
                        <span className="text-[10px] font-semibold text-[#5B6B7B] block mb-1">Frequency</span>
                        <select
                          value={item.frequency}
                          onChange={(e) => {
                            const updated = [...items];
                            updated[idx].frequency = e.target.value;
                            setItems(updated);
                          }}
                          className="w-full bg-white border border-[#E3E9EF] rounded-md px-2 py-1.5 text-xs text-[#0B4F8A] font-semibold outline-none focus:border-[#0B4F8A]"
                        >
                          <option value="1-0-0">1-0-0 (Morning)</option>
                          <option value="0-0-1">0-0-1 (Night)</option>
                          <option value="1-0-1">1-0-1 (Morning & Night)</option>
                          <option value="1-1-1">1-1-1 (TDS - 3 times)</option>
                          <option value="PRN">PRN (As Needed)</option>
                        </select>
                      </div>

                      {/* Duration */}
                      <div className="col-span-10 sm:col-span-3">
                        <span className="text-[10px] font-semibold text-[#5B6B7B] block mb-1">Duration / Instructions</span>
                        <input
                          type="text"
                          value={item.duration}
                          placeholder="5 days - after food"
                          onChange={(e) => {
                            const updated = [...items];
                            updated[idx].duration = e.target.value;
                            setItems(updated);
                          }}
                          className="w-full bg-white border border-[#E3E9EF] rounded-md px-2 py-1.5 text-xs text-[#1B2733] outline-none focus:border-[#0B4F8A]"
                        />
                      </div>

                      {/* Delete Row */}
                      <div className="col-span-2 sm:col-span-1 flex justify-end pt-3">
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicineRow(idx)}
                          className="p-1.5 text-[#8A97A5] hover:text-red-600 rounded"
                          title="Remove row"
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
                  <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                    Follow-Up Date / Advice
                  </label>
                  <input
                    type="text"
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    placeholder="e.g. Return in 5 days or if symptoms worsen"
                    className="w-full bg-white border border-[#E3E9EF] rounded-lg px-3.5 py-2 text-xs text-[#1B2733] outline-none focus:border-[#0B4F8A] shadow-sm"
                  />
                </div>
              </div>

              {/* Form Action Footer */}
              <div className="pt-4 border-t border-[#E3E9EF] flex items-center justify-between">
                {successMsg && (
                  <span className="text-[#2E9E6B] font-semibold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{successMsg}</span>
                  </span>
                )}

                <div className="ml-auto flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-lg bg-[#0B4F8A] hover:bg-[#093F6E] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
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
