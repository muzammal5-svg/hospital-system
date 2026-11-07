"use client";

import React from "react";
import { formatDate } from "@/lib/utils";
import { Printer, X } from "lucide-react";

interface PrescriptionPrintProps {
  prescription: {
    id: string;
    diagnosis: string;
    symptoms?: string | null;
    clinicalNotes?: string | null;
    bloodPressure?: string | null;
    pulse?: string | null;
    temperature?: string | null;
    weight?: string | null;
    oxygenSaturation?: string | null;
    followUpDate?: string | null;
    createdAt: string | Date;
    items: Array<{
      id: string;
      medicineName: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions?: string | null;
    }>;
    doctor: {
      name: string;
      qualification: string;
      specialty: string;
      roomNo: string;
      phone?: string | null;
      department?: { name: string };
    };
    patient: {
      fullName: string;
      mrNumber: string;
      age?: number | null;
      gender: string;
      allergies?: string | null;
      mobile: string;
    };
  };
  onClose?: () => void;
}

export function PrintA4Prescription({ prescription, onClose }: PrescriptionPrintProps) {
  const handlePrint = () => {
    window.print();
  };

  const { doctor, patient, items } = prescription;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 max-w-4xl w-full shadow-2xl my-8">
        {/* Print controls */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-6">
          <div className="flex items-center gap-2 text-sm font-bold text-neutral-800 dark:text-neutral-100">
            <Printer className="w-4 h-4 text-teal-500" />
            <span>A4 Hospital Letterhead Prescription</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-full bg-teal-500 hover:bg-teal-600 text-black text-xs font-bold transition-colors"
            >
              Print Prescription (Ctrl+P)
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Printable A4 Container */}
        <div className="a4-prescription bg-white text-black p-8 font-sans border border-neutral-300 rounded-lg shadow-sm">
          {/* Hospital Letterhead Header */}
          <div className="flex justify-between items-start border-b-2 border-teal-600 pb-4 mb-4">
            <div>
              <h1 className="text-2xl font-black text-teal-800 tracking-tight uppercase">NASEEM IJAZ HOSPITAL</h1>
              <p className="text-xs font-semibold text-neutral-600">Department of Outpatient Services • Jail Road, Lahore, Pakistan</p>
              <p className="text-[11px] text-neutral-500">UAN: +92 42 3578 9000 • Emergency 24/7: +92 42 3578 9999 • www.naseemijazhospital.pk</p>
            </div>
            <div className="text-right">
              <h2 className="text-base font-bold text-neutral-900">{doctor.name}</h2>
              <p className="text-xs text-teal-700 font-semibold">{doctor.qualification}</p>
              <p className="text-xs text-neutral-600">{doctor.specialty} • {doctor.roomNo}</p>
            </div>
          </div>

          {/* Patient Details & Vitals Strip */}
          <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-lg mb-4 text-xs">
            <div className="grid grid-cols-4 gap-2 pb-2 border-b border-neutral-200">
              <div>
                <span className="text-neutral-500 block">Patient Name:</span>
                <span className="font-bold text-sm">{patient.fullName}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">MR Number:</span>
                <span className="font-mono font-bold text-teal-700">{patient.mrNumber}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Age / Gender:</span>
                <span className="font-medium">{patient.age || "—"} Yrs / {patient.gender}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Date of Consult:</span>
                <span className="font-medium">{formatDate(prescription.createdAt)}</span>
              </div>
            </div>

            {/* Vitals row */}
            <div className="grid grid-cols-5 gap-2 pt-2 text-[11px]">
              <div><span className="text-neutral-500">BP:</span> <span className="font-semibold">{prescription.bloodPressure || "—"}</span></div>
              <div><span className="text-neutral-500">Pulse:</span> <span className="font-semibold">{prescription.pulse || "—"}</span></div>
              <div><span className="text-neutral-500">Temp:</span> <span className="font-semibold">{prescription.temperature || "—"}</span></div>
              <div><span className="text-neutral-500">Weight:</span> <span className="font-semibold">{prescription.weight || "—"}</span></div>
              <div><span className="text-neutral-500">SpO2:</span> <span className="font-semibold">{prescription.oxygenSaturation || "—"}</span></div>
            </div>
          </div>

          {/* Allergies Banner */}
          {patient.allergies && patient.allergies.toLowerCase() !== "none reported" && patient.allergies.toLowerCase() !== "none" && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-md text-xs font-bold mb-4 flex items-center gap-2">
              <span className="uppercase text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded">Allergy Alert</span>
              <span>Patient reports known allergies: {patient.allergies}</span>
            </div>
          )}

          {/* Clinical Findings & Diagnosis */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="col-span-1 border-r border-neutral-200 pr-4 space-y-3 text-xs">
              <div>
                <span className="font-bold text-neutral-700 block uppercase text-[10px] tracking-wider">Symptoms / Chief Complaint</span>
                <p className="text-neutral-600 mt-1">{prescription.symptoms || "Regular clinical evaluation"}</p>
              </div>

              <div>
                <span className="font-bold text-neutral-700 block uppercase text-[10px] tracking-wider">Clinical Notes</span>
                <p className="text-neutral-600 mt-1">{prescription.clinicalNotes || "General appearance satisfactory."}</p>
              </div>

              <div>
                <span className="font-bold text-teal-800 block uppercase text-[10px] tracking-wider">Provisional Diagnosis</span>
                <p className="font-bold text-neutral-900 mt-1 bg-teal-50 p-2 rounded border border-teal-200">
                  {prescription.diagnosis}
                </p>
              </div>
            </div>

            {/* Rx Section */}
            <div className="col-span-2 pl-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-serif italic font-black text-2xl text-teal-700">℞</span>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Prescribed Medications</span>
              </div>

              <table className="w-full text-xs border border-neutral-200">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 text-left">
                    <th className="p-2">#</th>
                    <th className="p-2">Medicine</th>
                    <th className="p-2">Dosage</th>
                    <th className="p-2">Frequency</th>
                    <th className="p-2">Duration</th>
                    <th className="p-2">Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.id} className="border-b border-neutral-100">
                      <td className="p-2 font-mono text-neutral-400">{idx + 1}</td>
                      <td className="p-2 font-bold text-neutral-900">{item.medicineName}</td>
                      <td className="p-2">{item.dosage}</td>
                      <td className="p-2 font-semibold text-teal-700">{item.frequency}</td>
                      <td className="p-2">{item.duration}</td>
                      <td className="p-2 text-neutral-600">{item.instructions || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {prescription.followUpDate && (
                <div className="mt-4 p-2 bg-neutral-50 border border-neutral-200 rounded text-xs">
                  <span className="font-bold text-neutral-800">Follow-up Recommendation:</span>{" "}
                  <span className="text-teal-700 font-semibold">{prescription.followUpDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Letterhead Footer & Doctor Signature */}
          <div className="mt-16 pt-8 border-t-2 border-neutral-200 flex justify-between items-end">
            <div className="text-[10px] text-neutral-500 max-w-sm leading-relaxed">
              * Please take medicines strictly as prescribed. Keep all medications out of reach of children. In case of adverse drug reactions or sudden fever, report to ER immediately.
            </div>

            <div className="text-center">
              <div className="w-48 border-b border-black mb-1"></div>
              <span className="text-xs font-bold block">{doctor.name}</span>
              <span className="text-[10px] text-neutral-600 block">Consultant Signature & Stamp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
