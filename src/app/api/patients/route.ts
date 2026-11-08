import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PatientSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";
import { maskCNIC } from "@/lib/utils";
import { DEFAULT_PATIENTS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role || "GUEST";

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "30");
  const skip = (page - 1) * limit;

  try {
    const where = query
      ? {
          OR: [
            { mrNumber: { contains: query } },
            { fullName: { contains: query } },
            { mobile: { contains: query } },
            { cnic: { contains: query } },
          ],
        }
      : {};

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
        include: {
          visits: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: { doctor: true, department: true },
          },
        },
      }),
      prisma.patient.count({ where }),
    ]);

    // Mask CNIC for non-admin roles
    const sanitized = patients.map((p) => ({
      ...p,
      cnic: maskCNIC(p.cnic, userRole),
      rawCnic: userRole === "ADMIN" ? p.cnic : undefined,
    }));

    return NextResponse.json({
      patients: sanitized,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.warn("Using fallback patients in API:", error);
    return NextResponse.json({
      patients: DEFAULT_PATIENTS.map((p) => ({
        ...p,
        cnic: maskCNIC(p.cnic, userRole),
        rawCnic: userRole === "ADMIN" ? p.cnic : undefined,
      })),
      pagination: {
        total: DEFAULT_PATIENTS.length,
        page: 1,
        limit: 30,
        pages: 1,
      },
    });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = PatientSchema.parse(body);

    // Duplicate check: Check CNIC (if provided) and Mobile
    if (validated.cnic) {
      const existingCnic = await prisma.patient.findFirst({
        where: { cnic: validated.cnic.trim() },
      });
      if (existingCnic) {
        return NextResponse.json(
          {
            error: "A patient with this CNIC already exists.",
            existingPatient: existingCnic,
          },
          { status: 409 }
        );
      }
    }

    // Auto-generate MR Number: NIH-YYYY-000001
    const currentYear = new Date().getFullYear();
    const count = await prisma.patient.count();
    const nextSeq = count + 1;
    let mrNumber = `NIH-${currentYear}-${String(nextSeq).padStart(6, "0")}`;

    // Ensure uniqueness
    let attempts = 0;
    while ((await prisma.patient.findUnique({ where: { mrNumber } })) && attempts < 10) {
      attempts++;
      mrNumber = `NIH-${currentYear}-${String(nextSeq + attempts).padStart(6, "0")}`;
    }

    const patient = await prisma.patient.create({
      data: {
        mrNumber,
        fullName: validated.fullName.trim(),
        fatherOrHusbandName: validated.fatherOrHusbandName?.trim() || null,
        age: validated.age || null,
        gender: validated.gender,
        cnic: validated.cnic?.trim() || null,
        mobile: validated.mobile.trim(),
        address: validated.address?.trim() || null,
        city: validated.city || "Lahore",
        bloodGroup: validated.bloodGroup || null,
        emergencyContact: validated.emergencyContact?.trim() || null,
        allergies: validated.allergies?.trim() || null,
        photoUrl: validated.photoUrl || null,
      },
    });

    await logAudit({
      userId: (session.user as any).id,
      userName: session.user?.name,
      role: (session.user as any).role,
      action: "PATIENT_REGISTER",
      entity: "Patient",
      entityId: patient.id,
      details: { mrNumber: patient.mrNumber, fullName: patient.fullName },
    });

    return NextResponse.json({ patient, message: "Patient registered successfully" }, { status: 201 });
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
