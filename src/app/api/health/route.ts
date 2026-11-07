import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
  } catch (error: any) {
    dbStatus = `unhealthy: ${error.message}`;
  }

  const isHealthy = dbStatus === "healthy";

  return NextResponse.json(
    {
      status: isHealthy ? "ok" : "degraded",
      service: "Naseem Ijaz Hospital Management System",
      timestamp: new Date().toISOString(),
      city: "Lahore, Pakistan",
      uptime: process.uptime(),
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      durationMs: Date.now() - startTime,
    },
    { status: isHealthy ? 200 : 503 }
  );
}
