import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DoctorClient from "./DoctorClient";

export const dynamic = "force-dynamic";

export default async function DoctorPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;
  const todayStr = new Date().toISOString().split("T")[0];

  const [doctors, visits] = await Promise.all([
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

  return (
    <DoctorClient
      initialVisits={visits}
      doctors={doctors}
      currentDoctorId={user.doctorId || null}
    />
  );
}
