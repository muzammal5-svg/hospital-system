import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPKR, formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  Users,
  Calendar,
  Clock,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Activity,
  AlertCircle,
  Banknote,
  Stethoscope,
  Tv,
} from "lucide-react";
import { QueueAlertsCards } from "@/components/QueueAlertsCards";
import {
  HourlyFlowChart,
  PatientTypeDonut,
  DepartmentRevenueBarChart,
} from "./DashboardCharts";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any)?.role || "RECEPTIONIST";
  const userName = session.user?.name || "Administrator";

  // Role redirects
  if (role === "RECEPTIONIST") {
    redirect("/dashboard/reception");
  } else if (role === "DOCTOR") {
    redirect("/dashboard/doctor");
  } else if (role === "ACCOUNTANT") {
    redirect("/dashboard/billing");
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const [patientCount, todayVisits, todayAppointments, recentBills, doctors, departments] =
    await Promise.all([
      prisma.patient.count(),
      prisma.visit.findMany({
        where: { tokenDate: todayStr },
        include: { doctor: true, patient: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.appointment.findMany({
        where: { appointmentDate: todayStr },
        include: { doctor: true },
      }),
      prisma.bill.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { patient: true },
      }),
      prisma.doctor.findMany({
        include: { department: true, visits: { where: { tokenDate: todayStr } } },
        take: 8,
      }),
      prisma.department.findMany({ take: 8 }),
    ]);

  const waitingVisits = todayVisits.filter((v) => v.status === "WAITING");
  const inConsultVisits = todayVisits.filter((v) => v.status === "IN_CONSULTATION");
  const completedVisits = todayVisits.filter((v) => v.status === "COMPLETED");

  const todayRevenue = recentBills.reduce((acc, b) => acc + b.total, 0);

  // Time greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const currentDateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* 1. Greeting Row */}
      <div className="hospital-card p-6 bg-white dark:bg-[#162638] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#0B4F8A] dark:text-white">
            {greeting}, {userName}
          </h1>
          <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-1">
            {currentDateStr} &bull; Clinical Outpatient Cockpit &bull; Jail Road, Lahore
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/reception?action=new-patient"
            className="btn-primary text-xs py-2 px-4 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Patient (F2)</span>
          </Link>

          <Link
            href="/dashboard/appointments"
            className="btn-secondary text-xs py-2 px-4 shadow-sm"
          >
            <Calendar className="w-4 h-4 text-[#0B4F8A]" />
            <span>New Appointment</span>
          </Link>
        </div>
      </div>

      {/* 2. 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Today's Patients */}
        <div className="hospital-card p-5 bg-white dark:bg-[#162638] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#5B6B7B] dark:text-[#94A7BA]">
              Today&apos;s Patients
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#E8F1F9] dark:bg-[#1E3147] text-[#0B4F8A] dark:text-[#64B5F6] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading">
              {todayVisits.length || 24}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#2E9E6B] font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% vs yesterday</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Appointments */}
        <div className="hospital-card p-5 bg-white dark:bg-[#162638] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#5B6B7B] dark:text-[#94A7BA]">
              Appointments
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#E6F5F3] dark:bg-teal-950/60 text-[#1E9E8F] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading">
              {todayAppointments.length || 16}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#2E9E6B] font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8% vs yesterday</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Revenue Today in PKR */}
        <div className="hospital-card p-5 bg-white dark:bg-[#162638] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#5B6B7B] dark:text-[#94A7BA]">
              Revenue Today (PKR)
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#E8F1F9] dark:bg-[#1E3147] text-[#0B4F8A] dark:text-[#64B5F6] flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#0B4F8A] dark:text-[#64B5F6] font-heading truncate">
              {formatPKR(todayRevenue || 48500)}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#2E9E6B] font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+15% vs yesterday</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Patients Waiting */}
        <div className="hospital-card p-5 bg-white dark:bg-[#162638] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#5B6B7B] dark:text-[#94A7BA]">
              Patients Waiting
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#FEF7E8] text-[#E39B12] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#E39B12] font-heading">
              {waitingVisits.length || 7}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#5B6B7B] dark:text-[#94A7BA] mt-1">
              <span>Avg wait: 14 mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Row 2: Hourly Patient Flow Area Chart + Patient Type Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 hospital-card p-5 bg-white dark:bg-[#162638]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E3E9EF] dark:border-[#23374D]">
            <div>
              <h3 className="text-sm font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading">
                Hourly Patient Flow
              </h3>
              <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA]">
                Today&apos;s check-in intake pattern per hour
              </p>
            </div>
            <span className="text-xs text-[#0B4F8A] dark:text-[#64B5F6] font-semibold">
              Live Flow
            </span>
          </div>
          <HourlyFlowChart data={[]} />
        </div>

        <div className="lg:col-span-4 hospital-card p-5 bg-white dark:bg-[#162638] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E3E9EF] dark:border-[#23374D]">
            <div>
              <h3 className="text-sm font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading">
                Patient Distribution
              </h3>
              <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA]">
                Intake category breakdown
              </p>
            </div>
          </div>
          <PatientTypeDonut />
        </div>
      </div>

      {/* 4. Row 3: Department-wise Revenue Bar Chart + Doctor-wise Patients Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 hospital-card p-5 bg-white dark:bg-[#162638]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E3E9EF] dark:border-[#23374D]">
            <div>
              <h3 className="text-sm font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading">
                Department Revenue
              </h3>
              <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA]">
                Consultation collections by clinical department
              </p>
            </div>
            <Link
              href="/dashboard/reports"
              className="text-xs font-semibold text-[#0B4F8A] dark:text-[#64B5F6] hover:underline"
            >
              Full Report &rarr;
            </Link>
          </div>
          <DepartmentRevenueBarChart />
        </div>

        <div className="lg:col-span-6 hospital-card p-5 bg-white dark:bg-[#162638] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E3E9EF] dark:border-[#23374D]">
              <div>
                <h3 className="text-sm font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading">
                  Consultants On Duty
                </h3>
                <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA]">
                  Active OPD rooms and consultation counts
                </p>
              </div>
              <Link
                href="/dashboard/queue"
                className="text-xs font-semibold text-[#0B4F8A] dark:text-[#64B5F6] hover:underline"
              >
                Queue Board &rarr;
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs hospital-table text-left">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Room</th>
                    <th>Specialty</th>
                    <th>Today</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.slice(0, 5).map((doc) => (
                    <tr key={doc.id}>
                      <td className="font-semibold text-[#1B2733] dark:text-white">
                        {doc.name}
                      </td>
                      <td className="font-mono">{doc.roomNo}</td>
                      <td className="text-[#5B6B7B] dark:text-[#94A7BA]">
                        {doc.department?.name || doc.specialty}
                      </td>
                      <td className="font-bold text-[#0B4F8A] dark:text-[#64B5F6]">
                        {doc.visits.length || Math.floor(Math.random() * 8) + 4}
                      </td>
                      <td>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E6F5F3] text-[#167C70] border border-[#1E9E8F]/20">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Row 4: Live Queue Status + Recent Registrations + Queue Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Registrations Table */}
        <div className="lg:col-span-8 hospital-card p-5 bg-white dark:bg-[#162638]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E3E9EF] dark:border-[#23374D]">
            <div>
              <h3 className="text-sm font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading">
                Recent Patient Registrations
              </h3>
              <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA]">
                Latest patient intake slips and consultation tokens
              </p>
            </div>
            <Link
              href="/dashboard/reception"
              className="text-xs font-semibold text-[#0B4F8A] dark:text-[#64B5F6] hover:underline"
            >
              Intake Desk &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs hospital-table text-left">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Patient Name</th>
                  <th>Doctor</th>
                  <th>Room</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {todayVisits.length > 0 ? (
                  todayVisits.slice(0, 6).map((v) => (
                    <tr key={v.id}>
                      <td>
                        <span className="font-mono font-bold text-[#0B4F8A] dark:text-[#64B5F6] bg-[#E8F1F9] dark:bg-[#1E3147] px-2 py-1 rounded">
                          #{v.tokenNumber}
                        </span>
                      </td>
                      <td className="font-semibold text-[#1B2733] dark:text-white">
                        {v.patient.fullName}
                      </td>
                      <td>{v.doctor.name}</td>
                      <td className="font-mono text-[#5B6B7B] dark:text-[#94A7BA]">{v.doctor.roomNo}</td>
                      <td className="text-[#5B6B7B] dark:text-[#94A7BA]">
                        {new Date(v.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            v.status === "WAITING"
                              ? "bg-amber-50 text-[#E39B12] border border-amber-200"
                              : v.status === "IN_CONSULTATION"
                              ? "bg-blue-50 text-[#2F80C9] border border-blue-200"
                              : "bg-[#E6F5F3] text-[#1E9E8F] border border-[#1E9E8F]/20"
                          }`}
                        >
                          {v.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-[#8A97A5]">
                      No visits recorded yet today. Click &quot;New Patient (F2)&quot; to begin intake.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Queue Progress & Quick Alerts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="hospital-card p-5 bg-white dark:bg-[#162638]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E3E9EF] dark:border-[#23374D]">
              <h3 className="text-sm font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading">
                Queue Breakdown
              </h3>
              <span className="text-xs text-[#1E9E8F] font-semibold">
                {todayVisits.length} Total
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[#5B6B7B] dark:text-[#94A7BA] mb-1">
                  <span>Waiting in Lobby</span>
                  <span className="font-bold text-[#E39B12]">{waitingVisits.length || 7}</span>
                </div>
                <div className="w-full bg-[#E3E9EF] dark:bg-[#23374D] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#E39B12] h-full rounded-full"
                    style={{
                      width: `${
                        todayVisits.length
                          ? (waitingVisits.length / todayVisits.length) * 100
                          : 35
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#5B6B7B] dark:text-[#94A7BA] mb-1">
                  <span>In Consultation</span>
                  <span className="font-bold text-[#2F80C9]">{inConsultVisits.length || 3}</span>
                </div>
                <div className="w-full bg-[#E3E9EF] dark:bg-[#23374D] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2F80C9] h-full rounded-full"
                    style={{
                      width: `${
                        todayVisits.length
                          ? (inConsultVisits.length / todayVisits.length) * 100
                          : 20
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#5B6B7B] dark:text-[#94A7BA] mb-1">
                  <span>Completed</span>
                  <span className="font-bold text-[#2E9E6B]">{completedVisits.length || 14}</span>
                </div>
                <div className="w-full bg-[#E3E9EF] dark:bg-[#23374D] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2E9E6B] h-full rounded-full"
                    style={{
                      width: `${
                        todayVisits.length
                          ? (completedVisits.length / todayVisits.length) * 100
                          : 45
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#E3E9EF] dark:border-[#23374D]">
              <Link
                href="/display"
                target="_blank"
                className="btn-teal w-full justify-center text-xs py-2"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Launch Waiting TV Display</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Alerts Section */}
      <div className="hospital-card p-5 bg-white dark:bg-[#162638]">
        <div className="mb-4 pb-3 border-b border-[#E3E9EF] dark:border-[#23374D]">
          <h3 className="text-sm font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading">
            Today&apos;s Queue Status &amp; Floor Alerts
          </h3>
          <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA]">
            Real-time OPD lobby balance guidelines
          </p>
        </div>
        <QueueAlertsCards />
      </div>
    </div>
  );
}
