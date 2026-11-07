"use client";

import React, { useState, useEffect, useRef } from "react";
import { formatPKR, formatCNIC, formatMobile } from "@/lib/utils";
import { PrintThermalReceipt } from "@/components/PrintThermalReceipt";
import {
  UserPlus,
  CalendarPlus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Camera,
  RefreshCw,
  Clock,
  UserCheck,
  AlertCircle,
  X,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface ReceptionClientProps {
  initialDepartments: any[];
  initialDoctors: any[];
  hospitalProfile: any;
}

export default function ReceptionClient({
  initialDepartments,
  initialDoctors,
  hospitalProfile,
}: ReceptionClientProps) {
  const [activeTab, setActiveTab] = useState<"register" | "visit" | "search">("register");

  // Keyboard shortcuts: F2 = New Patient Intake, F3 = Patient Search, F4 = Issue OPD Token
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        setActiveTab("register");
      } else if (e.key === "F3") {
        e.preventDefault();
        setActiveTab("search");
      } else if (e.key === "F4") {
        e.preventDefault();
        setActiveTab("visit");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Registration Form State
  const [fullName, setFullName] = useState("");
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("MALE");
  const [cnic, setCnic] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Lahore");
  const [bloodGroup, setBloodGroup] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [allergies, setAllergies] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  // Live duplicate warning state
  const [duplicateWarning, setDuplicateWarning] = useState<any[]>([]);

  // Visit Form State
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [departmentId, setDepartmentId] = useState(initialDepartments[0]?.id || "");
  const [doctorId, setDoctorId] = useState(initialDoctors[0]?.id || "");
  const [visitType, setVisitType] = useState("OPD");
  const [priority, setPriority] = useState("NORMAL");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  // Global search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Success / Receipt modal state
  const [issuedVisit, setIssuedVisit] = useState<any | null>(null);
  const [registeredPatient, setRegisteredPatient] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Webcam capture state
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const filteredDoctors = initialDoctors.filter(
    (d) => !departmentId || d.departmentId === departmentId
  );
  const currentDoctor = initialDoctors.find((d) => d.id === doctorId) || filteredDoctors[0];
  const fee = currentDoctor?.fee || 2000;
  const netFee = Math.max(0, fee - discountAmount);

  // Debounced duplicate detection on CNIC or Mobile input
  useEffect(() => {
    if ((cnic.length >= 5 || mobile.length >= 7) && !selectedPatient) {
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(
            `/api/patients/check-duplicate?cnic=${encodeURIComponent(cnic)}&mobile=${encodeURIComponent(mobile)}`
          );
          const data = await res.json();
          if (data.duplicate) {
            setDuplicateWarning(data.matches || []);
          } else {
            setDuplicateWarning([]);
          }
        } catch (e) {
          console.error(e);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setDuplicateWarning([]);
    }
  }, [cnic, mobile, selectedPatient]);

  // Handle Patient Registration
  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          fatherOrHusbandName: fatherOrHusbandName.trim() || undefined,
          age: age ? Number(age) : undefined,
          gender,
          cnic: cnic.trim() || undefined,
          mobile: mobile.trim(),
          address: address.trim() || undefined,
          city: city.trim() || "Lahore",
          bloodGroup: bloodGroup || undefined,
          emergencyContact: emergencyContact.trim() || undefined,
          allergies: allergies.trim() || undefined,
          photoUrl: photoUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register patient.");
      }

      setRegisteredPatient(data.patient);
      setSelectedPatient(data.patient);
      // Auto move to visit tab for immediate token generation (under 30 sec)
      setActiveTab("visit");
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OPD Visit / Token creation
  const handleCreateVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      setErrorMessage("Please select or register a patient first.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          doctorId: currentDoctor.id,
          departmentId: currentDoctor.departmentId,
          visitType,
          priority,
          consultationFee: fee,
          discountAmount: Number(discountAmount) || 0,
          discountReason: discountReason || undefined,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to issue token.");
      }

      setIssuedVisit(data.visit);
      // Reset form
      setDiscountAmount(0);
      setDiscountReason("");
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Global Patient Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.patients || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Quick select an existing patient for visit
  const handleSelectExisting = (patient: any) => {
    setSelectedPatient(patient);
    setDuplicateWarning([]);
    setActiveTab("visit");
  };

  // Webcam capture toggle
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Webcam not accessible or permission denied.");
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0, 320, 240);
      setPhotoUrl(canvas.toDataURL("image/jpeg"));
      // Stop camera
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 80mm Thermal Receipt Modal */}
      {issuedVisit && (
        <PrintThermalReceipt
          visit={issuedVisit}
          hospitalProfile={hospitalProfile}
          onClose={() => setIssuedVisit(null)}
        />
      )}

      {/* Top Header & Fast Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight text-neutral-900 dark:text-white">
            Reception Desk Intake & OPD Entry
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            30-second keyboard-optimized patient entry, duplicate check, and instant 80mm thermal slip.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-neutral-100 dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10">
          <button
            onClick={() => setActiveTab("register")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "register"
                ? "bg-teal-500 text-black shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Patient (F2)</span>
          </button>

          <button
            onClick={() => setActiveTab("visit")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "visit"
                ? "bg-teal-500 text-black shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Issue Token (F4)</span>
          </button>

          <button
            onClick={() => setActiveTab("search")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "search"
                ? "bg-teal-500 text-black shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find Record (F3)</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Selected Patient Banner (for Visit Tab) */}
      {selectedPatient && activeTab === "visit" && (
        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500 text-black font-black flex items-center justify-center text-sm">
              {selectedPatient.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-900 dark:text-white text-sm">
                  {selectedPatient.fullName}
                </span>
                <span className="font-mono text-teal-700 dark:text-teal-400 font-bold bg-teal-100 dark:bg-teal-900/50 px-2 py-0.5 rounded text-[11px]">
                  {selectedPatient.mrNumber}
                </span>
              </div>
              <span className="text-neutral-600 dark:text-neutral-400 text-[11px]">
                {selectedPatient.gender} • {selectedPatient.age || "—"} Yrs • Mobile: {selectedPatient.mobile} • CNIC: {formatCNIC(selectedPatient.cnic)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setSelectedPatient(null)}
            className="text-xs font-semibold text-neutral-500 hover:text-red-500"
          >
            Change Patient
          </button>
        </div>
      )}

      {/* TAB 1: NEW PATIENT REGISTRATION */}
      {activeTab === "register" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft">
          {/* Duplicate warning popup */}
          {duplicateWarning.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Existing Patient Record Detected</span>
              </div>
              <p className="text-amber-700 dark:text-amber-400 mb-3 text-[11px]">
                A patient matching this CNIC or Mobile already exists in the hospital directory. Click below to open their existing record instead of creating a duplicate:
              </p>
              <div className="space-y-1.5">
                {duplicateWarning.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-black/40 border border-amber-200 dark:border-white/5"
                  >
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-white">{match.fullName}</span>
                      <span className="font-mono text-teal-600 dark:text-teal-400 ml-2">({match.mrNumber})</span>
                      <span className="text-[11px] text-neutral-500 block">
                        Mobile: {match.mobile} • CNIC: {formatCNIC(match.cnic)} • City: {match.city}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectExisting(match)}
                      className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-black font-bold text-xs"
                    >
                      Open & Issue Token
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleRegisterPatient} className="space-y-6 text-xs">
            {/* Section 1: Demographics */}
            <div>
              <span className="font-bold uppercase tracking-wider text-[11px] text-neutral-400 block mb-3">
                1. Patient Identity & Contact
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Asif"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Father / Husband Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tariq Mehmood"
                    value={fatherOrHusbandName}
                    onChange={(e) => setFatherOrHusbandName(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="125"
                    placeholder="34"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
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
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    CNIC (13 Digits)
                  </label>
                  <input
                    type="text"
                    placeholder="35201-1234567-1"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
                  >
                    <option value="">Unknown</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Address & Medical Notes */}
            <div className="pt-4 border-t border-neutral-200 dark:border-white/10">
              <span className="font-bold uppercase tracking-wider text-[11px] text-neutral-400 block mb-3">
                2. Residential & Clinical Safety Notes
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="House / Street / Area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Emergency Contact Number
                  </label>
                  <input
                    type="tel"
                    placeholder="0300-9876543"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-red-600 dark:text-red-400 font-semibold mb-1 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Known Drug Allergies (Shown in Doctor Banner)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Sulfa, Aspirin (or None)"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Webcam Capture (Optional) */}
            <div className="pt-4 border-t border-neutral-200 dark:border-white/10 flex items-center gap-4">
              <button
                type="button"
                onClick={cameraActive ? capturePhoto : startCamera}
                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-white/10 flex items-center gap-2"
              >
                <Camera className="w-4 h-4 text-teal-500" />
                <span>{cameraActive ? "Capture Snapshot" : "Patient Photo (Webcam)"}</span>
              </button>

              {cameraActive && (
                <div className="relative w-40 h-28 rounded-lg overflow-hidden border border-teal-500">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                </div>
              )}

              {photoUrl && (
                <div className="flex items-center gap-2">
                  <img src={photoUrl} alt="Patient" className="w-10 h-10 rounded-full border border-teal-500 object-cover" />
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">Photo Attached ✓</span>
                </div>
              )}
            </div>

            {/* Submission Actions */}
            <div className="pt-4 flex items-center justify-between border-t border-neutral-200 dark:border-white/10">
              <span className="text-[11px] text-neutral-400">
                MR Number will be auto-generated in format NIH-YYYY-XXXXXX
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-pill bg-teal-500 hover:bg-teal-600 text-black text-xs font-bold uppercase tracking-wider gap-2 shadow-glow-teal"
              >
                <span>Register & Proceed to Token</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: OPD VISIT ENTRY & TOKEN GENERATION */}
      {activeTab === "visit" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft">
          {!selectedPatient ? (
            <div className="text-center py-12 space-y-3">
              <UserCheck className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                No Patient Selected for Visit
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Please register a new patient (F2) or select a returning patient from the directory (F3) to issue an OPD token.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setActiveTab("register")}
                  className="btn-pill bg-teal-500 text-black text-xs font-bold"
                >
                  Register New Patient (F2)
                </button>
                <button
                  onClick={() => setActiveTab("search")}
                  className="btn-pill bg-neutral-100 dark:bg-white/10 text-xs font-bold"
                >
                  Search Patient (F3)
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateVisit} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Department */}
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Clinical Department *
                  </label>
                  <select
                    value={departmentId}
                    onChange={(e) => {
                      setDepartmentId(e.target.value);
                      const matching = initialDoctors.filter((d) => d.departmentId === e.target.value);
                      if (matching.length > 0) setDoctorId(matching[0].id);
                    }}
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
                  >
                    {initialDepartments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} {d.nameUrdu ? `(${d.nameUrdu})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Doctor */}
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Consultant Physician / Surgeon *
                  </label>
                  <select
                    value={doctorId || currentDoctor?.id}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
                  >
                    {filteredDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} - Room {doc.roomNo} ({formatPKR(doc.fee)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Visit Type */}
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Visit Type
                  </label>
                  <select
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
                  >
                    <option value="OPD">Regular OPD Consultation</option>
                    <option value="FOLLOWUP">Follow-up Visit</option>
                    <option value="EMERGENCY">Emergency Triage</option>
                    <option value="ADMISSION">Admission Referral</option>
                  </select>
                </div>
              </div>

              {/* Priority & Financials */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Triage Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 outline-none font-bold ${
                      priority === "EMERGENCY"
                        ? "bg-red-500 text-white border-red-600"
                        : "bg-white dark:bg-black/40 border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white"
                    }`}
                  >
                    <option value="NORMAL">Normal Priority</option>
                    <option value="EMERGENCY">🚨 Emergency Fast-Track</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Consultation Fee
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formatPKR(fee)}
                    className="w-full bg-neutral-200 dark:bg-black/40 border border-neutral-300 dark:border-white/10 rounded-xl px-3 py-2 font-mono font-bold text-neutral-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Discount Amount (PKR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={fee}
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full bg-white dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2 text-neutral-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-white dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2 text-neutral-900 dark:text-white font-bold"
                  >
                    <option value="CASH">Cash Payment</option>
                    <option value="CARD">Debit / Credit Card</option>
                    <option value="JAZZCASH">JazzCash</option>
                    <option value="EASYPAISA">Easypaisa</option>
                  </select>
                </div>
              </div>

              {discountAmount > 0 && (
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                    Reason for Discount
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hospital staff family / Welfare concession"
                    value={discountReason}
                    onChange={(e) => setDiscountReason(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
              )}

              {/* Total & Issue Token Button */}
              <div className="pt-4 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-500 block">Net Payable Amount</span>
                  <span className="font-display font-black text-2xl text-teal-600 dark:text-teal-400">
                    {formatPKR(netFee)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-pill bg-teal-500 hover:bg-teal-600 text-black text-xs font-bold uppercase tracking-wider gap-2 shadow-glow-teal"
                >
                  <Printer className="w-4 h-4" />
                  <span>Issue Token & Print 80mm Slip</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 3: SEARCH PATIENT DIRECTORY */}
      {activeTab === "search" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search by MR Number, Patient Name, Mobile or CNIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-neutral-900 dark:text-white outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="btn-pill bg-teal-500 hover:bg-teal-600 text-black text-xs font-bold px-6"
            >
              Search
            </button>
          </form>

          {/* Search Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-white/10 text-neutral-400">
                  <th className="py-2.5 px-3">MR Number</th>
                  <th className="py-2.5 px-3">Patient Name</th>
                  <th className="py-2.5 px-3">Age/Gender</th>
                  <th className="py-2.5 px-3">Mobile</th>
                  <th className="py-2.5 px-3">CNIC</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                {searchResults.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-400">
                      Enter a query above to search 50+ registered patients.
                    </td>
                  </tr>
                ) : (
                  searchResults.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                        {p.mrNumber}
                      </td>
                      <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white">
                        {p.fullName}
                      </td>
                      <td className="py-3 px-3">
                        {p.age || "—"} Yrs / {p.gender}
                      </td>
                      <td className="py-3 px-3 font-mono">{p.mobile}</td>
                      <td className="py-3 px-3 font-mono">{formatCNIC(p.cnic)}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleSelectExisting(p)}
                          className="px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500 text-teal-700 hover:text-black dark:text-teal-300 font-bold transition-colors"
                        >
                          New Visit &rarr;
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
