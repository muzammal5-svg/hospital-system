import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiInsightCards } from "@/components/AiInsightCards";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Clock,
  Calendar,
  CheckCircle2,
  Users,
  Shield,
  Tv,
  Printer,
  ChevronRight,
  Phone,
  MapPin,
  Sparkles,
  HeartPulse,
  Brain,
  Bone,
  Stethoscope,
  Eye,
  Ear,
  Baby,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";
import PublicBookingForm from "./PublicBookingForm";
import PublicContactForm from "./PublicContactForm";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [departments, doctors, profile] = await Promise.all([
    prisma.department.findMany({ take: 10 }),
    prisma.doctor.findMany({ include: { department: true }, take: 8 }),
    prisma.hospitalProfile.findUnique({ where: { id: "default" } }),
  ]);

  return (
    <div className="bg-[#050505] text-[#EDE8E0] min-h-screen selection:bg-teal-500 selection:text-black">
      {/* 1. Sticky Navbar */}
      <Navbar />

      <main>
        {/* 2. Hero Section */}
        <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden bg-gradient-to-b from-[#0c2738]/40 via-[#07161f] to-[#050505]">
          {/* Subtle glow / grid ambient background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,164,0.18)_0%,transparent_60%)] pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-teal-500/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-bold tracking-wider uppercase mb-8 shadow-glow-teal animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>AI-Enhanced Reception & OPD Patient Suite</span>
            </div>

            {/* Giant Headings */}
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] text-white max-w-5xl mx-auto">
              Smarter care starts <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-200 to-white">
                at the front desk.
              </span>
            </h1>

            {/* Subtext */}
            <p className="mt-8 text-base sm:text-xl text-[#9A958C] max-w-3xl mx-auto leading-relaxed">
              Naseem Ijaz Hospital’s complete digital reception and outpatient platform. 30-second patient intake, real-time doctor queues, TV waiting displays, and A4 letterhead prescriptions.
            </p>

            {/* Hero CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/appointments"
                className="btn-pill bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-sm tracking-wider uppercase shadow-glow-teal gap-3 hover:scale-105 transition-all w-full sm:w-auto"
              >
                <span>Book Doctor Appointment</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>

              <Link
                href="/login"
                className="btn-pill bg-[#EDE8E0] hover:bg-white text-black font-extrabold text-sm tracking-wider uppercase gap-2 hover:shadow-glow-bone transition-all w-full sm:w-auto"
              >
                <Shield className="w-4 h-4" />
                <span>Staff Portal / Live Demo</span>
              </Link>
            </div>

            {/* Mini Trust Metrics Bar */}
            <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
              <div>
                <span className="text-2xl font-bold font-display text-white block">30 Sec</span>
                <span className="text-xs text-[#9A958C]">Avg. Patient Registration</span>
              </div>
              <div>
                <span className="text-2xl font-bold font-display text-white block">100% Real-time</span>
                <span className="text-xs text-[#9A958C]">SSE Live TV Queue Stream</span>
              </div>
              <div>
                <span className="text-2xl font-bold font-display text-white block">80mm & A4</span>
                <span className="text-xs text-[#9A958C]">Thermal Slip & Rx Printing</span>
              </div>
              <div>
                <span className="text-2xl font-bold font-display text-white block">English + اردو</span>
                <span className="text-xs text-[#9A958C]">Complete Bilingual Mode</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. "The Product" Strip (Interactive Mockup Preview) */}
        <section id="features" className="py-20 border-t border-white/10 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block mb-2">
                The Product
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                An unified cockpit for reception, doctors, and cashiers
              </h2>
            </div>

            {/* Real App UI Preview Mockup */}
            <div className="relative rounded-2xl border border-white/15 bg-[#0B0F14] p-3 sm:p-5 shadow-2xl overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs text-[#9A958C]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-white/70">
                    naseem-ijaz-hospital.pk/dashboard/reception
                  </span>
                </div>
                <div className="flex items-center gap-3 font-semibold text-teal-400">
                  <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span>OPD Queue Live</span>
                </div>
              </div>

              {/* Dashboard Grid Simulation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Reception Intake Column */}
                <div className="rounded-xl border border-white/10 bg-[#11171E] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Patient Registration</span>
                    <span className="text-[10px] font-mono text-teal-400">[F2 Shortcut]</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[10px] text-neutral-400 block">MR Number</span>
                      <span className="font-mono font-bold text-teal-300">NIH-2026-000042</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[10px] text-neutral-400 block">Patient CNIC Check</span>
                      <span className="font-mono text-white">35201-1234567-1 ✓ Verified</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[10px] text-neutral-400 block">Assigned Doctor</span>
                      <span className="font-semibold text-white">Dr. Tariq Mahmood (Cardiology)</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="btn-pill w-full bg-teal-500 text-black text-center text-xs font-bold">
                      Print 80mm Token Slip
                    </div>
                  </div>
                </div>

                {/* Live Board Column */}
                <div className="rounded-xl border border-white/10 bg-[#11171E] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">OPD Live Queue Board</span>
                    <span className="text-[10px] text-teal-400 font-semibold">4 Doctors Online</span>
                  </div>
                  <div className="space-y-2 font-mono">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-teal-950/40 border border-teal-500/30">
                      <div>
                        <span className="font-bold text-teal-300">TOKEN #04</span>
                        <span className="text-[10px] text-neutral-400 block">Muhammad Ali Khan</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400 font-bold uppercase">
                        In Room 101
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                      <div>
                        <span className="font-bold text-white">TOKEN #05</span>
                        <span className="text-[10px] text-neutral-400 block">Fatima Bibi</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 font-bold uppercase">
                        Next in Line
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-red-950/30 border border-red-500/30">
                      <div>
                        <span className="font-bold text-red-400">TOKEN #06</span>
                        <span className="text-[10px] text-neutral-400 block">Zubair Ahmed</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-red-500 text-white font-bold uppercase animate-pulse">
                        EMERGENCY
                      </span>
                    </div>
                  </div>
                </div>

                {/* Consultation & Rx Column */}
                <div className="rounded-xl border border-white/10 bg-[#11171E] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Doctor Consultation</span>
                    <span className="text-[10px] text-neutral-400">Dr. Tariq Mahmood</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] text-neutral-400 block">Diagnosis</span>
                    <span className="font-semibold text-white">Essential Hypertension & Angina</span>
                    <div className="pt-2 flex flex-wrap gap-1">
                      <span className="px-1.5 py-0.5 bg-neutral-800 rounded text-[10px] text-neutral-300">Panadol 500mg</span>
                      <span className="px-1.5 py-0.5 bg-neutral-800 rounded text-[10px] text-neutral-300">Norvasc 5mg</span>
                      <span className="px-1.5 py-0.5 bg-neutral-800 rounded text-[10px] text-neutral-300">Risek 40mg</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="btn-pill w-full bg-[#EDE8E0] text-black text-center text-xs font-bold">
                      Print A4 Letterhead Rx
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. "The Pain" Section with 3 Stat Blocks */}
        <section id="the-pain" className="py-24 border-t border-white/10 bg-[#070b0e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-red-400 block mb-3">
                  The Pain
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                  Traditional hospital reception quietly burns patient trust
                </h2>
                <p className="mt-6 text-base text-[#9A958C] leading-relaxed">
                  Scattered paper notebooks, unorganized walk-ins crowding doctor doorways, and zero live communication between reception and consultants result in chaotic patient waiting rooms.
                </p>
              </div>

              {/* 3 Giant Metric Stat Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 text-center">
                  <span className="font-display font-black text-4xl sm:text-5xl text-red-400 block mb-2">
                    30+ min
                  </span>
                  <span className="text-xs text-[#9A958C] leading-snug block">
                    Average manual registration and handwritten paper slip wait
                  </span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 text-center">
                  <span className="font-display font-black text-4xl sm:text-5xl text-amber-400 block mb-2">
                    5+
                  </span>
                  <span className="text-xs text-[#9A958C] leading-snug block">
                    Disconnected paper registers and receipts handled per patient
                  </span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 text-center">
                  <span className="font-display font-black text-4xl sm:text-5xl text-teal-400 block mb-2">
                    0
                  </span>
                  <span className="text-xs text-[#9A958C] leading-snug block">
                    Real-time visibility into doctor queues and daily cash closing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. "The Shift" Numbered 01 / 02 / 03 Cards */}
        <section id="the-shift" className="py-24 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block mb-3">
                The Shift
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                From reception chaos to high-speed digital clinical operations
              </h2>
              <p className="mt-4 text-[#9A958C] text-base">
                Engineered specifically for Pakistani hospitals with CNIC validation, multi-lingual support, and instant thermal printing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 01 */}
              <div className="relative rounded-2xl border border-white/10 bg-[#0A0A0A] p-8 hover:border-teal-500/40 transition-all group">
                <span className="font-display font-black text-5xl text-teal-500/30 group-hover:text-teal-400/80 transition-colors block mb-4">
                  01
                </span>
                <h3 className="font-display font-bold text-xl text-white mb-3">
                  Fast Patient Entry in 30 Seconds
                </h3>
                <p className="text-xs text-[#9A958C] leading-relaxed">
                  Keyboard-first intake with F2/F4 shortcuts. Automatic Pakistani CNIC and mobile verification, duplicate warning with one-click existing patient lookup, and auto NIH-MR number.
                </p>
              </div>

              {/* Card 02 */}
              <div className="relative rounded-2xl border border-white/10 bg-[#0A0A0A] p-8 hover:border-blue-500/40 transition-all group">
                <span className="font-display font-black text-5xl text-blue-500/30 group-hover:text-blue-400/80 transition-colors block mb-4">
                  02
                </span>
                <h3 className="font-display font-bold text-xl text-white mb-3">
                  Live Queue & Full-Screen TV Display
                </h3>
                <p className="text-xs text-[#9A958C] leading-relaxed">
                  Doctor calls next patient with one click. Instant Server-Sent Events update the waiting room TV screen (/display) with audio chime callouts, token numbers, and doctor room directions.
                </p>
              </div>

              {/* Card 03 */}
              <div className="relative rounded-2xl border border-white/10 bg-[#0A0A0A] p-8 hover:border-teal-500/40 transition-all group">
                <span className="font-display font-black text-5xl text-teal-500/30 group-hover:text-teal-400/80 transition-colors block mb-4">
                  03
                </span>
                <h3 className="font-display font-bold text-xl text-white mb-3">
                  Online Booking & SMS Reminders
                </h3>
                <p className="text-xs text-[#9A958C] leading-relaxed">
                  Self-serve appointment booking with doctor schedule availability, rate limiting, honeypot spam protection, and instant SMS/WhatsApp confirmation dispatched to the patient.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. AI Operational Insight Cards */}
        <section className="py-20 border-t border-white/10 bg-[#070b0e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block mb-2">
                  Operational Intelligence
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  Rule-based AI OPD Insights
                </h2>
                <p className="mt-2 text-xs text-[#9A958C]">
                  Live clinical data transformed into immediate recommendations to optimize lobby wait times.
                </p>
              </div>
              <Link
                href="/login"
                className="mt-4 md:mt-0 text-xs font-semibold text-teal-400 hover:text-teal-300 inline-flex items-center gap-1.5"
              >
                <span>View Full Admin Analytics Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <AiInsightCards isDarkTheme={true} />
          </div>
        </section>

        {/* 7. Clinical Departments Grid */}
        <section id="departments" className="py-24 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block mb-2">
                Specialized Services
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                Center of Clinical Excellence
              </h2>
              <p className="mt-3 text-xs text-[#9A958C]">
                10 specialized OPD departments equipped with senior consultants, diagnostic pathology, and radiology.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5 hover:border-teal-500/50 hover:bg-[#11171E] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {dept.code === "CARD" ? (
                      <HeartPulse className="w-5 h-5" />
                    ) : dept.code === "ORTH" ? (
                      <Bone className="w-5 h-5" />
                    ) : dept.code === "NEUR" ? (
                      <Brain className="w-5 h-5" />
                    ) : dept.code === "PED" ? (
                      <Baby className="w-5 h-5" />
                    ) : dept.code === "OPHT" ? (
                      <Eye className="w-5 h-5" />
                    ) : dept.code === "ENT" ? (
                      <Ear className="w-5 h-5" />
                    ) : (
                      <Stethoscope className="w-5 h-5" />
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white">{dept.name}</h4>
                  {dept.nameUrdu && (
                    <span className="text-[11px] text-teal-400/80 font-urdu block mb-2">
                      {dept.nameUrdu}
                    </span>
                  )}
                  <p className="text-[11px] text-[#9A958C] line-clamp-2 leading-relaxed">
                    {dept.description || "Comprehensive outpatient evaluation and expert care."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Doctors Grid */}
        <section id="doctors" className="py-24 border-t border-white/10 bg-[#070b0e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block mb-2">
                  Medical Specialists
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  Consultant Physicians & Surgeons
                </h2>
                <p className="mt-2 text-xs text-[#9A958C]">
                  Book appointments with Lahore’s most experienced medical faculty.
                </p>
              </div>
              <Link
                href="/appointments"
                className="btn-pill bg-teal-500 hover:bg-teal-400 text-black text-xs font-bold tracking-wider uppercase mt-4 md:mt-0"
              >
                Schedule Appointment Online
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 hover:border-teal-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Placeholder doctor avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500/30 to-blue-500/30 flex items-center justify-center text-teal-300 font-bold text-lg mb-4">
                      {doc.name.replace("Dr. ", "").charAt(0)}
                    </div>
                    <h3 className="font-bold text-base text-white">{doc.name}</h3>
                    {doc.nameUrdu && (
                      <span className="text-xs text-teal-400 font-urdu block">
                        {doc.nameUrdu}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-teal-400 block mt-1">
                      {doc.specialty}
                    </span>
                    <span className="text-[11px] text-[#9A958C] block mt-0.5">
                      {doc.qualification}
                    </span>

                    <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5 text-xs text-[#9A958C]">
                      <div className="flex justify-between">
                        <span>Room:</span>
                        <span className="text-white font-semibold">{doc.roomNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>OPD Fee:</span>
                        <span className="text-teal-300 font-bold">{formatPKR(doc.fee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timings:</span>
                        <span className="text-neutral-300">09:00 AM - 03:00 PM</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <Link
                      href={`/appointments?doctorId=${doc.id}`}
                      className="btn-pill w-full bg-white/10 hover:bg-teal-500 hover:text-black text-white text-center text-xs font-bold transition-all"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Interactive Online Appointment Booking Form */}
        <section id="book" className="py-24 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block mb-2">
                Online Patient Portal
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                Book Your Doctor Consultation
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-[#9A958C]">
                Select your department, doctor, and convenient time slot. Receive an instant SMS confirmation.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 sm:p-8 shadow-2xl">
              <PublicBookingForm
                departments={departments}
                doctors={doctors}
              />
            </div>
          </div>
        </section>

        {/* 10. Contact Section */}
        <section id="contact" className="py-24 border-t border-white/10 bg-[#070b0e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block mb-2">
                  Get In Touch
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  Hospital Information & Emergency Helpline
                </h2>
                <p className="mt-4 text-xs sm:text-sm text-[#9A958C] leading-relaxed">
                  Located in the heart of Lahore, Naseem Ijaz Hospital offers compassionate care with 24/7 emergency response, modular operation theaters, and an advanced ICU.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-[#0A0A0A]">
                    <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-white block">Main Campus Address</span>
                      <span className="text-xs text-[#9A958C]">
                        {profile?.address || "Plot 14-B, Medical Enclave, Jail Road, Lahore, Pakistan"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-[#0A0A0A]">
                    <Phone className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-white block">UAN Helpline</span>
                      <span className="text-xs text-[#9A958C]">
                        {profile?.phone || "+92 42 3578 9000"} (Available 24/7)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20 bg-red-950/20">
                    <HeartPulse className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-red-300 block">Emergency & Ambulance Direct</span>
                      <span className="text-xs text-red-200">
                        {profile?.emergencyPhone || "+92 42 3578 9999"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form Component */}
              <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 sm:p-8">
                <h3 className="font-bold text-lg text-white mb-2">Send us an Inquiry</h3>
                <p className="text-xs text-[#9A958C] mb-6">
                  Fill out the form below. Your query will be delivered directly to the administration inbox.
                </p>
                <PublicContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 11. Footer */}
      <Footer />
    </div>
  );
}
