'use client';

import React, { useState } from 'react';
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
} from 'recharts';
import { formatPKR } from '@/lib/utils';

export interface HourlyFlowItem {
  hour: string;
  today: number;
  yesterday?: number;
}

export interface PatientTypeItem {
  name: string;
  value: number;
  count: number;
  color: string;
}

export interface DeptRevenueItem {
  department: string;
  revenue: number;
}

export function HourlyFlowChart({ data }: { data?: HourlyFlowItem[] }) {
  const [showYesterday, setShowYesterday] = useState(true);

  const defaultData: HourlyFlowItem[] = [
    { hour: '08:00', today: 4, yesterday: 3 },
    { hour: '09:00', today: 12, yesterday: 8 },
    { hour: '10:00', today: 22, yesterday: 18 },
    { hour: '11:00', today: 28, yesterday: 24 },
    { hour: '12:00', today: 20, yesterday: 19 },
    { hour: '13:00', today: 14, yesterday: 12 },
    { hour: '14:00', today: 10, yesterday: 9 },
    { hour: '15:00', today: 18, yesterday: 15 },
    { hour: '16:00', today: 24, yesterday: 20 },
    { hour: '17:00', today: 21, yesterday: 19 },
    { hour: '18:00', today: 15, yesterday: 14 },
    { hour: '19:00', today: 8, yesterday: 7 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-end gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#0B4F8A]" />
          <span className="text-[#1B2733] font-medium">Today</span>
        </div>
        <button
          type="button"
          onClick={() => setShowYesterday(!showYesterday)}
          className={`flex items-center gap-1.5 transition-opacity ${
            showYesterday ? 'opacity-100' : 'opacity-40'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-[#8FB4D9]" />
          <span className="text-[#5B6B7B]">Yesterday</span>
        </button>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="todayGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0B4F8A" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0B4F8A" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="yestGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8FB4D9" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8FB4D9" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3E9EF" />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 11, fill: '#5B6B7B' }}
              axisLine={{ stroke: '#E3E9EF' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#5B6B7B' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E3E9EF',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(16,24,40,0.08)',
              }}
              formatter={(value: any, name: any) => [
                `${value} Patients`,
                name === 'today' ? 'Today' : 'Yesterday',
              ]}
            />
            {showYesterday && (
              <Area
                type="monotone"
                dataKey="yesterday"
                stroke="#8FB4D9"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#yestGrad)"
              />
            )}
            <Area
              type="monotone"
              dataKey="today"
              stroke="#0B4F8A"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#todayGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function PatientTypeDonut({ data }: { data?: PatientTypeItem[] }) {
  const defaultData: PatientTypeItem[] = [
    { name: 'Walk-in OPD', value: 58, count: 52, color: '#0B4F8A' },
    { name: 'Online Booked', value: 30, count: 27, color: '#1E9E8F' },
    { name: 'Follow-up', value: 12, count: 11, color: '#E39B12' },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="h-64 w-full flex flex-col justify-between">
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E3E9EF',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(val: any) => [`${val}%`, 'Share']}
            />
            <Pie
              data={chartData}
              innerRadius={48}
              outerRadius={72}
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

      {/* Legend with counts */}
      <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-[#F0F4F8]">
        {chartData.map((item) => (
          <div key={item.name} className="flex flex-col items-center text-center">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] text-[#5B6B7B] truncate">{item.name}</span>
            </div>
            <span className="font-bold text-[#1B2733] text-xs">
              {item.count} <span className="text-[10px] font-normal text-[#8A97A5]">({item.value}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DepartmentRevenueBarChart({ data }: { data?: DeptRevenueItem[] }) {
  const defaultData: DeptRevenueItem[] = [
    { department: 'Cardio', revenue: 72000 },
    { department: 'Ortho', revenue: 56000 },
    { department: 'Gynae', revenue: 48000 },
    { department: 'Peds', revenue: 42000 },
    { department: 'Medicine', revenue: 38000 },
    { department: 'ENT', revenue: 32000 },
    { department: 'Eye', revenue: 29000 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="horizontal"
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3E9EF" />
          <XAxis
            dataKey="department"
            tick={{ fontSize: 11, fill: '#5B6B7B' }}
            axisLine={{ stroke: '#E3E9EF' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#5B6B7B' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E3E9EF',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: any) => [formatPKR(value), 'Revenue']}
          />
          <Bar dataKey="revenue" fill="#0B4F8A" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
