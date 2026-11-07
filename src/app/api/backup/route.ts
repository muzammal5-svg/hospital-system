import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Only Admins can trigger backups" }, { status: 403 });
  }

  try {
    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `backup-hospital-${timestamp}.json`;
    const targetPath = path.join(backupDir, filename);

    // Export all major tables as JSON backup snapshot
    const [profile, departments, doctors, patients, visits, appointments, bills] = await Promise.all([
      prisma.hospitalProfile.findMany(),
      prisma.department.findMany(),
      prisma.doctor.findMany(),
      prisma.patient.findMany(),
      prisma.visit.findMany(),
      prisma.appointment.findMany(),
      prisma.bill.findMany({ include: { items: true, refunds: true } }),
    ]);

    const backupData = {
      createdAt: new Date().toISOString(),
      hospital: "Naseem Ijaz Hospital - Lahore",
      version: "1.0.0",
      counts: {
        departments: departments.length,
        doctors: doctors.length,
        patients: patients.length,
        visits: visits.length,
        appointments: appointments.length,
        bills: bills.length,
      },
      data: {
        profile,
        departments,
        doctors,
        patients,
        visits,
        appointments,
        bills,
      },
    };

    fs.writeFileSync(targetPath, JSON.stringify(backupData, null, 2));

    await logAudit({
      userId: (session.user as any).id,
      userName: session.user?.name,
      role: "ADMIN",
      action: "DATABASE_BACKUP",
      entity: "Backup",
      entityId: filename,
      details: backupData.counts,
    });

    return NextResponse.json({
      success: true,
      filename,
      sizeBytes: fs.statSync(targetPath).size,
      counts: backupData.counts,
      message: `Database backup snapshot saved to backups/${filename}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
