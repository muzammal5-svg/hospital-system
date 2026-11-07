'use client';

import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D5DDE5] bg-[#FBFDFF] p-8 text-center sm:p-12 ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F1F9] text-[#0B4F8A]">
        {icon || <Inbox className="h-6 w-6 stroke-[1.75]" />}
      </div>
      <h3 className="mt-3.5 font-heading text-base font-semibold text-[#1B2733]">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-[#5B6B7B]">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
