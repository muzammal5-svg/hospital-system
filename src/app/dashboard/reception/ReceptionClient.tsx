'use client';

import React, { useState, useEffect, useRef } from 'react';
import { formatPKR, formatCNIC, formatMobile } from '@/lib/utils';
import { PrintThermalReceipt } from '@/components/PrintThermalReceipt';
import {
  Card,
  CardHeader,
  StatCard,
} from '@/components/ui-app/Card';
import {
  TextField,
  PhoneField,
  CnicField,
  SelectField,
  TextareaField,
  RadioCards,
  FormSection,
  FormGrid,
  FormActions,
} from '@/components/ui-app/FormControls';
import { StatusChip } from '@/components/ui-app/StatusChip';
import { Avatar } from '@/components/ui-app/Avatar';
import { Modal } from '@/components/ui-app/Modal';
import { useToast } from '@/components/ui-app/Toast';
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
  CreditCard,
  Banknote,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

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
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'register' | 'visit' | 'search'>('register');

  // Keyboard shortcuts: F2 = New Patient Intake, F3 = Patient Search, F4 = Issue OPD Token
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setActiveTab('register');
      } else if (e.key === 'F3') {
        e.preventDefault();
        setActiveTab('search');
      } else if (e.key === 'F4') {
        e.preventDefault();
        setActiveTab('visit');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 1. Search First State
  const [topSearchQuery, setTopSearchQuery] = useState('');
  const [topSearchResults, setTopSearchResults] = useState<any[]>([]);
  const [isTopSearching, setIsTopSearching] = useState(false);
  const [matchedExistingPatient, setMatchedExistingPatient] = useState<any | null>(null);

  // 2. Personal Information
  const [fullName, setFullName] = useState('');
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState('');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('MALE');
  const [maritalStatus, setMaritalStatus] = useState('SINGLE');
  const [cnic, setCnic] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // 3. Contact
  const [mobile, setMobile] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');

  // 4. Medical Info
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');

  // 5. Visit Details
  const [patientType, setPatientType] = useState('NEW');
  const [departmentId, setDepartmentId] = useState(initialDepartments[0]?.id || '');
  const [doctorId, setDoctorId] = useState(initialDoctors[0]?.id || '');
  const [visitType, setVisitType] = useState('OPD');
  const [priority, setPriority] = useState('NORMAL');
  const [visitNotes, setVisitNotes] = useState('');

  // 6. Payment & Billing
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [amountReceived, setAmountReceived] = useState<number | string>('');

  // Live duplicate warning state
  const [duplicateWarning, setDuplicateWarning] = useState<any[]>([]);

  // Selected patient for visit tab
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  // Master search tab state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Today recent visits state
  const [recentVisits, setRecentVisits] = useState<any[]>([]);

  // Success / Receipt modal state
  const [issuedVisit, setIssuedVisit] = useState<any | null>(null);
  const [registeredPatient, setRegisteredPatient] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Webcam capture state
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-calculate DOB from Age
  const handleAgeChange = (val: string) => {
    setAge(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0 && num < 125) {
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - num;
      setDob(`${birthYear}-01-01`);
    }
  };

  // Auto-calculate Age from DOB
  const handleDobChange = (val: string) => {
    setDob(val);
    if (val) {
      const birth = new Date(val);
      const now = new Date();
      let diff = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
        diff--;
      }
      if (diff >= 0 && diff < 125) {
        setAge(String(diff));
      }
    }
  };

  // Autosave draft to sessionStorage
  useEffect(() => {
    try {
      const draft = {
        fullName,
        fatherOrHusbandName,
        age,
        gender,
        cnic,
        mobile,
        address,
        city,
        bloodGroup,
        allergies,
      };
      if (fullName || mobile || cnic) {
        sessionStorage.setItem('nih_registration_draft', JSON.stringify(draft));
      }
    } catch (e) {}
  }, [fullName, fatherOrHusbandName, age, gender, cnic, mobile, address, city, bloodGroup, allergies]);

  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('nih_registration_draft');
      if (saved) {
        const d = JSON.parse(saved);
        if (d.fullName) setFullName(d.fullName);
        if (d.fatherOrHusbandName) setFatherOrHusbandName(d.fatherOrHusbandName);
        if (d.age) setAge(d.age);
        if (d.gender) setGender(d.gender);
        if (d.cnic) setCnic(d.cnic);
        if (d.mobile) setMobile(d.mobile);
        if (d.address) setAddress(d.address);
        if (d.city) setCity(d.city);
        if (d.bloodGroup) setBloodGroup(d.bloodGroup);
        if (d.allergies) setAllergies(d.allergies);
      }
    } catch (e) {}
  }, []);

  const clearDraft = () => {
    try {
      sessionStorage.removeItem('nih_registration_draft');
    } catch (e) {}
    setFullName('');
    setFatherOrHusbandName('');
    setAge('');
    setDob('');
    setCnic('');
    setMobile('');
    setAddress('');
    setBloodGroup('');
    setAllergies('');
    setMatchedExistingPatient(null);
  };

  const filteredDoctors = initialDoctors.filter(
    (d) => !departmentId || d.departmentId === departmentId
  );
  const currentDoctor = initialDoctors.find((d) => d.id === doctorId) || filteredDoctors[0];
  const fee = currentDoctor?.fee || 2000;
  const netFee = Math.max(0, fee - Number(discountAmount || 0));
  const numericReceived = amountReceived === '' ? netFee : Number(amountReceived);
  const balance = netFee - numericReceived;

  // Fetch recent visits
  const fetchRecentVisits = async () => {
    try {
      const res = await fetch('/api/queue');
      if (res.ok) {
        const data = await res.json();
        setRecentVisits((data.visits || []).slice(0, 6));
      }
    } catch (e) {}
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

  // Top "Search First" bar
  useEffect(() => {
    if (!topSearchQuery.trim() || topSearchQuery.length < 2) {
      setTopSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsTopSearching(true);
      try {
        const res = await fetch(`/api/patients?q=${encodeURIComponent(topSearchQuery)}&limit=4`);
        const data = await res.json();
        setTopSearchResults(data.patients || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsTopSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [topSearchQuery]);

  // Handle Patient Registration
  const handleRegisterPatient = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          fatherOrHusbandName: fatherOrHusbandName.trim() || undefined,
          age: age ? Number(age) : undefined,
          gender,
          cnic: cnic.trim() || undefined,
          mobile: mobile.trim(),
          address: address.trim() || undefined,
          city: city.trim() || 'Lahore',
          bloodGroup: bloodGroup || undefined,
          emergencyContact: emergencyContact.trim() || undefined,
          allergies: allergies.trim() || undefined,
          photoUrl: photoUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register patient.');
      }

      setRegisteredPatient(data.patient);
      setSelectedPatient(data.patient);
      clearDraft();
      toast.success('Patient Registered', `${data.patient.name} (${data.patient.mrNumber})`);
      setActiveTab('visit');
    } catch (err: any) {
      setErrorMessage(err.message);
      toast.error('Registration Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Full Registration + Direct Token Generation
  const handleRegisterAndToken = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      let patient = selectedPatient;
      if (!patient) {
        const pRes = await fetch('/api/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: fullName.trim(),
            fatherOrHusbandName: fatherOrHusbandName.trim() || undefined,
            age: age ? Number(age) : undefined,
            gender,
            cnic: cnic.trim() || undefined,
            mobile: mobile.trim(),
            address: address.trim() || undefined,
            city: city.trim() || 'Lahore',
            bloodGroup: bloodGroup || undefined,
            allergies: allergies.trim() || undefined,
          }),
        });
        const pData = await pRes.json();
        if (!pRes.ok) throw new Error(pData.error || 'Failed to register patient.');
        patient = pData.patient;
        setRegisteredPatient(patient);
        setSelectedPatient(patient);
      }

      // Now create visit token
      const vRes = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patient.id,
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
      const vData = await vRes.json();
      if (!vRes.ok) throw new Error(vData.error || 'Failed to issue token.');

      setIssuedVisit(vData.visit);
      setShowSuccessModal(true);
      fetchRecentVisits();
      clearDraft();
      toast.success('Token Generated', `Token #${vData.visit.tokenNumber} assigned to Dr. ${currentDoctor.name}`);
    } catch (err: any) {
      setErrorMessage(err.message);
      toast.error('Operation Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OPD Visit / Token creation
  const handleCreateVisit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedPatient) {
      setErrorMessage('Please select or register a patient first.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        throw new Error(data.error || 'Failed to issue token.');
      }

      setIssuedVisit(data.visit);
      setShowSuccessModal(true);
      fetchRecentVisits();
      setDiscountAmount(0);
      setDiscountReason('');
      toast.success('Token Generated', `Token #${data.visit.tokenNumber} for Dr. ${currentDoctor.name}`);
    } catch (err: any) {
      setErrorMessage(err.message);
      toast.error('Token Error', err.message);
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
    setMatchedExistingPatient(patient);
    setDuplicateWarning([]);
    setTopSearchQuery('');
    setTopSearchResults([]);
    setActiveTab('visit');
    toast.info('Patient Selected', `${patient.name} (${patient.mrNumber})`);
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Quick Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E3E9EF] pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setSelectedPatient(null);
              clearDraft();
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'register'
                ? 'bg-[#0B4F8A] text-white shadow-xs'
                : 'bg-white border border-[#D5DDE5] text-[#1B2733] hover:bg-[#F8FAFC]'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>New Patient (F2)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('visit')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'visit'
                ? 'bg-[#1E9E8F] text-white shadow-xs'
                : 'bg-white border border-[#D5DDE5] text-[#1B2733] hover:bg-[#F8FAFC]'
            }`}
          >
            <CalendarPlus className="h-4 w-4" />
            <span>Issue Token (F4)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'search'
                ? 'bg-[#0B4F8A] text-white shadow-xs'
                : 'bg-white border border-[#D5DDE5] text-[#1B2733] hover:bg-[#F8FAFC]'
            }`}
          >
            <Search className="h-4 w-4" />
            <span>Search Master Directory</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#5B6B7B]">
          <span className="font-medium">Active Doctor:</span>
          <span className="font-bold text-[#0B4F8A]">Dr. {currentDoctor?.name}</span>
          <span className="text-[#8A97A5]">({currentDoctor?.room || 'Room 101'})</span>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-rose-600 hover:text-rose-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 1: HERO PATIENT REGISTRATION (Two-Column Layout)                  */}
      {/* ===================================================================== */}
      {activeTab === 'register' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Form Sections */}
          <div className="lg:col-span-8 space-y-6">
            <Card>
              {/* Section 1: Search First Bar */}
              <div className="border-b border-[#F0F4F8] pb-5 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#0B4F8A]">
                    1. Search Master Records First
                  </h3>
                  <span className="text-xs text-[#8A97A5]">Prevents duplicate hospital files</span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A97A5]" />
                  <input
                    type="text"
                    value={topSearchQuery}
                    onChange={(e) => setTopSearchQuery(e.target.value)}
                    placeholder="Search by MR No, CNIC, mobile or name..."
                    className="h-11 w-full rounded-lg border border-[#D5DDE5] bg-[#FBFDFF] pl-10 pr-10 text-sm text-[#1B2733] placeholder-[#8A97A5] focus:border-[#1E9E8F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E9E8F]/20"
                  />
                  {topSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setTopSearchQuery('');
                        setTopSearchResults([]);
                      }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A97A5] hover:text-[#1B2733]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Top Search Results Dropdown / Cards */}
                {topSearchResults.length > 0 && (
                  <div className="mt-2.5 space-y-2 rounded-xl border border-[#B5CDE0] bg-[#E8F1F9]/40 p-3">
                    <p className="text-xs font-semibold text-[#0B4F8A]">Matching Patients Found:</p>
                    <div className="space-y-1.5">
                      {topSearchResults.map((pat) => (
                        <div
                          key={pat.id}
                          className="flex items-center justify-between rounded-lg border border-[#D5DDE5] bg-white p-2.5 text-xs hover:border-[#0B4F8A]"
                        >
                          <div>
                            <span className="font-bold text-[#1B2733]">{pat.name}</span>
                            <span className="ml-2 font-mono font-bold text-[#0B4F8A]">({pat.mrNumber})</span>
                            <span className="ml-2 text-[#5B6B7B]">{pat.mobile}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSelectExisting(pat)}
                              className="rounded bg-[#1E9E8F] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#167C70]"
                            >
                              New Visit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Patient Banner if selected */}
                {matchedExistingPatient && (
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50 p-3 text-xs text-teal-900">
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="h-5 w-5 text-[#167C70]" />
                      <div>
                        <p className="font-bold">Patient already registered: {matchedExistingPatient.name}</p>
                        <p className="text-[11px] text-teal-700">
                          MR: {matchedExistingPatient.mrNumber} • Phone: {matchedExistingPatient.mobile}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMatchedExistingPatient(null);
                          setSelectedPatient(null);
                        }}
                        className="rounded border border-teal-300 bg-white px-2.5 py-1 text-xs font-medium text-teal-800"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('visit')}
                        className="rounded bg-[#1E9E8F] px-3 py-1 text-xs font-bold text-white shadow-xs"
                      >
                        Proceed to Visit &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Duplicate Detection Warning Banner */}
              {duplicateWarning.length > 0 && (
                <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 bg-amber-500/10">
                  <div className="flex items-center gap-2 font-bold text-amber-800">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span>Existing Patient Found</span>
                  </div>
                  <p className="mt-1 text-[#5B6B7B]">
                    A patient with this mobile or CNIC is already registered in the hospital database:
                  </p>
                  <div className="mt-2 space-y-1">
                    {duplicateWarning.map((match) => (
                      <div
                        key={match.id}
                        className="flex items-center justify-between rounded-lg border border-amber-200 bg-white p-2"
                      >
                        <div>
                          <span className="font-bold text-[#1B2733]">{match.name}</span>
                          <span className="ml-2 font-mono text-[#0B4F8A]">({match.mrNumber})</span>
                          <span className="ml-2 text-[#5B6B7B]">{match.mobile}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSelectExisting(match)}
                          className="rounded bg-[#0B4F8A] px-2.5 py-1 font-semibold text-white hover:bg-[#093F6E]"
                        >
                          Use Existing
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Content */}
              <form onSubmit={handleRegisterPatient} className="space-y-6">
                {/* Section 2: Personal Information */}
                <FormSection
                  title="2. Personal Information"
                  description="Primary identity and patient demographic details"
                >
                  <FormGrid>
                    <div className="sm:col-span-6 lg:col-span-6">
                      <TextField
                        label="Full Name (English or اردو)"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Muhammad Asif"
                        autoFocus
                      />
                    </div>
                    <div className="sm:col-span-6 lg:col-span-6">
                      <TextField
                        label="Father / Husband Name"
                        value={fatherOrHusbandName}
                        onChange={(e) => setFatherOrHusbandName(e.target.value)}
                        placeholder="e.g. Abdul Rasheed"
                      />
                    </div>

                    <div className="sm:col-span-6 lg:col-span-6">
                      <RadioCards
                        label="Gender"
                        required
                        value={gender}
                        onChange={setGender}
                        columns={3}
                        options={[
                          { value: 'MALE', label: 'Male' },
                          { value: 'FEMALE', label: 'Female' },
                          { value: 'OTHER', label: 'Other' },
                        ]}
                      />
                    </div>

                    <div className="sm:col-span-3 lg:col-span-3">
                      <TextField
                        label="Age (Years)"
                        required
                        type="number"
                        value={age}
                        onChange={(e) => handleAgeChange(e.target.value)}
                        placeholder="34"
                      />
                    </div>

                    <div className="sm:col-span-3 lg:col-span-3">
                      <TextField
                        label="Date of Birth"
                        type="date"
                        value={dob}
                        onChange={(e) => handleDobChange(e.target.value)}
                      />
                    </div>

                    <div className="sm:col-span-6 lg:col-span-6">
                      <CnicField
                        label="National ID (CNIC)"
                        value={cnic}
                        onChange={setCnic}
                        placeholder="35201-1234567-1"
                        helperText="13 digits with auto dashes"
                      />
                    </div>

                    <div className="sm:col-span-6 lg:col-span-6">
                      <SelectField
                        label="Marital Status"
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value)}
                        options={[
                          { value: 'SINGLE', label: 'Single' },
                          { value: 'MARRIED', label: 'Married' },
                          { value: 'WIDOWED', label: 'Widowed' },
                          { value: 'DIVORCED', label: 'Divorced' },
                        ]}
                      />
                    </div>
                  </FormGrid>
                </FormSection>

                {/* Section 3: Contact Details */}
                <FormSection
                  title="3. Contact Information"
                  description="Pakistani phone and residence address"
                >
                  <FormGrid>
                    <div className="sm:col-span-6 lg:col-span-6">
                      <PhoneField
                        label="Primary Mobile Number"
                        required
                        value={mobile}
                        onChange={setMobile}
                        placeholder="0300-1234567"
                        helperText="SMS token & prescriptions will be sent here"
                      />
                    </div>
                    <div className="sm:col-span-6 lg:col-span-6">
                      <PhoneField
                        label="Alternate Phone (Optional)"
                        value={altPhone}
                        onChange={setAltPhone}
                        placeholder="0321-7654321"
                      />
                    </div>

                    <div className="sm:col-span-8 lg:col-span-8">
                      <TextField
                        label="Residential Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House / Street / Area"
                      />
                    </div>
                    <div className="sm:col-span-4 lg:col-span-4">
                      <TextField
                        label="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Lahore"
                      />
                    </div>
                  </FormGrid>
                </FormSection>

                {/* Section 4: Medical Details */}
                <FormSection
                  title="4. Medical Information"
                  description="Emergency contacts, allergies, and blood group"
                >
                  <FormGrid>
                    <div className="sm:col-span-4 lg:col-span-4">
                      <SelectField
                        label="Blood Group"
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        options={[
                          { value: '', label: 'Select Blood Group...' },
                          { value: 'A+', label: 'A Positive (A+)' },
                          { value: 'A-', label: 'A Negative (A-)' },
                          { value: 'B+', label: 'B Positive (B+)' },
                          { value: 'B-', label: 'B Negative (B-)' },
                          { value: 'AB+', label: 'AB Positive (AB+)' },
                          { value: 'AB-', label: 'AB Negative (AB-)' },
                          { value: 'O+', label: 'O Positive (O+)' },
                          { value: 'O-', label: 'O Negative (O-)' },
                        ]}
                      />
                    </div>

                    <div className="sm:col-span-8 lg:col-span-8">
                      <TextField
                        label="Known Drug / Food Allergies"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        placeholder="e.g. Penicillin, Sulfa, Aspirin"
                        helperText="Alerts doctor console with high priority warning"
                      />
                    </div>

                    <div className="sm:col-span-6 lg:col-span-6">
                      <TextField
                        label="Emergency Contact Name"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        placeholder="e.g. Brother / Spouse Name"
                      />
                    </div>
                    <div className="sm:col-span-6 lg:col-span-6">
                      <PhoneField
                        label="Emergency Contact Phone"
                        value={emergencyPhone}
                        onChange={setEmergencyPhone}
                        placeholder="0300-9876543"
                      />
                    </div>
                  </FormGrid>
                </FormSection>

                {/* Section 5: Visit & Doctor Details */}
                <FormSection
                  title="5. OPD Visit Details"
                  description="Consultant room assignment and visit category"
                >
                  <FormGrid>
                    <div className="sm:col-span-6 lg:col-span-6">
                      <SelectField
                        label="Clinical Department"
                        required
                        value={departmentId}
                        onChange={(e) => {
                          setDepartmentId(e.target.value);
                          const docs = initialDoctors.filter((d) => d.departmentId === e.target.value);
                          if (docs.length > 0) setDoctorId(docs[0].id);
                        }}
                        options={initialDepartments.map((d) => ({
                          value: d.id,
                          label: d.name,
                        }))}
                      />
                    </div>

                    <div className="sm:col-span-6 lg:col-span-6">
                      <SelectField
                        label="Consultant Doctor"
                        required
                        value={doctorId}
                        onChange={(e) => setDoctorId(e.target.value)}
                        options={filteredDoctors.map((doc) => ({
                          value: doc.id,
                          label: `Dr. ${doc.name} (${doc.room || 'Room 101'}) — ${formatPKR(doc.fee)}`,
                        }))}
                      />
                    </div>

                    <div className="sm:col-span-12 lg:col-span-12">
                      <RadioCards
                        label="Patient Category"
                        value={patientType}
                        onChange={setPatientType}
                        columns={3}
                        options={[
                          { value: 'NEW', label: 'New Patient', sublabel: 'Standard first consultation' },
                          { value: 'FOLLOW_UP', label: 'Follow-up', sublabel: 'Within 7 days of initial visit' },
                          { value: 'EMERGENCY', label: 'Emergency', sublabel: 'Immediate triage protocol' },
                        ]}
                      />
                    </div>
                  </FormGrid>
                </FormSection>

                {/* Section 6: Payment & Billing */}
                <FormSection
                  title="6. Payment & Fee Calculation"
                  description="Outpatient consultation fee and discount authorization"
                >
                  <FormGrid>
                    <div className="sm:col-span-4 lg:col-span-4">
                      <TextField
                        label="Consultation Fee (PKR)"
                        value={formatPKR(fee)}
                        disabled
                        className="bg-[#F8FAFC] font-bold text-[#0B4F8A]"
                      />
                    </div>

                    <div className="sm:col-span-4 lg:col-span-4">
                      <TextField
                        label="Discount Amount (PKR)"
                        type="number"
                        value={discountAmount || ''}
                        onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>

                    <div className="sm:col-span-4 lg:col-span-4">
                      <TextField
                        label="Net Payable (PKR)"
                        value={formatPKR(netFee)}
                        disabled
                        className="bg-[#E6F5F3] font-bold text-[#167C70]"
                      />
                    </div>

                    {discountAmount > 0 && (
                      <div className="sm:col-span-12 lg:col-span-12">
                        <TextField
                          label="Discount Reason / Authorized By"
                          required
                          value={discountReason}
                          onChange={(e) => setDiscountReason(e.target.value)}
                          placeholder="e.g. Hospital Staff Relative / Medical Director Approval"
                          helperText="Required for hospital audit trail"
                        />
                      </div>
                    )}

                    <div className="sm:col-span-12 lg:col-span-12">
                      <RadioCards
                        label="Payment Method"
                        value={paymentMethod}
                        onChange={setPaymentMethod}
                        columns={3}
                        options={[
                          { value: 'CASH', label: 'Cash', sublabel: 'Direct reception handover' },
                          { value: 'CARD', label: 'Debit / Credit Card', sublabel: 'POS machine terminal' },
                          { value: 'ONLINE', label: 'Online / Bank Transfer', sublabel: 'Easypaisa / JazzCash / Raast' },
                        ]}
                      />
                    </div>
                  </FormGrid>
                </FormSection>

                {/* Sticky Actions Bar */}
                <FormActions
                  onCancel={clearDraft}
                  cancelLabel="Clear Form"
                  onSaveDraft={() => toast.info('Draft Saved', 'Patient details preserved in browser session.')}
                  draftLabel="Save Draft"
                  onSaveAndPrint={handleRegisterPatient}
                  saveAndPrintLabel="Register & Proceed to Token"
                  onSave={handleRegisterPatient}
                  saveLabel="Register Patient Only"
                  isSaving={isSubmitting}
                />
              </form>
            </Card>
          </div>

          {/* Right Column (4 cols sticky): Live Summary Card & Recent Registrations */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            {/* Live Fee & Patient Summary Card */}
            <div className="rounded-xl border border-[#B5CDE0] bg-[#E8F1F9]/50 p-5 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B4F8A] font-mono">
                Live Visit Summary
              </span>

              <div className="mt-3 flex items-center gap-3 border-b border-[#D5E6F5] pb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B4F8A] text-white font-bold text-base">
                  {fullName ? fullName.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-heading text-sm font-bold text-[#1B2733] truncate">
                    {fullName || 'New Patient'}
                  </h4>
                  <p className="text-xs text-[#5B6B7B]">
                    {gender} • {age ? `${age} yrs` : 'Age pending'}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#5B6B7B]">Consultant:</span>
                  <span className="font-semibold text-[#1B2733]">Dr. {currentDoctor?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5B6B7B]">Room Number:</span>
                  <span className="font-mono font-semibold text-[#1B2733]">
                    {currentDoctor?.room || 'Room 101'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5B6B7B]">Expected Token:</span>
                  <span className="rounded-md bg-[#0B4F8A] px-2 py-0.5 font-mono font-bold text-white">
                    Next in Queue
                  </span>
                </div>

                <div className="border-t border-[#D5E6F5] pt-2.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#5B6B7B]">Doctor Fee:</span>
                    <span className="text-[#1B2733]">{formatPKR(fee)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-rose-600">
                      <span>Discount:</span>
                      <span>-{formatPKR(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm font-bold text-[#0B4F8A] pt-1 border-t border-[#D5E6F5]">
                    <span>Total Payable:</span>
                    <span>{formatPKR(netFee)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleRegisterPatient}
                  disabled={isSubmitting || !fullName || !mobile}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#0B4F8A] px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#093F6E] transition-colors disabled:opacity-50"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Register & Proceed to Token</span>
                </button>
              </div>
            </div>

            {/* Today's Recent Registrations Mini List */}
            <Card dense>
              <CardHeader
                title="Today's Recent Tokens"
                subtitle="Real-time check-in stream"
                actionText="Live Queue"
                actionHref="/dashboard/queue"
              />
              {recentVisits.length === 0 ? (
                <p className="text-center py-4 text-xs text-[#8A97A5]">No visits issued yet today.</p>
              ) : (
                <div className="divide-y divide-[#F0F4F8]">
                  {recentVisits.slice(0, 5).map((v) => (
                    <div key={v.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-[#E8F1F9] px-1.5 py-0.2 font-mono font-bold text-[#0B4F8A]">
                            #{v.tokenNumber}
                          </span>
                          <span className="font-semibold text-[#1B2733] truncate max-w-[130px]">
                            {v.patient?.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8A97A5] mt-0.5">
                          Dr. {v.doctor?.name} • {v.department?.name}
                        </p>
                      </div>
                      <StatusChip status={v.status} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: ISSUE OPD TOKEN / NEW VISIT (for existing patients)             */}
      {/* ===================================================================== */}
      {activeTab === 'visit' && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader
            title="Issue Outpatient Consultation Token"
            subtitle="Assign doctor and print official 80mm thermal receipt"
          />

          {/* Selected Patient Banner */}
          {selectedPatient ? (
            <div className="mb-6 rounded-xl border border-[#B5CDE0] bg-[#E8F1F9]/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={selectedPatient.name} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading text-sm font-bold text-[#1B2733]">{selectedPatient.name}</h4>
                    <span className="rounded bg-[#0B4F8A] px-2 py-0.5 font-mono text-[11px] font-bold text-white">
                      {selectedPatient.mrNumber}
                    </span>
                  </div>
                  <p className="text-xs text-[#5B6B7B] mt-0.5">
                    {selectedPatient.gender} • {selectedPatient.age || '—'} yrs • Phone: {selectedPatient.mobile}
                  </p>
                  {selectedPatient.allergies && (
                    <span className="inline-block mt-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.2 rounded border border-rose-200">
                      Allergies: {selectedPatient.allergies}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="rounded-lg border border-[#D5DDE5] bg-white px-3 py-1.5 text-xs font-semibold text-[#5B6B7B] hover:text-[#1B2733]"
              >
                Change Patient
              </button>
            </div>
          ) : (
            <div className="mb-6 rounded-xl border border-dashed border-[#D5DDE5] bg-[#FBFDFF] p-6 text-center">
              <Users className="mx-auto h-8 w-8 text-[#0B4F8A] mb-2" />
              <h4 className="font-heading text-sm font-bold text-[#1B2733]">No Patient Selected</h4>
              <p className="text-xs text-[#5B6B7B] mt-1 mb-3">
                Lookup an existing patient from master directory or register a new one.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('search')}
                  className="rounded-lg bg-[#0B4F8A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#093F6E]"
                >
                  Search Master Directory
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="rounded-lg border border-[#D5DDE5] bg-white px-4 py-2 text-xs font-semibold text-[#1B2733] hover:bg-[#F8FAFC]"
                >
                  New Patient (F2)
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleCreateVisit} className="space-y-6">
            <FormGrid>
              <div className="sm:col-span-6 lg:col-span-6">
                <SelectField
                  label="Clinical Department"
                  required
                  value={departmentId}
                  onChange={(e) => {
                    setDepartmentId(e.target.value);
                    const docs = initialDoctors.filter((d) => d.departmentId === e.target.value);
                    if (docs.length > 0) setDoctorId(docs[0].id);
                  }}
                  options={initialDepartments.map((d) => ({
                    value: d.id,
                    label: d.name,
                  }))}
                />
              </div>

              <div className="sm:col-span-6 lg:col-span-6">
                <SelectField
                  label="Doctor & Fee"
                  required
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  options={filteredDoctors.map((doc) => ({
                    value: doc.id,
                    label: `Dr. ${doc.name} (${doc.room || 'Room 101'}) — ${formatPKR(doc.fee)}`,
                  }))}
                />
              </div>

              <div className="sm:col-span-4 lg:col-span-4">
                <TextField
                  label="Doctor Fee"
                  value={formatPKR(fee)}
                  disabled
                  className="bg-[#F8FAFC] font-bold text-[#0B4F8A]"
                />
              </div>

              <div className="sm:col-span-4 lg:col-span-4">
                <TextField
                  label="Discount (PKR)"
                  type="number"
                  value={discountAmount || ''}
                  onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div className="sm:col-span-4 lg:col-span-4">
                <TextField
                  label="Net Total (PKR)"
                  value={formatPKR(netFee)}
                  disabled
                  className="bg-[#E6F5F3] font-bold text-[#167C70]"
                />
              </div>

              {discountAmount > 0 && (
                <div className="sm:col-span-12 lg:col-span-12">
                  <TextField
                    label="Discount Reason"
                    required
                    value={discountReason}
                    onChange={(e) => setDiscountReason(e.target.value)}
                    placeholder="e.g. Senior Citizen / Director Approval"
                  />
                </div>
              )}

              <div className="sm:col-span-12 lg:col-span-12">
                <RadioCards
                  label="Payment Method"
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                  columns={3}
                  options={[
                    { value: 'CASH', label: 'Cash' },
                    { value: 'CARD', label: 'Card (POS)' },
                    { value: 'ONLINE', label: 'Online / Raast' },
                  ]}
                />
              </div>
            </FormGrid>

            <div className="border-t border-[#F0F4F8] pt-4 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !selectedPatient}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1E9E8F] px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#167C70] transition-colors disabled:opacity-50"
              >
                <Printer className="h-4 w-4" />
                <span>Issue Token & Print 80mm Slip</span>
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: SEARCH MASTER DIRECTORY                                        */}
      {/* ===================================================================== */}
      {activeTab === 'search' && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader
            title="Search Master Patients Directory"
            subtitle="Lookup registered records by MR Number, CNIC, Phone, or Name"
          />

          <form onSubmit={handleSearch} className="mb-6 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A97A5]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient by MR Number, CNIC, Mobile, or Name..."
                className="h-11 w-full rounded-lg border border-[#D5DDE5] bg-white pl-10 pr-4 text-sm text-[#1B2733] placeholder-[#8A97A5] focus:border-[#0B4F8A] focus:outline-none focus:ring-2 focus:ring-[#0B4F8A]/20"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="rounded-lg bg-[#0B4F8A] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#093F6E]"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {searchResults.length > 0 ? (
            <div className="divide-y divide-[#F0F4F8] border-t border-[#F0F4F8]">
              {searchResults.map((pat) => (
                <div key={pat.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={pat.name} size="sm" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1B2733]">{pat.name}</span>
                        <span className="rounded bg-[#E8F1F9] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0B4F8A]">
                          {pat.mrNumber}
                        </span>
                      </div>
                      <p className="text-xs text-[#5B6B7B] mt-0.5">
                        {pat.gender} • {pat.age || '—'} yrs • Phone: {pat.mobile} • CNIC: {pat.cnic || '—'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectExisting(pat)}
                    className="rounded-lg bg-[#1E9E8F] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#167C70]"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          ) : (
            searchQuery &&
            !isSearching && (
              <div className="py-8 text-center text-xs text-[#8A97A5]">
                No patients found matching your search.
              </div>
            )
          )}
        </Card>
      )}

      {/* ===================================================================== */}
      {/* SUCCESS MODAL: LARGE TOKEN & 80MM RECEIPT RENDER                      */}
      {/* ===================================================================== */}
      {showSuccessModal && issuedVisit && (
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="OPD Token Issued Successfully"
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveTab('register');
                  clearDraft();
                }}
                className="rounded-lg border border-[#D5DDE5] bg-white px-4 py-2 text-xs font-semibold text-[#1B2733] hover:bg-[#F8FAFC]"
                autoFocus
              >
                Register Another (F2)
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-lg bg-[#0B4F8A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#093F6E]"
                >
                  <Printer className="inline-block h-3.5 w-3.5 mr-1" />
                  Print Token Slip
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Big Token Display */}
            <div className="rounded-xl border-2 border-[#1E9E8F] bg-[#E6F5F3]/40 p-6 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#167C70] font-mono">
                Official OPD Token Number
              </span>
              <h2 className="font-heading text-5xl font-black text-[#0B4F8A] my-2">
                #{issuedVisit.tokenNumber}
              </h2>
              <p className="text-sm font-bold text-[#1B2733]">
                Dr. {issuedVisit.doctor?.name || currentDoctor?.name}
              </p>
              <p className="text-xs text-[#5B6B7B]">
                {issuedVisit.department?.name || 'General OPD'} • Room {issuedVisit.doctor?.room || 'Room 101'}
              </p>
            </div>

            {/* Embedded Official 80mm Thermal Slip Preview */}
            <div className="thermal-receipt">
              <PrintThermalReceipt
                visit={issuedVisit}
                hospitalProfile={hospitalProfile}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Standalone Thermal Receipt Modal if issuedVisit exists and modal closed */}
      {issuedVisit && !showSuccessModal && (
        <div className="thermal-receipt hidden">
          <PrintThermalReceipt
            visit={issuedVisit}
            hospitalProfile={hospitalProfile}
          />
        </div>
      )}
    </div>
  );
}
