import { z } from "zod";

// Pakistani CNIC Regex: 12345-1234567-1 or 13 digits
export const cnicRegex = /^(\d{5}-\d{7}-\d{1}|\d{13})$/;

// Pakistani Mobile Regex: 03XX-XXXXXXX or 03XXXXXXXXX (11 digits starting with 03)
export const pakMobileRegex = /^(03\d{2}-\d{7}|03\d{9})$/;

export const PatientSchema = z.object({
  fullName: z.string().min(2, "Full Name must be at least 2 characters"),
  fatherOrHusbandName: z.string().optional().nullable(),
  age: z.coerce.number().int().min(0).max(130).optional().nullable(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    errorMap: () => ({ message: "Select a valid gender" }),
  }),
  cnic: z
    .string()
    .trim()
    .refine((val) => !val || cnicRegex.test(val), {
      message: "CNIC must be formatted as 12345-1234567-1 or 13 digits",
    })
    .optional()
    .nullable(),
  mobile: z
    .string()
    .trim()
    .refine((val) => pakMobileRegex.test(val), {
      message: "Mobile must be a valid Pakistani number (e.g., 0300-1234567)",
    }),
  address: z.string().optional().nullable(),
  city: z.string().default("Lahore"),
  bloodGroup: z.string().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
});

export const VisitSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  departmentId: z.string().min(1, "Department is required"),
  visitType: z.enum(["OPD", "EMERGENCY", "ADMISSION", "FOLLOWUP"]).default("OPD"),
  priority: z.enum(["NORMAL", "EMERGENCY"]).default("NORMAL"),
  consultationFee: z.coerce.number().min(0, "Fee cannot be negative"),
  discountAmount: z.coerce.number().min(0).default(0),
  discountReason: z.string().optional().nullable(),
  paymentMethod: z.enum(["CASH", "CARD", "JAZZCASH", "EASYPAISA"]).default("CASH"),
});

export const AppointmentSchema = z.object({
  doctorId: z.string().min(1, "Doctor is required"),
  departmentId: z.string().min(1, "Department is required"),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  timeSlot: z.string().min(1, "Time slot is required"),
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  patientMobile: z
    .string()
    .trim()
    .refine((val) => pakMobileRegex.test(val), {
      message: "Enter a valid mobile (03XX-XXXXXXX)",
    }),
  patientCnic: z.string().optional().nullable(),
  patientId: z.string().optional().nullable(),
  type: z.enum(["ONLINE", "WALK_IN", "PHONE"]).default("ONLINE"),
  notes: z.string().optional().nullable(),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export const PrescriptionItemSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  dosage: z.string().min(1, "Dosage is required (e.g., 500mg)"),
  frequency: z.string().min(1, "Frequency is required (e.g., TDS / 1-0-1)"),
  duration: z.string().min(1, "Duration is required (e.g., 5 days)"),
  instructions: z.string().optional().nullable(),
});

export const PrescriptionSchema = z.object({
  visitId: z.string().min(1, "Visit ID is required"),
  patientId: z.string().min(1, "Patient ID is required"),
  doctorId: z.string().min(1, "Doctor ID is required"),
  diagnosis: z.string().min(2, "Diagnosis is required"),
  symptoms: z.string().optional().nullable(),
  clinicalNotes: z.string().optional().nullable(),
  bloodPressure: z.string().optional().nullable(),
  pulse: z.string().optional().nullable(),
  temperature: z.string().optional().nullable(),
  weight: z.string().optional().nullable(),
  oxygenSaturation: z.string().optional().nullable(),
  followUpDate: z.string().optional().nullable(),
  items: z.array(PrescriptionItemSchema).min(1, "At least one medicine is required"),
});

export const RefundSchema = z.object({
  billId: z.string().min(1, "Bill ID is required"),
  amount: z.coerce.number().positive("Refund amount must be greater than 0"),
  reason: z.string().min(3, "Refund reason is required"),
});

export const CashClosingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  openingCash: z.coerce.number().min(0).default(0),
  actualHandover: z.coerce.number().min(0, "Handover amount is required"),
  notes: z.string().optional().nullable(),
});

export const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().max(0, "Spam detected").optional(),
});
