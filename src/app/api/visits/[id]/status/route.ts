import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { queueEvents } from "@/lib/queue-events";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const visitId = params.id;
    const body = await req.json();
    const { status, priority } = body;

    const dataToUpdate: any = {};
    if (status) {
      dataToUpdate.status = status;
      if (status === "COMPLETED") dataToUpdate.completedAt = new Date();
      if (status === "IN_CONSULTATION") dataToUpdate.calledAt = new Date();
    }
    if (priority) {
      dataToUpdate.priority = priority;
    }

    const updated = await prisma.visit.update({
      where: { id: visitId },
      data: dataToUpdate,
      include: {
        patient: true,
        doctor: { include: { department: true } },
      },
    });

    queueEvents.notify({
      event: "STATUS_CHANGED",
      visitId: updated.id,
      status: updated.status,
      priority: updated.priority,
      doctorId: updated.doctorId,
    });

    await logAudit({
      userId: (session.user as any).id,
      userName: session.user?.name,
      role: (session.user as any).role,
      action: "VISIT_STATUS_UPDATE",
      entity: "Visit",
      entityId: updated.id,
      details: { status: updated.status, priority: updated.priority },
    });

    return NextResponse.json({ visit: updated, message: "Status updated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
