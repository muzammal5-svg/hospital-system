'use client';

import React, { useState } from 'react';
import { formatPKR, formatDate, formatTime } from '@/lib/utils';
import {
  PageHeader,
  StatCard,
  Card,
  CardHeader,
  DataTable,
  ColumnDef,
  FilterBar,
  Tabs,
  StatusChip,
} from '@/components/ui-app';
import {
  Download,
  Calendar,
  Users,
  DollarSign,
  Activity,
  Inbox,
  History,
  TrendingUp,
  FileSpreadsheet,
  Clock,
  ShieldCheck,
  Mail,
  Phone,
} from 'lucide-react';
import { QueueAlertsCards } from '@/components/QueueAlertsCards';
import {
  HourlyFlowChart,
  PatientTypeDonut,
  DepartmentRevenueBarChart,
} from '../DashboardCharts';

interface ReportsClientProps {
  initialKpis: any;
  auditLogs: any[];
  contactSubmissions: any[];
}

export default function ReportsClient({
  initialKpis,
  auditLogs,
  contactSubmissions,
}: ReportsClientProps) {
  const [data, setData] = useState(initialKpis);
  const [activeTab, setActiveTab] = useState<'analytics' | 'audit' | 'inbox'>('analytics');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [datePreset, setDatePreset] = useState('today');

  const loadKpis = async (date: string) => {
    try {
      const res = await fetch(`/api/reports/kpis?date=${date}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    }
  };

  const auditColumns: ColumnDef<any>[] = [
    {
      id: 'createdAt',
      header: 'Timestamp',
      cell: (row) => (
        <span className="font-mono text-xs text-[#5B6B7B]">
          {formatDate(row.createdAt)} {formatTime(row.createdAt)}
        </span>
      ),
    },
    {
      id: 'action',
      header: 'Action',
      accessorKey: 'action',
      cell: (row) => (
        <span className="font-mono font-bold text-xs bg-[#E8F1F9] text-[#0B4F8A] px-2 py-0.5 rounded">
          {row.action}
        </span>
      ),
    },
    {
      id: 'entity',
      header: 'Entity / Target',
      cell: (row) => (
        <span className="font-semibold text-xs text-[#1B2733]">
          {row.entity} {row.entityId ? `(#${row.entityId.slice(0, 8)})` : ''}
        </span>
      ),
    },
    {
      id: 'user',
      header: 'Staff Member',
      cell: (row) => (
        <span className="text-xs text-[#5B6B7B]">{row.user?.name || row.userName || 'System'}</span>
      ),
    },
    {
      id: 'ipAddress',
      header: 'IP Address',
      cell: (row) => <span className="font-mono text-[11px] text-[#8A97A5]">{row.ipAddress || '127.0.0.1'}</span>,
    },
  ];

  const inboxColumns: ColumnDef<any>[] = [
    {
      id: 'name',
      header: 'Sender Name',
      cell: (row) => (
        <div>
          <span className="font-bold text-[#1B2733] block">{row.name}</span>
          <span className="text-[11px] text-[#5B6B7B]">{row.email}</span>
        </div>
      ),
    },
    {
      id: 'phone',
      header: 'Phone',
      accessorKey: 'phone',
      cell: (row) => <span className="font-mono text-xs text-[#1B2733]">{row.phone || '—'}</span>,
    },
    {
      id: 'subject',
      header: 'Department / Subject',
      accessorKey: 'subject',
      cell: (row) => <span className="font-semibold text-xs text-[#0B4F8A]">{row.subject || 'General OPD'}</span>,
    },
    {
      id: 'message',
      header: 'Inquiry Message',
      cell: (row) => (
        <p className="text-xs text-[#5B6B7B] line-clamp-2 max-w-md">{row.message}</p>
      ),
    },
    {
      id: 'date',
      header: 'Received',
      cell: (row) => <span className="text-xs text-[#8A97A5]">{formatDate(row.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Clinical Analytics"
        subtitle="OPD footfall, department revenue, immutable audit trails, and patient inquiries."
        breadcrumbs={[
          { label: 'Hospital', href: '/dashboard' },
          { label: 'Reports & Analytics' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                loadKpis(e.target.value);
              }}
              className="h-10 rounded-lg border border-[#D5DDE5] bg-white px-3 text-xs font-semibold text-[#1B2733] shadow-2xs focus:border-[#0B4F8A] focus:outline-none"
            />

            <a
              href="/api/reports/export-excel"
              download
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export Excel (.xlsx)</span>
            </a>
          </div>
        }
      />

      {/* Tabs */}
      <Tabs
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as any)}
        variant="pills"
        tabs={[
          { id: 'analytics', label: 'OPD Analytics & Charts', icon: <TrendingUp className="h-4 w-4" /> },
          { id: 'audit', label: `System Audit Log (${auditLogs.length})`, icon: <History className="h-4 w-4" /> },
          { id: 'inbox', label: `Website Inquiries (${contactSubmissions.length})`, icon: <Inbox className="h-4 w-4" /> },
        ]}
      />

      {/* TAB 1: ANALYTICS & CHARTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* 4 StatCards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Registered Patients"
              value={data?.kpis?.totalPatients || 0}
              icon={<Users className="h-5 w-5" />}
              iconBg="bg-[#E8F1F9] text-[#0B4F8A]"
              subtitle="Permanent MR records in hospital DB"
            />
            <StatCard
              label="Today Visits & Queue"
              value={data?.kpis?.todayVisitsCount || 0}
              icon={<Clock className="h-5 w-5" />}
              iconBg="bg-[#E6F5F3] text-[#167C70]"
              subtitle={`${data?.kpis?.queue?.waiting || 0} Waiting • ${data?.kpis?.queue?.inConsultation || 0} In Room`}
            />
            <StatCard
              label="Today Revenue (PKR)"
              value={formatPKR(data?.kpis?.todayRevenue || 0)}
              icon={<DollarSign className="h-5 w-5" />}
              iconBg="bg-emerald-50 text-emerald-700"
              subtitle="Gross reception desk cash & card inflow"
            />
            <StatCard
              label="Cumulative Revenue"
              value={formatPKR(data?.kpis?.totalRevenue || 0)}
              icon={<TrendingUp className="h-5 w-5" />}
              iconBg="bg-[#E8F1F9] text-[#0B4F8A]"
              subtitle="All-time clinical revenue"
            />
          </div>

          {/* Queue Directives Card */}
          <Card>
            <CardHeader
              title="Today's Queue Status & Operational Directives"
              subtitle="Real-time load balancing and consultation volume"
            />
            <QueueAlertsCards insights={data?.aiInsights} />
          </Card>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8">
              <CardHeader
                title="Hourly Patient Flow"
                subtitle="Patient check-in volume throughout operating hours"
              />
              <HourlyFlowChart />
            </Card>

            <Card className="lg:col-span-4">
              <CardHeader
                title="Visit Types Composition"
                subtitle="Walk-in vs booked ratio"
              />
              <PatientTypeDonut />
            </Card>
          </div>

          <Card>
            <CardHeader
              title="Department Revenue Performance"
              subtitle="Comparative outpatient collections across clinical specialties"
            />
            <DepartmentRevenueBarChart />
          </Card>
        </div>
      )}

      {/* TAB 2: AUDIT LOG */}
      {activeTab === 'audit' && (
        <DataTable
          data={auditLogs}
          columns={auditColumns}
          keyExtractor={(log) => log.id}
          pagination={{ pageSize: 15, showPageSizeOptions: true }}
          emptyState={{
            title: 'No audit logs found',
            description: 'System actions and database modifications will appear here.',
          }}
        />
      )}

      {/* TAB 3: WEBSITE INQUIRIES */}
      {activeTab === 'inbox' && (
        <DataTable
          data={contactSubmissions}
          columns={inboxColumns}
          keyExtractor={(inq) => inq.id}
          pagination={{ pageSize: 10, showPageSizeOptions: true }}
          emptyState={{
            title: 'Inquiry inbox is clear',
            description: 'Patient inquiries submitted via the public contact form will appear here.',
          }}
        />
      )}
    </div>
  );
}
