"use client";

import React from "react";
import { formatPKR, formatDate, formatTime } from "@/lib/utils";
import { Printer, X } from "lucide-react";

interface ThermalReceiptProps {
  visit: {
    tokenNumber: number;
    visitNumber: string;
    tokenDate: string;
    visitType: string;
    consultationFee: number;
    discountAmount: number;
    netAmount: number;
    paymentMethod: string;
    createdAt: string | Date;
    doctor: {
      name: string;
      specialty: string;
      roomNo: string;
      department?: { name: string };
    };
    patient: {
      fullName: string;
      mrNumber: string;
      age?: number | null;
      gender: string;
      mobile: string;
    };
  };
  hospitalProfile?: {
    name?: string;
    address?: string;
    phone?: string;
    receiptHeader?: string;
    receiptFooter?: string;
  };
  onClose?: () => void;
}

export function PrintThermalReceipt({ visit, hospitalProfile, onClose }: ThermalReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  const defaultHospitalName = hospitalProfile?.name || "Naseem Ijaz Hospital";
  const defaultAddress = hospitalProfile?.address || "Plot 14-B, Medical Enclave, Jail Road, Lahore";
  const defaultPhone = hospitalProfile?.phone || "+92 42 3578 9000";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white border border-[#E3E9EF] rounded-xl p-6 max-w-sm w-full shadow-2xl">
        {/* Controls (hidden during print) */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-[#E3E9EF] mb-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1B2733]">
            <Printer className="w-4 h-4 text-[#0B4F8A]" />
            <span>80mm Thermal Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#0B4F8A] hover:bg-[#093F6E] text-white text-xs font-semibold transition-colors shadow-sm"
            >
              Print Slip (Ctrl+P)
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-[#8A97A5] hover:text-[#1B2733] hover:bg-[#F6F9FC]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 80mm Slip Printable Container */}
        <div className="thermal-receipt bg-white text-black p-4 font-mono text-xs border border-dashed border-neutral-300 rounded-lg">
          {/* Header */}
          <div className="text-center border-b border-black pb-2 mb-2">
            <h1 className="font-bold text-base leading-tight uppercase tracking-wider">{defaultHospitalName}</h1>
            <p className="text-[10px] text-neutral-600">{defaultAddress}</p>
            <p className="text-[10px] text-neutral-600">Tel: {defaultPhone}</p>
            <div className="mt-1 font-bold text-[10px] border border-black inline-block px-2 py-0.5 uppercase">
              OPD Token & Fee Receipt
            </div>
          </div>

          {/* Token Callout */}
          <div className="text-center my-3 border-y-2 border-dashed border-black py-2">
            <span className="text-[11px] font-bold uppercase tracking-widest block text-neutral-600">Daily Queue Token</span>
            <span className="text-4xl font-black block tracking-tighter my-1">
              #{String(visit.tokenNumber).padStart(2, "0")}
            </span>
            <span className="text-xs font-bold uppercase">
              Room: {visit.doctor.roomNo}
            </span>
          </div>

          {/* Doctor & Room */}
          <div className="border-b border-black pb-2 mb-2 space-y-0.5">
            <div className="flex justify-between">
              <span className="text-neutral-600">Doctor:</span>
              <span className="font-bold text-right">{visit.doctor.name}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-neutral-600">Specialty:</span>
              <span className="text-right">{visit.doctor.specialty}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-neutral-600">Dept:</span>
              <span className="text-right">{visit.doctor.department?.name || "General OPD"}</span>
            </div>
          </div>

          {/* Patient Details */}
          <div className="border-b border-black pb-2 mb-2 space-y-0.5">
            <div className="flex justify-between">
              <span className="text-neutral-600">Patient:</span>
              <span className="font-bold text-right">{visit.patient.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">MR Number:</span>
              <span className="font-bold">{visit.patient.mrNumber}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-neutral-600">Age / Gender:</span>
              <span>{visit.patient.age || "—"} Yrs / {visit.patient.gender}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-neutral-600">Mobile:</span>
              <span>{visit.patient.mobile}</span>
            </div>
          </div>

          {/* Financials */}
          <div className="border-b border-black pb-2 mb-2 space-y-1">
            <div className="flex justify-between">
              <span>Consultation Fee:</span>
              <span>{formatPKR(visit.consultationFee)}</span>
            </div>
            {visit.discountAmount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount:</span>
                <span>-{formatPKR(visit.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm border-t border-black pt-1">
              <span>Total Paid:</span>
              <span>{formatPKR(visit.netAmount)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-neutral-600">
              <span>Payment Mode:</span>
              <span className="font-bold uppercase">{visit.paymentMethod}</span>
            </div>
          </div>

          {/* Metadata & Footer */}
          <div className="text-center text-[10px] text-neutral-600 pt-1 space-y-1">
            <div>Visit ID: {visit.visitNumber}</div>
            <div>Date: {formatDate(visit.tokenDate)} • Time: {formatTime(visit.createdAt)}</div>
            <div className="pt-2 text-[9px] uppercase tracking-wider font-semibold border-t border-dashed border-neutral-300">
              Valid for consultation on issue date only.
              <br />Emergency 24/7: +92 42 3578 9999
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
