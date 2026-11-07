'use client';

import React from 'react';
import { Search, X, Download, Filter } from 'lucide-react';

export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface FilterSelectConfig {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterSelectOption[];
}

interface FilterBarProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  selectFilters?: FilterSelectConfig[];
  datePreset?: string;
  onDatePresetChange?: (preset: string) => void;
  datePresets?: { id: string; label: string }[];
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  onExport?: () => void;
  exportLabel?: string;
  isExporting?: boolean;
  extraActions?: React.ReactNode;
  className?: string;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  selectFilters = [],
  datePreset,
  onDatePresetChange,
  datePresets = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'this_week', label: 'This Week' },
    { id: 'this_month', label: 'This Month' },
    { id: 'all', label: 'All Time' },
  ],
  onClearFilters,
  hasActiveFilters = false,
  onExport,
  exportLabel = 'Export',
  isExporting = false,
  extraActions,
  className = '',
}: FilterBarProps) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border border-[#E3E9EF] bg-white p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] lg:flex-row lg:items-center lg:justify-between ${className}`}
    >
      {/* Left side: Search & Dropdowns */}
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {onSearchChange !== undefined && (
          <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A97A5]" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-lg border border-[#D5DDE5] bg-white pl-9 pr-8 text-sm text-[#1B2733] placeholder-[#8A97A5] transition-all focus:border-[#1E9E8F] focus:outline-none focus:ring-2 focus:ring-[#1E9E8F]/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A97A5] hover:text-[#1B2733]"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

        {selectFilters.map((f) => (
          <div key={f.id} className="min-w-[140px]">
            <select
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#D5DDE5] bg-white px-3 text-xs font-medium text-[#1B2733] transition-all focus:border-[#1E9E8F] focus:outline-none focus:ring-2 focus:ring-[#1E9E8F]/20"
              aria-label={f.label}
            >
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {onDatePresetChange && (
          <div className="flex items-center gap-1 rounded-lg border border-[#D5DDE5] bg-[#F8FAFC] p-0.5 text-xs">
            {datePresets.map((dp) => (
              <button
                key={dp.id}
                type="button"
                onClick={() => onDatePresetChange(dp.id)}
                className={`rounded-md px-2.5 py-1.5 font-medium transition-all ${
                  datePreset === dp.id
                    ? 'bg-white text-[#0B4F8A] shadow-xs font-semibold'
                    : 'text-[#5B6B7B] hover:text-[#1B2733]'
                }`}
              >
                {dp.label}
              </button>
            ))}
          </div>
        )}

        {hasActiveFilters && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-1 text-xs font-semibold text-[#0B4F8A] hover:text-[#093F6E] px-2 py-1"
          >
            <X className="h-3 w-3" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* Right side: Exports & Actions */}
      <div className="flex items-center gap-2">
        {extraActions}

        {onExport && (
          <button
            type="button"
            onClick={onExport}
            disabled={isExporting}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D5DDE5] bg-white px-3.5 text-xs font-semibold text-[#1B2733] shadow-xs hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5 text-[#5B6B7B]" />
            <span>{isExporting ? 'Exporting...' : exportLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
