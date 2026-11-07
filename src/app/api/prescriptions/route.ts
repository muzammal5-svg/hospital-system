import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PrescriptionSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";
import { queueEvents } from "@/lib/queue-events";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const visitId = searchParams.get("visitId");
  const patientId = searchParams.get("patientId");

  try {
    const where: any = {};
    if (visitId) where.visitId = visitId;
    if (patientId) where.patientId = patientId;

    const prescriptions = await prisma.prescription.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        doctor: { include: { department: true } },
        patient: true,
        visit: true,
      },
    });

    return NextResponse.json({ prescriptions });
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
    const validated = PrescriptionSchema.parse(body);

    const prescription = await prisma.prescription.create({
      data: {
        visitId: validated.visitId,
        patientId: validated.patientId,
        doctorId: validated.doctorId,
        diagnosis: validated.diagnosis,
        symptoms: validated.symptoms || null,
        clinicalNotes: validated.clinicalNotes || null,
        bloodPressure: validated.bloodPressure || null,
        pulse: validated.pulse || null,
        temperature: validated.temperature || null,
        weight: validated.weight || null,
        oxygenSaturation: validated.oxygenSaturation || null,
        followUpDate: validated.followUpDate || null,
        items: {
          create: validated.items.map((item) => ({
            medicineName: item.medicineName,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            instructions: item.instructions || null,
          })),
        },
      },
      include: {
        items: true,
        doctor: { include: { department: true } },
        patient: true,
      },
    });

    // Mark visit as completed
    await prisma.visit.update({
      where: { id: validated.visitId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    queueEvents.notify({
      event: "STATUS_CHANGED",
      visitId: validated.visitId,
      status: "COMPLETED",
    });

    await logAudit({
      userId: (session.user as any).id,
      userName: session.user?.name,
      role: (session.user as any).role,
      action: "PRESCRIPTION_CREATE",
      entity: "Prescription",
      entityId: prescription.id,
      details: {
        visitId: prescription.visitId,
        diagnosis: prescription.diagnosis,
        itemCount: prescription.items.length,
      },
    });

    return NextResponse.json({ prescription, message: "Prescription saved and consultation marked complete" }, { status: 201 });
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
