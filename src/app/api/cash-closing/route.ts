import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CashClosingSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  try {
    // Check if closing already submitted for this date
    const existingClosing = await prisma.dailyCashClosing.findFirst({
      where: { date },
      orderBy: { closedAt: "desc" },
    });

    // Compute live collections for today
    const bills = await prisma.bill.findMany({
      where: {
        createdAt: {
          gte: new Date(`${date}T00:00:00.000Z`),
          lte: new Date(`${date}T23:59:59.999Z`),
        },
      },
      include: { refunds: true },
    });

    let cashCollected = 0;
    let cardCollected = 0;
    let jazzCashCollected = 0;
    let easypaisaCollected = 0;
    let refundsTotal = 0;

    bills.forEach((b) => {
      const paid = b.paidAmount || 0;
      if (b.paymentMethod === "CASH") cashCollected += paid;
      else if (b.paymentMethod === "CARD") cardCollected += paid;
      else if (b.paymentMethod === "JAZZCASH") jazzCashCollected += paid;
      else if (b.paymentMethod === "EASYPAISA") easypaisaCollected += paid;

      b.refunds.forEach((r) => {
        refundsTotal += r.amount;
      });
    });

    const totalExpected = cashCollected - refundsTotal;

    return NextResponse.json({
      date,
      existingClosing,
      isClosed: !!existingClosing,
      liveSummary: {
        cashCollected,
        cardCollected,
        jazzCashCollected,
        easypaisaCollected,
        refundsTotal,
        totalExpected,
        totalInvoices: bills.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = CashClosingSchema.parse(body);

    // Compute live summary to freeze into record
    const bills = await prisma.bill.findMany({
      where: {
        createdAt: {
          gte: new Date(`${validated.date}T00:00:00.000Z`),
          lte: new Date(`${validated.date}T23:59:59.999Z`),
        },
      },
      include: { refunds: true },
    });

    let cashCollected = 0;
    let cardCollected = 0;
    let jazzCashCollected = 0;
    let easypaisaCollected = 0;
    let refundsTotal = 0;

    bills.forEach((b) => {
      const paid = b.paidAmount || 0;
      if (b.paymentMethod === "CASH") cashCollected += paid;
      else if (b.paymentMethod === "CARD") cardCollected += paid;
      else if (b.paymentMethod === "JAZZCASH") jazzCashCollected += paid;
      else if (b.paymentMethod === "EASYPAISA") easypaisaCollected += paid;

      b.refunds.forEach((r) => {
        refundsTotal += r.amount;
      });
    });

    const totalExpected = cashCollected - refundsTotal;
    const discrepancy = validated.actualHandover - totalExpected;

    const closing = await prisma.dailyCashClosing.create({
      data: {
        receptionistId: (session.user as any).id,
        receptionistName: session.user?.name || "Staff",
        date: validated.date,
        openingCash: validated.openingCash || 0,
        cashCollected,
        cardCollected,
        jazzCashCollected,
        easypaisaCollected,
        refundsTotal,
        totalExpected,
        actualHandover: validated.actualHandover,
        discrepancy,
        notes: validated.notes || null,
      },
    });

    await logAudit({
      userId: (session.user as any).id,
      userName: session.user?.name,
      role: (session.user as any).role,
      action: "DAILY_CASH_CLOSING",
      entity: "DailyCashClosing",
      entityId: closing.id,
      details: {
        date: closing.date,
        expected: closing.totalExpected,
        actual: closing.actualHandover,
        discrepancy: closing.discrepancy,
      },
    });

    return NextResponse.json({ closing, message: "Cash closing submitted successfully." }, { status: 201 });
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
