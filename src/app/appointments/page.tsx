import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import PublicBookingForm from "../PublicBookingForm";
import { DEFAULT_DEPARTMENTS, DEFAULT_DOCTORS } from "@/lib/mock-data";
import { Calendar, ShieldCheck, Clock, MapPin, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: { doctorId?: string };
}) {
  let departments: any[] = DEFAULT_DEPARTMENTS;
  let doctors: any[] = DEFAULT_DOCTORS;

  try {
    const [dbDepts, dbDocs] = await Promise.all([
      prisma.department.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
      prisma.doctor.findMany({ where: { active: true }, include: { department: true }, orderBy: { name: "asc" } }),
    ]);
    if (dbDepts.length > 0) departments = dbDepts;
    if (dbDocs.length > 0) doctors = dbDocs;
  } catch (err) {
    console.warn("Using fallback appointment data:", err);
  }

  return (
    <div className="bg-[#F6F9FC] dark:bg-[#0F1B2A] text-[#1B2733] dark:text-[#E6EEF5] min-h-screen">
      <Navbar />

      <main className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E9E8F] block mb-2 font-heading">
              Online Consultation Booking
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#0B4F8A] dark:text-white">
              Book a Specialist Doctor
            </h1>
            <p className="mt-3 text-sm text-[#5B6B7B] dark:text-[#94A7BA] max-w-xl mx-auto leading-relaxed">
              Select your consultant, date, and preferred time slot. You will receive an immediate SMS confirmation with your booking reference.
            </p>
          </div>

          <div className="hospital-card bg-white dark:bg-[#162638] p-6 sm:p-10 shadow-sm border border-[#E3E9EF] dark:border-[#23374D]">
            <PublicBookingForm departments={departments} doctors={doctors} />
          </div>

          {/* Guidelines */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#5B6B7B] dark:text-[#94A7BA]">
            <div className="hospital-card p-5 bg-white dark:bg-[#162638]">
              <Clock className="w-5 h-5 text-[#0B4F8A] dark:text-[#64B5F6] mb-2.5" />
              <h4 className="font-bold text-[#1B2733] dark:text-white text-sm mb-1 font-heading">
                Arrive 15 Mins Early
              </h4>
              <p className="leading-relaxed">
                Present your booking reference at Reception Desk 1 to check in and receive your consultation token.
              </p>
            </div>

            <div className="hospital-card p-5 bg-white dark:bg-[#162638]">
              <ShieldCheck className="w-5 h-5 text-[#1E9E8F] mb-2.5" />
              <h4 className="font-bold text-[#1B2733] dark:text-white text-sm mb-1 font-heading">
                Pay at Front Desk
              </h4>
              <p className="leading-relaxed">
                Consultation fee is collected upon arrival via Cash, Debit/Credit Card, JazzCash, or Easypaisa.
              </p>
            </div>

            <div className="hospital-card p-5 bg-white dark:bg-[#162638]">
              <MapPin className="w-5 h-5 text-[#0B4F8A] dark:text-[#64B5F6] mb-2.5" />
              <h4 className="font-bold text-[#1B2733] dark:text-white text-sm mb-1 font-heading">
                Jail Road, Lahore
              </h4>
              <p className="leading-relaxed">
                Valet parking and wheelchair assistance are available at the main hospital outpatient entrance.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
