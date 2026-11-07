import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BillingClient from "./BillingClient";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any)?.role || "RECEPTIONIST";

  const bills = await prisma.bill.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      patient: true,
      items: true,
      refunds: true,
    },
    take: 50,
  });

  return <BillingClient initialBills={bills} userRole={role} />;
}
