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
  Tv,
  FileText,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Activity,
  AlertCircle,
  Clock,
} from "lucide-react";
import { AiInsightCards } from "@/components/AiInsightCards";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any)?.role || "RECEPTIONIST";

  // Role redirects
  if (role === "RECEPTIONIST") {
    redirect("/dashboard/reception");
  } else if (role === "DOCTOR") {
    redirect("/dashboard/doctor");
  } else if (role === "ACCOUNTANT") {
    redirect("/dashboard/billing");
  }

  // Admin Overview
  const todayStr = new Date().toISOString().split("T")[0];
  const [patientCount, todayVisits, todayAppointments, recentBills] = await Promise.all([
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
  ]);

  const waitingCount = todayVisits.filter((v) => v.status === "WAITING").length;
  const todayRevenue = recentBills.reduce((acc, b) => acc + b.total, 0);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-neutral-900 dark:text-white">
            Hospital Operations Cockpit
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Real-time status for Naseem Ijaz Hospital • Jail Road, Lahore
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/reception?action=new-patient"
            className="btn-pill bg-teal-500 hover:bg-teal-600 text-black text-xs font-bold gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Patient (F2)</span>
          </Link>

          <Link
            href="/display"
            target="_blank"
            className="btn-pill bg-white dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 text-xs font-bold gap-2 text-neutral-700 dark:text-neutral-200"
          >
            <Tv className="w-4 h-4 text-teal-500" />
            <span>Launch TV Queue</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Patients</span>
            <Users className="w-4 h-4 text-teal-500" />
          </div>
          <span className="font-display font-black text-3xl text-neutral-900 dark:text-white block">
            {patientCount.toLocaleString()}
          </span>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 mt-1 block">
            Registered in NIH Master Index
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today’s OPD Visits</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <span className="font-display font-black text-3xl text-neutral-900 dark:text-white block">
            {todayVisits.length}
          </span>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 block">
            {waitingCount} Patients currently waiting
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today Appointments</span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <span className="font-display font-black text-3xl text-neutral-900 dark:text-white block">
            {todayAppointments.length}
          </span>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 block">
            Online & walk-in bookings
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">OPD Inflow Today</span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="font-display font-black text-3xl text-neutral-900 dark:text-white block">
            {formatPKR(todayRevenue)}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">
            Collected at Front Desk
          </span>
        </div>
      </div>

      {/* AI Operational Insights Component */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-base text-neutral-900 dark:text-white">
          Rule-based AI Hospital Insights
        </h3>
        <AiInsightCards />
      </div>

      {/* Recent Visits and Billing Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Active Visits */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Today’s Live Queue Tokens</h3>
            <Link href="/dashboard/queue" className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline">
              View All Queue Board &rarr;
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            {todayVisits.slice(0, 5).map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-mono font-bold flex items-center justify-center">
                    #{v.tokenNumber}
                  </span>
                  <div>
                    <span className="font-bold text-neutral-900 dark:text-white block">{v.patient.fullName}</span>
                    <span className="text-[11px] text-neutral-500">
                      Dr. {v.doctor.name} ({v.doctor.roomNo})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      v.status === "WAITING"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400"
                        : v.status === "IN_CONSULTATION"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400"
                    }`}
                  >
                    {v.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Recent Front Desk Receipts</h3>
            <Link href="/dashboard/billing" className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline">
              Cash Closing &rarr;
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            {recentBills.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5"
              >
                <div>
                  <span className="font-mono font-bold text-neutral-900 dark:text-white block">{b.invoiceNo}</span>
                  <span className="text-[11px] text-neutral-500">
                    {b.patient.fullName} • {formatDate(b.createdAt)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-bold text-neutral-900 dark:text-white block">{formatPKR(b.total)}</span>
                  <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 uppercase">
                    {b.paymentMethod}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
