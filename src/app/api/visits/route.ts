import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VisitSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";
import { queueEvents } from "@/lib/queue-events";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const status = searchParams.get("status");

  try {
    const where: any = {
      tokenDate: date,
    };
    if (doctorId) where.doctorId = doctorId;
    if (status) where.status = status;

    const visits = await prisma.visit.findMany({
      where,
      orderBy: [
        { priority: "desc" }, // EMERGENCY first
        { tokenNumber: "asc" },
      ],
      include: {
        patient: true,
        doctor: {
          include: { department: true },
        },
        department: true,
        prescriptions: {
          include: { items: true },
        },
      },
    });

    return NextResponse.json({ visits });
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
    const validated = VisitSchema.parse(body);

    const todayStr = new Date().toISOString().split("T")[0];

    // Get next token number for this doctor on today's date
    const lastVisit = await prisma.visit.findFirst({
      where: {
        doctorId: validated.doctorId,
        tokenDate: todayStr,
      },
      orderBy: { tokenNumber: "desc" },
    });
    const tokenNumber = (lastVisit?.tokenNumber || 0) + 1;

    // Generate unique Visit Number: VIS-YYYY-000001
    const currentYear = new Date().getFullYear();
    const totalVisits = await prisma.visit.count();
    const visitNumber = `VIS-${currentYear}-${String(totalVisits + 1).padStart(6, "0")}`;

    const netAmount = Math.max(0, validated.consultationFee - (validated.discountAmount || 0));

    // Create Visit
    const visit = await prisma.visit.create({
      data: {
        visitNumber,
        patientId: validated.patientId,
        doctorId: validated.doctorId,
        departmentId: validated.departmentId,
        tokenNumber,
        tokenDate: todayStr,
        visitType: validated.visitType,
        status: "WAITING",
        priority: validated.priority,
        consultationFee: validated.consultationFee,
        discountAmount: validated.discountAmount || 0,
        discountReason: validated.discountReason || null,
        netAmount,
        paymentStatus: "PAID",
        paymentMethod: validated.paymentMethod,
        receptionUserId: (session.user as any).id,
      },
      include: {
        patient: true,
        doctor: { include: { department: true } },
        department: true,
      },
    });

    // Generate Bill and BillItem automatically
    const totalBills = await prisma.bill.count();
    const invoiceNo = `INV-${currentYear}-${String(totalBills + 1).padStart(6, "0")}`;

    const bill = await prisma.bill.create({
      data: {
        invoiceNo,
        visitId: visit.id,
        patientId: visit.patientId,
        subtotal: validated.consultationFee,
        discount: validated.discountAmount || 0,
        total: netAmount,
        paidAmount: netAmount,
        balance: 0,
        paymentMethod: validated.paymentMethod,
        paymentStatus: "PAID",
        receptionUserId: (session.user as any).id,
      },
    });

    await prisma.billItem.create({
      data: {
        billId: bill.id,
        itemType: "CONSULTATION",
        description: `OPD Consultation - ${visit.doctor.name} (${visit.doctor.specialty})`,
        quantity: 1,
        unitPrice: validated.consultationFee,
        amount: validated.consultationFee,
      },
    });

    // Notify queue subscribers (TV display)
    queueEvents.notify({
      event: "NEW_VISIT",
      visitId: visit.id,
      doctorId: visit.doctorId,
      tokenNumber: visit.tokenNumber,
      patientName: visit.patient.fullName,
    });

    await logAudit({
      userId: (session.user as any).id,
      userName: session.user?.name,
      role: (session.user as any).role,
      action: "VISIT_CREATE",
      entity: "Visit",
      entityId: visit.id,
      details: { tokenNumber: visit.tokenNumber, doctorName: visit.doctor.name, fee: netAmount },
    });

    return NextResponse.json({ visit, bill, message: "Token issued successfully" }, { status: 201 });
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
