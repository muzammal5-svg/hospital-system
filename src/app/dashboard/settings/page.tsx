import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

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

  const [profile, departments, doctors, users] = await Promise.all([
    prisma.hospitalProfile.findUnique({ where: { id: "default" } }),
    prisma.department.findMany({ include: { doctors: true } }),
    prisma.doctor.findMany({ include: { department: true } }),
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, active: true },
    }),
  ]);

  return (
    <SettingsClient
      initialProfile={profile}
      departments={departments}
      doctors={doctors}
      users={users}
    />
  );
}
