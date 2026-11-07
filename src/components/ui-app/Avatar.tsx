'use client';

import React from 'react';
import Image from 'next/image';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-[#E8F1F9] text-[#0B4F8A] border-[#B5CDE0]',
    secondary: 'bg-[#E6F5F3] text-[#167C70] border-[#A8DFD8]',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  }[variant];

  const sizeStyles = {
    xs: 'px-1.5 py-0.2 text-[10px] font-semibold',
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-sm font-medium',
  }[size];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border ${variantStyles} ${sizeStyles} ${className} whitespace-nowrap`}
    >
      {children}
    </span>
  );
}

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'rounded';
  className?: string;
}

const TINT_COLORS = [
  'bg-[#0B4F8A] text-white',
  'bg-[#1E9E8F] text-white',
  'bg-[#0B3A66] text-white',
  'bg-[#167C70] text-white',
  'bg-[#2F80C9] text-white',
  'bg-[#5B6B7B] text-white',
  'bg-[#D97706] text-white',
];

export function Avatar({
  src,
  name,
  size = 'md',
  shape = 'circle',
  className = '',
}: AvatarProps) {
  const initials = (name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('') || '?';

  // Deterministic color
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = (name || '').charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % TINT_COLORS.length;
  const tintClass = TINT_COLORS[colorIndex];

  const sizeClasses = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg font-bold',
  }[size];

  const radiusClass = shape === 'circle' ? 'rounded-full' : 'rounded-lg';

  if (src) {
    return (
      <div className={`relative overflow-hidden ${sizeClasses} ${radiusClass} border border-[#E3E9EF] bg-slate-100 flex-shrink-0 ${className}`}>
        <Image
          src={src}
          alt={name}
          fill
          sizes="64px"
          className="object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center font-semibold select-none flex-shrink-0 ${sizeClasses} ${radiusClass} ${tintClass} ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
}
