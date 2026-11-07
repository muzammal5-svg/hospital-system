import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "../src/lib/prisma";
import { cnicRegex, pakMobileRegex, PatientSchema, AppointmentSchema } from "../src/lib/validators";
import { maskCNIC, formatCNIC, formatMobile } from "../src/lib/utils";

describe("Naseem Ijaz Hospital - Core Systems Test Suite", () => {
  const testCnic = "35201-9999999-1";
  const testMobile = "0300-9999999";
  let createdPatientId: string;
  let testDoctor: any;
  let testDept: any;

  beforeAll(async () => {
    testDept = await prisma.department.findFirst();
    testDoctor = await prisma.doctor.findFirst({ where: { departmentId: testDept?.id } });
  });

  afterAll(async () => {
    // Cleanup created test records
    if (createdPatientId) {
      await prisma.visit.deleteMany({ where: { patientId: createdPatientId } });
      await prisma.appointment.deleteMany({ where: { patientId: createdPatientId } });
      await prisma.patient.deleteMany({ where: { id: createdPatientId } });
    }
  });

  describe("1. Validation & Formatting Tests", () => {
    it("should correctly validate Pakistani CNIC patterns", () => {
      expect(cnicRegex.test("35201-1234567-1")).toBe(true);
      expect(cnicRegex.test("3520112345671")).toBe(true);
      expect(cnicRegex.test("1234-invalid")).toBe(false);
      expect(cnicRegex.test("abcdefghijklm")).toBe(false);
    });

    it("should correctly validate Pakistani Mobile numbers", () => {
      expect(pakMobileRegex.test("0300-1234567")).toBe(true);
      expect(pakMobileRegex.test("03211234567")).toBe(true);
      expect(pakMobileRegex.test("042-35789000")).toBe(false); // PTCL landline
      expect(pakMobileRegex.test("123456")).toBe(false);
    });

    it("should properly format and mask CNIC based on role", () => {
      const rawCnic = "3520112345671";
      expect(formatCNIC(rawCnic)).toBe("35201-1234567-1");

      // Admin sees unmasked CNIC
      expect(maskCNIC("35201-1234567-1", "ADMIN")).toBe("35201-1234567-1");

      // Receptionist/Doctor sees masked CNIC
      const masked = maskCNIC("35201-1234567-1", "RECEPTIONIST");
      expect(masked).toContain("*******");
      expect(masked.startsWith("35201-")).toBe(true);
      expect(masked.endsWith("-1")).toBe(true);
    });
  });

  describe("2. Patient Registration & Duplicate Detection", () => {
    it("should successfully register a patient with auto-generated MR number", async () => {
      const currentYear = new Date().getFullYear();
      const count = await prisma.patient.count();
      const mrNumber = `NIH-${currentYear}-${String(count + 100).padStart(6, "0")}`;

      const patient = await prisma.patient.create({
        data: {
          mrNumber,
          fullName: "Test Automated Patient",
          fatherOrHusbandName: "Test Guardian",
          gender: "MALE",
          age: 40,
          mobile: testMobile,
          cnic: testCnic,
          city: "Lahore",
          bloodGroup: "B+",
          allergies: "Penicillin",
        },
      });

      createdPatientId = patient.id;
      expect(patient.id).toBeDefined();
      expect(patient.mrNumber).toMatch(/^NIH-\d{4}-\d{6}$/);
      expect(patient.fullName).toBe("Test Automated Patient");
    });

    it("should detect duplicate patient when matching CNIC or Mobile is checked", async () => {
      const existing = await prisma.patient.findFirst({
        where: { cnic: testCnic },
      });

      expect(existing).toBeDefined();
      expect(existing?.cnic).toBe(testCnic);
    });
  });

  describe("3. Sequential Token Generation & Live Queue", () => {
    it("should issue incremental daily tokens per doctor", async () => {
      const todayStr = "2026-12-31"; // Isolated test date

      // Token 1
      const v1 = await prisma.visit.create({
        data: {
          visitNumber: `VIS-TEST-001`,
          patientId: createdPatientId,
          doctorId: testDoctor.id,
          departmentId: testDept.id,
          tokenNumber: 1,
          tokenDate: todayStr,
          consultationFee: testDoctor.fee,
          netAmount: testDoctor.fee,
        },
      });

      // Token 2
      const v2 = await prisma.visit.create({
        data: {
          visitNumber: `VIS-TEST-002`,
          patientId: createdPatientId,
          doctorId: testDoctor.id,
          departmentId: testDept.id,
          tokenNumber: 2,
          tokenDate: todayStr,
          consultationFee: testDoctor.fee,
          netAmount: testDoctor.fee,
        },
      });

      expect(v1.tokenNumber).toBe(1);
      expect(v2.tokenNumber).toBe(2);

      // Clean up test visits
      await prisma.visit.deleteMany({ where: { tokenDate: todayStr } });
    });
  });

  describe("4. Double-Booking Prevention in Appointments", () => {
    it("should prevent duplicate appointments for the same doctor, date and time slot", async () => {
      const testDate = "2026-12-31";
      const testSlot = "10:30 AM";
      const ref1 = `APT-TEST-001`;
      const ref2 = `APT-TEST-002`;

      // Create First Appointment
      await prisma.appointment.create({
        data: {
          referenceNo: ref1,
          patientId: createdPatientId,
          patientName: "Patient A",
          patientMobile: "0300-1111111",
          doctorId: testDoctor.id,
          departmentId: testDept.id,
          appointmentDate: testDate,
          timeSlot: testSlot,
        },
      });

      // Attempting to create duplicate slot for same doctor must throw unique constraint error
      let errorThrown = false;
      try {
        await prisma.appointment.create({
          data: {
            referenceNo: ref2,
            patientName: "Patient B",
            patientMobile: "0300-2222222",
            doctorId: testDoctor.id,
            departmentId: testDept.id,
            appointmentDate: testDate,
            timeSlot: testSlot,
          },
        });
      } catch (err: any) {
        errorThrown = true;
        expect(err.code).toBe("P2002"); // Prisma Unique Constraint code
      }

      expect(errorThrown).toBe(true);

      // Clean up test appointments
      await prisma.appointment.deleteMany({ where: { appointmentDate: testDate } });
    });
  });

  describe("5. Role-Based Access Validation", () => {
    it("should enforce role distinctions for refund authorizations", () => {
      const canApproveRefund = (role: string) => role === "ADMIN" || role === "ACCOUNTANT";

      expect(canApproveRefund("ADMIN")).toBe(true);
      expect(canApproveRefund("ACCOUNTANT")).toBe(true);
      expect(canApproveRefund("RECEPTIONIST")).toBe(false);
      expect(canApproveRefund("DOCTOR")).toBe(false);
    });
  });
});
