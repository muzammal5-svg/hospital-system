"use client";

import React, { useState } from "react";
import { formatPKR, formatDate } from "@/lib/utils";
import {
  FileText,
  DollarSign,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowDownRight,
  Printer,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  RotateCcw,
} from "lucide-react";

interface BillingClientProps {
  initialBills: any[];
  userRole: string;
}

export default function BillingClient({ initialBills, userRole }: BillingClientProps) {
  const [bills, setBills] = useState(initialBills);
  const [activeTab, setActiveTab] = useState<"invoices" | "closing">("invoices");

  // Refund Modal State
  const [refundModalBill, setRefundModalBill] = useState<any | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState("");
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);

  // Cash Closing State
  const [closingDate, setClosingDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [closingSummary, setClosingSummary] = useState<any | null>(null);
  const [openingCash, setOpeningCash] = useState<number>(5000);
  const [actualHandover, setActualHandover] = useState<number>(0);
  const [closingNotes, setClosingNotes] = useState("");
  const [closingLoading, setClosingLoading] = useState(false);
  const [closingSuccess, setClosingSuccess] = useState(false);

  // Fetch live closing summary
  const loadClosingSummary = async (date: string) => {
    try {
      const res = await fetch(`/api/cash-closing?date=${date}`);
      const data = await res.json();
      setClosingSummary(data);
      if (data.liveSummary) {
        setActualHandover(data.liveSummary.totalExpected);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenRefund = (bill: any) => {
    setRefundModalBill(bill);
    setRefundAmount(bill.paidAmount);
    setRefundReason("");
    setRefundError(null);
  };

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundModalBill) return;

    setIsRefunding(true);
    setRefundError(null);

    try {
      const res = await fetch(`/api/bills/${refundModalBill.id}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(refundAmount),
          reason: refundReason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Refund failed.");
      }

      const updated = bills.map((b) =>
        b.id === refundModalBill.id
          ? {
              ...b,
              paymentStatus: "REFUNDED",
              refunds: [...(b.refunds || []), data.refund],
            }
          : b
      );
      setBills(updated);
      setRefundModalBill(null);
    } catch (err: any) {
      setRefundError(err.message);
    } finally {
      setIsRefunding(false);
    }
  };

  const handleSubmitClosing = async (e: React.FormEvent) => {
    e.preventDefault();
    setClosingLoading(true);
    try {
      const res = await fetch("/api/cash-closing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: closingDate,
          openingCash: Number(openingCash) || 0,
          actualHandover: Number(actualHandover) || 0,
          notes: closingNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Closing submission failed.");
      }

      setClosingSuccess(true);
      loadClosingSummary(closingDate);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setClosingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Refund Modal */}
      {refundModalBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#E3E9EF] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E9EF]">
              <h3 className="font-bold text-sm text-[#1B2733]">
                Authorize Invoice Refund
              </h3>
              <button
                onClick={() => setRefundModalBill(null)}
                className="text-[#8A97A5] hover:text-[#1B2733]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {refundError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {refundError}
              </div>
            )}

            <form onSubmit={handleProcessRefund} className="space-y-4">
              <div className="p-3.5 bg-[#F6F9FC] border border-[#E3E9EF] rounded-lg space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#5B6B7B]">Invoice Number:</span>
                  <span className="font-mono font-bold text-[#1B2733]">{refundModalBill.invoiceNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B6B7B]">Patient:</span>
                  <span className="font-semibold text-[#1B2733]">{refundModalBill.patient.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B6B7B]">Paid Amount:</span>
                  <span className="font-bold text-[#0B4F8A]">{formatPKR(refundModalBill.paidAmount)}</span>
                </div>
              </div>

              <div>
                <label className="block text-[#1B2733] font-semibold mb-1">
                  Refund Amount (PKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={refundModalBill.paidAmount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value) || 0)}
                  className="w-full bg-white border border-[#E3E9EF] rounded-lg px-3 py-2 text-[#1B2733] font-mono font-bold outline-none focus:border-[#0B4F8A]"
                />
              </div>

              <div>
                <label className="block text-[#1B2733] font-semibold mb-1">
                  Reason for Refund <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Doctor emergency leave, patient requested cancellation"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full bg-white border border-[#E3E9EF] rounded-lg p-2.5 text-[#1B2733] outline-none focus:border-[#0B4F8A] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRefundModalBill(null)}
                  className="px-4 py-2 rounded-lg border border-[#E3E9EF] text-[#5B6B7B] font-semibold hover:bg-[#F6F9FC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRefunding}
                  className="px-4 py-2 rounded-lg bg-[#D64545] hover:bg-red-700 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {isRefunding ? "Processing..." : "Confirm Refund"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-[#E3E9EF]">
        <div>
          <h1 className="font-display font-bold text-2xl tracking-tight text-[#1B2733]">
            Billing & Cash Counter
          </h1>
          <p className="text-sm text-[#5B6B7B] mt-0.5">
            Fee invoices, refund authorizations, and end-of-shift cash drawer reconciliations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#F6F9FC] border border-[#E3E9EF]">
          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "invoices"
                ? "bg-[#0B4F8A] text-white shadow-sm"
                : "text-[#5B6B7B] hover:text-[#1B2733]"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Invoices Registry</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("closing");
              loadClosingSummary(closingDate);
            }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "closing"
                ? "bg-[#0B4F8A] text-white shadow-sm"
                : "text-[#5B6B7B] hover:text-[#1B2733]"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Daily Cash Closing</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INVOICES REGISTRY */}
      {activeTab === "invoices" && (
        <div className="rounded-xl bg-white border border-[#E3E9EF] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E3E9EF] text-[#5B6B7B] bg-[#F6F9FC]">
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Invoice #</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Patient Name</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Date</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Total Fee</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Method</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px]">Status</th>
                  <th className="py-3 px-4 font-semibold uppercase text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E9EF]">
                {bills.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F6F9FC] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1B2733]">
                      {b.invoiceNo}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#1B2733] block">{b.patient.fullName}</span>
                      <span className="text-[11px] text-[#5B6B7B] font-mono">
                        {b.patient.mrNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#5B6B7B]">{formatDate(b.createdAt)}</td>
                    <td className="py-3.5 px-4 font-bold text-[#1B2733]">
                      {formatPKR(b.total)}
                      {b.discount > 0 && (
                        <span className="text-[10px] text-red-600 block font-normal">
                          Discount: -{formatPKR(b.discount)}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono uppercase text-[#0B4F8A] font-bold">
                      {b.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          b.paymentStatus === "PAID"
                            ? "bg-[#E6F5F3] text-[#1E9E8F] border border-[#1E9E8F]/20"
                            : b.paymentStatus === "REFUNDED"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {b.paymentStatus !== "REFUNDED" && (userRole === "ADMIN" || userRole === "ACCOUNTANT") && (
                        <button
                          onClick={() => handleOpenRefund(b)}
                          className="px-2.5 py-1 rounded-md bg-red-50 hover:bg-red-600 hover:text-white text-red-700 font-semibold text-xs border border-red-200 transition-colors"
                        >
                          Process Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DAILY CASH CLOSING */}
      {activeTab === "closing" && (
        <div className="p-6 rounded-xl bg-white border border-[#E3E9EF] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E9EF]">
            <div>
              <h3 className="font-bold text-base text-[#1B2733]">
                Daily Cash Counter Closing & Handover
              </h3>
              <p className="text-xs text-[#5B6B7B] mt-0.5">
                Reconcile physical cash with system invoices for end-of-shift handover.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <label htmlFor="closingDateInput" className="text-[#5B6B7B] font-semibold">
                Closing Date:
              </label>
              <input
                id="closingDateInput"
                type="date"
                value={closingDate}
                onChange={(e) => {
                  setClosingDate(e.target.value);
                  loadClosingSummary(e.target.value);
                }}
                className="bg-[#F6F9FC] border border-[#E3E9EF] rounded-lg px-3 py-1.5 text-[#1B2733] font-medium outline-none focus:border-[#0B4F8A]"
              />
            </div>
          </div>

          {/* Breakdown KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F6F9FC] border border-[#E3E9EF]">
              <span className="text-[#5B6B7B] block text-[11px] font-semibold mb-1">Cash In Drawer</span>
              <span className="font-display font-bold text-xl text-[#1B2733]">
                {formatPKR(closingSummary?.liveSummary?.cashCollected || 0)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F9FC] border border-[#E3E9EF]">
              <span className="text-[#5B6B7B] block text-[11px] font-semibold mb-1">Card Swipes</span>
              <span className="font-display font-bold text-xl text-[#0B4F8A]">
                {formatPKR(closingSummary?.liveSummary?.cardCollected || 0)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F9FC] border border-[#E3E9EF]">
              <span className="text-[#5B6B7B] block text-[11px] font-semibold mb-1">JazzCash / Easypaisa</span>
              <span className="font-display font-bold text-xl text-[#1E9E8F]">
                {formatPKR((closingSummary?.liveSummary?.jazzCashCollected || 0) + (closingSummary?.liveSummary?.easypaisaCollected || 0))}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <span className="text-red-700 block text-[11px] font-semibold mb-1">Total Refunds</span>
              <span className="font-display font-bold text-xl text-red-600">
                -{formatPKR(closingSummary?.liveSummary?.refundsTotal || 0)}
              </span>
            </div>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmitClosing} className="space-y-4 text-xs max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#1B2733] font-semibold mb-1">
                  Opening Float / Cash in Drawer (PKR)
                </label>
                <input
                  type="number"
                  value={openingCash}
                  onChange={(e) => setOpeningCash(Number(e.target.value) || 0)}
                  className="w-full bg-white border border-[#E3E9EF] rounded-lg px-3 py-2 text-[#1B2733] font-mono outline-none focus:border-[#0B4F8A]"
                />
              </div>

              <div>
                <label className="block text-[#1B2733] font-semibold mb-1">
                  Physical Cash Handed Over (PKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={actualHandover}
                  onChange={(e) => setActualHandover(Number(e.target.value) || 0)}
                  className="w-full bg-white border border-[#E3E9EF] rounded-lg px-3 py-2 text-[#1B2733] font-mono font-bold outline-none focus:border-[#0B4F8A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#1B2733] font-semibold mb-1">
                Handover Notes / Discrepancy Remarks
              </label>
              <textarea
                rows={2}
                placeholder="Mention any shortage or notes for next cashier..."
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
                className="w-full bg-white border border-[#E3E9EF] rounded-lg p-3 text-[#1B2733] outline-none focus:border-[#0B4F8A] resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {closingSuccess && (
                <span className="text-[#2E9E6B] font-semibold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Closing Submitted & Handover Logged.</span>
                </span>
              )}

              <button
                type="submit"
                disabled={closingLoading}
                className="px-5 py-2.5 rounded-lg bg-[#0B4F8A] hover:bg-[#093F6E] text-white text-xs font-semibold ml-auto flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Submit Cash Closing</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
