'use client';

import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  id: string | number;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: StepItem[];
  currentStep: number; // 0-indexed
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  className = '',
}: StepperProps) {
  return (
    <nav aria-label="Progress" className={`w-full ${className}`}>
      <ol className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isUpcoming = idx > currentStep;

          return (
            <li
              key={step.id}
              className={`relative flex flex-1 items-center ${
                idx !== steps.length - 1 ? 'pr-4 sm:pr-8' : ''
              }`}
            >
              <div
                className={`group flex items-center ${
                  onStepClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onStepClick && onStepClick(idx)}
              >
                <span
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[#0B4F8A] text-white ring-4 ring-[#E8F1F9]'
                      : 'border-2 border-[#D5DDE5] bg-white text-[#5B6B7B]'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : idx + 1}
                </span>

                <div className="ml-3 hidden sm:block">
                  <p
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      isCurrent
                        ? 'text-[#0B4F8A]'
                        : isCompleted
                        ? 'text-[#1B2733]'
                        : 'text-[#8A97A5]'
                    }`}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-[11px] text-[#8A97A5]">{step.description}</p>
                  )}
                </div>
              </div>

              {idx !== steps.length - 1 && (
                <div
                  className={`absolute right-0 top-1/2 -mt-px h-0.5 w-full -translate-y-1/2 pr-6 sm:pr-10 ${
                    isCompleted ? 'bg-emerald-500' : 'bg-[#E3E9EF]'
                  }`}
                  style={{ left: 'calc(2.25rem + 0.75rem)', width: 'calc(100% - 3.75rem)' }}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
