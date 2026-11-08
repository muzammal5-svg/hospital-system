import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_MEDICINES } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";

  try {
    const medicines = await prisma.medicine.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q } },
              { genericName: { contains: q } },
              { category: { contains: q } },
            ],
          }
        : {},
      take: 20,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ medicines: medicines.length > 0 ? medicines : DEFAULT_MEDICINES });
  } catch (error: any) {
    console.warn("Using fallback medicines:", error);
    return NextResponse.json({ medicines: DEFAULT_MEDICINES });
  }
}
