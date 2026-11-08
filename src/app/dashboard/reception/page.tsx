import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReceptionClient from "./ReceptionClient";
import {
  DEFAULT_DEPARTMENTS,
  DEFAULT_DOCTORS,
  DEFAULT_HOSPITAL_PROFILE,
} from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function ReceptionPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  let departments: any[] = DEFAULT_DEPARTMENTS;
  let doctors: any[] = DEFAULT_DOCTORS;
  let profile: any = DEFAULT_HOSPITAL_PROFILE;

  try {
    const [dbDepts, dbDocs, dbProfile] = await Promise.all([
      prisma.department.findMany({ orderBy: { name: "asc" } }),
      prisma.doctor.findMany({ include: { department: true }, orderBy: { name: "asc" } }),
      prisma.hospitalProfile.findUnique({ where: { id: "default" } }),
    ]);

    if (dbDepts.length > 0) departments = dbDepts;
    if (dbDocs.length > 0) doctors = dbDocs;
    if (dbProfile) profile = dbProfile;
  } catch (err) {
    console.warn("Using fallback reception data:", err);
  }

  return (
    <ReceptionClient
      initialDepartments={departments}
      initialDoctors={doctors}
      hospitalProfile={profile}
    />
  );
}
