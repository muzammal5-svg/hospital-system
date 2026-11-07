import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Pakistani CNIC formatting: 12345-1234567-1
export function formatCNIC(cnic: string | null | undefined): string {
  if (!cnic) return "N/A";
  const clean = cnic.replace(/\D/g, "");
  if (clean.length === 13) {
    return `${clean.slice(0, 5)}-${clean.slice(5, 12)}-${clean.slice(12, 13)}`;
  }
  return cnic;
}

// CNIC masking for non-admin roles: 35201-*******-1
export function maskCNIC(cnic: string | null | undefined, role?: string): string {
  if (!cnic) return "—";
  if (role === "ADMIN") return formatCNIC(cnic);
  const formatted = formatCNIC(cnic);
  if (formatted.length === 15) {
    return `${formatted.slice(0, 6)}*******${formatted.slice(13)}`;
  }
  return formatted.slice(0, 3) + "****" + formatted.slice(-2);
}

// Pakistani Mobile formatting: 03XX-XXXXXXX
export function formatMobile(mobile: string | null | undefined): string {
  if (!mobile) return "—";
  const clean = mobile.replace(/\D/g, "");
  if (clean.length === 11) {
    return `${clean.slice(0, 4)}-${clean.slice(4)}`;
  }
  return mobile;
}

// Currency formatting in PKR
export function formatPKR(amount: number | null | undefined): string {
  const num = Number(amount || 0);
  return `PKR ${num.toLocaleString("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

// Date formatter
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
