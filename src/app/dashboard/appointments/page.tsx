import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppointmentsClient from "./AppointmentsClient";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const [appointments, doctors, departments] = await Promise.all([
    prisma.appointment.findMany({
      orderBy: [{ appointmentDate: "asc" }, { timeSlot: "asc" }],
      include: {
        doctor: { include: { department: true } },
        department: true,
      },
    }),
    prisma.doctor.findMany({ include: { department: true } }),
    prisma.department.findMany(),
  ]);

  return (
    <AppointmentsClient
      initialAppointments={appointments}
      doctors={doctors}
      departments={departments}
    />
  );
}
