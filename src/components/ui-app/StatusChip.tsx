'use client';

import React from 'react';

export type StatusType =
  | 'waiting'
  | 'in_consultation'
  | 'consultation'
  | 'completed'
  | 'cancelled'
  | 'emergency'
  | 'paid'
  | 'partial'
  | 'unpaid'
  | 'refunded'
  | 'active'
  | 'inactive'
  | 'scheduled'
  | 'no_show'
  | string;

interface StatusChipProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export function StatusChip({ status, label, size = 'sm', pulse, className = '' }: StatusChipProps) {
  const norm = String(status || '').toLowerCase().replace(/[\s-]/g, '_');

  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';
  let displayLabel = label || status;
  let isPulse = pulse;

  switch (norm) {
    case 'waiting':
      style = 'bg-amber-50 text-amber-800 border-amber-200/80';
      dotColor = 'bg-amber-500';
      displayLabel = label || 'Waiting';
      break;
    case 'in_consultation':
    case 'consultation':
    case 'in_progress':
      style = 'bg-blue-50 text-blue-800 border-blue-200/80';
      dotColor = 'bg-blue-600';
      displayLabel = label || 'In Consultation';
      break;
    case 'completed':
    case 'done':
      style = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      dotColor = 'bg-emerald-500';
      displayLabel = label || 'Completed';
      break;
    case 'cancelled':
      style = 'bg-slate-100 text-slate-600 border-slate-200';
      dotColor = 'bg-slate-400';
      displayLabel = label || 'Cancelled';
      break;
    case 'emergency':
      style = 'bg-rose-50 text-rose-800 border-rose-200/80';
      dotColor = 'bg-rose-500';
      displayLabel = label || 'Emergency';
      isPulse = true;
      break;
    case 'paid':
      style = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      dotColor = 'bg-emerald-500';
      displayLabel = label || 'Paid';
      break;
    case 'partial':
      style = 'bg-amber-50 text-amber-800 border-amber-200/80';
      dotColor = 'bg-amber-500';
      displayLabel = label || 'Partial';
      break;
    case 'unpaid':
    case 'pending':
      style = 'bg-rose-50 text-rose-800 border-rose-200/80';
      dotColor = 'bg-rose-500';
      displayLabel = label || 'Unpaid';
      break;
    case 'refunded':
      style = 'bg-purple-50 text-purple-800 border-purple-200/80';
      dotColor = 'bg-purple-500';
      displayLabel = label || 'Refunded';
      break;
    case 'active':
      style = 'bg-teal-50 text-teal-800 border-teal-200/80';
      dotColor = 'bg-teal-500';
      displayLabel = label || 'Active';
      break;
    case 'scheduled':
      style = 'bg-sky-50 text-sky-800 border-sky-200/80';
      dotColor = 'bg-sky-500';
      displayLabel = label || 'Scheduled';
      break;
    case 'no_show':
      style = 'bg-neutral-100 text-neutral-700 border-neutral-200';
      dotColor = 'bg-neutral-400';
      displayLabel = label || 'No Show';
      break;
  }

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs font-medium' : 'px-3 py-1 text-sm font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${style} ${sizeClasses} ${className} whitespace-nowrap`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${dotColor} ${isPulse ? 'animate-pulse' : ''}`}
        aria-hidden="true"
      />
      <span>{displayLabel}</span>
    </span>
  );
}
