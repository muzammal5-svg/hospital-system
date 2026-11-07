import { prisma } from "./prisma";

export async function logAudit(params: {
  userId?: string | null;
  userName?: string | null;
  role?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: any;
  ipAddress?: string | null;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        userName: params.userName || null,
        role: params.role || null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId || null,
        details: typeof params.details === "object" ? JSON.stringify(params.details) : params.details || null,
        ipAddress: params.ipAddress || null,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
