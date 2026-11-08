import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppointmentsClient from "./AppointmentsClient";
import {
  DEFAULT_APPOINTMENTS,
  DEFAULT_DOCTORS,
  DEFAULT_DEPARTMENTS,
} from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  let appointments: any[] = DEFAULT_APPOINTMENTS;
  let doctors: any[] = DEFAULT_DOCTORS;
  let departments: any[] = DEFAULT_DEPARTMENTS;

  try {
    const [dbAppointments, dbDoctors, dbDepartments] = await Promise.all([
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

    if (dbAppointments.length > 0) appointments = dbAppointments;
    if (dbDoctors.length > 0) doctors = dbDoctors;
    if (dbDepartments.length > 0) departments = dbDepartments;
  } catch (err) {
    console.warn("Using fallback appointments data:", err);
  }

  return (
    <AppointmentsClient
      initialAppointments={appointments}
      doctors={doctors}
      departments={departments}
    />
  );
}
