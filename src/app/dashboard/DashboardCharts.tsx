"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { formatPKR } from "@/lib/utils";

interface HourlyFlowItem {
  hour: string;
  patients: number;
}

interface PatientTypeItem {
  name: string;
  value: number;
  color: string;
}

interface DeptRevenueItem {
  department: string;
  revenue: number;
}

export function HourlyFlowChart({ data }: { data: HourlyFlowItem[] }) {
  const chartData =
    data && data.length > 0
      ? data
      : [
          { hour: "09:00", patients: 8 },
          { hour: "10:00", patients: 18 },
          { hour: "11:00", patients: 25 },
          { hour: "12:00", patients: 22 },
          { hour: "13:00", patients: 14 },
          { hour: "14:00", patients: 9 },
          { hour: "15:00", patients: 15 },
          { hour: "16:00", patients: 20 },
          { hour: "17:00", patients: 19 },
          { hour: "18:00", patients: 12 },
          { hour: "19:00", patients: 7 },
        ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0B4F8A" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#0B4F8A" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3E9EF" />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 11, fill: "#5B6B7B" }}
            axisLine={{ stroke: "#E3E9EF" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#5B6B7B" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E3E9EF",
              borderRadius: "8px",
              fontSize: "12px",
              boxShadow: "0 2px 8px rgba(16,24,40,0.08)",
            }}
            formatter={(value: any) => [`${value} Patients`, "Flow"]}
          />
          <Area
            type="monotone"
            dataKey="patients"
            stroke="#0B4F8A"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#flowGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PatientTypeDonut({ data }: { data?: PatientTypeItem[] }) {
  const chartData: PatientTypeItem[] =
    data && data.length > 0
      ? data
      : [
          { name: "Walk-in OPD", value: 58, color: "#0B4F8A" },
          { name: "Online Booked", value: 32, color: "#1E9E8F" },
          { name: "Follow-up", value: 10, color: "#E39B12" },
        ];

  return (
    <div className="h-64 w-full flex flex-col justify-between">
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E3E9EF",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(val: any) => [`${val}%`, "Share"]}
            />
            <Pie
              data={chartData}
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-around text-xs pt-2 border-t border-[#E3E9EF] dark:border-[#23374D]">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[#5B6B7B] dark:text-[#94A7BA]">{item.name}</span>
            <span className="font-bold text-[#1B2733] dark:text-[#E6EEF5]">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DepartmentRevenueBarChart({ data }: { data?: DeptRevenueItem[] }) {
  const chartData =
    data && data.length > 0
      ? data
      : [
          { department: "Cardio", revenue: 58000 },
          { department: "Ortho", revenue: 45000 },
          { department: "Gynae", revenue: 42000 },
          { department: "Peds", revenue: 36000 },
          { department: "Medicine", revenue: 38000 },
          { department: "Surgery", revenue: 49000 },
          { department: "Neuro", revenue: 31000 },
        ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3E9EF" />
          <XAxis
            dataKey="department"
            tick={{ fontSize: 11, fill: "#5B6B7B" }}
            axisLine={{ stroke: "#E3E9EF" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#5B6B7B" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E3E9EF",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: any) => [formatPKR(value), "Revenue"]}
          />
          <Bar dataKey="revenue" fill="#0B4F8A" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
