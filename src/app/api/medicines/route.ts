import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    return NextResponse.json({ medicines });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
