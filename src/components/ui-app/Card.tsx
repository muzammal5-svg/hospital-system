'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  dense?: boolean;
}

export function Card({ children, className = '', dense = false, ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-[#E3E9EF] bg-white text-[#1B2733] shadow-[0_1px_3px_rgba(16,24,40,0.05)] transition-shadow hover:shadow-[0_4px_12px_rgba(16,24,40,0.06)] ${
        dense ? 'p-4' : 'p-5 sm:p-6'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  subtitle,
  actionText,
  actionHref,
  onAction,
  actions,
  className = '',
}: CardHeaderProps) {
  return (
    <div className={`mb-4 flex items-start justify-between gap-4 border-b border-[#F0F4F8] pb-3 ${className}`}>
      <div>
        <h2 className="font-heading text-base font-semibold text-[#1B2733]">{title}</h2>
        {subtitle && <p className="text-xs text-[#5B6B7B] mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {actions}
        {actionText && actionHref && (
          <Link
            href={actionHref}
            className="text-xs font-semibold text-[#0B4F8A] hover:text-[#093F6E] transition-colors"
          >
            {actionText} &rarr;
          </Link>
        )}
        {actionText && !actionHref && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="text-xs font-semibold text-[#0B4F8A] hover:text-[#093F6E] transition-colors"
          >
            {actionText} &rarr;
          </button>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string; // e.g. bg-[#E8F1F9] text-[#0B4F8A]
  trend?: {
    value: string;
    positive?: boolean | null; // true: green up, false: red down, null: neutral
    label?: string; // e.g. "vs yesterday"
  };
  subtitle?: string;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  iconBg = 'bg-[#E8F1F9] text-[#0B4F8A]',
  trend,
  subtitle,
  onClick,
  className = '',
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-[#E3E9EF] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.05)] transition-all ${
        onClick ? 'cursor-pointer hover:border-[#B5CDE0] hover:shadow-md' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#5B6B7B]">{label}</span>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#1B2733]">
          {value}
        </span>

        {trend && (
          <div
            className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium ${
              trend.positive === true
                ? 'bg-emerald-50 text-emerald-700'
                : trend.positive === false
                ? 'bg-rose-50 text-rose-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {trend.positive === true ? (
              <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
            ) : trend.positive === false ? (
              <ArrowDownRight className="h-3.5 w-3.5 stroke-[2.5]" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>

      {(trend?.label || subtitle) && (
        <p className="mt-1.5 text-xs text-[#8A97A5]">{trend?.label || subtitle}</p>
      )}
    </div>
  );
}
