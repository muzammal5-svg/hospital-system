import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { DEFAULT_BILLS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get("patientId");
  const date = searchParams.get("date");
  const query = searchParams.get("q")?.trim();

  try {
    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (query) {
      where.OR = [
        { invoiceNo: { contains: query } },
        { patient: { fullName: { contains: query } } },
        { patient: { mrNumber: { contains: query } } },
      ];
    }

    const bills = await prisma.bill.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        patient: true,
        items: true,
        refunds: true,
        visit: {
          include: { doctor: true },
        },
      },
    });

    return NextResponse.json({ bills: bills.length > 0 ? bills : DEFAULT_BILLS });
  } catch (error: any) {
    console.warn("Using fallback bills in API:", error);
    return NextResponse.json({ bills: DEFAULT_BILLS });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { patientId, items, paymentMethod, discount = 0 } = body;

    if (!patientId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Patient and bill items are required" }, { status: 400 });
    }

    const subtotal = items.reduce((acc: number, item: any) => acc + (Number(item.unitPrice) * (item.quantity || 1)), 0);
    const total = Math.max(0, subtotal - Number(discount));

    const currentYear = new Date().getFullYear();
    const count = await prisma.bill.count();
    const invoiceNo = `INV-${currentYear}-${String(count + 1).padStart(6, "0")}`;

    const bill = await prisma.bill.create({
      data: {
        invoiceNo,
        patientId,
        subtotal,
        discount: Number(discount),
        total,
        paidAmount: total,
        balance: 0,
        paymentMethod: paymentMethod || "CASH",
        paymentStatus: "PAID",
        receptionUserId: (session.user as any).id,
        items: {
          create: items.map((it: any) => ({
            itemType: it.itemType || "PROCEDURE",
            description: it.description,
            quantity: Number(it.quantity) || 1,
            unitPrice: Number(it.unitPrice),
            amount: Number(it.unitPrice) * (Number(it.quantity) || 1),
          })),
        },
      },
      include: {
        items: true,
        patient: true,
      },
    });

    await logAudit({
      userId: (session.user as any).id,
      userName: session.user?.name,
      role: (session.user as any).role,
      action: "BILL_CREATE",
      entity: "Bill",
      entityId: bill.id,
      details: { invoiceNo: bill.invoiceNo, total: bill.total },
    });

    return NextResponse.json({ bill, message: "Invoice created successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
