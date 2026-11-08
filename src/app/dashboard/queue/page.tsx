import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import QueueClient from "./QueueClient";
import { DEFAULT_VISITS, DEFAULT_DOCTORS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function QueuePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const todayStr = new Date().toISOString().split("T")[0];

  let visits: any[] = DEFAULT_VISITS;
  let doctors: any[] = DEFAULT_DOCTORS;

  try {
    const [dbVisits, dbDoctors] = await Promise.all([
      prisma.visit.findMany({
        where: { tokenDate: todayStr },
        include: {
          patient: true,
          doctor: { include: { department: true } },
        },
        orderBy: [{ priority: "desc" }, { tokenNumber: "asc" }],
      }),
      prisma.doctor.findMany({ include: { department: true } }),
    ]);
    if (dbVisits.length > 0) visits = dbVisits;
    if (dbDoctors.length > 0) doctors = dbDoctors;
  } catch (err) {
    console.warn("Using fallback queue data:", err);
  }

  return <QueueClient initialVisits={visits} doctors={doctors} />;
}
