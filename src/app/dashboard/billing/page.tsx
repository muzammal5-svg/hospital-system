import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BillingClient from "./BillingClient";
import { DEFAULT_BILLS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any)?.role || "RECEPTIONIST";

  let bills: any[] = DEFAULT_BILLS;
  try {
    const dbBills = await prisma.bill.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        patient: true,
        items: true,
        refunds: true,
      },
      take: 50,
    });
    if (dbBills.length > 0) bills = dbBills;
  } catch (err) {
    console.warn("Using fallback bills data:", err);
  }

  return <BillingClient initialBills={bills} userRole={role} />;
}
