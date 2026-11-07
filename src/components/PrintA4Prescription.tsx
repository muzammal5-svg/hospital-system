"use client";

import React from "react";
import Image from "next/image";
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
      <div className="bg-white border border-[#E3E9EF] rounded-xl p-6 max-w-4xl w-full shadow-2xl my-8">
        {/* Print controls */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-[#E3E9EF] mb-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1B2733]">
            <Printer className="w-4 h-4 text-[#0B4F8A]" />
            <span>Official A4 Hospital Prescription</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-[#0B4F8A] hover:bg-[#093F6E] text-white text-xs font-semibold transition-colors shadow-sm"
            >
              Print Prescription (Ctrl+P)
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#8A97A5] hover:text-[#1B2733] hover:bg-[#F6F9FC] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Printable A4 Container */}
        <div className="a4-prescription bg-white text-[#1B2733] p-8 font-sans border border-[#E3E9EF] rounded-lg shadow-sm">
          {/* Hospital Letterhead Header */}
          <div className="flex justify-between items-start border-b-2 border-[#0B4F8A] pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#0B4F8A] flex items-center justify-center text-white font-bold text-xl shrink-0">
                +
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0B4F8A] tracking-tight">NASEEM IJAZ HOSPITAL</h1>
                <p className="text-xs font-medium text-[#5B6B7B]">Outpatient Consultation & Diagnostic Center • Jail Road, Lahore</p>
                <p className="text-[11px] text-[#8A97A5]">UAN: +92 42 3578 9000 • Emergency 24/7: +92 42 3578 9999 • www.naseemijazhospital.pk</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-base font-bold text-[#1B2733]">{doctor.name}</h2>
              <p className="text-xs text-[#1E9E8F] font-semibold">{doctor.qualification}</p>
              <p className="text-xs text-[#5B6B7B]">{doctor.specialty} • Room {doctor.roomNo}</p>
            </div>
          </div>

          {/* Patient Details & Vitals Strip */}
          <div className="bg-[#F6F9FC] border border-[#E3E9EF] p-3 rounded-lg mb-4 text-xs">
            <div className="grid grid-cols-4 gap-2 pb-2 border-b border-[#E3E9EF]">
              <div>
                <span className="text-[#8A97A5] block">Patient Name:</span>
                <span className="font-bold text-sm text-[#1B2733]">{patient.fullName}</span>
              </div>
              <div>
                <span className="text-[#8A97A5] block">MR Number:</span>
                <span className="font-mono font-bold text-[#0B4F8A]">{patient.mrNumber}</span>
              </div>
              <div>
                <span className="text-[#8A97A5] block">Age / Gender:</span>
                <span className="font-medium text-[#1B2733]">{patient.age || "—"} Yrs / {patient.gender}</span>
              </div>
              <div>
                <span className="text-[#8A97A5] block">Date of Consult:</span>
                <span className="font-medium text-[#1B2733]">{formatDate(prescription.createdAt)}</span>
              </div>
            </div>

            {/* Vitals row */}
            <div className="grid grid-cols-5 gap-2 pt-2 text-[11px]">
              <div><span className="text-[#8A97A5]">BP:</span> <span className="font-semibold text-[#1B2733]">{prescription.bloodPressure || "—"}</span></div>
              <div><span className="text-[#8A97A5]">Pulse:</span> <span className="font-semibold text-[#1B2733]">{prescription.pulse || "—"}</span></div>
              <div><span className="text-[#8A97A5]">Temp:</span> <span className="font-semibold text-[#1B2733]">{prescription.temperature || "—"}</span></div>
              <div><span className="text-[#8A97A5]">Weight:</span> <span className="font-semibold text-[#1B2733]">{prescription.weight || "—"}</span></div>
              <div><span className="text-[#8A97A5]">SpO2:</span> <span className="font-semibold text-[#1B2733]">{prescription.oxygenSaturation || "—"}</span></div>
            </div>
          </div>

          {/* Allergies Banner */}
          {patient.allergies && patient.allergies.toLowerCase() !== "none reported" && patient.allergies.toLowerCase() !== "none" && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-md text-xs font-semibold mb-4 flex items-center gap-2">
              <span className="uppercase text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">Allergy Alert</span>
              <span>Patient reports known allergies: {patient.allergies}</span>
            </div>
          )}

          {/* Clinical Findings & Diagnosis */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="col-span-1 border-r border-[#E3E9EF] pr-4 space-y-3 text-xs">
              <div>
                <span className="font-bold text-[#5B6B7B] block uppercase text-[10px] tracking-wider">Symptoms / Chief Complaint</span>
                <p className="text-[#1B2733] mt-1">{prescription.symptoms || "Regular clinical evaluation"}</p>
              </div>

              <div>
                <span className="font-bold text-[#5B6B7B] block uppercase text-[10px] tracking-wider">Clinical Notes</span>
                <p className="text-[#1B2733] mt-1">{prescription.clinicalNotes || "General appearance satisfactory."}</p>
              </div>

              <div>
                <span className="font-bold text-[#0B4F8A] block uppercase text-[10px] tracking-wider">Provisional Diagnosis</span>
                <p className="font-bold text-[#1B2733] mt-1 bg-[#E8F1F9] p-2 rounded border border-[#0B4F8A]/20">
                  {prescription.diagnosis}
                </p>
              </div>
            </div>

            {/* Rx Section */}
            <div className="col-span-2 pl-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-serif italic font-bold text-2xl text-[#0B4F8A]">℞</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5B6B7B]">Prescribed Medications</span>
              </div>

              <table className="w-full text-xs border border-[#E3E9EF]">
                <thead>
                  <tr className="bg-[#F6F9FC] border-b border-[#E3E9EF] text-[#5B6B7B] text-left">
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
                    <tr key={item.id} className="border-b border-[#E3E9EF] last:border-none">
                      <td className="p-2 font-mono text-[#8A97A5]">{idx + 1}</td>
                      <td className="p-2 font-bold text-[#1B2733]">{item.medicineName}</td>
                      <td className="p-2 text-[#5B6B7B]">{item.dosage}</td>
                      <td className="p-2 font-semibold text-[#0B4F8A]">{item.frequency}</td>
                      <td className="p-2 text-[#5B6B7B]">{item.duration}</td>
                      <td className="p-2 text-[#5B6B7B]">{item.instructions || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {prescription.followUpDate && (
                <div className="mt-4 p-2 bg-[#F6F9FC] border border-[#E3E9EF] rounded text-xs">
                  <span className="font-semibold text-[#1B2733]">Follow-up Advice:</span>{" "}
                  <span className="text-[#0B4F8A] font-semibold">{prescription.followUpDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Letterhead Footer & Doctor Signature */}
          <div className="mt-16 pt-8 border-t-2 border-[#E3E9EF] flex justify-between items-end">
            <div className="text-[10px] text-[#8A97A5] max-w-sm leading-relaxed">
              * Please take medicines strictly as prescribed. Keep medications away from children. In case of unexpected adverse reactions or severe fever, report to ER immediately.
            </div>

            <div className="text-center">
              <div className="w-48 border-b border-[#1B2733] mb-1.5"></div>
              <span className="text-xs font-bold text-[#1B2733] block">{doctor.name}</span>
              <span className="text-[10px] text-[#5B6B7B] block">Consultant Signature & Official Stamp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
