import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReceptionClient from "./ReceptionClient";

export const dynamic = "force-dynamic";

export default async function ReceptionPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const [departments, doctors, profile] = await Promise.all([
    prisma.department.findMany({ orderBy: { name: "asc" } }),
    prisma.doctor.findMany({ include: { department: true }, orderBy: { name: "asc" } }),
    prisma.hospitalProfile.findUnique({ where: { id: "default" } }),
  ]);

  return (
    <ReceptionClient
      initialDepartments={departments}
      initialDoctors={doctors}
      hospitalProfile={profile}
    />
  );
}
