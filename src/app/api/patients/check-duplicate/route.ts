import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cnic = searchParams.get("cnic")?.trim();
  const mobile = searchParams.get("mobile")?.trim();
  const name = searchParams.get("name")?.trim();

  if (!cnic && !mobile && !name) {
    return NextResponse.json({ duplicate: false });
  }

  try {
    const conditions: any[] = [];
    if (cnic && cnic.length >= 5) {
      conditions.push({ cnic: { contains: cnic } });
    }
    if (mobile && mobile.length >= 7) {
      conditions.push({ mobile: { contains: mobile } });
    }
    if (name && name.length >= 3) {
      conditions.push({ fullName: { contains: name } });
    }

    const matches = await prisma.patient.findMany({
      where: { OR: conditions },
      take: 5,
      select: {
        id: true,
        mrNumber: true,
        fullName: true,
        fatherOrHusbandName: true,
        mobile: true,
        cnic: true,
        age: true,
        gender: true,
        city: true,
      },
    });

    return NextResponse.json({
      duplicate: matches.length > 0,
      matches,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
