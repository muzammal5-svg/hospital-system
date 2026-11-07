'use client';

import React, { useState, useEffect } from 'react';
import { formatPKR, formatDate } from '@/lib/utils';
import { PrintA4Prescription } from '@/components/PrintA4Prescription';
import {
  PageHeader,
  Card,
  CardHeader,
  StatusChip,
  Avatar,
  TextField,
  SelectField,
  TextareaField,
  Tabs,
  useToast,
} from '@/components/ui-app';
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
  ArrowRight,
  ClipboardList,
  RotateCcw,
} from 'lucide-react';

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
  const toast = useToast();
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    currentDoctorId || doctors[0]?.id || ''
  );
  const [visits, setVisits] = useState(initialVisits);
  const [activeVisit, setActiveVisit] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'vitals' | 'consultation' | 'prescription' | 'orders' | 'history'>('vitals');

  // Prescription Form State
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [bp, setBp] = useState('120/80');
  const [pulse, setPulse] = useState('76');
  const [temp, setTemp] = useState('98.6');
  const [weight, setWeight] = useState('70');
  const [spo2, setSpo2] = useState('98%');
  const [followUp, setFollowUp] = useState('In 7 days for review');

  // Selected Lab Orders
  const [selectedOrders, setSelectedOrders] = useState<string[]>([
    'Complete Blood Count (CBC)',
  ]);

  // Prescription Items
  const [items, setItems] = useState<Array<{
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>>([
    {
      medicineName: 'Panadol 500mg',
      dosage: '500mg',
      frequency: '1-1-1',
      duration: '3 days',
      instructions: 'After meals',
    },
  ]);

  // Autocomplete medicine catalog
  const [medicines, setMedicines] = useState<any[]>([]);
  const [autocompleteResults, setAutocompleteResults] = useState<any[]>([]);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  // Print Prescription Modal
  const [prescriptionToPrint, setPrescriptionToPrint] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  // Filter visits for current doctor
  const doctorVisits = visits.filter((v) => v.doctorId === selectedDoctorId);
  const waitingVisits = doctorVisits.filter((v) => v.status === 'WAITING');
  const inConsultVisits = doctorVisits.filter((v) => v.status === 'IN_CONSULTATION');
  const activeConsultation = inConsultVisits[0];

  useEffect(() => {
    if (activeConsultation) {
      setActiveVisit(activeConsultation);
    } else if (waitingVisits.length > 0 && !activeVisit) {
      setActiveVisit(waitingVisits[0]);
    }
  }, [selectedDoctorId, visits]);

  // Fetch medicines for autocomplete
  useEffect(() => {
    fetch('/api/medicines')
      .then((res) => res.json())
      .then((data) => setMedicines(data.medicines || []))
      .catch(console.error);
  }, []);

  const handleCallCurrent = async (visitId: string) => {
    try {
      const res = await fetch(`/api/visits/${visitId}/call`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        const updated = visits.map((v) =>
          v.id === visitId ? { ...v, status: 'IN_CONSULTATION' } : v
        );
        setVisits(updated);
        setActiveVisit(data.visit);
        toast.success('Patient Called', `Token #${data.visit.tokenNumber} called to room`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddMedicineRow = () => {
    setItems([
      ...items,
      {
        medicineName: '',
        dosage: '1 tab',
        frequency: '1+0+1',
        duration: '5 days',
        instructions: 'After meals',
      },
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
      updated[index].dosage = med.commonDosage;
    }
    setItems(updated);
    setAutocompleteResults([]);
    setActiveItemIndex(null);
  };

  const handleCopyLastPrescription = () => {
    setItems([
      { medicineName: 'Augmentin 625mg', dosage: '625mg', frequency: '1+0+1', duration: '5 days', instructions: 'After food' },
      { medicineName: 'Panadol 500mg', dosage: '500mg', frequency: '1+1+1', duration: '3 days', instructions: 'For pain or fever' },
      { medicineName: 'Risek 20mg (Omeprazole)', dosage: '20mg', frequency: '1+0+0', duration: '7 days', instructions: 'Before breakfast' },
    ]);
    toast.info('Template Copied', 'Standard acute prescription template loaded.');
  };

  const handleToggleOrder = (orderName: string) => {
    if (selectedOrders.includes(orderName)) {
      setSelectedOrders(selectedOrders.filter((o) => o !== orderName));
    } else {
      setSelectedOrders([...selectedOrders, orderName]);
    }
  };

  const handleSavePrescription = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeVisit) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitId: activeVisit.id,
          patientId: activeVisit.patientId,
          doctorId: currentDoctor.id,
          diagnosis: diagnosis.trim() || 'Clinical Examination',
          symptoms: symptoms.trim() || undefined,
          clinicalNotes: `${clinicalNotes}\nLab Orders: ${selectedOrders.join(', ')}`.trim(),
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
        throw new Error(data.error || 'Failed to save prescription.');
      }

      setPrescriptionToPrint(data.prescription);
      toast.success('Consultation Completed', `Prescription saved for ${activeVisit.patient?.name}`);

      const updated = visits.map((v) =>
        v.id === activeVisit.id ? { ...v, status: 'COMPLETED' } : v
      );
      setVisits(updated);
    } catch (err: any) {
      toast.error('Save Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // High BP detection
  const isHighBp = (() => {
    const parts = bp.split('/');
    if (parts[0] && parseInt(parts[0], 10) >= 140) return true;
    return false;
  })();

  const commonLabOrders = [
    'Complete Blood Count (CBC)',
    'Blood Sugar Fasting (BSF)',
    'Serum Creatinine & Urea',
    'Lipid Profile (Fasting)',
    'Liver Function Tests (LFTs)',
    'HbA1c',
    'Chest X-Ray PA View',
    'ECG (12-Lead)',
    'Ultrasound Abdomen & Pelvis',
    'Urine Complete Examination (R/E)',
  ];

  return (
    <div className="space-y-6">
      {/* Printable A4 Prescription Modal */}
      {prescriptionToPrint && (
        <PrintA4Prescription
          prescription={prescriptionToPrint}
          onClose={() => setPrescriptionToPrint(null)}
        />
      )}

      {/* Page Header with Doctor Selector */}
      <PageHeader
        title="Doctor Consultation Suite"
        subtitle={`Room ${currentDoctor.room || '101'} • ${waitingVisits.length} waiting, ${inConsultVisits.length} in room`}
        breadcrumbs={[
          { label: 'Hospital', href: '/dashboard' },
          { label: 'Doctor Panel' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#5B6B7B] font-medium hidden sm:inline">Active Doctor:</span>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="h-10 rounded-lg border border-[#D5DDE5] bg-white px-3 text-xs font-bold text-[#0B4F8A] shadow-xs focus:border-[#0B4F8A] focus:outline-none"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.name} ({d.specialty} — {d.room || 'Room 101'})
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* 2-Column Clinical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 cols): Patient Queue List */}
        <div className="lg:col-span-4 space-y-4">
          <Card dense>
            <div className="flex items-center justify-between border-b border-[#F0F4F8] pb-3 mb-3">
              <div>
                <h3 className="font-heading text-sm font-bold text-[#1B2733]">Today&apos;s Patient Queue</h3>
                <p className="text-[11px] text-[#5B6B7B]">{doctorVisits.length} total visits scheduled</p>
              </div>
              <span className="rounded-full bg-[#E8F1F9] px-2.5 py-0.5 text-xs font-bold text-[#0B4F8A]">
                {waitingVisits.length} Waiting
              </span>
            </div>

            <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
              {doctorVisits.length === 0 ? (
                <p className="text-center py-8 text-xs text-[#8A97A5]">
                  No patients queued for this consultant today.
                </p>
              ) : (
                doctorVisits.map((v) => {
                  const isSelected = activeVisit?.id === v.id;
                  const isInside = v.status === 'IN_CONSULTATION';

                  return (
                    <div
                      key={v.id}
                      onClick={() => setActiveVisit(v)}
                      className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                        isSelected
                          ? 'border-[#0B4F8A] bg-[#E8F1F9]/50 shadow-xs'
                          : isInside
                          ? 'border-blue-300 bg-blue-50/40'
                          : 'border-[#E3E9EF] bg-white hover:border-[#B5CDE0] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-lg px-2 py-0.5 font-mono text-xs font-bold ${
                              isInside
                                ? 'bg-blue-600 text-white'
                                : 'bg-[#0B4F8A] text-white'
                            }`}
                          >
                            #{v.tokenNumber}
                          </span>
                          <span className="font-bold text-xs text-[#1B2733] truncate max-w-[130px]">
                            {v.patient?.name}
                          </span>
                        </div>
                        <StatusChip status={v.status} size="sm" />
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-[#5B6B7B]">
                        <span>
                          {v.patient?.gender} • {v.patient?.age || '—'} yrs
                        </span>
                        <span className="font-mono">{v.tokenDate}</span>
                      </div>

                      {v.status === 'WAITING' && (
                        <div className="mt-2.5 pt-2 border-t border-[#F0F4F8] flex justify-end">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCallCurrent(v.id);
                            }}
                            className="inline-flex items-center gap-1 rounded bg-[#1E9E8F] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#167C70] transition-colors"
                          >
                            <Volume2 className="h-3 w-3" />
                            <span>Call to Room</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right Column (8 cols): Clinical Consultation Suite */}
        <div className="lg:col-span-8 space-y-6">
          {activeVisit ? (
            <Card>
              {/* Patient Banner */}
              <div className="rounded-xl border border-[#B5CDE0] bg-[#E8F1F9]/40 p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B4F8A] font-bold text-white text-base">
                    #{activeVisit.tokenNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-base font-bold text-[#1B2733]">
                        {activeVisit.patient?.name}
                      </h3>
                      <span className="rounded bg-[#0B4F8A] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                        {activeVisit.patient?.mrNumber}
                      </span>
                    </div>
                    <p className="text-xs text-[#5B6B7B] mt-0.5">
                      {activeVisit.patient?.gender} • {activeVisit.patient?.age || '—'} yrs • Phone: {activeVisit.patient?.mobile}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusChip status={activeVisit.status} size="md" />
                </div>
              </div>

              {/* Critical Allergy Warning Banner */}
              {activeVisit.patient?.allergies && (
                <div className="mb-5 rounded-xl border border-rose-300 bg-rose-50 p-3.5 text-xs text-rose-900 flex items-center gap-3">
                  <ShieldAlert className="h-5 w-5 text-rose-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold">CRITICAL ALLERGY ALERT:</span>{' '}
                    <span>Patient is allergic to: <strong>{activeVisit.patient.allergies}</strong></span>
                  </div>
                </div>
              )}

              {/* Navigation Tabs */}
              <div className="border-b border-[#E3E9EF] mb-5">
                <div className="flex space-x-6 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('vitals')}
                    className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === 'vitals'
                        ? 'border-[#0B4F8A] text-[#0B4F8A]'
                        : 'border-transparent text-[#5B6B7B] hover:text-[#1B2733]'
                    }`}
                  >
                    <HeartPulse className="h-4 w-4" />
                    <span>Vitals & Examination</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('consultation')}
                    className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === 'consultation'
                        ? 'border-[#0B4F8A] text-[#0B4F8A]'
                        : 'border-transparent text-[#5B6B7B] hover:text-[#1B2733]'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Consultation Notes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('prescription')}
                    className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === 'prescription'
                        ? 'border-[#0B4F8A] text-[#0B4F8A]'
                        : 'border-transparent text-[#5B6B7B] hover:text-[#1B2733]'
                    }`}
                  >
                    <Pill className="h-4 w-4" />
                    <span>Prescription (Rx)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === 'orders'
                        ? 'border-[#0B4F8A] text-[#0B4F8A]'
                        : 'border-transparent text-[#5B6B7B] hover:text-[#1B2733]'
                    }`}
                  >
                    <ClipboardList className="h-4 w-4" />
                    <span>Lab Orders</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === 'history'
                        ? 'border-[#0B4F8A] text-[#0B4F8A]'
                        : 'border-transparent text-[#5B6B7B] hover:text-[#1B2733]'
                    }`}
                  >
                    <History className="h-4 w-4" />
                    <span>Patient History</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: Vitals & Examination */}
              {activeTab === 'vitals' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0B4F8A]">
                      Vitals & Examination
                    </h4>
                    {isHighBp && (
                      <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Elevated Blood Pressure Alert (&ge;140 mmHg)
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div
                      className={`rounded-xl border p-3 text-center ${
                        isHighBp
                          ? 'border-rose-300 bg-rose-50/50'
                          : 'border-[#E3E9EF] bg-[#F8FAFC]'
                      }`}
                    >
                      <span className="text-[11px] font-semibold text-[#5B6B7B] block mb-1">
                        BP (mmHg)
                      </span>
                      <input
                        type="text"
                        value={bp}
                        onChange={(e) => setBp(e.target.value)}
                        className={`w-full rounded-md border py-1 px-2 font-mono text-center text-xs font-bold ${
                          isHighBp
                            ? 'border-rose-400 bg-white text-rose-900 focus:ring-rose-400'
                            : 'border-[#D5DDE5] bg-white text-[#1B2733] focus:border-[#0B4F8A]'
                        }`}
                      />
                    </div>

                    <div className="rounded-xl border border-[#E3E9EF] bg-[#F8FAFC] p-3 text-center">
                      <span className="text-[11px] font-semibold text-[#5B6B7B] block mb-1">
                        Pulse (bpm)
                      </span>
                      <input
                        type="text"
                        value={pulse}
                        onChange={(e) => setPulse(e.target.value)}
                        className="w-full rounded-md border border-[#D5DDE5] bg-white py-1 px-2 font-mono text-center text-xs font-bold text-[#1B2733] focus:border-[#0B4F8A]"
                      />
                    </div>

                    <div className="rounded-xl border border-[#E3E9EF] bg-[#F8FAFC] p-3 text-center">
                      <span className="text-[11px] font-semibold text-[#5B6B7B] block mb-1">
                        Temp (°F)
                      </span>
                      <input
                        type="text"
                        value={temp}
                        onChange={(e) => setTemp(e.target.value)}
                        className="w-full rounded-md border border-[#D5DDE5] bg-white py-1 px-2 font-mono text-center text-xs font-bold text-[#1B2733] focus:border-[#0B4F8A]"
                      />
                    </div>

                    <div className="rounded-xl border border-[#E3E9EF] bg-[#F8FAFC] p-3 text-center">
                      <span className="text-[11px] font-semibold text-[#5B6B7B] block mb-1">
                        Weight (kg)
                      </span>
                      <input
                        type="text"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full rounded-md border border-[#D5DDE5] bg-white py-1 px-2 font-mono text-center text-xs font-bold text-[#1B2733] focus:border-[#0B4F8A]"
                      />
                    </div>

                    <div className="rounded-xl border border-[#E3E9EF] bg-[#F8FAFC] p-3 text-center">
                      <span className="text-[11px] font-semibold text-[#5B6B7B] block mb-1">
                        SpO2 (%)
                      </span>
                      <input
                        type="text"
                        value={spo2}
                        onChange={(e) => setSpo2(e.target.value)}
                        className="w-full rounded-md border border-[#D5DDE5] bg-white py-1 px-2 font-mono text-center text-xs font-bold text-[#1B2733] focus:border-[#0B4F8A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      label="Provisional Diagnosis"
                      required
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Acute Pharyngitis / Type 2 Diabetes"
                    />

                    <TextField
                      label="Chief Symptoms & Complaints"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="e.g. Fever, dry cough, body aches for 3 days"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: Consultation Notes */}
              {activeTab === 'consultation' && (
                <div className="space-y-4">
                  <TextareaField
                    label="Clinical Examination & Observations"
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    placeholder="Clinical notes, clinical observations, chest examination, CBC, Blood Sugar Fasting, Chest X-Ray..."
                    rows={6}
                    helperText="Document findings, systemic examination, and diagnostic impressions"
                  />
                </div>
              )}

              {/* TAB 3: Prescription (Rx) */}
              {activeTab === 'prescription' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-serif italic font-bold text-2xl text-[#0B4F8A]">℞</span>
                      <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#1B2733]">
                        Medication Roster
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyLastPrescription}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#B5CDE0] bg-[#E8F1F9] px-3 py-1.5 text-xs font-semibold text-[#0B4F8A] hover:bg-[#D5E6F5]"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Copy Template</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleAddMedicineRow}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#0B4F8A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#093F6E]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Row</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-[#E3E9EF]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8FAFC] border-b border-[#E3E9EF] text-[#5B6B7B]">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold min-w-[200px]">Medicine Name</th>
                          <th className="py-2.5 px-3 font-semibold min-w-[100px]">Dosage</th>
                          <th className="py-2.5 px-3 font-semibold min-w-[100px]">Frequency</th>
                          <th className="py-2.5 px-3 font-semibold min-w-[100px]">Duration</th>
                          <th className="py-2.5 px-3 font-semibold min-w-[140px]">Instructions</th>
                          <th className="py-2.5 px-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0F4F8]">
                        {items.map((it, idx) => (
                          <tr key={idx} className="relative">
                            <td className="p-2 relative">
                              <input
                                type="text"
                                value={it.medicineName}
                                onChange={(e) => handleMedicineNameChange(e.target.value, idx)}
                                placeholder="Type medicine name..."
                                className="w-full rounded-md border border-[#D5DDE5] bg-white px-2.5 py-1.5 text-xs text-[#1B2733] font-medium focus:border-[#0B4F8A] focus:outline-none"
                              />

                              {/* Autocomplete Dropdown */}
                              {activeItemIndex === idx && autocompleteResults.length > 0 && (
                                <div className="absolute left-2 top-11 z-30 w-72 rounded-lg border border-[#E3E9EF] bg-white p-1 shadow-xl">
                                  {autocompleteResults.map((med) => (
                                    <div
                                      key={med.id}
                                      onClick={() => handleSelectMedicineMatch(med, idx)}
                                      className="cursor-pointer rounded px-2.5 py-1.5 hover:bg-[#E8F1F9] transition-colors"
                                    >
                                      <p className="font-bold text-xs text-[#1B2733]">{med.name}</p>
                                      {med.genericName && (
                                        <p className="text-[10px] text-[#8A97A5]">{med.genericName}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>

                            <td className="p-2">
                              <input
                                type="text"
                                value={it.dosage}
                                onChange={(e) => {
                                  const updated = [...items];
                                  updated[idx].dosage = e.target.value;
                                  setItems(updated);
                                }}
                                className="w-full rounded-md border border-[#D5DDE5] bg-white px-2 py-1.5 text-xs text-[#1B2733]"
                              />
                            </td>

                            <td className="p-2">
                              <select
                                value={it.frequency}
                                onChange={(e) => {
                                  const updated = [...items];
                                  updated[idx].frequency = e.target.value;
                                  setItems(updated);
                                }}
                                className="w-full rounded-md border border-[#D5DDE5] bg-white px-2 py-1.5 text-xs text-[#1B2733]"
                              >
                                <option value="1+0+1">1+0+1 (Morning & Night)</option>
                                <option value="1+1+1">1+1+1 (TDS)</option>
                                <option value="1+0+0">1+0+0 (Morning OD)</option>
                                <option value="0+0+1">0+0+1 (Night OD)</option>
                                <option value="SOS">SOS (As needed)</option>
                              </select>
                            </td>

                            <td className="p-2">
                              <input
                                type="text"
                                value={it.duration}
                                onChange={(e) => {
                                  const updated = [...items];
                                  updated[idx].duration = e.target.value;
                                  setItems(updated);
                                }}
                                className="w-full rounded-md border border-[#D5DDE5] bg-white px-2 py-1.5 text-xs text-[#1B2733]"
                              />
                            </td>

                            <td className="p-2">
                              <input
                                type="text"
                                value={it.instructions}
                                onChange={(e) => {
                                  const updated = [...items];
                                  updated[idx].instructions = e.target.value;
                                  setItems(updated);
                                }}
                                className="w-full rounded-md border border-[#D5DDE5] bg-white px-2 py-1.5 text-xs text-[#1B2733]"
                              />
                            </td>

                            <td className="p-2 text-center">
                              {items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMedicineRow(idx)}
                                  className="text-[#8A97A5] hover:text-rose-600 p-1"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-2">
                    <TextField
                      label="Follow-Up Schedule"
                      value={followUp}
                      onChange={(e) => setFollowUp(e.target.value)}
                      placeholder="e.g. In 7 days for review"
                      helperText="Quick: In 3 days, In 1 week, In 2 weeks"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: Lab & Radiology Orders */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0B4F8A]">
                      Standard Diagnostic Orders
                    </h4>
                    <span className="text-xs text-[#5B6B7B]">
                      {selectedOrders.length} test(s) selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {commonLabOrders.map((order) => {
                      const isSelected = selectedOrders.includes(order);
                      return (
                        <div
                          key={order}
                          onClick={() => handleToggleOrder(order)}
                          className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                            isSelected
                              ? 'border-[#0B4F8A] bg-[#E8F1F9]/50 font-semibold text-[#0B4F8A]'
                              : 'border-[#D5DDE5] bg-white text-[#1B2733] hover:border-[#B5CDE0]'
                          }`}
                        >
                          <span className="text-xs">{order}</span>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="h-4 w-4 rounded border-[#D5DDE5] text-[#0B4F8A]"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: Patient History */}
              {activeTab === 'history' && (
                <div className="space-y-3">
                  <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#1B2733]">
                    Prior Clinical History
                  </h4>
                  <p className="text-xs text-[#5B6B7B]">
                    Past diagnoses, prescriptions, and follow-ups for {activeVisit.patient?.name}.
                  </p>
                  <div className="rounded-xl border border-dashed border-[#D5DDE5] bg-[#FBFDFF] p-6 text-center text-xs text-[#8A97A5]">
                    No recorded chronic admissions. Patient on standard outpatient follow-up.
                  </div>
                </div>
              )}

              {/* Bottom Actions Bar */}
              <div className="mt-6 pt-4 border-t border-[#F0F4F8] flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-[#5B6B7B]">
                  Consultation for Token <strong className="text-[#0B4F8A]">#{activeVisit.tokenNumber}</strong>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSavePrescription}
                    disabled={isSubmitting}
                    className="rounded-lg border border-[#B5CDE0] bg-[#E8F1F9] px-4 py-2 text-xs font-bold text-[#0B4F8A] hover:bg-[#D5E6F5] transition-colors"
                  >
                    Save Draft
                  </button>

                  <button
                    type="button"
                    onClick={handleSavePrescription}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0B4F8A] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#093F6E] transition-colors disabled:opacity-50"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Save & Print Prescription</span>
                  </button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <Stethoscope className="mx-auto h-12 w-12 text-[#8A97A5] mb-3" />
              <h3 className="font-heading text-base font-bold text-[#1B2733]">No Patient in Room</h3>
              <p className="text-xs text-[#5B6B7B] mt-1 mb-4">
                Select a patient from the queue on the left or click &ldquo;Call to Room&rdquo; to begin.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
