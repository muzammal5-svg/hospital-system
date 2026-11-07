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
        <section className="relative min-h-[92vh] flex items-center justify-center pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-b from-[#07161f] via-[#05090e] to-[#050505]">
          {/* Subtle glow / grid ambient background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,164,0.22)_0%,rgba(7,22,31,0.5)_45%,transparent_75%)] pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-teal-500/12 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-bold tracking-widest uppercase mb-8 shadow-glow-teal animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>Next-Generation Hospital Reception & OPD System</span>
            </div>

            {/* Giant Fluid Hero Heading */}
            <h1 className="hero-headline text-white max-w-5xl mx-auto">
              Smarter care starts <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-200 to-[#EDE8E0]">
                at the front desk.
              </span>
            </h1>

            {/* Subtext */}
            <p className="mt-8 text-base sm:text-xl text-[#9A958C] max-w-3xl mx-auto leading-relaxed font-sans font-normal">
              Naseem Ijaz Hospital’s complete outpatient operations suite. 30-second patient intake, real-time live doctor queues, waiting room TV displays, and automated thermal receipts.
            </p>

            {/* Hero CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/appointments"
                className="btn-pill bg-teal-500 hover:bg-teal-400 text-black shadow-glow-teal gap-3 hover:scale-105 transition-all w-full sm:w-auto"
              >
                <span>Book Doctor Appointment</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                href="/login"
                className="btn-pill bg-[#EDE8E0] hover:bg-white text-black gap-2 hover:shadow-glow-bone transition-all w-full sm:w-auto"
              >
                <Shield className="w-4 h-4" />
                <span>Staff Portal / Live Demo</span>
              </Link>
            </div>

            {/* Mini Trust Metrics Bar */}
            <div className="mt-20 pt-8 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-2xl sm:text-3xl font-extrabold font-display text-white block">30 Sec</span>
                <span className="text-xs text-[#9A958C]">Avg. Patient Registration</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-2xl sm:text-3xl font-extrabold font-display text-white block">100% Real-time</span>
                <span className="text-xs text-[#9A958C]">SSE Live TV Queue Stream</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-2xl sm:text-3xl font-extrabold font-display text-white block">80mm & A4</span>
                <span className="text-xs text-[#9A958C]">Thermal Slip & Rx Letterhead</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-2xl sm:text-3xl font-extrabold font-display text-white block">English + اردو</span>
                <span className="text-xs text-[#9A958C]">Full Bilingual RTL Mode</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. "The Product" Strip (Interactive Mockup Preview) */}
        <section id="features" className="py-28 md:py-36 border-t border-white/[0.08] relative bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block mb-3">
                The Product
              </span>
              <h2 className="section-headline text-white tracking-tight">
                An unified cockpit for reception, doctors, and cashiers
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#9A958C]">
                Designed specifically for high-volume Pakistani hospital workflows with keyboard shortcuts, rapid patient search, and instant doctor room routing.
              </p>
            </div>

            {/* Real App UI Preview Mockup in Dark Browser Frame */}
            <div className="relative rounded-2xl border border-white/[0.12] bg-[#0B0F14] p-4 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08] text-xs text-[#9A958C]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 font-mono text-[11px] text-white/70 bg-white/[0.05] px-3 py-1 rounded-full border border-white/[0.06]">
                    https://naseem-ijaz-hospital.pk/dashboard/reception
                  </span>
                </div>
                <div className="flex items-center gap-3 font-semibold text-teal-400">
                  <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-[11px] uppercase tracking-wider">SSE Active • OPD Live</span>
                </div>
              </div>

              {/* Dashboard Grid Simulation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                {/* Reception Intake Column */}
                <div className="rounded-xl border border-white/[0.08] bg-[#0E131A] p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <span className="font-bold text-white text-sm">Patient Registration</span>
                    <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">[F2 Shortcut]</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-lg bg-black/50 border border-white/[0.06]">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-0.5">Assigned MR Number</span>
                      <span className="font-mono font-bold text-teal-300 text-sm">NIH-2026-000042</span>
                    </div>
                    <div className="p-3 rounded-lg bg-black/50 border border-white/[0.06]">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-0.5">Pakistani CNIC Validation</span>
                      <span className="font-mono text-white text-xs">35201-1234567-1 <span className="text-emerald-400 font-bold">✓ Verified</span></span>
                    </div>
                    <div className="p-3 rounded-lg bg-black/50 border border-white/[0.06]">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-0.5">Assigned OPD Specialist</span>
                      <span className="font-semibold text-white text-xs">Dr. Tariq Mahmood (Cardiology • Room 101)</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="btn-pill w-full bg-teal-500 text-black text-center text-xs font-bold shadow-glow-teal">
                      Print 80mm Token Slip
                    </div>
                  </div>
                </div>

                {/* Live Board Column */}
                <div className="rounded-xl border border-white/[0.08] bg-[#0E131A] p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <span className="font-bold text-white text-sm">OPD Live Queue Board</span>
                    <span className="text-[10px] text-teal-400 font-semibold bg-teal-500/10 px-2 py-0.5 rounded">4 Doctors Active</span>
                  </div>
                  <div className="space-y-2.5 font-mono">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-teal-950/40 border border-teal-500/30 shadow-glow-teal">
                      <div>
                        <span className="font-bold text-teal-300 text-sm">TOKEN #04</span>
                        <span className="text-[11px] text-neutral-300 block font-sans">Muhammad Ali Khan</span>
                      </div>
                      <span className="px-2.5 py-1 rounded text-[10px] bg-blue-500/20 text-blue-400 font-bold uppercase tracking-wider border border-blue-500/30">
                        In Room 101
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-white/[0.06]">
                      <div>
                        <span className="font-bold text-white text-sm">TOKEN #05</span>
                        <span className="text-[11px] text-neutral-400 block font-sans">Fatima Bibi</span>
                      </div>
                      <span className="px-2.5 py-1 rounded text-[10px] bg-amber-500/20 text-amber-400 font-bold uppercase tracking-wider border border-amber-500/30">
                        Next in Line
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-red-950/30 border border-red-500/30 animate-pulse">
                      <div>
                        <span className="font-bold text-red-400 text-sm">TOKEN #06</span>
                        <span className="text-[11px] text-neutral-400 block font-sans">Zubair Ahmed</span>
                      </div>
                      <span className="px-2.5 py-1 rounded text-[10px] bg-red-500 text-white font-bold uppercase tracking-wider">
                        EMERGENCY
                      </span>
                    </div>
                  </div>
                </div>

                {/* Consultation & Rx Column */}
                <div className="rounded-xl border border-white/[0.08] bg-[#0E131A] p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <span className="font-bold text-white text-sm">Doctor Consultation</span>
                    <span className="text-[10px] text-neutral-400">Dr. Tariq Mahmood</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-black/50 border border-white/[0.06] space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Clinical Diagnosis</span>
                    <span className="font-semibold text-white text-xs block">Essential Hypertension & Angina Pectoris</span>
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-white/[0.08] rounded text-[10px] text-neutral-200">Panadol 500mg (1-1-1)</span>
                      <span className="px-2 py-0.5 bg-white/[0.08] rounded text-[10px] text-neutral-200">Norvasc 5mg (0-1-0)</span>
                      <span className="px-2 py-0.5 bg-white/[0.08] rounded text-[10px] text-neutral-200">Risek 40mg (1-0-0)</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="btn-pill w-full bg-[#EDE8E0] hover:bg-white text-black text-center text-xs font-bold transition-all">
                      Print A4 Letterhead Rx
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. "The Pain" Section with 3 Stat Blocks */}
        <section id="the-pain" className="py-28 md:py-36 border-t border-white/[0.08] bg-[#06090D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-red-400 block mb-3">
                  The Problem
                </span>
                <h2 className="section-headline text-white tracking-tight leading-tight">
                  Traditional hospital reception quietly burns patient trust
                </h2>
                <p className="mt-6 text-base text-[#9A958C] leading-relaxed">
                  Scattered paper notebooks, unorganized walk-ins crowding doctor doorways, and zero live communication between reception and consultants result in chaotic patient waiting rooms.
                </p>
                <div className="mt-8 flex items-center gap-6 text-xs font-semibold text-neutral-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Eliminates Paper Token Books</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Zero Walk-in Bottlenecks</span>
                  </div>
                </div>
              </div>

              {/* 3 Giant Metric Stat Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D12] p-8 text-center hover:border-red-500/40 transition-colors">
                  <span className="font-display font-black text-5xl md:text-6xl text-red-400 block mb-3">
                    30+<span className="text-xl font-medium text-red-300 ml-1">m</span>
                  </span>
                  <span className="text-xs text-[#9A958C] leading-snug block font-medium">
                    Average manual registration and handwritten paper slip wait
                  </span>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D12] p-8 text-center hover:border-amber-500/40 transition-colors">
                  <span className="font-display font-black text-5xl md:text-6xl text-amber-400 block mb-3">
                    5+
                  </span>
                  <span className="text-xs text-[#9A958C] leading-snug block font-medium">
                    Disconnected paper registers and manual receipts per patient
                  </span>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D12] p-8 text-center hover:border-teal-500/40 transition-colors">
                  <span className="font-display font-black text-5xl md:text-6xl text-teal-400 block mb-3">
                    0
                  </span>
                  <span className="text-xs text-[#9A958C] leading-snug block font-medium">
                    Real-time visibility into doctor queues and daily cash closing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. "The Shift" Numbered 01 / 02 / 03 Cards */}
        <section id="the-shift" className="py-28 md:py-36 border-t border-white/[0.08] bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block mb-3">
                The Shift
              </span>
              <h2 className="section-headline text-white tracking-tight">
                From reception chaos to high-speed digital clinical operations
              </h2>
              <p className="mt-4 text-[#9A958C] text-sm sm:text-base">
                Engineered specifically for Pakistani hospitals with CNIC validation, multi-lingual support, and instant thermal printing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 01 */}
              <div className="relative rounded-2xl border border-white/[0.08] bg-[#0A0D12] p-8 md:p-10 hover:border-teal-500/40 transition-all group flex flex-col justify-between">
                <div>
                  <span className="font-display font-black text-6xl text-teal-500/20 group-hover:text-teal-400/80 transition-colors block mb-6">
                    01
                  </span>
                  <h3 className="font-display font-bold text-xl text-white mb-3">
                    Fast Patient Entry in 30 Seconds
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9A958C] leading-relaxed">
                    Keyboard-first intake with F2/F4 shortcuts. Automatic Pakistani CNIC and mobile verification, duplicate warning with one-click existing patient lookup, and auto NIH-MR number.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs font-semibold text-teal-400">
                  <span>Instant Thermal Token</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 02 */}
              <div className="relative rounded-2xl border border-white/[0.08] bg-[#0A0D12] p-8 md:p-10 hover:border-blue-500/40 transition-all group flex flex-col justify-between">
                <div>
                  <span className="font-display font-black text-6xl text-blue-500/20 group-hover:text-blue-400/80 transition-colors block mb-6">
                    02
                  </span>
                  <h3 className="font-display font-bold text-xl text-white mb-3">
                    Live Queue & Full-Screen TV Display
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9A958C] leading-relaxed">
                    Doctor calls next patient with one click. Instant Server-Sent Events update the waiting room TV screen (/display) with audio chime callouts, token numbers, and doctor room directions.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs font-semibold text-blue-400">
                  <span>Sub-second SSE Sync</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 03 */}
              <div className="relative rounded-2xl border border-white/[0.08] bg-[#0A0D12] p-8 md:p-10 hover:border-teal-500/40 transition-all group flex flex-col justify-between">
                <div>
                  <span className="font-display font-black text-6xl text-teal-500/20 group-hover:text-teal-400/80 transition-colors block mb-6">
                    03
                  </span>
                  <h3 className="font-display font-bold text-xl text-white mb-3">
                    Online Booking & SMS Reminders
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9A958C] leading-relaxed">
                    Self-serve appointment booking with doctor schedule availability, rate limiting, honeypot spam protection, and instant SMS/WhatsApp confirmation dispatched to the patient.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs font-semibold text-teal-400">
                  <span>Automated WhatsApp / SMS</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. AI Operational Insight Cards */}
        <section className="py-28 md:py-36 border-t border-white/[0.08] bg-[#06090D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block mb-3">
                  Operational Intelligence
                </span>
                <h2 className="section-headline text-white tracking-tight">
                  Rule-based AI OPD Insights
                </h2>
                <p className="mt-3 text-sm text-[#9A958C] max-w-xl">
                  Live clinical operations data transformed into instant actionable recommendations to balance lobby wait times and consultant load.
                </p>
              </div>
              <Link
                href="/login"
                className="mt-6 md:mt-0 text-xs font-bold uppercase tracking-wider text-teal-400 hover:text-teal-300 inline-flex items-center gap-2 group"
              >
                <span>View Full Admin Analytics Console</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <AiInsightCards isDarkTheme={true} />
          </div>
        </section>

        {/* 7. Clinical Departments Grid */}
        <section id="departments" className="py-28 md:py-36 border-t border-white/[0.08] bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block mb-3">
                Specialized Services
              </span>
              <h2 className="section-headline text-white tracking-tight">
                Center of Clinical Excellence
              </h2>
              <p className="mt-3 text-sm text-[#9A958C]">
                10 specialized OPD departments equipped with senior faculty, diagnostic pathology, and modern clinical facilities in Lahore.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="rounded-2xl border border-white/[0.08] bg-[#0A0D12] p-6 hover:border-teal-500/50 hover:bg-[#0E141C] transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-black transition-all">
                      {dept.code === "CARD" ? (
                        <HeartPulse className="w-6 h-6" />
                      ) : dept.code === "ORTH" ? (
                        <Bone className="w-6 h-6" />
                      ) : dept.code === "NEUR" ? (
                        <Brain className="w-6 h-6" />
                      ) : dept.code === "PED" ? (
                        <Baby className="w-6 h-6" />
                      ) : dept.code === "OPHT" ? (
                        <Eye className="w-6 h-6" />
                      ) : dept.code === "ENT" ? (
                        <Ear className="w-6 h-6" />
                      ) : (
                        <Stethoscope className="w-6 h-6" />
                      )}
                    </div>
                    <h4 className="font-bold text-base text-white group-hover:text-teal-300 transition-colors">{dept.name}</h4>
                    {dept.nameUrdu && (
                      <span className="text-xs text-teal-400/80 font-urdu block mb-2">
                        {dept.nameUrdu}
                      </span>
                    )}
                    <p className="text-xs text-[#9A958C] line-clamp-2 leading-relaxed">
                      {dept.description || "Comprehensive outpatient evaluation and expert care."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Doctors Grid */}
        <section id="doctors" className="py-28 md:py-36 border-t border-white/[0.08] bg-[#06090D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block mb-3">
                  Medical Specialists
                </span>
                <h2 className="section-headline text-white tracking-tight">
                  Consultant Physicians & Surgeons
                </h2>
                <p className="mt-3 text-sm text-[#9A958C]">
                  Book consultation appointments with Lahore’s most senior medical faculty.
                </p>
              </div>
              <Link
                href="/appointments"
                className="btn-pill bg-teal-500 hover:bg-teal-400 text-black text-xs font-bold tracking-wider uppercase mt-6 md:mt-0 shadow-glow-teal"
              >
                Schedule Appointment Online
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-white/[0.08] bg-[#0A0D12] p-6 hover:border-teal-500/40 hover:bg-[#0E141C] transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Doctor avatar initials with gradient ring */}
                    <div className="w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-teal-400 via-teal-600 to-blue-500 mb-5 group-hover:scale-105 transition-transform">
                      <div className="w-full h-full rounded-[14px] bg-[#0B0F14] flex items-center justify-center text-teal-300 font-display font-extrabold text-xl">
                        {doc.name.replace("Dr. ", "").charAt(0)}
                      </div>
                    </div>

                    <h3 className="font-bold text-lg text-white group-hover:text-teal-300 transition-colors">{doc.name}</h3>
                    {doc.nameUrdu && (
                      <span className="text-xs text-teal-400 font-urdu block mb-1">
                        {doc.nameUrdu}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-teal-400 block">
                      {doc.specialty}
                    </span>
                    <span className="text-[11px] text-[#9A958C] block mt-1">
                      {doc.qualification}
                    </span>

                    <div className="mt-5 pt-4 border-t border-white/[0.06] space-y-2 text-xs text-[#9A958C]">
                      <div className="flex justify-between">
                        <span>OPD Room:</span>
                        <span className="text-white font-semibold">{doc.roomNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Consultation Fee:</span>
                        <span className="text-teal-300 font-bold">{formatPKR(doc.fee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Clinic Hours:</span>
                        <span className="text-neutral-300">09:00 AM - 03:00 PM</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.06]">
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
        <section id="book" className="py-28 md:py-36 border-t border-white/[0.08] bg-[#050505]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block mb-3">
                Online Patient Portal
              </span>
              <h2 className="section-headline text-white tracking-tight">
                Book Your Doctor Consultation
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#9A958C]">
                Select your department, doctor, and preferred appointment slot. Receive instant SMS confirmation.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D12] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <PublicBookingForm
                departments={departments}
                doctors={doctors}
              />
            </div>
          </div>
        </section>

        {/* 10. Contact Section */}
        <section id="contact" className="py-28 md:py-36 border-t border-white/[0.08] bg-[#06090D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block mb-3">
                  Get In Touch
                </span>
                <h2 className="section-headline text-white tracking-tight leading-tight">
                  Hospital Information & 24/7 Emergency Helpline
                </h2>
                <p className="mt-6 text-sm sm:text-base text-[#9A958C] leading-relaxed">
                  Located in Lahore, Pakistan, Naseem Ijaz Hospital offers compassionate outpatient and inpatient care with 24/7 trauma response, modular operation theaters, and an advanced cardiac ICU.
                </p>

                <div className="mt-10 space-y-4">
                  <div className="flex items-start gap-4 p-5 rounded-xl border border-white/[0.08] bg-[#0A0D12]">
                    <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-white block">Main Medical Campus</span>
                      <span className="text-xs text-[#9A958C] mt-1 block">
                        {profile?.address || "Plot 14-B, Medical Enclave, Jail Road, Lahore, Pakistan"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-xl border border-white/[0.08] bg-[#0A0D12]">
                    <Phone className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-white block">OPD Appointments Helpline</span>
                      <span className="text-xs text-[#9A958C] mt-1 block font-mono">
                        {profile?.phone || "+92 42 3578 9000"} (08:00 AM - 10:00 PM)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-xl border border-red-500/30 bg-red-950/20 shadow-glow-teal/10">
                    <HeartPulse className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <span className="text-xs font-bold text-red-300 block">Emergency & Ambulance Direct</span>
                      <span className="text-xs text-red-200 mt-1 block font-mono font-bold">
                        {profile?.emergencyPhone || "+92 42 3578 9999"} (24/7 Dedicated Line)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form Component */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D12] p-8 sm:p-10 shadow-2xl">
                <h3 className="font-display font-bold text-xl text-white mb-2">Send us an Inquiry</h3>
                <p className="text-xs text-[#9A958C] mb-8">
                  Fill out the form below. Your query will be delivered directly to hospital administration.
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
