import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReportsClient from "./ReportsClient";
import { DEFAULT_VISITS, DEFAULT_BILLS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any)?.role || "RECEPTIONIST";
  if (role !== "ADMIN" && role !== "ACCOUNTANT") {
    redirect("/dashboard");
  }

  const todayStr = new Date().toISOString().split("T")[0];

  let auditLogs: any[] = [];
  let contactSubmissions: any[] = [];
  let totalPatients = 50;
  let todayVisits: any[] = DEFAULT_VISITS;
  let allBills: any[] = DEFAULT_BILLS;

  try {
    const [dbAudit, dbContact, dbCount, dbVisits, dbBills] = await Promise.all([
      prisma.auditLog.findMany({ take: 50, orderBy: { createdAt: "desc" } }),
      prisma.contactSubmission.findMany({ take: 50, orderBy: { createdAt: "desc" } }),
      prisma.patient.count(),
      prisma.visit.findMany({ where: { tokenDate: todayStr } }),
      prisma.bill.findMany({ include: { refunds: true } }),
    ]);
    auditLogs = dbAudit;
    contactSubmissions = dbContact;
    totalPatients = dbCount;
    if (dbVisits.length > 0) todayVisits = dbVisits;
    if (dbBills.length > 0) allBills = dbBills;
  } catch (err) {
    console.warn("Using fallback reports data:", err);
  }

  const todayBills = allBills.filter(
    (b) => (b.createdAt instanceof Date ? b.createdAt.toISOString() : String(b.createdAt)).split("T")[0] === todayStr
  );
  const todayRevenue = todayBills.reduce((acc, b) => acc + (b.total || b.grossAmount || 0), 0);
  const totalRevenue = allBills.reduce((acc, b) => acc + (b.total || b.grossAmount || 0), 0);

  const initialKpis = {
    kpis: {
      totalPatients,
      todayVisitsCount: todayVisits.length,
      todayRevenue,
      totalRevenue,
      queue: {
        waiting: todayVisits.filter((v) => v.status === "WAITING").length,
        inConsultation: todayVisits.filter((v) => v.status === "IN_CONSULTATION").length,
        completed: todayVisits.filter((v) => v.status === "COMPLETED").length,
      },
    },
    hourlyDistribution: [
      { hour: "08:00 AM", count: 4 },
      { hour: "09:00 AM", count: 12 },
      { hour: "10:00 AM", count: 24 },
      { hour: "11:00 AM", count: 28 },
      { hour: "12:00 PM", count: 18 },
      { hour: "01:00 PM", count: 14 },
      { hour: "02:00 PM", count: 10 },
      { hour: "03:00 PM", count: 8 },
    ],
    patientBreakdown: [
      { name: "New Patients", value: 12 },
      { name: "Follow-ups", value: 5 },
    ],
    deptStats: [
      { code: "CARD", revenue: 15000 },
      { code: "ORTH", revenue: 12500 },
      { code: "MED", revenue: 18000 },
      { code: "GYN", revenue: 11000 },
      { code: "PED", revenue: 9000 },
    ],
  };

  return (
    <ReportsClient
      initialKpis={initialKpis}
      auditLogs={auditLogs}
      contactSubmissions={contactSubmissions}
    />
  );
}
