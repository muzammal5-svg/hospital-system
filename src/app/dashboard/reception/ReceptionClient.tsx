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
  Clock,
  UserCheck,
  AlertCircle,
  X,
  ArrowRight,
  ShieldAlert,
  Users,
  FileText,
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

  // Today recent visits state
  const [recentVisits, setRecentVisits] = useState<any[]>([]);

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

  // Fetch recent visits for right panel
  const fetchRecentVisits = async () => {
    try {
      const res = await fetch("/api/queue");
      if (res.ok) {
        const data = await res.json();
        setRecentVisits((data.visits || []).slice(0, 5));
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchRecentVisits();
  }, []);

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
      fetchRecentVisits();
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

  const handleSelectExisting = (patient: any) => {
    setSelectedPatient(patient);
    setDuplicateWarning([]);
    setActiveTab("visit");
  };

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

      {/* Top Header & Switcher */}
      <div className="hospital-card p-5 bg-white dark:bg-[#162638] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#0B4F8A] dark:text-white">
            Reception Desk &amp; Patient Intake
          </h1>
          <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-0.5">
            Rapid patient intake, CNIC duplicate check, and instant 80mm thermal token receipt.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 p-1 rounded-lg bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D]">
          <button
            onClick={() => setActiveTab("register")}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "register"
                ? "bg-[#0B4F8A] text-white shadow-sm"
                : "text-[#5B6B7B] dark:text-[#94A7BA] hover:text-[#0B4F8A] dark:hover:text-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Patient (F2)</span>
          </button>

          <button
            onClick={() => setActiveTab("visit")}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "visit"
                ? "bg-[#0B4F8A] text-white shadow-sm"
                : "text-[#5B6B7B] dark:text-[#94A7BA] hover:text-[#0B4F8A] dark:hover:text-white"
            }`}
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Issue Token (F4)</span>
          </button>

          <button
            onClick={() => setActiveTab("search")}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "search"
                ? "bg-[#0B4F8A] text-white shadow-sm"
                : "text-[#5B6B7B] dark:text-[#94A7BA] hover:text-[#0B4F8A] dark:hover:text-white"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find Record (F3)</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-[#D64545] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Main Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Selected Patient Banner (for Visit Tab) */}
          {selectedPatient && activeTab === "visit" && (
            <div className="p-4 rounded-xl bg-[#E6F5F3] dark:bg-teal-950/40 border border-[#1E9E8F]/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1E9E8F] text-white font-bold flex items-center justify-center text-sm">
                  {selectedPatient.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1B2733] dark:text-white text-sm">
                      {selectedPatient.fullName}
                    </span>
                    <span className="font-mono text-[#0B4F8A] dark:text-[#64B5F6] font-bold bg-white dark:bg-[#162638] px-2 py-0.5 rounded text-[11px] border border-[#E3E9EF] dark:border-[#23374D]">
                      {selectedPatient.mrNumber}
                    </span>
                  </div>
                  <span className="text-[#5B6B7B] dark:text-[#94A7BA] text-[11px]">
                    {selectedPatient.gender} &bull; {selectedPatient.age || "—"} Yrs &bull; Mobile: {selectedPatient.mobile} &bull; CNIC: {formatCNIC(selectedPatient.cnic)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="text-xs font-semibold text-[#0B4F8A] hover:underline cursor-pointer"
              >
                Change Patient
              </button>
            </div>
          )}

          {/* TAB 1: NEW PATIENT REGISTRATION FORM */}
          {activeTab === "register" && (
            <div className="hospital-card p-6 bg-white dark:bg-[#162638]">
              {/* Duplicate warning popup */}
              {duplicateWarning.length > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-300 dark:border-amber-700 text-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Existing Patient Found</span>
                  </div>
                  <p className="text-amber-800 dark:text-amber-400 mb-3 text-xs leading-relaxed">
                    A patient matching this CNIC or Mobile already exists in the hospital directory. Click below to open their existing record instead of creating a duplicate:
                  </p>
                  <div className="space-y-2">
                    {duplicateWarning.map((match) => (
                      <div
                        key={match.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-[#111B27] border border-amber-200 dark:border-amber-800"
                      >
                        <div>
                          <span className="font-bold text-[#1B2733] dark:text-white">{match.fullName}</span>
                          <span className="font-mono text-[#0B4F8A] dark:text-[#64B5F6] ml-2">({match.mrNumber})</span>
                          <span className="text-[11px] text-[#5B6B7B] dark:text-[#94A7BA] block mt-0.5">
                            Mobile: {match.mobile} &bull; CNIC: {formatCNIC(match.cnic)} &bull; City: {match.city}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSelectExisting(match)}
                          className="btn-teal text-xs py-1.5 px-3"
                        >
                          Open &amp; Issue Token
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleRegisterPatient} className="space-y-6 text-xs">
                {/* Section 1: Personal Information */}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider text-[#0B4F8A] dark:text-[#64B5F6] mb-3 pb-2 border-b border-[#E3E9EF] dark:border-[#23374D]">
                    1. Personal Information
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Muhammad Asif"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        Father / Husband Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Tariq Mehmood"
                        value={fatherOrHusbandName}
                        onChange={(e) => setFatherOrHusbandName(e.target.value)}
                        className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        Gender *
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11 text-xs"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="125"
                        placeholder="34"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0300-1234567"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        CNIC (13 Digits)
                      </label>
                      <input
                        type="text"
                        placeholder="35201-1234567-1"
                        value={cnic}
                        onChange={(e) => setCnic(e.target.value)}
                        className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        Blood Group
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11 text-xs"
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

                {/* Section 2: Contact & Address */}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider text-[#0B4F8A] dark:text-[#64B5F6] mb-3 pb-2 border-b border-[#E3E9EF] dark:border-[#23374D]">
                    2. Address &amp; Emergency Contact
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        Residential Address
                      </label>
                      <input
                        type="text"
                        placeholder="House / Street / Area"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        Emergency Contact Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="0300-9876543"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] font-mono h-11 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#D64545] mb-1.5 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Known Drug Allergies (Alert in Doctor Banner)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Penicillin, Sulfa, Aspirin (or None)"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        className="w-full bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#D64545] h-11 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Webcam Capture */}
                <div className="pt-2 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={cameraActive ? capturePhoto : startCamera}
                    className="btn-secondary text-xs py-2 px-3.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#0B4F8A]" />
                    <span>{cameraActive ? "Capture Snapshot" : "Patient Photo (Webcam)"}</span>
                  </button>

                  {cameraActive && (
                    <div className="relative w-36 h-24 rounded-lg overflow-hidden border border-[#0B4F8A]">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    </div>
                  )}

                  {photoUrl && (
                    <div className="flex items-center gap-2">
                      <img src={photoUrl} alt="Patient" className="w-9 h-9 rounded-full border border-[#1E9E8F] object-cover" />
                      <span className="text-[11px] text-[#1E9E8F] font-semibold">Photo Attached ✓</span>
                    </div>
                  )}
                </div>

                {/* Submit Actions */}
                <div className="pt-4 flex items-center justify-between border-t border-[#E3E9EF] dark:border-[#23374D]">
                  <span className="text-[11px] text-[#5B6B7B] dark:text-[#94A7BA]">
                    MR Number auto-assigned in format NIH-YYYY-XXXXXX
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary text-xs py-2.5 px-5 font-bold"
                  >
                    <span>Register &amp; Proceed to Token</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: OPD VISIT / TOKEN CREATION FORM */}
          {activeTab === "visit" && (
            <div className="hospital-card p-6 bg-white dark:bg-[#162638]">
              {!selectedPatient ? (
                <div className="text-center py-12 space-y-3">
                  <UserCheck className="w-10 h-10 text-[#8A97A5] mx-auto" />
                  <h3 className="font-bold text-base text-[#1B2733] dark:text-white font-heading">
                    No Patient Selected for Visit
                  </h3>
                  <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] max-w-sm mx-auto">
                    Please register a new patient (F2) or select a returning patient from the directory (F3) to issue an OPD token.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => setActiveTab("register")}
                      className="btn-primary text-xs py-2 px-4"
                    >
                      Register New Patient (F2)
                    </button>
                    <button
                      onClick={() => setActiveTab("search")}
                      className="btn-secondary text-xs py-2 px-4"
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
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        Clinical Department *
                      </label>
                      <select
                        value={departmentId}
                        onChange={(e) => {
                          setDepartmentId(e.target.value);
                          const matching = initialDoctors.filter((d) => d.departmentId === e.target.value);
                          if (matching.length > 0) setDoctorId(matching[0].id);
                        }}
                        className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11 text-xs"
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
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        Consultant *
                      </label>
                      <select
                        value={doctorId || currentDoctor?.id}
                        onChange={(e) => setDoctorId(e.target.value)}
                        className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11 text-xs"
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
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        Visit Type
                      </label>
                      <select
                        value={visitType}
                        onChange={(e) => setVisitType(e.target.value)}
                        className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11 text-xs"
                      >
                        <option value="OPD">Regular OPD Consultation</option>
                        <option value="FOLLOWUP">Follow-up Visit</option>
                        <option value="EMERGENCY">Emergency Triage</option>
                        <option value="ADMISSION">Admission Referral</option>
                      </select>
                    </div>
                  </div>

                  {/* Priority & Financials */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D]">
                    <div>
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        Triage Priority
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 outline-none font-semibold h-11 text-xs ${
                          priority === "EMERGENCY"
                            ? "bg-red-500 text-white border-red-600"
                            : "bg-white dark:bg-[#162638] border-[#E3E9EF] dark:border-[#23374D] text-[#1B2733] dark:text-[#E6EEF5]"
                        }`}
                      >
                        <option value="NORMAL">Normal Priority</option>
                        <option value="EMERGENCY">🚨 Emergency Fast-Track</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        Consultation Fee
                      </label>
                      <input
                        type="text"
                        disabled
                        value={formatPKR(fee)}
                        className="w-full bg-[#E3E9EF] dark:bg-[#1E3147] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2 font-mono font-bold text-[#1B2733] dark:text-white h-11 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        Discount Amount (PKR)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={fee}
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full bg-white dark:bg-[#162638] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2 text-[#1B2733] dark:text-[#E6EEF5] font-mono h-11 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        Payment Method
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full bg-white dark:bg-[#162638] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2 text-[#1B2733] dark:text-[#E6EEF5] font-bold h-11 text-xs"
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
                      <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                        Reason for Discount *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hospital staff family / Welfare concession"
                        value={discountReason}
                        onChange={(e) => setDiscountReason(e.target.value)}
                        className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11 text-xs"
                      />
                    </div>
                  )}

                  {/* Total & Submit */}
                  <div className="pt-4 border-t border-[#E3E9EF] dark:border-[#23374D] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] block">Net Payable Amount</span>
                      <span className="text-2xl font-bold font-heading text-[#0B4F8A] dark:text-[#64B5F6]">
                        {formatPKR(netFee)}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary text-xs py-2.5 px-5 font-bold"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Issue Token &amp; Print Slip</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: SEARCH PATIENT DIRECTORY */}
          {activeTab === "search" && (
            <div className="hospital-card p-6 bg-white dark:bg-[#162638] space-y-4">
              <form onSubmit={handleSearch} className="flex gap-2.5">
                <input
                  type="text"
                  placeholder="Search by MR Number, Patient Name, Mobile or CNIC..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-4 py-2 text-xs text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="btn-primary text-xs px-6 font-bold h-11"
                >
                  Search
                </button>
              </form>

              <div className="overflow-x-auto">
                <table className="w-full text-xs hospital-table text-left">
                  <thead>
                    <tr>
                      <th>MR Number</th>
                      <th>Patient Name</th>
                      <th>Age / Gender</th>
                      <th>Mobile</th>
                      <th>CNIC</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-[#8A97A5]">
                          Enter a search term above to locate patient records.
                        </td>
                      </tr>
                    ) : (
                      searchResults.map((p) => (
                        <tr key={p.id}>
                          <td className="font-mono font-bold text-[#0B4F8A] dark:text-[#64B5F6]">
                            {p.mrNumber}
                          </td>
                          <td className="font-semibold text-[#1B2733] dark:text-white">
                            {p.fullName}
                          </td>
                          <td className="text-[#5B6B7B] dark:text-[#94A7BA]">
                            {p.age || "—"} Yrs / {p.gender}
                          </td>
                          <td className="font-mono">{p.mobile}</td>
                          <td className="font-mono">{formatCNIC(p.cnic)}</td>
                          <td className="text-right">
                            <button
                              onClick={() => handleSelectExisting(p)}
                              className="btn-secondary text-[11px] py-1 px-3"
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

        {/* Right Column (4 cols): Sticky Panel */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          {/* Panel Card 1: Today's Recent Tokens */}
          <div className="hospital-card p-5 bg-white dark:bg-[#162638]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E3E9EF] dark:border-[#23374D]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0B4F8A] dark:text-[#64B5F6]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B2733] dark:text-[#E6EEF5] font-heading">
                  Today&apos;s Recent Tokens
                </h3>
              </div>
              <span className="text-[10px] text-[#1E9E8F] font-semibold">Live</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {recentVisits.length > 0 ? (
                recentVisits.map((v) => (
                  <div
                    key={v.id}
                    className="p-2.5 rounded-lg bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded bg-[#E8F1F9] dark:bg-[#1E3147] text-[#0B4F8A] dark:text-[#64B5F6] font-mono font-bold flex items-center justify-center text-xs">
                        #{v.tokenNumber}
                      </span>
                      <div>
                        <span className="font-semibold text-[#1B2733] dark:text-white block truncate max-w-[120px]">
                          {v.patient.fullName}
                        </span>
                        <span className="text-[10px] text-[#5B6B7B] dark:text-[#94A7BA] block">
                          Dr. {v.doctor.name} ({v.doctor.roomNo})
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        v.status === "WAITING"
                          ? "bg-amber-50 text-[#E39B12] border border-amber-200"
                          : v.status === "IN_CONSULTATION"
                          ? "bg-blue-50 text-[#2F80C9] border border-blue-200"
                          : "bg-[#E6F5F3] text-[#1E9E8F] border border-[#1E9E8F]/20"
                      }`}
                    >
                      {v.status.replace("_", " ")}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-[#8A97A5]">
                  No tokens issued yet today.
                </div>
              )}
            </div>
          </div>

          {/* Panel Card 2: Quick Search by MR Number */}
          <div className="hospital-card p-5 bg-white dark:bg-[#162638]">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#E3E9EF] dark:border-[#23374D]">
              <Search className="w-4 h-4 text-[#0B4F8A] dark:text-[#64B5F6]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B2733] dark:text-[#E6EEF5] font-heading">
                Quick Patient Lookup
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setActiveTab("search");
                handleSearch(e);
              }}
              className="space-y-3 text-xs"
            >
              <input
                type="text"
                placeholder="Enter MR Number (e.g. NIH-...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2 text-xs text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-10 font-mono"
              />
              <button type="submit" className="btn-secondary w-full justify-center text-xs py-2">
                Search Patient (F3)
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
