'use client';

import React, { useState } from 'react';
import { formatCNIC, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  PageHeader,
  DataTable,
  ColumnDef,
  FilterBar,
  Drawer,
  Avatar,
  StatusChip,
} from '@/components/ui-app';
import {
  UserPlus,
  CalendarPlus,
  FileText,
  ChevronRight,
  X,
  ShieldAlert,
  User,
  Phone,
  CreditCard,
  MapPin,
  Calendar,
  Activity,
  Printer,
} from 'lucide-react';

interface PatientsClientProps {
  initialPatients: any[];
  userRole: string;
}

export default function PatientsClient({ initialPatients, userRole }: PatientsClientProps) {
  const [patients, setPatients] = useState(initialPatients);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [activeGenderFilter, setActiveGenderFilter] = useState('ALL');
  const router = useRouter();

  const handleSearch = async (val: string) => {
    setQuery(val);
    setLoading(true);
    try {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(val)}`);
      const data = await res.json();
      setPatients(data.patients || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((p) => {
    if (activeGenderFilter === 'ALL') return true;
    return p.gender === activeGenderFilter;
  });

  const columns: ColumnDef<any>[] = [
    {
      id: 'mrNumber',
      header: 'MR Number',
      accessorKey: 'mrNumber',
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-bold text-[#0B4F8A] bg-[#E8F1F9] px-2 py-0.5 rounded text-xs">
          {row.mrNumber}
        </span>
      ),
    },
    {
      id: 'fullName',
      header: 'Patient Name',
      accessorKey: 'fullName',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.fullName} size="sm" />
          <div>
            <span className="font-bold text-[#1B2733] block">{row.fullName}</span>
            {row.fatherOrHusbandName && (
              <span className="text-[11px] text-[#8A97A5]">s/o {row.fatherOrHusbandName}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'gender',
      header: 'Age / Gender',
      cell: (row) => (
        <span className="text-[#5B6B7B]">
          {row.age || '—'} Yrs / {row.gender}
        </span>
      ),
    },
    {
      id: 'mobile',
      header: 'Mobile',
      accessorKey: 'mobile',
      cell: (row) => <span className="font-mono text-[#1B2733]">{row.mobile}</span>,
    },
    {
      id: 'cnic',
      header: `CNIC (${userRole === 'ADMIN' ? 'Full' : 'Masked'})`,
      cell: (row) => (
        <span className="font-mono text-[#5B6B7B]">{row.cnic || '—'}</span>
      ),
    },
    {
      id: 'city',
      header: 'City',
      accessorKey: 'city',
      sortable: true,
      cell: (row) => <span className="text-[#5B6B7B]">{row.city || 'Lahore'}</span>,
    },
    {
      id: 'registered',
      header: 'Registered',
      cell: (row) => (
        <span className="text-[#8A97A5] text-xs">{formatDate(row.createdAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients Master Directory"
        subtitle="Centralized outpatient repository with Pakistani privacy masking."
        breadcrumbs={[
          { label: 'Hospital', href: '/dashboard' },
          { label: 'Patients Directory' },
        ]}
        actions={
          <button
            type="button"
            onClick={() => router.push('/dashboard/reception?action=new-patient')}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0B4F8A] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#093F6E] transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>New Patient (F2)</span>
          </button>
        }
      />

      {/* Filter Bar */}
      <FilterBar
        searchQuery={query}
        onSearchChange={handleSearch}
        searchPlaceholder="Search by MR Number, Patient Name, Mobile or CNIC..."
        selectFilters={[
          {
            id: 'genderFilter',
            label: 'Gender',
            value: activeGenderFilter,
            onChange: setActiveGenderFilter,
            options: [
              { value: 'ALL', label: 'All Genders' },
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
            ],
          },
        ]}
        hasActiveFilters={Boolean(query || activeGenderFilter !== 'ALL')}
        onClearFilters={() => {
          setQuery('');
          setActiveGenderFilter('ALL');
          handleSearch('');
        }}
      />

      {/* Master Data Table */}
      <DataTable
        data={filteredPatients}
        columns={columns}
        keyExtractor={(p) => p.id}
        isLoading={loading}
        onRowClick={(p) => setSelectedPatient(p)}
        pagination={{ pageSize: 10, showPageSizeOptions: true }}
        rowActions={(row) => [
          {
            label: 'View Profile',
            onClick: () => setSelectedPatient(row),
            icon: <User className="h-3.5 w-3.5 text-[#0B4F8A]" />,
          },
          {
            label: 'Issue Token',
            onClick: () =>
              router.push(`/dashboard/reception?action=new-visit&patientId=${row.id}`),
            icon: <CalendarPlus className="h-3.5 w-3.5 text-[#1E9E8F]" />,
          },
        ]}
      />

      {/* Slide-in Patient Profile Drawer */}
      {selectedPatient && (
        <Drawer
          isOpen={Boolean(selectedPatient)}
          onClose={() => setSelectedPatient(null)}
          title={
            <div className="flex items-center gap-3">
              <Avatar name={selectedPatient.fullName} size="md" />
              <div>
                <h3 className="font-heading text-base font-bold text-[#1B2733]">
                  {selectedPatient.fullName}
                </h3>
                <span className="font-mono text-xs font-bold text-[#0B4F8A] bg-[#E8F1F9] px-2 py-0.5 rounded">
                  {selectedPatient.mrNumber}
                </span>
              </div>
            </div>
          }
          width="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="rounded-lg border border-[#D5DDE5] bg-white px-4 py-2 text-xs font-semibold text-[#5B6B7B] hover:text-[#1B2733]"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  router.push(`/dashboard/reception?action=new-visit&patientId=${selectedPatient.id}`);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0B4F8A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#093F6E]"
              >
                <CalendarPlus className="h-4 w-4" />
                <span>Issue OPD Token</span>
              </button>
            </div>
          }
        >
          <div className="space-y-6 text-xs">
            {/* Demographics Card */}
            <div className="rounded-xl border border-[#E3E9EF] bg-white p-4 shadow-2xs space-y-3">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0B4F8A]">
                Demographics & Identification
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[#8A97A5] block text-[11px]">Father / Husband</span>
                  <span className="font-semibold text-[#1B2733]">{selectedPatient.fatherOrHusbandName || '—'}</span>
                </div>
                <div>
                  <span className="text-[#8A97A5] block text-[11px]">Age & Gender</span>
                  <span className="font-semibold text-[#1B2733]">
                    {selectedPatient.age || '—'} Yrs • {selectedPatient.gender}
                  </span>
                </div>
                <div>
                  <span className="text-[#8A97A5] block text-[11px]">CNIC ({userRole === 'ADMIN' ? 'Full' : 'Masked'})</span>
                  <span className="font-mono font-semibold text-[#1B2733]">{selectedPatient.cnic || '—'}</span>
                </div>
                <div>
                  <span className="text-[#8A97A5] block text-[11px]">Blood Group</span>
                  <span className="font-semibold text-[#1B2733]">{selectedPatient.bloodGroup || '—'}</span>
                </div>
                <div>
                  <span className="text-[#8A97A5] block text-[11px]">Mobile</span>
                  <span className="font-mono font-semibold text-[#1B2733]">{selectedPatient.mobile}</span>
                </div>
                <div>
                  <span className="text-[#8A97A5] block text-[11px]">City / Residence</span>
                  <span className="font-semibold text-[#1B2733]">{selectedPatient.city || 'Lahore'}</span>
                </div>
              </div>
            </div>

            {/* Medical Alerts */}
            {selectedPatient.allergies ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-xs">Known Medical Allergies</p>
                  <p className="text-[11px] text-rose-800 mt-0.5">{selectedPatient.allergies}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-[#E3E9EF] bg-white p-3 text-[#5B6B7B] text-[11px]">
                No drug or food allergies on record.
              </div>
            )}

            {/* Previous Visits Timeline */}
            <div>
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#1B2733] mb-3">
                Clinical Visit History
              </h4>
              <div className="space-y-2">
                {selectedPatient.visits && selectedPatient.visits.length > 0 ? (
                  selectedPatient.visits.map((v: any) => (
                    <div
                      key={v.id}
                      className="rounded-xl border border-[#E3E9EF] bg-white p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1B2733]">Dr. {v.doctor?.name}</span>
                          <span className="text-[#8A97A5]">({v.department?.name})</span>
                        </div>
                        <p className="text-[11px] text-[#5B6B7B] mt-0.5">
                          {formatDate(v.createdAt)} • Token #{v.tokenNumber}
                        </p>
                      </div>
                      <StatusChip status={v.status} size="sm" />
                    </div>
                  ))
                ) : (
                  <p className="text-center py-6 text-xs text-[#8A97A5] bg-white rounded-xl border border-[#E3E9EF]">
                    No recorded prior visits.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
