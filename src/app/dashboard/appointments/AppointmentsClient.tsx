'use client';

import React, { useState } from 'react';
import { formatMobile, formatPKR, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  PageHeader,
  DataTable,
  ColumnDef,
  FilterBar,
  Modal,
  StatusChip,
  Avatar,
  TextField,
  PhoneField,
  SelectField,
  TextareaField,
  FormGrid,
  ConfirmDialog,
  useToast,
} from '@/components/ui-app';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  X,
  CalendarCheck,
  Grid,
  List,
  AlertTriangle,
} from 'lucide-react';

interface AppointmentsClientProps {
  initialAppointments: any[];
  doctors: any[];
  departments: any[];
}

export default function AppointmentsClient({
  initialAppointments,
  doctors,
  departments,
}: AppointmentsClientProps) {
  const toast = useToast();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const [cancelModalApt, setCancelModalApt] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const router = useRouter();

  // Booking Modal Form
  const [patientName, setPatientName] = useState('');
  const [patientMobile, setPatientMobile] = useState('');
  const [docId, setDocId] = useState(doctors[0]?.id || '');
  const [deptId, setDeptId] = useState(departments[0]?.id || '');
  const [slot, setSlot] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [source, setSource] = useState('PHONE');
  const [reminder, setReminder] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  ];

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedDoctor && apt.doctorId !== selectedDoctor) return false;
    if (selectedDate && apt.appointmentDate !== selectedDate) return false;
    return true;
  });

  // Handle appointment creation
  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: patientName.trim(),
          patientMobile: patientMobile.trim(),
          doctorId: docId,
          departmentId: deptId,
          appointmentDate: selectedDate,
          timeSlot: slot,
          notes: notes.trim() || undefined,
          type: source,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to book appointment.');
      }

      setAppointments([data.appointment, ...appointments]);
      setShowModal(false);
      setPatientName('');
      setPatientMobile('');
      setNotes('');
      toast.success('Appointment Scheduled', `Booked for ${patientName} on ${selectedDate} at ${slot}`);
    } catch (err: any) {
      setError(err.message);
      toast.error('Booking Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
        toast.info('Status Updated', `Appointment marked as ${newStatus}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelModalApt) return;
    try {
      await handleUpdateStatus(cancelModalApt.id, 'CANCELLED');
      setCancelModalApt(null);
      setCancelReason('');
    } catch (e) {}
  };

  const columns: ColumnDef<any>[] = [
    {
      id: 'timeSlot',
      header: 'Time Slot',
      accessorKey: 'timeSlot',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#0B4F8A]">
          <Clock className="h-3.5 w-3.5 text-[#8A97A5]" />
          <span>{row.timeSlot}</span>
        </div>
      ),
    },
    {
      id: 'patientName',
      header: 'Patient Details',
      cell: (row) => (
        <div>
          <span className="font-bold text-[#1B2733] block">{row.patientName}</span>
          <span className="font-mono text-[11px] text-[#5B6B7B]">{row.patientMobile}</span>
        </div>
      ),
    },
    {
      id: 'doctor',
      header: 'Doctor & Department',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.doctor?.name || 'Doctor'} size="xs" />
          <div>
            <span className="font-semibold text-[#1B2733] block">Dr. {row.doctor?.name}</span>
            <span className="text-[11px] text-[#8A97A5]">{row.doctor?.specialty || 'General'}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'appointmentDate',
      header: 'Date',
      accessorKey: 'appointmentDate',
      sortable: true,
      cell: (row) => <span className="text-xs text-[#5B6B7B]">{row.appointmentDate}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusChip status={row.status} size="sm" />,
    },
    {
      id: 'actions',
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.status === 'SCHEDULED' && (
            <>
              <button
                type="button"
                onClick={() => handleUpdateStatus(row.id, 'CONFIRMED')}
                className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setCancelModalApt(row)}
                className="rounded bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
              >
                Cancel
              </button>
            </>
          )}
          {row.status === 'CONFIRMED' && (
            <button
              type="button"
              onClick={() => {
                router.push(
                  `/dashboard/reception?action=new-visit&name=${encodeURIComponent(
                    row.patientName
                  )}&mobile=${encodeURIComponent(row.patientMobile)}&doctorId=${row.doctorId}`
                );
              }}
              className="rounded bg-[#0B4F8A] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#093F6E]"
            >
              Issue Token
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments Roster"
        subtitle="Manage daily OPD consultant schedule, time-slots, and bookings."
        breadcrumbs={[
          { label: 'Hospital', href: '/dashboard' },
          { label: 'Appointments' },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-[#D5DDE5] bg-white p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#E8F1F9] text-[#0B4F8A]'
                    : 'text-[#5B6B7B] hover:text-[#1B2733]'
                }`}
              >
                <List className="h-3.5 w-3.5" />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-[#E8F1F9] text-[#0B4F8A]'
                    : 'text-[#5B6B7B] hover:text-[#1B2733]'
                }`}
              >
                <Grid className="h-3.5 w-3.5" />
                <span>Slots Grid</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0B4F8A] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#093F6E] transition-colors"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Book Appointment</span>
            </button>
          </div>
        }
      />

      {/* Filter Bar */}
      <FilterBar
        selectFilters={[
          {
            id: 'doctorFilter',
            label: 'Doctor',
            value: selectedDoctor,
            onChange: setSelectedDoctor,
            options: [
              { value: '', label: 'All Doctors' },
              ...doctors.map((d) => ({
                value: d.id,
                label: `Dr. ${d.name} (${d.specialty})`,
              })),
            ],
          },
        ]}
        extraActions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5B6B7B] font-medium">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-10 rounded-lg border border-[#D5DDE5] bg-white px-3 text-xs font-semibold text-[#1B2733] focus:border-[#1E9E8F] focus:outline-none"
            />
          </div>
        }
        hasActiveFilters={Boolean(selectedDoctor)}
        onClearFilters={() => {
          setSelectedDoctor('');
        }}
      />

      {/* View Mode: List vs Time-Slot Grid */}
      {viewMode === 'list' ? (
        <DataTable
          data={filteredAppointments}
          columns={columns}
          keyExtractor={(apt) => apt.id}
          pagination={{ pageSize: 10, showPageSizeOptions: true }}
          emptyState={{
            title: 'No appointments found',
            description: 'There are no appointments matching this date and doctor filter.',
          }}
        />
      ) : (
        /* Visual Time-Slot Grid */
        <div className="rounded-xl border border-[#E3E9EF] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-[#F0F4F8] pb-3">
            <div>
              <h3 className="font-heading text-sm font-bold text-[#1B2733]">
                Daily Time-Slot Allocation ({selectedDate})
              </h3>
              <p className="text-xs text-[#5B6B7B] mt-0.5">
                Click any open slot to instantly book an appointment
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded border border-[#D5DDE5] bg-white" />
                <span>Available</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-[#0B4F8A]" />
                <span>Booked</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {slots.map((s) => {
              const bookedApt = filteredAppointments.find((a) => a.timeSlot === s);
              const isBooked = Boolean(bookedApt);

              return (
                <div
                  key={s}
                  onClick={() => {
                    if (!isBooked) {
                      setSlot(s);
                      setShowModal(true);
                    }
                  }}
                  className={`flex flex-col justify-between rounded-xl p-3.5 transition-all min-h-[90px] border ${
                    isBooked
                      ? 'border-[#0B4F8A] bg-[#E8F1F9]/50 cursor-default'
                      : 'border-[#D5DDE5] bg-white hover:border-[#1E9E8F] hover:shadow-xs cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#1B2733]">{s}</span>
                    {isBooked ? (
                      <span className="h-2 w-2 rounded-full bg-[#0B4F8A]" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </div>

                  <div className="mt-2">
                    {isBooked ? (
                      <div>
                        <p className="font-bold text-xs text-[#0B4F8A] truncate">{bookedApt?.patientName}</p>
                        <p className="text-[10px] text-[#5B6B7B] truncate">Dr. {bookedApt?.doctor?.name}</p>
                      </div>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-semibold">+ Open Slot</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Schedule Outpatient Appointment"
          subtitle={`Booking for ${selectedDate} at ${slot}`}
          maxWidth="lg"
        >
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCreateAppointment} className="space-y-4">
            <FormGrid>
              <div className="sm:col-span-6 lg:col-span-6">
                <TextField
                  label="Patient Full Name"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Asad Ullah"
                  autoFocus
                />
              </div>

              <div className="sm:col-span-6 lg:col-span-6">
                <PhoneField
                  label="Mobile Number"
                  required
                  value={patientMobile}
                  onChange={setPatientMobile}
                  placeholder="0300-1234567"
                />
              </div>

              <div className="sm:col-span-6 lg:col-span-6">
                <SelectField
                  label="Doctor"
                  required
                  value={docId}
                  onChange={(e) => {
                    setDocId(e.target.value);
                    const d = doctors.find((doc) => doc.id === e.target.value);
                    if (d) setDeptId(d.departmentId);
                  }}
                  options={doctors.map((d) => ({
                    value: d.id,
                    label: `Dr. ${d.name} (${d.specialty})`,
                  }))}
                />
              </div>

              <div className="sm:col-span-6 lg:col-span-6">
                <SelectField
                  label="Time Slot"
                  required
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  options={slots.map((s) => ({ value: s, label: s }))}
                />
              </div>

              <div className="sm:col-span-12 lg:col-span-12">
                <TextareaField
                  label="Clinical Notes / Visit Reason (Optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Chest pain follow-up, routine checkup..."
                  rows={2}
                />
              </div>
            </FormGrid>

            <div className="border-t border-[#F0F4F8] pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-[#D5DDE5] bg-white px-4 py-2 text-xs font-semibold text-[#5B6B7B] hover:text-[#1B2733]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !patientName || !patientMobile}
                className="rounded-lg bg-[#0B4F8A] px-5 py-2 text-xs font-semibold text-white hover:bg-[#093F6E] disabled:opacity-50"
              >
                {loading ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Cancel Confirmation Dialog */}
      {cancelModalApt && (
        <ConfirmDialog
          isOpen={Boolean(cancelModalApt)}
          onClose={() => setCancelModalApt(null)}
          onConfirm={handleConfirmCancel}
          title="Cancel Appointment"
          description={`Are you sure you want to cancel the appointment for ${cancelModalApt.patientName} on ${cancelModalApt.appointmentDate} at ${cancelModalApt.timeSlot}?`}
          confirmLabel="Cancel Appointment"
          variant="danger"
        />
      )}
    </div>
  );
}
