import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QueueAlertsCards } from "@/components/QueueAlertsCards";
import { DoctorsSection } from "./DoctorsSection";
import { prisma } from "@/lib/prisma";
import {
  Calendar,
  Phone,
  Clock,
  CheckCircle2,
  Users,
  ShieldCheck,
  Tv,
  ArrowRight,
  HeartPulse,
  MapPin,
  Mail,
  UserCheck,
  FileText,
  Activity,
} from "lucide-react";
import PublicBookingForm from "./PublicBookingForm";
import PublicContactForm from "./PublicContactForm";
import {
  DEFAULT_DEPARTMENTS,
  DEFAULT_DOCTORS,
  DEFAULT_HOSPITAL_PROFILE,
} from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  let departments: any[] = [];
  let doctors: any[] = [];
  let profile: any = DEFAULT_HOSPITAL_PROFILE;

  try {
    const [dbDepts, dbDocs, dbProfile] = await Promise.all([
      prisma.department.findMany({
        where: { active: true },
        take: 10,
        orderBy: { createdAt: "asc" },
      }),
      prisma.doctor.findMany({
        where: { active: true },
        include: { department: true },
        take: 8,
        orderBy: { createdAt: "asc" },
      }),
      prisma.hospitalProfile.findUnique({ where: { id: "default" } }),
    ]);

    departments = dbDepts.length > 0 ? dbDepts : DEFAULT_DEPARTMENTS;
    doctors = dbDocs.length > 0 ? dbDocs : DEFAULT_DOCTORS;
    profile = dbProfile || DEFAULT_HOSPITAL_PROFILE;
  } catch (err) {
    console.warn("Using fallback hospital data:", err);
    departments = DEFAULT_DEPARTMENTS;
    doctors = DEFAULT_DOCTORS;
    profile = DEFAULT_HOSPITAL_PROFILE;
  }

  // Department image lookup
  const deptImages: Record<string, string> = {
    CARD: "/images/departments/cardiology.webp",
    ORTH: "/images/departments/orthopedics.webp",
    PED: "/images/departments/pediatrics.webp",
    GYN: "/images/departments/gynecology.webp",
    MED: "/images/departments/internal-medicine.webp",
    SURG: "/images/departments/general-surgery.webp",
    NEUR: "/images/departments/neurology.webp",
    OPHT: "/images/departments/ophthalmology.webp",
    ENT: "/images/departments/ent.webp",
    DERM: "/images/departments/dermatology.webp",
  };

  return (
    <div className="bg-[#F6F9FC] dark:bg-[#0F1B2A] text-[#1B2733] dark:text-[#E6EEF5] min-h-screen">
      {/* 1. Navbar */}
      <Navbar />

      <main>
        {/* 2. Hero Section (Light, Split Layout) */}
        <section className="relative bg-gradient-to-b from-[#E8F1F9] via-[#F6F9FC] to-white dark:from-[#111F30] dark:via-[#0F1B2A] dark:to-[#0F1B2A] pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E3E9EF] dark:border-[#23374D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[520px]">
              {/* Left Column: Headline, Subtext, Buttons, Trust Points */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#E8F1F9] dark:bg-[#162638] border border-[#0B4F8A]/20 text-[#0B4F8A] dark:text-[#64B5F6] text-xs font-semibold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#1E9E8F]" />
                  <span>Naseem Ijaz Hospital &bull; Lahore</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold font-heading tracking-tight text-[#0B4F8A] dark:text-white leading-[1.15]">
                  Quality Healthcare, <br />
                  <span className="text-[#1E9E8F]">Close to Home.</span>
                </h1>

                <p className="text-base sm:text-lg text-[#5B6B7B] dark:text-[#94A7BA] max-w-2xl leading-relaxed">
                  Naseem Ijaz Hospital provides trusted consultation, diagnostics and emergency care in Lahore. With experienced consultants, fast OPD registration, and on-site pharmacy, your family is in caring hands.
                </p>

                {/* 2 Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Link
                    href="/appointments"
                    className="btn-teal px-6 py-3 text-sm font-semibold shadow-sm justify-center"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </Link>

                  <Link
                    href="/login"
                    className="btn-secondary px-6 py-3 text-sm font-semibold justify-center"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#0B4F8A]" />
                    <span>Staff Login</span>
                  </Link>
                </div>

                {/* 3 Trust Points */}
                <div className="pt-6 border-t border-[#E3E9EF] dark:border-[#23374D] flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-[#5B6B7B] dark:text-[#94A7BA]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1E9E8F] shrink-0" />
                    <span className="font-medium text-[#1B2733] dark:text-[#E6EEF5]">24/7 Emergency Care</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1E9E8F] shrink-0" />
                    <span className="font-medium text-[#1B2733] dark:text-[#E6EEF5]">Experienced Consultants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1E9E8F] shrink-0" />
                    <span className="font-medium text-[#1B2733] dark:text-[#E6EEF5]">Online Appointments</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Large Real Hospital Photo */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-[#E3E9EF] dark:border-[#23374D] shadow-md aspect-[4/3] bg-[#E8F1F9]">
                  <Image
                    src="/images/hero-hospital.webp"
                    alt="Naseem Ijaz Hospital Medical Team"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>

                {/* Floating OPD Status Card */}
                <div className="absolute -bottom-5 -left-4 sm:bottom-4 sm:left-4 bg-white dark:bg-[#162638] border border-[#E3E9EF] dark:border-[#23374D] rounded-xl p-3.5 shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E6F5F3] dark:bg-teal-950/60 text-[#1E9E8F] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#2E9E6B] animate-pulse" />
                      <span className="text-xs font-bold text-[#1B2733] dark:text-[#E6EEF5]">
                        OPD Open Today
                      </span>
                    </div>
                    <span className="text-[11px] text-[#5B6B7B] dark:text-[#94A7BA]">
                      9:00 AM &ndash; 9:00 PM &bull; Jail Road
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Quick Action Cards (4 Cards) */}
        <section className="relative -mt-6 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <Link
              href="/appointments"
              className="hospital-card p-5 hover:border-[#0B4F8A] transition-all group flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-lg bg-[#E8F1F9] dark:bg-[#1E3147] text-[#0B4F8A] dark:text-[#64B5F6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading">
                    Book Appointment
                  </h3>
                  <ArrowRight className="w-3.5 h-3.5 text-[#5B6B7B] group-hover:text-[#0B4F8A] transition-colors" />
                </div>
                <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-1">
                  Choose your doctor, date, and preferred time slot online.
                </p>
              </div>
            </Link>

            {/* Card 2 */}
            <Link
              href="/#doctors"
              className="hospital-card p-5 hover:border-[#0B4F8A] transition-all group flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-lg bg-[#E6F5F3] dark:bg-teal-950/50 text-[#1E9E8F] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading">
                    Find a Doctor
                  </h3>
                  <ArrowRight className="w-3.5 h-3.5 text-[#5B6B7B] group-hover:text-[#0B4F8A] transition-colors" />
                </div>
                <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-1">
                  Review consultant profiles, fees, and clinic schedules.
                </p>
              </div>
            </Link>

            {/* Card 3 */}
            <a
              href="tel:+924235789999"
              className="hospital-card p-5 hover:border-red-400 transition-all group flex items-start gap-4 border-l-4 border-l-red-500"
            >
              <div className="w-11 h-11 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 font-heading">
                    Emergency 24/7
                  </h3>
                  <ArrowRight className="w-3.5 h-3.5 text-red-500" />
                </div>
                <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-1">
                  Trauma, cardiac response and ambulance helpline.
                </p>
              </div>
            </a>

            {/* Card 4 */}
            <Link
              href="/display"
              target="_blank"
              className="hospital-card p-5 hover:border-[#0B4F8A] transition-all group flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-lg bg-[#E8F1F9] dark:bg-[#1E3147] text-[#0B4F8A] dark:text-[#64B5F6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Tv className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading">
                    Live OPD Queue
                  </h3>
                  <ArrowRight className="w-3.5 h-3.5 text-[#5B6B7B] group-hover:text-[#0B4F8A] transition-colors" />
                </div>
                <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-1">
                  View waiting room tokens and active consultations in real time.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* 4. About Us Section */}
        <section id="about" className="py-20 bg-white dark:bg-[#162638] border-b border-[#E3E9EF] dark:border-[#23374D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Photo Left */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-[#E3E9EF] dark:border-[#23374D] shadow-sm aspect-[4/3] bg-[#F6F9FC]">
                  <Image
                    src="/images/about-building.webp"
                    alt="Naseem Ijaz Hospital Building, Lahore"
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Text Right */}
              <div className="lg:col-span-7 space-y-6">
                <div className="text-xs font-bold uppercase tracking-wider text-[#1E9E8F]">
                  About Our Hospital
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#0B4F8A] dark:text-white leading-tight">
                  A Trusted Name in Compassionate Medical Care
                </h2>
                <p className="text-sm sm:text-base text-[#5B6B7B] dark:text-[#94A7BA] leading-relaxed">
                  Founded with a vision to deliver accessible, high-standard healthcare, Naseem Ijaz Hospital is a premier multi-specialty medical facility situated on Jail Road, Lahore.
                </p>
                <p className="text-sm sm:text-base text-[#5B6B7B] dark:text-[#94A7BA] leading-relaxed">
                  With modern outpatient clinics, fully equipped surgical theatres, on-site diagnostics, and dedicated patient care coordinators, our team of seasoned consultants is committed to supporting every patient with dignity and clinical excellence.
                </p>

                {/* 4 Stat Counters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#E3E9EF] dark:border-[#23374D]">
                  <div className="p-3.5 bg-[#F6F9FC] dark:bg-[#111B27] rounded-xl border border-[#E3E9EF] dark:border-[#23374D]">
                    <div className="text-2xl sm:text-3xl font-bold text-[#0B4F8A] dark:text-[#64B5F6] font-heading">
                      18+
                    </div>
                    <div className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-0.5 font-medium">
                      Years of Service
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#F6F9FC] dark:bg-[#111B27] rounded-xl border border-[#E3E9EF] dark:border-[#23374D]">
                    <div className="text-2xl sm:text-3xl font-bold text-[#1E9E8F] font-heading">
                      35+
                    </div>
                    <div className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-0.5 font-medium">
                      Consultant Doctors
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#F6F9FC] dark:bg-[#111B27] rounded-xl border border-[#E3E9EF] dark:border-[#23374D]">
                    <div className="text-2xl sm:text-3xl font-bold text-[#0B4F8A] dark:text-[#64B5F6] font-heading">
                      10+
                    </div>
                    <div className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-0.5 font-medium">
                      Departments
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#F6F9FC] dark:bg-[#111B27] rounded-xl border border-[#E3E9EF] dark:border-[#23374D]">
                    <div className="text-2xl sm:text-3xl font-bold text-[#1E9E8F] font-heading">
                      120k+
                    </div>
                    <div className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-0.5 font-medium">
                      Patients Treated
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Departments Grid Section */}
        <section id="departments" className="py-20 bg-[#F6F9FC] dark:bg-[#0F1B2A] border-b border-[#E3E9EF] dark:border-[#23374D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E9E8F] block mb-2">
                Specialized Care
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#0B4F8A] dark:text-white">
                Clinical Departments
              </h2>
              <p className="mt-3 text-sm text-[#5B6B7B] dark:text-[#94A7BA]">
                Equipped with modern diagnostic capabilities and dedicated outpatient consultation suites.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {departments.map((dept) => {
                const imgUrl = deptImages[dept.code] || "/images/departments/cardiology.webp";

                return (
                  <div
                    key={dept.id}
                    className="hospital-card overflow-hidden group hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Department Photo */}
                      <div className="relative w-full aspect-[16/10] bg-[#E8F1F9] overflow-hidden">
                        <Image
                          src={imgUrl}
                          alt={dept.name}
                          fill
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-base font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading">
                            {dept.name}
                          </h3>
                        </div>
                        {dept.nameUrdu && (
                          <div className="text-xs text-[#1E9E8F] font-urdu mb-2">
                            {dept.nameUrdu}
                          </div>
                        )}
                        <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] leading-relaxed line-clamp-2">
                          {dept.description || "Comprehensive outpatient diagnostics, treatment, and specialist consultations."}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <Link
                        href={`/appointments?departmentId=${dept.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B4F8A] dark:text-[#64B5F6] group-hover:underline"
                      >
                        <span>View Doctors & Book</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. Doctors Section (Grid + Department Filter) */}
        <section id="doctors" className="py-20 bg-white dark:bg-[#162638] border-b border-[#E3E9EF] dark:border-[#23374D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E9E8F] block mb-2">
                Medical Team
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#0B4F8A] dark:text-white">
                Our Senior Consultants
              </h2>
              <p className="mt-3 text-sm text-[#5B6B7B] dark:text-[#94A7BA]">
                Consult with verified specialists across outpatient departments in Lahore.
              </p>
            </div>

            {/* Interactive Doctors Filter Component */}
            <DoctorsSection doctors={doctors as any} departments={departments} />
          </div>
        </section>

        {/* 7. How It Works / Patient Journey (3 Steps) */}
        <section className="py-20 bg-[#F6F9FC] dark:bg-[#0F1B2A] border-b border-[#E3E9EF] dark:border-[#23374D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E9E8F] block mb-2">
                Simple Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#0B4F8A] dark:text-white">
                How It Works
              </h2>
              <p className="mt-3 text-sm text-[#5B6B7B] dark:text-[#94A7BA]">
                A clear, organized outpatient journey from registration to doctor consultation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="hospital-card p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-xl bg-[#E8F1F9] text-[#0B4F8A] font-heading font-bold text-xl flex items-center justify-center mx-auto">
                  01
                </div>
                <h3 className="text-lg font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading">
                  Book Online or Walk In
                </h3>
                <p className="text-xs sm:text-sm text-[#5B6B7B] dark:text-[#94A7BA] leading-relaxed">
                  Select your specialist, date, and preferred time slot online from your phone, or visit our reception desk on Jail Road.
                </p>
              </div>

              {/* Step 2 */}
              <div className="hospital-card p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-xl bg-[#E6F5F3] text-[#1E9E8F] font-heading font-bold text-xl flex items-center justify-center mx-auto">
                  02
                </div>
                <h3 className="text-lg font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading">
                  Check In & Collect Token
                </h3>
                <p className="text-xs sm:text-sm text-[#5B6B7B] dark:text-[#94A7BA] leading-relaxed">
                  Provide your CNIC or mobile number for instant verification. Receive your official token slip and track live progress on waiting room TVs.
                </p>
              </div>

              {/* Step 3 */}
              <div className="hospital-card p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-xl bg-[#E8F1F9] text-[#0B4F8A] font-heading font-bold text-xl flex items-center justify-center mx-auto">
                  03
                </div>
                <h3 className="text-lg font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading">
                  Consultation & Reports
                </h3>
                <p className="text-xs sm:text-sm text-[#5B6B7B] dark:text-[#94A7BA] leading-relaxed">
                  Meet your consultant, complete examinations, collect your printed prescription, and receive follow-up guidance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Today's Queue Status / Queue Alerts */}
        <section className="py-16 bg-white dark:bg-[#162638] border-b border-[#E3E9EF] dark:border-[#23374D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E9E8F] block mb-1">
                  OPD Floor Management
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#0B4F8A] dark:text-white">
                  Today&apos;s Queue Status
                </h2>
              </div>
              <Link
                href="/display"
                target="_blank"
                className="btn-secondary text-xs py-2 px-4 inline-flex items-center gap-1.5"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Open Full-Screen TV Display</span>
              </Link>
            </div>

            <QueueAlertsCards />
          </div>
        </section>

        {/* 9. Patient Testimonials (3 Cards, Initials Avatars) */}
        <section className="py-20 bg-[#F6F9FC] dark:bg-[#0F1B2A] border-b border-[#E3E9EF] dark:border-[#23374D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E9E8F] block mb-2">
                Patient Stories
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#0B4F8A] dark:text-white">
                What Our Patients Say
              </h2>
              <p className="mt-3 text-sm text-[#5B6B7B] dark:text-[#94A7BA]">
                Real feedback from patients and families cared for at Naseem Ijaz Hospital.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="hospital-card p-6 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-[#5B6B7B] dark:text-[#94A7BA] leading-relaxed mb-6 italic">
                  &ldquo;The reception process was remarkably fast. We were issued token 04 for Dr. Tariq Mahmood and seen right on schedule. The hospital is impeccably clean and orderly.&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#E3E9EF] dark:border-[#23374D]">
                  <div className="w-10 h-10 rounded-full bg-[#0B4F8A] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    MA
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1B2733] dark:text-[#E6EEF5]">
                      Muhammad Asif
                    </h4>
                    <span className="text-xs text-[#5B6B7B] dark:text-[#94A7BA]">
                      Cardiology Patient &bull; Gulberg Lahore
                    </span>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="hospital-card p-6 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-[#5B6B7B] dark:text-[#94A7BA] leading-relaxed mb-6 italic">
                  &ldquo;Dr. Sana Farooq was exceedingly thorough and kind. The nursing staff assisted us with care, and having the digital prescription sent via SMS made medication retrieval effortless.&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#E3E9EF] dark:border-[#23374D]">
                  <div className="w-10 h-10 rounded-full bg-[#1E9E8F] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    SR
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1B2733] dark:text-[#E6EEF5]">
                      Sadia Riaz
                    </h4>
                    <span className="text-xs text-[#5B6B7B] dark:text-[#94A7BA]">
                      Gynecology Clinic &bull; Model Town Lahore
                    </span>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="hospital-card p-6 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-[#5B6B7B] dark:text-[#94A7BA] leading-relaxed mb-6 italic">
                  &ldquo;Having the live TV display board in the waiting lounge kept everything calm and transparent. No confusion about whose turn was next. A standard every hospital in Pakistan should follow.&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#E3E9EF] dark:border-[#23374D]">
                  <div className="w-10 h-10 rounded-full bg-[#0B4F8A] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    KH
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1B2733] dark:text-[#E6EEF5]">
                      Kamran Hafeez
                    </h4>
                    <span className="text-xs text-[#5B6B7B] dark:text-[#94A7BA]">
                      Pediatrics OPD &bull; DHA Lahore
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Appointment Booking Section (Working Form on White Card over Light Blue Band) */}
        <section id="appointments" className="py-20 bg-[#E8F1F9] dark:bg-[#111F30] border-b border-[#E3E9EF] dark:border-[#23374D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Guidance & Info */}
              <div className="lg:col-span-5 space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B4F8A] dark:text-[#64B5F6] block">
                  Online Appointments
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#0B4F8A] dark:text-white leading-tight">
                  Schedule Your Consultation
                </h2>
                <p className="text-sm text-[#5B6B7B] dark:text-[#94A7BA] leading-relaxed">
                  Reserve your appointment slot online in less than a minute. You will receive an immediate SMS confirmation with your reference number.
                </p>

                {/* Banner Photo */}
                <div className="relative rounded-xl overflow-hidden border border-[#E3E9EF] dark:border-[#23374D] aspect-[16/9] shadow-sm bg-white">
                  <Image
                    src="/images/appointment-banner.webp"
                    alt="Doctor Appointment Consultation"
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>

                <div className="hospital-card p-4 bg-white dark:bg-[#162638] space-y-2">
                  <div className="text-xs font-bold text-[#0B4F8A] dark:text-[#64B5F6]">
                    Appointment Guidelines:
                  </div>
                  <ul className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] space-y-1.5 list-disc list-inside">
                    <li>Please arrive 15 minutes prior to your allocated slot for token check-in.</li>
                    <li>Consultation fee is payable directly at the hospital reception desk.</li>
                    <li>Need urgent assistance? Call our helpline at +92 42 3578 9000.</li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Working Appointment Form */}
              <div className="lg:col-span-7">
                <div className="hospital-card p-6 sm:p-8 bg-white dark:bg-[#162638] shadow-md">
                  <div className="border-b border-[#E3E9EF] dark:border-[#23374D] pb-4 mb-6">
                    <h3 className="text-lg font-bold text-[#0B4F8A] dark:text-white font-heading">
                      Book Doctor Consultation
                    </h3>
                    <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-1">
                      Fill in your details below to secure your consultation appointment.
                    </p>
                  </div>

                  <PublicBookingForm departments={departments} doctors={doctors as any} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Contact & Emergency Section */}
        <section id="contact" className="py-20 bg-white dark:bg-[#162638]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E9E8F] block mb-2">
                Hospital Campus
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#0B4F8A] dark:text-white">
                Contact & Location
              </h2>
              <p className="mt-3 text-sm text-[#5B6B7B] dark:text-[#94A7BA]">
                Located conveniently on Jail Road, Lahore with 24-hour emergency response and ambulance services.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Campus Details + Emergency Red Box + Static Map */}
              <div className="lg:col-span-6 space-y-6">
                {/* 24/7 Emergency Box */}
                <div className="p-5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                      <h4 className="text-sm font-bold text-red-700 dark:text-red-400 font-heading">
                        24/7 Emergency & Ambulance Service
                      </h4>
                    </div>
                    <p className="text-xs text-red-600/90 dark:text-red-300">
                      Immediate trauma, cardiac, and pediatric emergency care team on round-the-clock duty.
                    </p>
                  </div>
                  <a
                    href="tel:+924235789999"
                    className="btn-danger text-xs px-3.5 py-2 shrink-0 flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call ER</span>
                  </a>
                </div>

                {/* Campus Information Grid */}
                <div className="hospital-card p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#0B4F8A] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-[#1B2733] dark:text-[#E6EEF5]">
                        Hospital Campus Address
                      </div>
                      <div className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-0.5">
                        Plot 14-B, Medical Enclave, Jail Road, Lahore, Pakistan
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3 border-t border-[#E3E9EF] dark:border-[#23374D]">
                    <Phone className="w-5 h-5 text-[#1E9E8F] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-[#1B2733] dark:text-[#E6EEF5]">
                        Telephone & Helpline
                      </div>
                      <div className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-0.5">
                        General: +92 42 3578 9000 &bull; Emergency: +92 42 3578 9999
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3 border-t border-[#E3E9EF] dark:border-[#23374D]">
                    <Mail className="w-5 h-5 text-[#0B4F8A] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-[#1B2733] dark:text-[#E6EEF5]">
                        Email Communication
                      </div>
                      <div className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-0.5">
                        info@naseemijazhospital.pk
                      </div>
                    </div>
                  </div>
                </div>

                {/* Static Stylized Map */}
                <div className="relative rounded-xl overflow-hidden border border-[#E3E9EF] dark:border-[#23374D] aspect-[16/9] shadow-sm bg-[#EBF2F7]">
                  <Image
                    src="/images/hospital-map.svg"
                    alt="Naseem Ijaz Hospital Location Map - Jail Road Lahore"
                    fill
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Right Column: Contact Inquiry Form */}
              <div className="lg:col-span-6">
                <div className="hospital-card p-6 sm:p-8 bg-[#F6F9FC] dark:bg-[#111B27]">
                  <div className="border-b border-[#E3E9EF] dark:border-[#23374D] pb-3 mb-5">
                    <h3 className="text-base font-bold text-[#0B4F8A] dark:text-white font-heading">
                      Send a Message to Patient Services
                    </h3>
                    <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-1">
                      Our patient coordination desk will answer your query promptly.
                    </p>
                  </div>

                  <PublicContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 12. Footer */}
      <Footer />
    </div>
  );
}
