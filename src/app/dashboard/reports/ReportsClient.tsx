"use client";

import React, { useState, useEffect } from "react";
import { formatPKR, formatDate, formatTime } from "@/lib/utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Download,
  Calendar,
  Users,
  DollarSign,
  Activity,
  Sparkles,
  Inbox,
  History,
  TrendingUp,
} from "lucide-react";
import { AiInsightCards } from "@/components/AiInsightCards";

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
  const [activeTab, setActiveTab] = useState<"analytics" | "audit" | "inbox">("analytics");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);

  const loadKpis = async (date: string) => {
    try {
      const res = await fetch(`/api/reports/kpis?date=${date}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    }
  };

  const COLORS = ["#0EA5A4", "#2563EB", "#F59E0B", "#10B981", "#8B5CF6"];

  return (
    <div className="space-y-6">
      {/* Top Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight text-neutral-900 dark:text-white">
            Operational Analytics & Reports
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time OPD performance, revenue metrics, audit trails, and inquiry inbox.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Picker */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              loadKpis(e.target.value);
            }}
            className="bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs font-semibold text-neutral-900 dark:text-white outline-none"
          />

          {/* Export Excel Button */}
          <a
            href="/api/reports/export-excel"
            download
            className="btn-pill bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel (.xlsx)</span>
          </a>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-neutral-100 dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 max-w-fit">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "analytics"
              ? "bg-teal-500 text-black shadow-sm"
              : "text-neutral-600 dark:text-neutral-400"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>OPD Analytics & Charts</span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "audit"
              ? "bg-teal-500 text-black shadow-sm"
              : "text-neutral-600 dark:text-neutral-400"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>System Audit Log ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("inbox")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "inbox"
              ? "bg-teal-500 text-black shadow-sm"
              : "text-neutral-600 dark:text-neutral-400"
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Website Inquiries ({contactSubmissions.length})</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS & CHARTS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* KPI Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Total Patients
              </span>
              <span className="font-display font-black text-3xl text-neutral-900 dark:text-white">
                {data?.kpis?.totalPatients || 0}
              </span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 block mt-1">
                Permanent MR records
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Today Visits & Queue
              </span>
              <span className="font-display font-black text-3xl text-blue-600 dark:text-blue-400">
                {data?.kpis?.todayVisitsCount || 0}
              </span>
              <span className="text-[11px] text-neutral-500 block mt-1">
                {data?.kpis?.queue?.waiting || 0} Waiting • {data?.kpis?.queue?.inConsultation || 0} In Room
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Today Revenue
              </span>
              <span className="font-display font-black text-3xl text-emerald-600 dark:text-emerald-400">
                {formatPKR(data?.kpis?.todayRevenue || 0)}
              </span>
              <span className="text-[11px] text-neutral-500 block mt-1">
                Gross front desk inflow
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Cumulative Revenue
              </span>
              <span className="font-display font-black text-3xl text-neutral-900 dark:text-white">
                {formatPKR(data?.kpis?.totalRevenue || 0)}
              </span>
              <span className="text-[11px] text-neutral-500 block mt-1">
                All-time hospital collections
              </span>
            </div>
          </div>

          {/* AI Operational Insights */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-500" />
              <span>Real-Time AI Operational Directives</span>
            </h3>
            <AiInsightCards insights={data?.aiInsights} />
          </div>

          {/* Charts Row: Hourly Footfall & Patient Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Hourly Footfall Area Chart (Col 8) */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Hourly OPD Patient Footfall
                  </h3>
                  <span className="text-xs text-neutral-500">Distribution across morning and afternoon shifts</span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.hourlyDistribution || []}>
                    <defs>
                      <linearGradient id="colorFootfall" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5A4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#0EA5A4" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hour" stroke="#9A958C" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9A958C" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0B0F14",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#0EA5A4"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorFootfall)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* New vs Returning Patients Donut Chart (Col 4) */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">
                  Patient Intake Composition
                </h3>
                <span className="text-xs text-neutral-500">New OPD Registrations vs Follow-ups</span>
              </div>

              <div className="h-48 w-full my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.patientBreakdown || []}
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(data?.patientBreakdown || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-around text-xs border-t border-neutral-100 dark:border-white/5 pt-3">
                {(data?.patientBreakdown || []).map((entry: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {entry.name}: <strong>{entry.value}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department-wise Revenue Bar Chart */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">
              Department-wise OPD Revenue
            </h3>
            <span className="text-xs text-neutral-500 block mb-4">Financial volume per clinical department</span>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.deptStats || []}>
                  <XAxis dataKey="code" stroke="#9A958C" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9A958C" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B0F14",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#0EA5A4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT LOG */}
      {activeTab === "audit" && (
        <div className="rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-white/10 text-neutral-400 bg-neutral-50 dark:bg-white/5">
                  <th className="py-3 px-4 font-bold uppercase text-[10px]">Timestamp</th>
                  <th className="py-3 px-4 font-bold uppercase text-[10px]">User & Role</th>
                  <th className="py-3 px-4 font-bold uppercase text-[10px]">Action</th>
                  <th className="py-3 px-4 font-bold uppercase text-[10px]">Target Entity</th>
                  <th className="py-3 px-4 font-bold uppercase text-[10px]">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-400">
                      No audit trails recorded yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono text-neutral-500 whitespace-nowrap">
                        {formatDate(log.createdAt)} {formatTime(log.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-neutral-900 dark:text-white block">
                          {log.userName || "System"}
                        </span>
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">
                          {log.role || "SYSTEM"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-xs bg-neutral-100 dark:bg-white/10 px-2 py-0.5 rounded">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">
                        {log.entity} {log.entityId ? `(#${log.entityId.slice(-6)})` : ""}
                      </td>
                      <td className="py-3 px-4 text-neutral-500 font-mono text-[11px] truncate max-w-xs">
                        {log.details || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT FORM INBOX */}
      {activeTab === "inbox" && (
        <div className="rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-white/10 text-neutral-400 bg-neutral-50 dark:bg-white/5">
                  <th className="py-3 px-4 font-bold uppercase text-[10px]">Received</th>
                  <th className="py-3 px-4 font-bold uppercase text-[10px]">Sender</th>
                  <th className="py-3 px-4 font-bold uppercase text-[10px]">Contact Info</th>
                  <th className="py-3 px-4 font-bold uppercase text-[10px]">Subject</th>
                  <th className="py-3 px-4 font-bold uppercase text-[10px]">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                {contactSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-400">
                      Inquiry inbox is empty.
                    </td>
                  </tr>
                ) : (
                  contactSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono text-neutral-500 whitespace-nowrap">
                        {formatDate(sub.createdAt)}
                      </td>
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">
                        {sub.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-600 dark:text-neutral-300">
                        <div>{sub.email}</div>
                        <div className="text-[10px] text-teal-600">{sub.phone || "—"}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-neutral-800 dark:text-neutral-200">
                        {sub.subject}
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 max-w-sm">
                        {sub.message}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
