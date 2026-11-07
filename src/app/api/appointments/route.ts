import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AppointmentSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { getNotificationProvider, createAppointmentConfirmationMessage } from "@/lib/sms";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date");
  const departmentId = searchParams.get("departmentId");

  try {
    const where: any = {};
    if (doctorId) where.doctorId = doctorId;
    if (date) where.appointmentDate = date;
    if (departmentId) where.departmentId = departmentId;

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: [{ appointmentDate: "asc" }, { timeSlot: "asc" }],
      include: {
        doctor: { include: { department: true } },
        department: true,
        patient: true,
      },
    });

    return NextResponse.json({ appointments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const rateLimitCheck = rateLimit(`appointment-${ip}`, 10, 60000);
  if (!rateLimitCheck.success) {
    return NextResponse.json(
      { error: "Too many booking requests. Please wait a moment." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const validated = AppointmentSchema.parse(body);

    // Honeypot spam trap
    if (body.honeypot && body.honeypot.length > 0) {
      return NextResponse.json({ error: "Spam detected." }, { status: 400 });
    }

    // Check Double Booking
    const existingSlot = await prisma.appointment.findFirst({
      where: {
        doctorId: validated.doctorId,
        appointmentDate: validated.appointmentDate,
        timeSlot: validated.timeSlot,
        status: { in: ["CONFIRMED", "ATTENDED"] },
      },
    });

    if (existingSlot) {
      return NextResponse.json(
        {
          error: "This time slot has already been booked. Please select another slot.",
        },
        { status: 409 }
      );
    }

    // Generate unique reference number: APT-YYYY-0001
    const currentYear = new Date().getFullYear();
    const totalApts = await prisma.appointment.count();
    const referenceNo = `APT-${currentYear}-${String(totalApts + 1).padStart(4, "0")}`;

    const appointment = await prisma.appointment.create({
      data: {
        referenceNo,
        patientId: validated.patientId || null,
        patientName: validated.patientName.trim(),
        patientMobile: validated.patientMobile.trim(),
        patientCnic: validated.patientCnic?.trim() || null,
        doctorId: validated.doctorId,
        departmentId: validated.departmentId,
        appointmentDate: validated.appointmentDate,
        timeSlot: validated.timeSlot,
        type: validated.type,
        status: "CONFIRMED",
        notes: validated.notes?.trim() || null,
        reminderSent: true,
      },
      include: {
        doctor: { include: { department: true } },
        department: true,
      },
    });

    // Send SMS / WhatsApp notification via pluggable provider
    const hospital = await prisma.hospitalProfile.findUnique({ where: { id: "default" } });
    const sms = getNotificationProvider();
    const message = createAppointmentConfirmationMessage({
      hospitalName: hospital?.name || "Naseem Ijaz Hospital",
      patientName: appointment.patientName,
      doctorName: appointment.doctor.name,
      date: appointment.appointmentDate,
      timeSlot: appointment.timeSlot,
      referenceNo: appointment.referenceNo,
      phone: hospital?.phone || "+92 42 3578 9000",
    });

    // Asynchronously dispatch notification
    sms.send({
      to: appointment.patientMobile,
      message,
      type: "sms",
      bookingReference: appointment.referenceNo,
    }).catch(console.error);

    await logAudit({
      action: "APPOINTMENT_BOOK",
      entity: "Appointment",
      entityId: appointment.id,
      details: {
        referenceNo: appointment.referenceNo,
        doctorName: appointment.doctor.name,
        date: appointment.appointmentDate,
        timeSlot: appointment.timeSlot,
      },
      ipAddress: ip,
    });

    return NextResponse.json(
      {
        appointment,
        message: "Appointment booked successfully. Confirmation SMS sent.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    // Database unique constraint violation catch
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Time slot already reserved. Please pick another slot." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
