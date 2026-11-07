import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PatientsClient from "./PatientsClient";
import { maskCNIC } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PatientsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any)?.role || "RECEPTIONIST";

  const patients = await prisma.patient.findMany({
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

  const sanitized = patients.map((p) => ({
    ...p,
    cnic: maskCNIC(p.cnic, role),
  }));

  return <PatientsClient initialPatients={sanitized} userRole={role} />;
}
