import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import PublicBookingForm from "../PublicBookingForm";
import { Calendar, ShieldCheck, Clock, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: { doctorId?: string };
}) {
  const [departments, doctors] = await Promise.all([
    prisma.department.findMany(),
    prisma.doctor.findMany({ include: { department: true } }),
  ]);

  return (
    <div className="bg-[#050505] text-[#EDE8E0] min-h-screen">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block mb-2">
              Patient Scheduling
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              Book a Specialist Doctor
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-[#9A958C] max-w-xl mx-auto">
              Choose your doctor and preferred date. Our OPD queue engine reserves your slot without double-booking.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 sm:p-10 shadow-2xl">
            <PublicBookingForm departments={departments} doctors={doctors} />
          </div>

          {/* Guidelines */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#9A958C]">
            <div className="p-4 rounded-xl border border-white/5 bg-[#0A0A0A]">
              <Clock className="w-4 h-4 text-teal-400 mb-2" />
              <h4 className="font-bold text-white mb-1">Arrive 15 Mins Early</h4>
              <p>Please present your booking reference at Desk 1 to receive your consultation slip.</p>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-[#0A0A0A]">
              <ShieldCheck className="w-4 h-4 text-teal-400 mb-2" />
              <h4 className="font-bold text-white mb-1">Fee at Reception</h4>
              <p>Consultation fees are collected upon arrival via Cash, Debit/Credit Card, or JazzCash.</p>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-[#0A0A0A]">
              <MapPin className="w-4 h-4 text-teal-400 mb-2" />
              <h4 className="font-bold text-white mb-1">Jail Road, Lahore</h4>
              <p>Complimentary parking and wheelchair assistance available at main reception entrance.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
