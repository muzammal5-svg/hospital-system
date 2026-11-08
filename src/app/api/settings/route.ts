import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import {
  DEFAULT_HOSPITAL_PROFILE,
  DEFAULT_DEPARTMENTS,
  DEFAULT_DOCTORS,
  DEFAULT_USERS,
} from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [profile, departments, doctors, users] = await Promise.all([
      prisma.hospitalProfile.findUnique({ where: { id: "default" } }),
      prisma.department.findMany({ include: { doctors: true } }),
      prisma.doctor.findMany({ include: { department: true, schedules: true } }),
      prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({ profile, departments, doctors, users });
  } catch (error: any) {
    console.warn("Using fallback settings in API:", error);
    return NextResponse.json({
      profile: DEFAULT_HOSPITAL_PROFILE,
      departments: DEFAULT_DEPARTMENTS,
      doctors: DEFAULT_DOCTORS,
      users: DEFAULT_USERS.map(({ id, name, email, role }) => ({
        id,
        name,
        email,
        role,
        active: true,
        createdAt: new Date(),
      })),
    });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Only Admins can update system settings" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = await prisma.hospitalProfile.update({
      where: { id: "default" },
      data: {
        name: body.name,
        tagline: body.tagline,
        phone: body.phone,
        emergencyPhone: body.emergencyPhone,
        email: body.email,
        address: body.address,
        receiptHeader: body.receiptHeader,
        receiptFooter: body.receiptFooter,
        prescriptionHeader: body.prescriptionHeader,
        prescriptionFooter: body.prescriptionFooter,
        maxDiscountApprovalPercent: Number(body.maxDiscountApprovalPercent) || 20,
      },
    });

    await logAudit({
      userId: (session.user as any).id,
      userName: session.user?.name,
      role: "ADMIN",
      action: "SETTINGS_UPDATE",
      entity: "HospitalProfile",
      entityId: "default",
      details: body,
    });

    return NextResponse.json({ profile: updated, message: "Settings updated successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
