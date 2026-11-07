'use client';

import React, { forwardRef, useState, useId } from 'react';
import { AlertCircle, Check, ChevronDown, Calendar, Search } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Common Wrapper for Labels, Asterisks, Helpers & Errors                     */
/* -------------------------------------------------------------------------- */
interface FieldWrapperProps {
  id?: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FieldWrapper({
  id,
  label,
  required,
  helperText,
  error,
  children,
  className = '',
}: FieldWrapperProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#1B2733] flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-rose-600 font-bold" aria-hidden="true">*</span>}
        </label>
      )}

      {children}

      {error ? (
        <p className="flex items-center gap-1 text-xs font-medium text-rose-600 animate-in fade-in duration-100" role="alert">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-[#8A97A5]">{helperText}</p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TextField                                                                  */
/* -------------------------------------------------------------------------- */
export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, required, helperText, error, leftIcon, rightIcon, className = '', wrapperClassName, id, ...props },
  ref
) {
  const autoId = useId();
  const fieldId = id || autoId;

  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      required={required}
      helperText={helperText}
      error={error}
      className={wrapperClassName}
    >
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3.5 text-[#8A97A5]">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={fieldId}
          required={required}
          className={`h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-[#1B2733] placeholder-[#8A97A5] transition-all disabled:bg-[#F1F5F9] disabled:text-[#8A97A5] ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${
            error
              ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20'
              : 'border-[#D5DDE5] focus:border-[#1E9E8F] focus:outline-none focus:ring-2 focus:ring-[#1E9E8F]/20'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="pointer-events-none absolute right-3.5 text-[#8A97A5]">
            {rightIcon}
          </div>
        )}
      </div>
    </FieldWrapper>
  );
});

/* -------------------------------------------------------------------------- */
/* PhoneField (Pakistani format: 03XX-XXXXXXX)                                */
/* -------------------------------------------------------------------------- */
export interface PhoneFieldProps extends Omit<TextFieldProps, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
}

export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(function PhoneField(
  { value = '', onChange, ...props },
  ref
) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 11) raw = raw.slice(0, 11);

    let formatted = raw;
    if (raw.length > 4) {
      formatted = `${raw.slice(0, 4)}-${raw.slice(4)}`;
    }

    if (onChange) onChange(formatted);
  };

  return (
    <TextField
      ref={ref}
      type="tel"
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      placeholder="0300-1234567"
      {...props}
    />
  );
});

/* -------------------------------------------------------------------------- */
/* CnicField (Pakistani format: 35201-1234567-1)                             */
/* -------------------------------------------------------------------------- */
export interface CnicFieldProps extends Omit<TextFieldProps, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
}

export const CnicField = forwardRef<HTMLInputElement, CnicFieldProps>(function CnicField(
  { value = '', onChange, ...props },
  ref
) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 13) raw = raw.slice(0, 13);

    let formatted = raw;
    if (raw.length > 5 && raw.length <= 12) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`;
    } else if (raw.length > 12) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5, 12)}-${raw.slice(12)}`;
    }

    if (onChange) onChange(formatted);
  };

  return (
    <TextField
      ref={ref}
      type="text"
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      placeholder="35201-1234567-1"
      {...props}
    />
  );
});

/* -------------------------------------------------------------------------- */
/* DateField                                                                  */
/* -------------------------------------------------------------------------- */
export interface DateFieldProps extends TextFieldProps {}

export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(function DateField(
  { ...props },
  ref
) {
  return (
    <TextField
      ref={ref}
      type="date"
      rightIcon={<Calendar className="h-4 w-4" />}
      {...props}
    />
  );
});

/* -------------------------------------------------------------------------- */
/* SelectField                                                                */
/* -------------------------------------------------------------------------- */
export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
  children?: React.ReactNode;
  wrapperClassName?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, required, helperText, error, options, children, className = '', wrapperClassName, id, ...props },
  ref
) {
  const autoId = useId();
  const fieldId = id || autoId;

  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      required={required}
      helperText={helperText}
      error={error}
      className={wrapperClassName}
    >
      <div className="relative flex items-center">
        <select
          ref={ref}
          id={fieldId}
          required={required}
          className={`h-11 w-full appearance-none rounded-lg border bg-white px-3.5 pr-10 text-sm text-[#1B2733] transition-all disabled:bg-[#F1F5F9] disabled:text-[#8A97A5] ${
            error
              ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-[#D5DDE5] focus:border-[#1E9E8F] focus:ring-[#1E9E8F]/20'
          } focus:outline-none focus:ring-2 ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 h-4 w-4 text-[#8A97A5]" />
      </div>
    </FieldWrapper>
  );
});

/* -------------------------------------------------------------------------- */
/* TextareaField                                                              */
/* -------------------------------------------------------------------------- */
export interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  wrapperClassName?: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
  { label, required, helperText, error, className = '', wrapperClassName, id, rows = 3, ...props },
  ref
) {
  const autoId = useId();
  const fieldId = id || autoId;

  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      required={required}
      helperText={helperText}
      error={error}
      className={wrapperClassName}
    >
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        required={required}
        className={`w-full rounded-lg border bg-white p-3.5 text-sm text-[#1B2733] placeholder-[#8A97A5] transition-all disabled:bg-[#F1F5F9] ${
          error
            ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-[#D5DDE5] focus:border-[#1E9E8F] focus:ring-[#1E9E8F]/20'
        } focus:outline-none focus:ring-2 ${className}`}
        {...props}
      />
    </FieldWrapper>
  );
});

/* -------------------------------------------------------------------------- */
/* RadioCards (e.g. for Gender, Patient Type, Payment Mode)                  */
/* -------------------------------------------------------------------------- */
export interface RadioCardOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

export interface RadioCardsProps {
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  options: RadioCardOption[];
  value: string;
  onChange: (value: string) => void;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function RadioCards({
  label,
  required,
  helperText,
  error,
  options,
  value,
  onChange,
  columns = 3,
  className = '',
}: RadioCardsProps) {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
  }[columns];

  return (
    <FieldWrapper label={label} required={required} helperText={helperText} error={error} className={className}>
      <div className={`grid gap-2.5 ${colClass}`}>
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <div
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                isSelected
                  ? 'border-[#0B4F8A] bg-[#E8F1F9]/40 ring-1 ring-[#0B4F8A]'
                  : 'border-[#D5DDE5] bg-white hover:border-[#B5CDE0] hover:bg-[#F8FAFC]'
              }`}
            >
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                  isSelected ? 'border-[#0B4F8A] bg-[#0B4F8A]' : 'border-[#D5DDE5] bg-white'
                }`}
              >
                {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
              </div>

              {opt.icon && (
                <div className={`text-base ${isSelected ? 'text-[#0B4F8A]' : 'text-[#5B6B7B]'}`}>
                  {opt.icon}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${isSelected ? 'text-[#0B4F8A]' : 'text-[#1B2733]'}`}>
                  {opt.label}
                </p>
                {opt.sublabel && <p className="text-[11px] text-[#8A97A5] truncate">{opt.sublabel}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </FieldWrapper>
  );
}

/* -------------------------------------------------------------------------- */
/* CheckboxField                                                              */
/* -------------------------------------------------------------------------- */
export interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  sublabel?: string;
  wrapperClassName?: string;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(function CheckboxField(
  { label, sublabel, className = '', wrapperClassName = '', id, ...props },
  ref
) {
  const autoId = useId();
  const fieldId = id || autoId;

  return (
    <div className={`flex items-start gap-2.5 ${wrapperClassName}`}>
      <input
        ref={ref}
        id={fieldId}
        type="checkbox"
        className={`mt-0.5 h-4 w-4 rounded border-[#D5DDE5] text-[#0B4F8A] focus:ring-[#0B4F8A] ${className}`}
        {...props}
      />
      <label htmlFor={fieldId} className="cursor-pointer select-none">
        <span className="text-sm font-medium text-[#1B2733]">{label}</span>
        {sublabel && <p className="text-xs text-[#8A97A5]">{sublabel}</p>}
      </label>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/* SwitchField                                                                */
/* -------------------------------------------------------------------------- */
export interface SwitchFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  sublabel?: string;
  disabled?: boolean;
  className?: string;
}

export function SwitchField({
  checked,
  onChange,
  label,
  sublabel,
  disabled = false,
  className = '',
}: SwitchFieldProps) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div>
        <span className="text-sm font-medium text-[#1B2733]">{label}</span>
        {sublabel && <p className="text-xs text-[#8A97A5]">{sublabel}</p>}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1E9E8F] focus:ring-offset-2 disabled:opacity-50 ${
          checked ? 'bg-[#0B4F8A]' : 'bg-[#D5DDE5]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SearchableSelect (Combobox)                                                */
/* -------------------------------------------------------------------------- */
export interface SearchableSelectProps {
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
}

export function SearchableSelect({
  label,
  required,
  helperText,
  error,
  placeholder = 'Select option...',
  options,
  value,
  onChange,
  className = '',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedOption = options.find((o) => o.value === value);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FieldWrapper label={label} required={required} helperText={helperText} error={error} className={className}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`h-11 w-full rounded-lg border bg-white px-3.5 text-left text-sm transition-all flex items-center justify-between ${
            error ? 'border-rose-400 text-rose-900' : 'border-[#D5DDE5] text-[#1B2733]'
          }`}
        >
          <span className={selectedOption ? 'text-[#1B2733]' : 'text-[#8A97A5]'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 text-[#8A97A5]" />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
            <div className="absolute left-0 top-12 z-30 w-full rounded-lg border border-[#E3E9EF] bg-white p-2 shadow-xl">
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A97A5]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter..."
                  className="h-8 w-full rounded-md border border-[#D5DDE5] bg-[#F8FAFC] pl-8 pr-3 text-xs text-[#1B2733] focus:border-[#1E9E8F] focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {filtered.length === 0 ? (
                  <p className="p-2 text-center text-xs text-[#8A97A5]">No matches found</p>
                ) : (
                  filtered.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        opt.value === value
                          ? 'bg-[#E8F1F9] text-[#0B4F8A]'
                          : 'text-[#1B2733] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {opt.value === value && <Check className="h-3.5 w-3.5 text-[#0B4F8A]" />}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </FieldWrapper>
  );
}

/* -------------------------------------------------------------------------- */
/* FormSection                                                                */
/* -------------------------------------------------------------------------- */
interface FormSectionProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  badge,
  children,
  className = '',
}: FormSectionProps) {
  return (
    <div className={`space-y-4 pt-4 first:pt-0 ${className}`}>
      <div className="border-b border-[#F0F4F8] pb-2.5">
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-base font-semibold text-[#1B2733]">{title}</h3>
          {badge}
        </div>
        {description && <p className="text-xs text-[#5B6B7B] mt-0.5">{description}</p>}
      </div>

      <div className="pt-1">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FormGrid (12-column responsive layout)                                     */
/* -------------------------------------------------------------------------- */
interface FormGridProps {
  children: React.ReactNode;
  className?: string;
}

export function FormGrid({ children, className = '' }: FormGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-6 lg:grid-cols-12 ${className}`}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FormActions (Sticky Bottom Action Bar)                                     */
/* -------------------------------------------------------------------------- */
interface FormActionsProps {
  onCancel?: () => void;
  cancelLabel?: string;
  onSaveDraft?: () => void;
  draftLabel?: string;
  onSaveAndPrint?: () => void;
  saveAndPrintLabel?: string;
  onSave?: () => void;
  saveLabel?: string;
  isSaving?: boolean;
  extraActions?: React.ReactNode;
  className?: string;
}

export function FormActions({
  onCancel,
  cancelLabel = 'Cancel',
  onSaveDraft,
  draftLabel = 'Save Draft',
  onSaveAndPrint,
  saveAndPrintLabel = 'Save & Print',
  onSave,
  saveLabel = 'Save',
  isSaving = false,
  extraActions,
  className = '',
}: FormActionsProps) {
  return (
    <div
      className={`sticky bottom-0 z-30 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E3E9EF] bg-white/95 px-4 py-3.5 backdrop-blur-md shadow-[0_-4px_16px_rgba(16,24,40,0.06)] rounded-b-xl ${className}`}
    >
      <div className="flex items-center gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-lg border border-[#D5DDE5] bg-white px-4 py-2.5 text-xs font-semibold text-[#1B2733] hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        )}
        {extraActions}
      </div>

      <div className="flex items-center gap-2.5">
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="rounded-lg border border-[#B5CDE0] bg-[#E8F1F9] px-4 py-2.5 text-xs font-semibold text-[#0B4F8A] hover:bg-[#D5E6F5] transition-colors disabled:opacity-50"
          >
            {draftLabel}
          </button>
        )}

        {onSaveAndPrint && (
          <button
            type="button"
            onClick={onSaveAndPrint}
            disabled={isSaving}
            className="rounded-lg border border-[#167C70] bg-[#1E9E8F] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#167C70] transition-colors disabled:opacity-50"
          >
            {saveAndPrintLabel}
          </button>
        )}

        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0B4F8A] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#093F6E] transition-colors disabled:opacity-50"
          >
            {isSaving && (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            <span>{isSaving ? 'Saving...' : saveLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
