import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatPKR, formatDate } from '@/lib/utils';
import Link from 'next/link';
import {
  Users,
  Calendar,
  Clock,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Activity,
  Banknote,
  Stethoscope,
  Tv,
  CalendarPlus,
  FileText,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, StatCard } from '@/components/ui-app/Card';
import { StatusChip } from '@/components/ui-app/StatusChip';
import { Avatar } from '@/components/ui-app/Avatar';
import { QueueAlertsCards } from '@/components/QueueAlertsCards';
import {
  HourlyFlowChart,
  PatientTypeDonut,
  DepartmentRevenueBarChart,
} from './DashboardCharts';
import {
  DEFAULT_DEPARTMENTS,
  DEFAULT_DOCTORS,
  DEFAULT_PATIENTS,
  DEFAULT_VISITS,
  DEFAULT_BILLS,
  DEFAULT_APPOINTMENTS,
} from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  const role = (session.user as any)?.role || 'RECEPTIONIST';
  const userName = session.user?.name || 'Staff Member';

  const todayStr = new Date().toISOString().split('T')[0];

  let patientCount = 50;
  let todayVisits: any[] = DEFAULT_VISITS;
  let todayAppointments: any[] = DEFAULT_APPOINTMENTS;
  let recentBills: any[] = DEFAULT_BILLS;
  let doctors: any[] = DEFAULT_DOCTORS;
  let departments: any[] = DEFAULT_DEPARTMENTS;
  let recentPatients: any[] = DEFAULT_PATIENTS;

  try {
    const [
      dbPatientCount,
      dbTodayVisits,
      dbTodayAppointments,
      dbRecentBills,
      dbDoctors,
      dbDepartments,
      dbRecentPatients,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.visit.findMany({
        where: { tokenDate: todayStr },
        include: { doctor: { include: { department: true } }, patient: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.appointment.findMany({
        where: { appointmentDate: todayStr },
        include: { doctor: true },
        orderBy: { timeSlot: 'asc' },
      }),
      prisma.bill.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { patient: true },
      }),
      prisma.doctor.findMany({
        include: { department: true, visits: { where: { tokenDate: todayStr } } },
        take: 8,
      }),
      prisma.department.findMany({ take: 8 }),
      prisma.patient.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: { visits: { take: 1, orderBy: { createdAt: 'desc' } } },
      }),
    ]);

    patientCount = dbPatientCount;
    todayVisits = dbTodayVisits;
    todayAppointments = dbTodayAppointments;
    recentBills = dbRecentBills;
    doctors = dbDoctors.length > 0 ? dbDoctors : DEFAULT_DOCTORS;
    departments = dbDepartments.length > 0 ? dbDepartments : DEFAULT_DEPARTMENTS;
    recentPatients = dbRecentPatients.length > 0 ? dbRecentPatients : DEFAULT_PATIENTS;
  } catch (err) {
    console.warn('Using fallback dashboard data:', err);
  }

  const waitingVisits = todayVisits.filter((v) => v.status === 'WAITING');
  const inConsultVisits = todayVisits.filter((v) => v.status === 'IN_CONSULTATION');
  const completedVisits = todayVisits.filter((v) => v.status === 'COMPLETED');
  const todayRevenue = recentBills.reduce((acc, b) => acc + (b.total || 0), 0);

  // Time greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  /* ========================================================================= */
  /* RECEPTION HOME VIEW (if user role is RECEPTIONIST)                        */
  /* ========================================================================= */
  if (role === 'RECEPTIONIST') {
    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-[#E3E9EF] bg-white p-5 shadow-xs">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1E9E8F] font-mono">
              OPD Reception Desk
            </span>
            <h1 className="font-heading text-2xl font-bold text-[#1B2733] mt-0.5">
              {greeting}, {userName}
            </h1>
            <p className="text-xs text-[#5B6B7B] mt-1">{currentDateStr} • Outpatient Check-in Console</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard/reception"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0B4F8A] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#093F6E] transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>Patient Intake (F2)</span>
            </Link>
            <Link
              href="/dashboard/appointments"
              className="inline-flex items-center gap-2 rounded-lg border border-[#D5DDE5] bg-white px-4 py-2.5 text-xs font-semibold text-[#1B2733] hover:bg-[#F8FAFC] transition-colors"
            >
              <Calendar className="h-4 w-4 text-[#5B6B7B]" />
              <span>Book Appointment</span>
            </Link>
          </div>
        </div>

        {/* 4 Big Primary Action Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/dashboard/reception?action=new-patient"
            className="group rounded-xl border border-[#B5CDE0] bg-[#E8F1F9]/40 p-5 shadow-xs hover:bg-[#E8F1F9] hover:border-[#0B4F8A] transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B4F8A] text-white">
                <UserPlus className="h-5 w-5" />
              </div>
              <span className="rounded bg-black/10 px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#0B4F8A]">
                F2
              </span>
            </div>
            <h3 className="font-heading text-base font-bold text-[#1B2733] mt-3 group-hover:text-[#0B4F8A]">
              Register New Patient
            </h3>
            <p className="text-xs text-[#5B6B7B] mt-1">30-second keyboard-first intake & MR generation</p>
          </Link>

          <Link
            href="/dashboard/patients"
            className="group rounded-xl border border-[#D5DDE5] bg-white p-5 shadow-xs hover:border-[#0B4F8A] hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F1F9] text-[#0B4F8A]">
                <Users className="h-5 w-5" />
              </div>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#5B6B7B]">
                F3
              </span>
            </div>
            <h3 className="font-heading text-base font-bold text-[#1B2733] mt-3 group-hover:text-[#0B4F8A]">
              Search Master Directory
            </h3>
            <p className="text-xs text-[#5B6B7B] mt-1">Lookup by MR #, Pakistani CNIC, or Mobile</p>
          </Link>

          <Link
            href="/dashboard/reception?action=issue-token"
            className="group rounded-xl border border-[#A8DFD8] bg-[#E6F5F3]/40 p-5 shadow-xs hover:bg-[#E6F5F3] hover:border-[#1E9E8F] transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E9E8F] text-white">
                <CalendarPlus className="h-5 w-5" />
              </div>
              <span className="rounded bg-black/10 px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#167C70]">
                F4
              </span>
            </div>
            <h3 className="font-heading text-base font-bold text-[#1B2733] mt-3 group-hover:text-[#167C70]">
              Issue OPD Token Slip
            </h3>
            <p className="text-xs text-[#5B6B7B] mt-1">Quick doctor assignment & 80mm thermal receipt</p>
          </Link>

          <Link
            href="/display"
            target="_blank"
            className="group rounded-xl border border-[#D5DDE5] bg-white p-5 shadow-xs hover:border-[#0B4F8A] hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0F4F8] text-[#0B4F8A]">
                <Tv className="h-5 w-5" />
              </div>
              <ExternalLink className="h-4 w-4 text-[#8A97A5]" />
            </div>
            <h3 className="font-heading text-base font-bold text-[#1B2733] mt-3 group-hover:text-[#0B4F8A]">
              Waiting TV Board
            </h3>
            <p className="text-xs text-[#5B6B7B] mt-1">Full-screen display board with live audio chime</p>
          </Link>
        </div>

        {/* 2-Column: Today's Appointments & Current Queue per Doctor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title="Today's Appointments Roster"
              subtitle={`${todayAppointments.length} scheduled visits`}
              actionText="View All"
              actionHref="/dashboard/appointments"
            />
            {todayAppointments.length === 0 ? (
              <p className="text-center py-6 text-xs text-[#8A97A5]">No appointments scheduled for today.</p>
            ) : (
              <div className="divide-y divide-[#F0F4F8]">
                {todayAppointments.slice(0, 6).map((apt) => (
                  <div key={apt.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-[#1B2733]">{apt.patientName}</p>
                      <p className="text-[11px] text-[#5B6B7B]">
                        Dr. {apt.doctor?.name} • {apt.timeSlot}
                      </p>
                    </div>
                    <StatusChip status={apt.status} />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Current OPD Queue per Doctor"
              subtitle={`${waitingVisits.length} waiting, ${inConsultVisits.length} in consultation`}
              actionText="Open Queue"
              actionHref="/dashboard/queue"
            />
            <div className="divide-y divide-[#F0F4F8]">
              {doctors.map((doc) => {
                const docWaiting = ((doc as any).visits || []).filter((v: any) => v.status === 'WAITING').length;
                const docIn = ((doc as any).visits || []).filter((v: any) => v.status === 'IN_CONSULTATION').length;
                return (
                  <div key={doc.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={doc.name} size="sm" />
                      <div>
                        <p className="font-semibold text-[#1B2733]">Dr. {doc.name}</p>
                        <p className="text-[11px] text-[#8A97A5]">{doc.department?.name || 'General'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        {docWaiting} waiting
                      </span>
                      {docIn > 0 && (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                          {docIn} inside
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  /* ========================================================================= */
  /* DOCTOR HOME VIEW (if user role is DOCTOR)                                 */
  /* ========================================================================= */
  if (role === 'DOCTOR') {
    const nextPatient = waitingVisits[0];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-[#E3E9EF] bg-white p-5 shadow-xs">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0B4F8A] font-mono">
              Clinical Consultation Suite
            </span>
            <h1 className="font-heading text-2xl font-bold text-[#1B2733] mt-0.5">
              {greeting}, {userName}
            </h1>
            <p className="text-xs text-[#5B6B7B] mt-1">{currentDateStr} • Outpatient Clinic</p>
          </div>

          <Link
            href="/dashboard/doctor"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0B4F8A] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#093F6E] transition-colors"
          >
            <Stethoscope className="h-4 w-4" />
            <span>Open Clinical Console</span>
          </Link>
        </div>

        {/* Next Patient Call Card */}
        {nextPatient ? (
          <div className="rounded-xl border-2 border-[#1E9E8F] bg-[#E6F5F3]/30 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="rounded-full bg-[#1E9E8F] px-2.5 py-0.5 text-xs font-bold text-white uppercase tracking-wider">
                  Next Patient in Queue
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <h2 className="font-heading text-3xl font-bold text-[#1B2733]">
                    Token #{nextPatient.tokenNumber}
                  </h2>
                  <span className="text-xl font-bold text-[#0B4F8A]">
                    • {nextPatient.patient?.fullName || (nextPatient.patient as any)?.name}
                  </span>
                </div>
                <p className="text-xs text-[#5B6B7B] mt-1">
                  MR: {nextPatient.patient?.mrNumber} • {nextPatient.patient?.gender}, {nextPatient.patient?.age || '—'} yrs • Phone: {nextPatient.patient?.mobile}
                </p>
              </div>

              <Link
                href="/dashboard/doctor"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1E9E8F] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#167C70] transition-colors"
              >
                <span>Call Patient Next</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#D5DDE5] bg-white p-8 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
            <h3 className="font-heading text-base font-bold text-[#1B2733]">All Patients Attended</h3>
            <p className="text-xs text-[#5B6B7B] mt-1">There are no waiting patients currently in the OPD queue.</p>
          </div>
        )}

        {/* Quick Stats & Queue Table */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Patients Seen Today"
            value={completedVisits.length}
            icon={<CheckCircle2 className="h-5 w-5" />}
            iconBg="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            label="Waiting Now"
            value={waitingVisits.length}
            icon={<Clock className="h-5 w-5" />}
            iconBg="bg-amber-50 text-amber-700"
          />
          <StatCard
            label="Today's Appointments"
            value={todayAppointments.length}
            icon={<Calendar className="h-5 w-5" />}
            iconBg="bg-[#E8F1F9] text-[#0B4F8A]"
          />
        </div>
      </div>
    );
  }

  /* ========================================================================= */
  /* ACCOUNTANT HOME VIEW (if user role is ACCOUNTANT)                         */
  /* ========================================================================= */
  if (role === 'ACCOUNTANT') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-[#E3E9EF] bg-white p-5 shadow-xs">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0B4F8A] font-mono">
              Accounts & Cash Operations
            </span>
            <h1 className="font-heading text-2xl font-bold text-[#1B2733] mt-0.5">
              {greeting}, {userName}
            </h1>
            <p className="text-xs text-[#5B6B7B] mt-1">{currentDateStr} • Cash Drawer & Invoices</p>
          </div>

          <Link
            href="/dashboard/billing"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0B4F8A] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#093F6E] transition-colors"
          >
            <CreditCard className="h-4 w-4" />
            <span>Open Billing Ledger</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Revenue Today"
            value={formatPKR(todayRevenue)}
            icon={<Banknote className="h-5 w-5" />}
            iconBg="bg-emerald-50 text-emerald-700"
            trend={{ value: '+14%', positive: true, label: 'vs yesterday' }}
          />
          <StatCard
            label="Invoices Generated"
            value={recentBills.length}
            icon={<FileText className="h-5 w-5" />}
            iconBg="bg-[#E8F1F9] text-[#0B4F8A]"
          />
          <StatCard
            label="Paid Invoices"
            value={recentBills.filter((b) => b.paymentStatus === 'PAID').length}
            icon={<CheckCircle2 className="h-5 w-5" />}
            iconBg="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            label="Pending / Partial"
            value={recentBills.filter((b) => b.paymentStatus !== 'PAID').length}
            icon={<Clock className="h-5 w-5" />}
            iconBg="bg-amber-50 text-amber-700"
          />
        </div>

        <Card>
          <CardHeader
            title="Recent Invoices Ledger"
            actionText="All Invoices"
            actionHref="/dashboard/billing"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#5B6B7B] border-b border-[#E3E9EF]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Bill #</th>
                  <th className="py-2.5 px-3 font-semibold">Patient</th>
                  <th className="py-2.5 px-3 font-semibold">Total Amount</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F8]">
                {recentBills.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0B4F8A]">
                      {b.invoiceNo || (b as any).billNumber}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#1B2733]">{b.patient?.fullName || (b.patient as any)?.name}</td>
                    <td className="py-2.5 px-3 font-bold text-[#1B2733]">{formatPKR(b.total)}</td>
                    <td className="py-2.5 px-3">
                      <StatusChip status={b.paymentStatus} />
                    </td>
                    <td className="py-2.5 px-3 text-[#8A97A5]">{formatDate(b.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  /* ========================================================================= */
  /* ADMIN MASTER HOME VIEW                                                    */
  /* ========================================================================= */
  return (
    <div className="space-y-6">
      {/* 1. Header: Greeting + Date + Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-xl border border-[#E3E9EF] bg-white p-5 shadow-xs">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0B4F8A] font-mono">
            Hospital Information System (HIS)
          </span>
          <h1 className="font-heading text-2xl font-bold text-[#1B2733] mt-0.5">
            {greeting}, {userName}
          </h1>
          <p className="text-xs text-[#5B6B7B] mt-1">
            {currentDateStr} • Clinical Operations Cockpit • Jail Road, Lahore
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/dashboard/reception?action=new-patient"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0B4F8A] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#093F6E] transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>New Patient</span>
          </Link>

          <Link
            href="/dashboard/appointments?action=new"
            className="inline-flex items-center gap-2 rounded-lg border border-[#D5DDE5] bg-white px-4 py-2.5 text-xs font-semibold text-[#1B2733] hover:bg-[#F8FAFC] transition-colors"
          >
            <Calendar className="h-4 w-4 text-[#5B6B7B]" />
            <span>New Appointment</span>
          </Link>

          <Link
            href="/dashboard/reports"
            className="inline-flex items-center gap-2 rounded-lg border border-[#B5CDE0] bg-[#E8F1F9] px-4 py-2.5 text-xs font-semibold text-[#0B4F8A] hover:bg-[#D5E6F5] transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>Daily Report</span>
          </Link>
        </div>
      </div>

      {/* 2. Row 1: 4 StatCards with trend vs yesterday */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Patients Today"
          value={todayVisits.length || patientCount}
          icon={<Users className="h-5 w-5" />}
          iconBg="bg-[#E8F1F9] text-[#0B4F8A]"
          trend={{ value: '+8%', positive: true, label: 'vs yesterday' }}
        />

        <StatCard
          label="Appointments"
          value={todayAppointments.length}
          icon={<Calendar className="h-5 w-5" />}
          iconBg="bg-[#E6F5F3] text-[#167C70]"
          trend={{ value: '+4%', positive: true, label: 'vs yesterday' }}
        />

        <StatCard
          label="Revenue (PKR)"
          value={formatPKR(todayRevenue)}
          icon={<Banknote className="h-5 w-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
          trend={{ value: '+12%', positive: true, label: 'vs yesterday' }}
        />

        <StatCard
          label="Waiting Now"
          value={waitingVisits.length}
          icon={<Clock className="h-5 w-5" />}
          iconBg="bg-amber-50 text-amber-700"
          trend={{ value: '-2', positive: null, label: `${inConsultVisits.length} in room` }}
        />
      </div>

      {/* 3. Row 2 (2/3 + 1/3): Patient Flow by Hour | Visit Types Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Hourly Patient Flow"
            subtitle="Patient volume through reception and OPD clinics"
          />
          <HourlyFlowChart />
        </Card>

        <Card>
          <CardHeader
            title="Visit Types Distribution"
            subtitle="Today's patient composition"
          />
          <PatientTypeDonut />
        </Card>
      </div>

      {/* 4. Row 3 (1/2 + 1/2): Revenue by Dept | Doctor Workload Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Revenue by Department"
            subtitle="Outpatient fees collected today (PKR)"
          />
          <DepartmentRevenueBarChart />
        </Card>

        <Card>
          <CardHeader
            title="Doctor Workload & OPD Status"
            subtitle="Active consultants on duty today"
            actionText="View Queue"
            actionHref="/dashboard/queue"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#5B6B7B] border-b border-[#E3E9EF]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Doctor</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Waiting</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Seen</th>
                  <th className="py-2.5 px-3 font-semibold">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F8]">
                {doctors.slice(0, 5).map((doc) => {
                  const waiting = ((doc as any).visits || []).filter((v: any) => v.status === 'WAITING').length;
                  const seen = ((doc as any).visits || []).filter((v: any) => v.status === 'COMPLETED').length;
                  const total = waiting + seen || 1;
                  const pct = Math.round((seen / total) * 100);

                  return (
                    <tr key={doc.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={doc.name} size="sm" />
                          <div>
                            <p className="font-semibold text-[#1B2733]">Dr. {doc.name}</p>
                            <p className="text-[11px] text-[#8A97A5]">{doc.department?.name || 'OPD'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-700">{waiting}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-700">{seen}</td>
                      <td className="py-2.5 px-3">
                        <div className="w-24 bg-[#E3E9EF] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0B4F8A] h-full rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* 5. Row 4 (2/3 + 1/3): Recent Registrations Table | Queue Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent Patient Registrations"
            subtitle="Last 8 patients added to hospital records"
            actionText="View All Patients"
            actionHref="/dashboard/patients"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#5B6B7B] border-b border-[#E3E9EF]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">MR #</th>
                  <th className="py-2.5 px-3 font-semibold">Name</th>
                  <th className="py-2.5 px-3 font-semibold">Gender / Age</th>
                  <th className="py-2.5 px-3 font-semibold">Mobile</th>
                  <th className="py-2.5 px-3 font-semibold">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F8]">
                {recentPatients.map((pat) => (
                  <tr key={pat.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0B4F8A]">
                      <Link href={`/dashboard/patients?id=${pat.id}`} className="hover:underline">
                        {pat.mrNumber}
                      </Link>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#1B2733]">{pat.fullName}</td>
                    <td className="py-2.5 px-3 text-[#5B6B7B]">
                      {pat.gender}, {pat.age || '—'} yrs
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#5B6B7B]">{pat.mobile}</td>
                    <td className="py-2.5 px-3 text-[#8A97A5]">{formatDate(pat.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Queue Alerts & Directives"
            subtitle="Live load balancing notices"
          />
          <QueueAlertsCards />
        </Card>
      </div>
    </div>
  );
}
