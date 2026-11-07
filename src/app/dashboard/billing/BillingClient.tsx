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

      // Update bill in local state
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
          <div className="bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-white/10">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                Authorize Invoice Refund
              </h3>
              <button onClick={() => setRefundModalBill(null)} className="text-neutral-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {refundError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-500 rounded-xl">
                {refundError}
              </div>
            )}

            <form onSubmit={handleProcessRefund} className="space-y-4">
              <div className="p-3 bg-neutral-50 dark:bg-white/5 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Invoice Number:</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-white">{refundModalBill.invoiceNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Patient:</span>
                  <span className="font-semibold">{refundModalBill.patient.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Paid Amount:</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">{formatPKR(refundModalBill.paidAmount)}</span>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                  Refund Amount (PKR) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={refundModalBill.paidAmount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value) || 0)}
                  className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2 text-neutral-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                  Clinical / Administrative Refund Reason *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Doctor emergency leave / Patient requested rescheduling"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl p-2.5 text-neutral-900 dark:text-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRefundModalBill(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-white/5 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRefunding}
                  className="btn-pill bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                >
                  {isRefunding ? "Processing..." : "Confirm Refund"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight text-neutral-900 dark:text-white">
            Hospital Billing & Cash Closing
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Fee receipts, partial/full refunds, and daily front desk cash reconciliation.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-neutral-100 dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10">
          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "invoices"
                ? "bg-teal-500 text-black shadow-sm"
                : "text-neutral-600 dark:text-neutral-400"
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
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "closing"
                ? "bg-teal-500 text-black shadow-sm"
                : "text-neutral-600 dark:text-neutral-400"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Daily Cash Closing</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INVOICES REGISTRY */}
      {activeTab === "invoices" && (
        <div className="rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-white/10 text-neutral-400 bg-neutral-50 dark:bg-white/5">
                  <th className="py-3 px-4 font-bold uppercase text-[10px]">Invoice #</th>
                  <th className="py-3 px-4 font-bold uppercase text-[10px]">Patient Name</th>
                  <th className="py-3 px-4 font-bold uppercase text-[10px]">Date</th>
                  <th className="py-3 px-4 font-bold uppercase text-[10px]">Total Fee</th>
                  <th className="py-3 px-4 font-bold uppercase text-[10px]">Method</th>
                  <th className="py-3 px-4 font-bold uppercase text-[10px]">Status</th>
                  <th className="py-3 px-4 font-bold uppercase text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                {bills.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-white">
                      {b.invoiceNo}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-neutral-800 dark:text-neutral-100">
                      {b.patient.fullName}
                      <span className="text-[10px] text-neutral-400 block font-mono">
                        {b.patient.mrNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500">{formatDate(b.createdAt)}</td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                      {formatPKR(b.total)}
                      {b.discount > 0 && (
                        <span className="text-[10px] text-red-500 block font-normal">
                          Discount: -{formatPKR(b.discount)}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono uppercase text-teal-600 dark:text-teal-400 font-bold">
                      {b.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.paymentStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : b.paymentStatus === "REFUNDED"
                            ? "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {b.paymentStatus !== "REFUNDED" && (userRole === "ADMIN" || userRole === "ACCOUNTANT") && (
                        <button
                          onClick={() => handleOpenRefund(b)}
                          className="px-2.5 py-1 rounded bg-red-50 dark:bg-red-950/30 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 font-bold text-[11px] transition-colors"
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

      {/* TAB 2: DAILY CASH CLOSING PER RECEPTIONIST */}
      {activeTab === "closing" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-white/10">
            <div>
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                Reception Daily Cash Closing & Handover
              </h3>
              <p className="text-xs text-neutral-500">
                End-of-shift reconciliation for cashier physical handover.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400 font-semibold">Closing Date:</span>
              <input
                type="date"
                value={closingDate}
                onChange={(e) => {
                  setClosingDate(e.target.value);
                  loadClosingSummary(e.target.value);
                }}
                className="bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-neutral-900 dark:text-white outline-none"
              />
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10">
              <span className="text-neutral-400 block text-[11px]">Cash In Drawer</span>
              <span className="font-display font-black text-xl text-neutral-900 dark:text-white">
                {formatPKR(closingSummary?.liveSummary?.cashCollected || 0)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10">
              <span className="text-neutral-400 block text-[11px]">Card Transactions</span>
              <span className="font-display font-black text-xl text-blue-600 dark:text-blue-400">
                {formatPKR(closingSummary?.liveSummary?.cardCollected || 0)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10">
              <span className="text-neutral-400 block text-[11px]">JazzCash / Easypaisa</span>
              <span className="font-display font-black text-xl text-purple-600 dark:text-purple-400">
                {formatPKR((closingSummary?.liveSummary?.jazzCashCollected || 0) + (closingSummary?.liveSummary?.easypaisaCollected || 0))}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30">
              <span className="text-red-500 block text-[11px]">Total Refunds</span>
              <span className="font-display font-black text-xl text-red-600 dark:text-red-400">
                -{formatPKR(closingSummary?.liveSummary?.refundsTotal || 0)}
              </span>
            </div>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmitClosing} className="space-y-4 text-xs max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                  Opening Float / Cash in Drawer (PKR)
                </label>
                <input
                  type="number"
                  value={openingCash}
                  onChange={(e) => setOpeningCash(Number(e.target.value) || 0)}
                  className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2 text-neutral-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                  Actual Physical Cash Handed Over (PKR) *
                </label>
                <input
                  type="number"
                  required
                  value={actualHandover}
                  onChange={(e) => setActualHandover(Number(e.target.value) || 0)}
                  className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2 text-neutral-900 dark:text-white font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                Handover Notes / Discrepancy Explanation
              </label>
              <textarea
                rows={2}
                placeholder="Mention any change shortage or notes for the next shift receptionist..."
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl p-3 text-neutral-900 dark:text-white resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {closingSuccess && (
                <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Closing Submitted & Handover Logged.</span>
                </span>
              )}

              <button
                type="submit"
                disabled={closingLoading}
                className="btn-pill bg-teal-500 hover:bg-teal-600 text-black text-xs font-bold uppercase tracking-wider ml-auto gap-2"
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
