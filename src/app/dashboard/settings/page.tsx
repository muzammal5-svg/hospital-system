import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";
import {
  DEFAULT_HOSPITAL_PROFILE,
  DEFAULT_DEPARTMENTS,
  DEFAULT_DOCTORS,
  DEFAULT_USERS,
} from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any)?.role;
  if (role !== "ADMIN") {
    redirect("/dashboard");
  }

  let profile: any = DEFAULT_HOSPITAL_PROFILE;
  let departments: any[] = DEFAULT_DEPARTMENTS;
  let doctors: any[] = DEFAULT_DOCTORS;
  let users: any[] = DEFAULT_USERS.map(({ id, name, email, role }) => ({
    id,
    name,
    email,
    role,
    active: true,
  }));

  try {
    const [dbProfile, dbDepartments, dbDoctors, dbUsers] = await Promise.all([
      prisma.hospitalProfile.findUnique({ where: { id: "default" } }),
      prisma.department.findMany({ include: { doctors: true } }),
      prisma.doctor.findMany({ include: { department: true } }),
      prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, active: true },
      }),
    ]);
    if (dbProfile) profile = dbProfile;
    if (dbDepartments.length > 0) departments = dbDepartments;
    if (dbDoctors.length > 0) doctors = dbDoctors;
    if (dbUsers.length > 0) users = dbUsers;
  } catch (err) {
    console.warn("Using fallback settings data:", err);
  }

  return (
    <SettingsClient
      initialProfile={profile}
      departments={departments}
      doctors={doctors}
      users={users}
    />
  );
}
