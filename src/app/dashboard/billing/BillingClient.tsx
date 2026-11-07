'use client';

import React, { useState } from 'react';
import { formatPKR, formatDate } from '@/lib/utils';
import {
  PageHeader,
  StatCard,
  Card,
  CardHeader,
  DataTable,
  ColumnDef,
  FilterBar,
  Modal,
  StatusChip,
  TextField,
  SelectField,
  TextareaField,
  FormGrid,
  useToast,
} from '@/components/ui-app';
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
  Receipt,
  Coins,
} from 'lucide-react';

interface BillingClientProps {
  initialBills: any[];
  userRole: string;
}

export default function BillingClient({ initialBills, userRole }: BillingClientProps) {
  const toast = useToast();
  const [bills, setBills] = useState(initialBills);
  const [activeTab, setActiveTab] = useState<'invoices' | 'closing' | 'new_invoice'>('invoices');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Refund Modal State
  const [refundModalBill, setRefundModalBill] = useState<any | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);

  // Cash Closing State
  const [closingDate, setClosingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [closingSummary, setClosingSummary] = useState<any | null>(null);
  const [openingCash, setOpeningCash] = useState<number>(5000);
  const [actualHandover, setActualHandover] = useState<number>(0);
  const [closingNotes, setClosingNotes] = useState('');
  const [closingLoading, setClosingLoading] = useState(false);
  const [closingSuccess, setClosingSuccess] = useState(false);

  // New Invoice State
  const [newInvPatient, setNewInvPatient] = useState('');
  const [newInvItems, setNewInvItems] = useState([
    { description: 'OPD Specialist Consultation Fee', amount: 2500, qty: 1 },
  ]);
  const [newInvDiscount, setNewInvDiscount] = useState<number>(0);
  const [newInvMethod, setNewInvMethod] = useState('CASH');

  // Calculate high-level stats
  const totalRevenue = bills.reduce((acc, b) => acc + (b.total || 0), 0);
  const cashTotal = bills
    .filter((b) => (b.paymentMethod || 'CASH') === 'CASH')
    .reduce((acc, b) => acc + (b.paidAmount || b.total || 0), 0);
  const cardTotal = bills
    .filter((b) => (b.paymentMethod || '') === 'CARD')
    .reduce((acc, b) => acc + (b.paidAmount || b.total || 0), 0);
  const refundedTotal = bills
    .filter((b) => (b.paymentStatus || b.status) === 'REFUNDED')
    .reduce((acc, b) => acc + (b.paidAmount || b.total || 0), 0);

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
    setRefundAmount(bill.paidAmount || bill.total || 0);
    setRefundReason('');
    setRefundError(null);
  };

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundModalBill) return;

    setIsRefunding(true);
    setRefundError(null);

    try {
      const res = await fetch(`/api/bills/${refundModalBill.id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(refundAmount),
          reason: refundReason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Refund failed.');
      }

      const updated = bills.map((b) =>
        b.id === refundModalBill.id
          ? {
              ...b,
              paymentStatus: 'REFUNDED',
              status: 'REFUNDED',
              refunds: [...(b.refunds || []), data.refund],
            }
          : b
      );
      setBills(updated);
      setRefundModalBill(null);
      toast.success('Refund Authorized', `PKR ${refundAmount} refunded for invoice ${refundModalBill.invoiceNo || refundModalBill.billNumber}`);
    } catch (err: any) {
      setRefundError(err.message);
      toast.error('Refund Failed', err.message);
    } finally {
      setIsRefunding(false);
    }
  };

  const handleSubmitClosing = async (e: React.FormEvent) => {
    e.preventDefault();
    setClosingLoading(true);
    try {
      const res = await fetch('/api/cash-closing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: closingDate,
          openingCash: Number(openingCash) || 0,
          actualHandover: Number(actualHandover) || 0,
          notes: closingNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Closing submission failed.');
      }

      setClosingSuccess(true);
      loadClosingSummary(closingDate);
      toast.success('Shift Handover Closed', 'Cash drawer reconciliation recorded in audit trail.');
    } catch (err: any) {
      toast.error('Closing Failed', err.message);
    } finally {
      setClosingLoading(false);
    }
  };

  const filteredBills = bills.filter((b) => {
    const invNo = b.invoiceNo || b.billNumber || '';
    const patName = b.patient?.fullName || b.patient?.name || '';
    const matchesQuery =
      invNo.toLowerCase().includes(query.toLowerCase()) ||
      patName.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;
    if (statusFilter !== 'ALL') {
      const st = (b.paymentStatus || b.status || '').toUpperCase();
      if (st !== statusFilter) return false;
    }
    return true;
  });

  const columns: ColumnDef<any>[] = [
    {
      id: 'invoiceNo',
      header: 'Invoice #',
      cell: (row) => (
        <span className="font-mono font-bold text-[#0B4F8A]">
          {row.invoiceNo || row.billNumber}
        </span>
      ),
    },
    {
      id: 'patient',
      header: 'Patient Details',
      cell: (row) => (
        <div>
          <span className="font-bold text-[#1B2733] block">
            {row.patient?.fullName || row.patient?.name}
          </span>
          <span className="font-mono text-[11px] text-[#5B6B7B]">
            {row.patient?.mrNumber}
          </span>
        </div>
      ),
    },
    {
      id: 'date',
      header: 'Date',
      cell: (row) => <span className="text-xs text-[#5B6B7B]">{formatDate(row.createdAt)}</span>,
    },
    {
      id: 'amount',
      header: 'Total Fee',
      cell: (row) => (
        <div>
          <span className="font-bold text-[#1B2733] block">{formatPKR(row.total)}</span>
          {row.discount > 0 && (
            <span className="text-[10px] text-rose-600 font-medium block">
              Disc: -{formatPKR(row.discount)}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'paymentMethod',
      header: 'Method',
      cell: (row) => (
        <span className="font-mono text-xs font-semibold text-[#5B6B7B]">
          {row.paymentMethod || 'CASH'}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => <StatusChip status={row.paymentStatus || row.status} size="sm" />,
    },
    {
      id: 'actions',
      header: 'Actions',
      className: 'text-right',
      cell: (row) => {
        const isPaid = (row.paymentStatus || row.status) === 'PAID';
        return (
          <div className="flex items-center justify-end gap-2">
            {isPaid ? (
              <button
                type="button"
                onClick={() => handleOpenRefund(row)}
                className="rounded bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
              >
                Refund
              </button>
            ) : (
              <span className="text-[11px] text-[#8A97A5] italic">Processed</span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Cash Counter"
        subtitle="Outpatient fee invoices, refund authorizations, and end-of-shift drawer closing."
        breadcrumbs={[
          { label: 'Hospital', href: '/dashboard' },
          { label: 'Billing & Cash' },
        ]}
        actions={
          <div className="flex items-center rounded-lg border border-[#D5DDE5] bg-white p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('invoices')}
              className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 font-semibold transition-all ${
                activeTab === 'invoices'
                  ? 'bg-[#0B4F8A] text-white shadow-xs'
                  : 'text-[#5B6B7B] hover:text-[#1B2733]'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Invoices Registry</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('closing');
                loadClosingSummary(closingDate);
              }}
              className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 font-semibold transition-all ${
                activeTab === 'closing'
                  ? 'bg-[#0B4F8A] text-white shadow-xs'
                  : 'text-[#5B6B7B] hover:text-[#1B2733]'
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Daily Cash Closing</span>
            </button>
          </div>
        }
      />

      {/* 4 StatCards at Top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Billed"
          value={formatPKR(totalRevenue)}
          icon={<DollarSign className="h-5 w-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
          trend={{ value: '+14%', positive: true, label: 'vs yesterday' }}
        />
        <StatCard
          label="Cash in Drawer"
          value={formatPKR(cashTotal)}
          icon={<Banknote className="h-5 w-5" />}
          iconBg="bg-[#E8F1F9] text-[#0B4F8A]"
        />
        <StatCard
          label="POS Card / Raast"
          value={formatPKR(cardTotal)}
          icon={<CreditCard className="h-5 w-5" />}
          iconBg="bg-[#E6F5F3] text-[#167C70]"
        />
        <StatCard
          label="Refunds Issued"
          value={formatPKR(refundedTotal)}
          icon={<RotateCcw className="h-5 w-5" />}
          iconBg="bg-rose-50 text-rose-700"
        />
      </div>

      {/* TAB 1: INVOICES REGISTRY */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <FilterBar
            searchQuery={query}
            onSearchChange={setQuery}
            searchPlaceholder="Search by Invoice # or Patient Name..."
            selectFilters={[
              {
                id: 'status',
                label: 'Status',
                value: statusFilter,
                onChange: setStatusFilter,
                options: [
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'PAID', label: 'Paid' },
                  { value: 'REFUNDED', label: 'Refunded' },
                  { value: 'PENDING', label: 'Pending' },
                ],
              },
            ]}
            hasActiveFilters={Boolean(query || statusFilter !== 'ALL')}
            onClearFilters={() => {
              setQuery('');
              setStatusFilter('ALL');
            }}
          />

          <DataTable
            data={filteredBills}
            columns={columns}
            keyExtractor={(b) => b.id}
            pagination={{ pageSize: 10, showPageSizeOptions: true }}
            emptyState={{
              title: 'No invoices found',
              description: 'Try adjusting your search criteria.',
            }}
          />
        </div>
      )}

      {/* TAB 2: DAILY CASH CLOSING */}
      {activeTab === 'closing' && (
        <Card className="max-w-3xl mx-auto">
          <CardHeader
            title="End-of-Shift Cash Closing & Handover"
            subtitle="Reconcile physical cash drawer with system transactions"
          />

          <form onSubmit={handleSubmitClosing} className="space-y-6">
            <FormGrid>
              <div className="sm:col-span-6 lg:col-span-6">
                <TextField
                  label="Closing Date"
                  type="date"
                  required
                  value={closingDate}
                  onChange={(e) => {
                    setClosingDate(e.target.value);
                    loadClosingSummary(e.target.value);
                  }}
                />
              </div>

              <div className="sm:col-span-6 lg:col-span-6">
                <TextField
                  label="Opening Float Cash (PKR)"
                  type="number"
                  value={openingCash}
                  onChange={(e) => setOpeningCash(Number(e.target.value) || 0)}
                  helperText="Cash present in drawer at shift start"
                />
              </div>

              <div className="sm:col-span-12 lg:col-span-12">
                <div className="rounded-xl border border-[#B5CDE0] bg-[#E8F1F9]/50 p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#5B6B7B]">Expected Shift Cash Inflow:</span>
                    <span className="font-bold text-[#1B2733]">
                      {formatPKR(closingSummary?.liveSummary?.cashTotal || cashTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5B6B7B]">Opening Float:</span>
                    <span className="font-bold text-[#1B2733]">{formatPKR(openingCash)}</span>
                  </div>
                  <div className="border-t border-[#D5E6F5] pt-2 flex justify-between font-bold text-sm text-[#0B4F8A]">
                    <span>Total Drawer Expected:</span>
                    <span>
                      {formatPKR((closingSummary?.liveSummary?.cashTotal || cashTotal) + openingCash)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6 lg:col-span-6">
                <TextField
                  label="Actual Physical Handover (PKR)"
                  type="number"
                  required
                  value={actualHandover || ''}
                  onChange={(e) => setActualHandover(Number(e.target.value) || 0)}
                  helperText="Counted physical banknotes handed over"
                />
              </div>

              <div className="sm:col-span-6 lg:col-span-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#1B2733]">Cash Discrepancy</label>
                  <div
                    className={`h-11 rounded-lg border px-3.5 flex items-center font-bold text-xs ${
                      actualHandover - ((closingSummary?.liveSummary?.cashTotal || cashTotal) + openingCash) === 0
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-rose-200 bg-rose-50 text-rose-800'
                    }`}
                  >
                    {actualHandover - ((closingSummary?.liveSummary?.cashTotal || cashTotal) + openingCash) === 0
                      ? '✓ Balanced (Zero Discrepancy)'
                      : `Discrepancy: ${formatPKR(
                          actualHandover -
                            ((closingSummary?.liveSummary?.cashTotal || cashTotal) + openingCash)
                        )}`}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-12 lg:col-span-12">
                <TextareaField
                  label="Closing Notes & Reconciliation Observations"
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  placeholder="e.g. Handed over to night shift supervisor. All receipts verified."
                  rows={3}
                />
              </div>
            </FormGrid>

            <div className="border-t border-[#F0F4F8] pt-4 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={closingLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0B4F8A] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#093F6E] disabled:opacity-50"
              >
                <Lock className="h-4 w-4" />
                <span>{closingLoading ? 'Submitting...' : 'Submit Cash Closing Handover'}</span>
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* REFUND MODAL */}
      {refundModalBill && (
        <Modal
          isOpen={Boolean(refundModalBill)}
          onClose={() => setRefundModalBill(null)}
          title="Authorize Invoice Refund"
          subtitle={`Processing refund for invoice ${refundModalBill.invoiceNo || refundModalBill.billNumber}`}
          maxWidth="md"
        >
          {refundError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{refundError}</span>
            </div>
          )}

          <form onSubmit={handleProcessRefund} className="space-y-4">
            <div className="rounded-xl border border-[#E3E9EF] bg-[#F8FAFC] p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5B6B7B]">Patient:</span>
                <span className="font-bold text-[#1B2733]">
                  {refundModalBill.patient?.fullName || refundModalBill.patient?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B6B7B]">Original Paid Amount:</span>
                <span className="font-bold text-[#0B4F8A]">
                  {formatPKR(refundModalBill.paidAmount || refundModalBill.total)}
                </span>
              </div>
            </div>

            <TextField
              label="Refund Amount (PKR)"
              type="number"
              required
              max={refundModalBill.paidAmount || refundModalBill.total}
              value={refundAmount}
              onChange={(e) => setRefundAmount(Number(e.target.value) || 0)}
            />

            <TextareaField
              label="Reason for Refund"
              required
              rows={2}
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="e.g. Doctor emergency leave, patient requested cancellation"
              helperText="Recorded for management audit"
            />

            <div className="border-t border-[#F0F4F8] pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setRefundModalBill(null)}
                className="rounded-lg border border-[#D5DDE5] bg-white px-4 py-2 text-xs font-semibold text-[#5B6B7B]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isRefunding || !refundReason}
                className="rounded-lg bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {isRefunding ? 'Processing...' : 'Confirm Refund'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
