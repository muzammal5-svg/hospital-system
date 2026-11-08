import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PatientsClient from "./PatientsClient";
import { maskCNIC } from "@/lib/utils";
import { DEFAULT_PATIENTS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function PatientsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any)?.role || "RECEPTIONIST";

  let patients: any[] = DEFAULT_PATIENTS;
  try {
    const dbPatients = await prisma.patient.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        visits: {
          orderBy: { createdAt: "desc" },
          take: 3,
          include: { doctor: true, department: true },
        },
      },
    });
    if (dbPatients.length > 0) patients = dbPatients;
  } catch (err) {
    console.warn("Using fallback patients data:", err);
  }

  const sanitized = patients.map((p) => ({
    ...p,
    cnic: maskCNIC(p.cnic, role),
  }));

  return <PatientsClient initialPatients={sanitized} userRole={role} />;
}
