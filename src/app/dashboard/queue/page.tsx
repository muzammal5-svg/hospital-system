import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import QueueClient from "./QueueClient";

export const dynamic = "force-dynamic";

export default async function QueuePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const [visits, doctors] = await Promise.all([
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

  return <QueueClient initialVisits={visits} doctors={doctors} />;
}
