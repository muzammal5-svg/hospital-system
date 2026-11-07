'use client';

import React, { useState } from 'react';
import {
  PageHeader,
  Card,
  CardHeader,
  Tabs,
  TextField,
  PhoneField,
  TextareaField,
  FormGrid,
  DataTable,
  ColumnDef,
  StatusChip,
  Avatar,
  useToast,
} from '@/components/ui-app';
import {
  Settings,
  Building,
  Printer,
  Users,
  Database,
  CheckCircle2,
  AlertCircle,
  Save,
  Download,
  Loader2,
  Shield,
  Clock,
  Stethoscope,
  Building2,
} from 'lucide-react';

interface SettingsClientProps {
  initialProfile: any;
  departments: any[];
  doctors: any[];
  users: any[];
}

export default function SettingsClient({
  initialProfile,
  departments,
  doctors,
  users,
}: SettingsClientProps) {
  const toast = useToast();
  const [profile, setProfile] = useState(initialProfile || {});
  const [activeTab, setActiveTab] = useState<'profile' | 'doctors' | 'users' | 'printing' | 'backup'>('profile');
  const [loading, setLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupResult, setBackupResult] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');

      setProfile(data.profile);
      setSuccessMsg('Hospital profile and configuration updated successfully.');
      toast.success('Settings Saved', 'Hospital profile and branding parameters updated.');
    } catch (err: any) {
      toast.error('Save Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerBackup = async () => {
    setBackupLoading(true);
    setBackupResult(null);

    try {
      const res = await fetch('/api/backup', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Backup failed');

      setBackupResult(data);
      toast.success('Backup Generated', `Created snapshot: ${data.filename}`);
    } catch (err: any) {
      toast.error('Backup Error', err.message);
    } finally {
      setBackupLoading(false);
    }
  };

  const userColumns: ColumnDef<any>[] = [
    {
      id: 'name',
      header: 'Staff Member',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} size="sm" />
          <div>
            <span className="font-bold text-xs text-[#1B2733] block">{row.name}</span>
            <span className="text-[11px] text-[#5B6B7B] font-mono">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Assigned Role',
      cell: (row) => (
        <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#E8F1F9] text-[#0B4F8A]">
          {row.role}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: () => <StatusChip status="active" size="sm" />,
    },
  ];

  const doctorColumns: ColumnDef<any>[] = [
    {
      id: 'doctor',
      header: 'Doctor Name',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} size="sm" />
          <div>
            <span className="font-bold text-xs text-[#1B2733] block">Dr. {row.name}</span>
            <span className="text-[11px] text-[#8A97A5]">{row.specialty}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'department',
      header: 'Department',
      cell: (row) => (
        <span className="text-xs text-[#5B6B7B]">{row.department?.name || 'General OPD'}</span>
      ),
    },
    {
      id: 'room',
      header: 'Room',
      cell: (row) => (
        <span className="font-mono font-bold text-xs text-[#0B4F8A]">
          {row.room || row.roomNo || 'Room 101'}
        </span>
      ),
    },
    {
      id: 'fee',
      header: 'Consultation Fee',
      cell: (row) => (
        <span className="font-bold text-xs text-[#1B2733]">{row.fee ? `PKR ${row.fee}` : 'PKR 2,000'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hospital Settings & System Configuration"
        subtitle="Branding identity, letterhead headers, staff role privileges, and database snapshot engine."
        breadcrumbs={[
          { label: 'Hospital', href: '/dashboard' },
          { label: 'Settings' },
        ]}
      />

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as any)}
        variant="pills"
        tabs={[
          { id: 'profile', label: 'Hospital Profile & Contacts', icon: <Building className="h-4 w-4" /> },
          { id: 'doctors', label: `Consultants (${doctors.length})`, icon: <Stethoscope className="h-4 w-4" /> },
          { id: 'users', label: `Staff Accounts (${users.length})`, icon: <Users className="h-4 w-4" /> },
          { id: 'printing', label: 'Receipt & Letterhead', icon: <Printer className="h-4 w-4" /> },
          { id: 'backup', label: 'Database Backup Engine', icon: <Database className="h-4 w-4" /> },
        ]}
      />

      {/* TAB 1: PROFILE & CONTACTS */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile}>
          <Card className="space-y-5">
            <CardHeader
              title="Hospital Identity & Public Contact"
              subtitle="Official information displayed on invoices, public site, and TV boards"
            />

            <FormGrid>
              <div className="sm:col-span-6 lg:col-span-6">
                <TextField
                  label="Hospital Name"
                  required
                  value={profile.name || ''}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>

              <div className="sm:col-span-6 lg:col-span-6">
                <TextField
                  label="Tagline / Motto"
                  value={profile.tagline || ''}
                  onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                  placeholder="e.g. Quality Healthcare, Close to Home"
                />
              </div>

              <div className="sm:col-span-4 lg:col-span-4">
                <TextField
                  label="UAN Helpline Number"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+92 42 3578 9000"
                />
              </div>

              <div className="sm:col-span-4 lg:col-span-4">
                <TextField
                  label="Emergency Direct Hotline (24/7)"
                  value={profile.emergencyPhone || ''}
                  onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })}
                  placeholder="+92 42 3578 9999"
                  className="text-rose-600 font-bold"
                />
              </div>

              <div className="sm:col-span-4 lg:col-span-4">
                <TextField
                  label="Official Contact Email"
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="info@naseemijazhospital.pk"
                />
              </div>

              <div className="sm:col-span-12 lg:col-span-12">
                <TextField
                  label="Physical Campus Address (Lahore)"
                  value={profile.address || ''}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  placeholder="Plot 14-B, Medical Enclave, Jail Road, Lahore, Pakistan"
                />
              </div>
            </FormGrid>

            <div className="border-t border-[#F0F4F8] pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0B4F8A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#093F6E] transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Configuration</span>
              </button>
            </div>
          </Card>
        </form>
      )}

      {/* TAB 2: DOCTORS DIRECTORY */}
      {activeTab === 'doctors' && (
        <DataTable
          data={doctors}
          columns={doctorColumns}
          keyExtractor={(d) => d.id}
          pagination={{ pageSize: 10 }}
        />
      )}

      {/* TAB 3: USERS & ROLES */}
      {activeTab === 'users' && (
        <DataTable
          data={users}
          columns={userColumns}
          keyExtractor={(u) => u.id}
          pagination={{ pageSize: 10 }}
        />
      )}

      {/* TAB 4: PRINTING & LETTERHEAD */}
      {activeTab === 'printing' && (
        <form onSubmit={handleSaveProfile}>
          <Card className="space-y-5">
            <CardHeader
              title="Official Thermal & Prescription Templates"
              subtitle="Headers and footers rendered on 80mm thermal paper and A4 letterhead"
            />

            <FormGrid>
              <div className="sm:col-span-6 lg:col-span-6">
                <TextareaField
                  label="80mm Thermal Receipt Header Text"
                  rows={4}
                  value={profile.receiptHeader || ''}
                  onChange={(e) => setProfile({ ...profile, receiptHeader: e.target.value })}
                  placeholder="NASEEM IJAZ HOSPITAL&#10;Jail Road, Lahore&#10;Emergency: +92 42 3578 9999"
                />
              </div>

              <div className="sm:col-span-6 lg:col-span-6">
                <TextareaField
                  label="80mm Thermal Receipt Footer Text"
                  rows={4}
                  value={profile.receiptFooter || ''}
                  onChange={(e) => setProfile({ ...profile, receiptFooter: e.target.value })}
                  placeholder="Please wait for your token on the TV screen.&#10;Thank you for choosing Naseem Ijaz Hospital."
                />
              </div>
            </FormGrid>

            <div className="border-t border-[#F0F4F8] pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0B4F8A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#093F6E] transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Configuration</span>
              </button>
            </div>
          </Card>
        </form>
      )}

      {/* TAB 5: DATABASE BACKUP */}
      {activeTab === 'backup' && (
        <Card className="space-y-4">
          <CardHeader
            title="Database Backup & Snapshot Engine"
            subtitle="Automated complete dump of hospital registries, visits, bills, and patients"
          />

          <p className="text-xs text-[#5B6B7B] leading-relaxed">
            Generates an instantaneous full snapshot of all database entities into a verified JSON/SQL archive stored safely in the local system backups repository.
          </p>

          {backupResult && (
            <div className="rounded-xl border border-[#B5CDE0] bg-[#E8F1F9] p-4 text-xs font-mono text-[#0B4F8A]">
              <p className="font-bold">✓ {backupResult.message}</p>
              <p className="text-[11px] text-[#5B6B7B] mt-1">
                File: {backupResult.filename} • Size: {Math.round(backupResult.sizeBytes / 1024)} KB • Backed up {backupResult.counts?.patients || 0} patients, {backupResult.counts?.visits || 0} visits
              </p>
            </div>
          )}

          <div>
            <button
              type="button"
              onClick={handleTriggerBackup}
              disabled={backupLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-[#D5DDE5] bg-white px-4 py-2.5 text-xs font-bold text-[#1B2733] shadow-2xs hover:bg-[#F8FAFC] disabled:opacity-50"
            >
              {backupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Generate Backup Snapshot Now</span>
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
