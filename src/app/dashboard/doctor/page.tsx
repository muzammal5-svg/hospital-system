import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DoctorClient from "./DoctorClient";
import { DEFAULT_DOCTORS, DEFAULT_VISITS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function DoctorPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;
  const todayStr = new Date().toISOString().split("T")[0];

  let doctors: any[] = DEFAULT_DOCTORS;
  let visits: any[] = DEFAULT_VISITS;

  try {
    const [dbDoctors, dbVisits] = await Promise.all([
      prisma.doctor.findMany({ include: { department: true } }),
      prisma.visit.findMany({
        where: { tokenDate: todayStr },
        include: {
          patient: true,
          doctor: { include: { department: true } },
        },
        orderBy: [{ priority: "desc" }, { tokenNumber: "asc" }],
      }),
    ]);
    if (dbDoctors.length > 0) doctors = dbDoctors;
    if (dbVisits.length > 0) visits = dbVisits;
  } catch (err) {
    console.warn("Using fallback doctor data:", err);
  }

  return (
    <DoctorClient
      initialVisits={visits}
      doctors={doctors}
      currentDoctorId={user.doctorId || null}
    />
  );
}
