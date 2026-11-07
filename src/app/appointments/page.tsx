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
    <div className="bg-[#050505] text-[#EDE8E0] min-h-screen selection:bg-teal-500 selection:text-black">
      <Navbar />

      <main className="relative pt-40 pb-32 overflow-hidden bg-gradient-to-b from-[#07161f] via-[#05090e] to-[#050505]">
        {/* Ambient Glow Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,164,0.18)_0%,transparent_65%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block mb-3">
              Patient Scheduling Portal
            </span>
            <h1 className="section-headline text-white tracking-tight">
              Book a Specialist Doctor
            </h1>
            <p className="mt-4 text-sm sm:text-base text-[#9A958C] max-w-xl mx-auto">
              Choose your doctor and preferred date. Our OPD queue engine reserves your slot with zero double-booking and dispatches an instant SMS confirmation.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D12] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <PublicBookingForm departments={departments} doctors={doctors} />
          </div>

          {/* Guidelines */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#9A958C]">
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0A0D12]">
              <Clock className="w-5 h-5 text-teal-400 mb-3" />
              <h4 className="font-bold text-white text-sm mb-1.5">Arrive 15 Mins Early</h4>
              <p className="leading-relaxed">Present your booking reference code at Reception Desk 1 to receive your 80mm consultation token slip.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0A0D12]">
              <ShieldCheck className="w-5 h-5 text-teal-400 mb-3" />
              <h4 className="font-bold text-white text-sm mb-1.5">Pay at Front Desk</h4>
              <p className="leading-relaxed">Consultation fee is collected upon arrival via Cash, Credit/Debit Card, JazzCash, or Easypaisa.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0A0D12]">
              <MapPin className="w-5 h-5 text-teal-400 mb-3" />
              <h4 className="font-bold text-white text-sm mb-1.5">Jail Road, Lahore</h4>
              <p className="leading-relaxed">Complimentary valet parking and wheelchair assistance available at the main outpatient entrance.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
