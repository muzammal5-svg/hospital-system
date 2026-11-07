import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContactSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ submissions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const limitCheck = rateLimit(`contact-${ip}`, 5, 60000);
  if (!limitCheck.success) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const validated = ContactSchema.parse(body);

    if (body.honeypot && body.honeypot.length > 0) {
      return NextResponse.json({ error: "Spam detected." }, { status: 400 });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name: validated.name.trim(),
        email: validated.email.trim().toLowerCase(),
        phone: validated.phone?.trim() || null,
        subject: validated.subject.trim(),
        message: validated.message.trim(),
      },
    });

    return NextResponse.json(
      { submission, message: "Your message has been received. Our team will contact you shortly." },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
