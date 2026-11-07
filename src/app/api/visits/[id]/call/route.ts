import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { queueEvents } from "@/lib/queue-events";
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

  try {
    const visitId = params.id;
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: {
        patient: true,
        doctor: { include: { department: true } },
      },
    });

    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 });
    }

    const updated = await prisma.visit.update({
      where: { id: visitId },
      data: {
        status: "IN_CONSULTATION",
        calledAt: new Date(),
      },
      include: {
        patient: true,
        doctor: { include: { department: true } },
      },
    });

    // Broadcast instant event for TV display to ring chime and update "Now Serving"
    queueEvents.notify({
      event: "PATIENT_CALLED",
      visitId: updated.id,
      tokenNumber: updated.tokenNumber,
      patientName: updated.patient.fullName,
      doctorName: updated.doctor.name,
      roomNo: updated.doctor.roomNo,
      department: updated.doctor.department.name,
      calledAt: new Date().toISOString(),
    });

    await logAudit({
      userId: (session.user as any).id,
      userName: session.user?.name,
      role: (session.user as any).role,
      action: "PATIENT_CALLED",
      entity: "Visit",
      entityId: updated.id,
      details: {
        tokenNumber: updated.tokenNumber,
        doctorName: updated.doctor.name,
        roomNo: updated.doctor.roomNo,
      },
    });

    return NextResponse.json({
      message: `Token #${updated.tokenNumber} called to ${updated.doctor.roomNo}`,
      visit: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
