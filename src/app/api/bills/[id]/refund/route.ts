import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RefundSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRole = (session.user as any).role;
  if (userRole !== "ADMIN" && userRole !== "ACCOUNTANT") {
    return NextResponse.json(
      { error: "Only Admin and Accountant roles can approve refunds." },
      { status: 403 }
    );
  }

  try {
    const billId = params.id;
    const body = await req.json();
    const validated = RefundSchema.parse({ ...body, billId });

    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      include: { refunds: true },
    });

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    const previousRefunds = bill.refunds.reduce((sum, r) => sum + r.amount, 0);
    const availableToRefund = bill.paidAmount - previousRefunds;

    if (validated.amount > availableToRefund) {
      return NextResponse.json(
        {
          error: `Cannot refund PKR ${validated.amount}. Maximum refundable is PKR ${availableToRefund}.`,
        },
        { status: 400 }
      );
    }

    const refund = await prisma.refund.create({
      data: {
        billId,
        amount: validated.amount,
        reason: validated.reason,
        approvedBy: session.user?.name || "Admin",
        processedBy: session.user?.name,
      },
    });

    // Update bill status
    const newTotalRefunded = previousRefunds + validated.amount;
    const newStatus = newTotalRefunded >= bill.paidAmount ? "REFUNDED" : "PARTIAL";

    await prisma.bill.update({
      where: { id: billId },
      data: {
        paymentStatus: newStatus,
        balance: bill.paidAmount - newTotalRefunded,
      },
    });

    await logAudit({
      userId: (session.user as any).id,
      userName: session.user?.name,
      role: userRole,
      action: "BILL_REFUND",
      entity: "Refund",
      entityId: refund.id,
      details: {
        invoiceNo: bill.invoiceNo,
        refundAmount: validated.amount,
        reason: validated.reason,
      },
    });

    return NextResponse.json({ refund, message: "Refund processed successfully" });
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
