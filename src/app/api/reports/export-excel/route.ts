import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [patients, visits, bills] = await Promise.all([
      prisma.patient.findMany({ take: 100, orderBy: { createdAt: "desc" } }),
      prisma.visit.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
        include: { patient: true, doctor: true, department: true },
      }),
      prisma.bill.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
        include: { patient: true, items: true },
      }),
    ]);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Naseem Ijaz Hospital - Lahore";
    workbook.created = new Date();

    // Sheet 1: Patients
    const sheetPatients = workbook.addWorksheet("Patients Registry");
    sheetPatients.columns = [
      { header: "MR Number", key: "mr", width: 18 },
      { header: "Full Name", key: "name", width: 24 },
      { header: "Father/Husband", key: "guardian", width: 22 },
      { header: "Age", key: "age", width: 10 },
      { header: "Gender", key: "gender", width: 12 },
      { header: "Mobile", key: "mobile", width: 18 },
      { header: "CNIC", key: "cnic", width: 20 },
      { header: "City", key: "city", width: 15 },
      { header: "Blood Group", key: "blood", width: 14 },
    ];
    patients.forEach((p) => {
      sheetPatients.addRow({
        mr: p.mrNumber,
        name: p.fullName,
        guardian: p.fatherOrHusbandName || "—",
        age: p.age || "—",
        gender: p.gender,
        mobile: p.mobile,
        cnic: p.cnic || "—",
        city: p.city,
        blood: p.bloodGroup || "—",
      });
    });

    // Sheet 2: Visits
    const sheetVisits = workbook.addWorksheet("OPD Visits & Queue");
    sheetVisits.columns = [
      { header: "Visit #", key: "visitNo", width: 18 },
      { header: "Date", key: "date", width: 14 },
      { header: "Token #", key: "token", width: 10 },
      { header: "Patient Name", key: "patient", width: 22 },
      { header: "Doctor", key: "doctor", width: 22 },
      { header: "Department", key: "dept", width: 20 },
      { header: "Status", key: "status", width: 16 },
      { header: "Priority", key: "priority", width: 14 },
      { header: "Net Fee (PKR)", key: "fee", width: 16 },
    ];
    visits.forEach((v) => {
      sheetVisits.addRow({
        visitNo: v.visitNumber,
        date: v.tokenDate,
        token: v.tokenNumber,
        patient: v.patient.fullName,
        doctor: v.doctor.name,
        dept: v.department.name,
        status: v.status,
        priority: v.priority,
        fee: v.netAmount,
      });
    });

    // Sheet 3: Invoices
    const sheetBills = workbook.addWorksheet("Invoices & Billing");
    sheetBills.columns = [
      { header: "Invoice #", key: "inv", width: 18 },
      { header: "Patient Name", key: "patient", width: 22 },
      { header: "Subtotal (PKR)", key: "subtotal", width: 16 },
      { header: "Discount (PKR)", key: "discount", width: 16 },
      { header: "Total (PKR)", key: "total", width: 16 },
      { header: "Method", key: "method", width: 14 },
      { header: "Status", key: "status", width: 14 },
    ];
    bills.forEach((b) => {
      sheetBills.addRow({
        inv: b.invoiceNo,
        patient: b.patient.fullName,
        subtotal: b.subtotal,
        discount: b.discount,
        total: b.total,
        method: b.paymentMethod,
        status: b.paymentStatus,
      });
    });

    // Style headers
    [sheetPatients, sheetVisits, sheetBills].forEach((sheet) => {
      sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
      sheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0EA5A4" }, // Primary Teal
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=Naseem_Ijaz_Hospital_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
