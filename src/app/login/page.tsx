"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Shield, ArrowRight, AlertCircle, Loader2, UserCheck, Stethoscope, FileText, Lock, ChevronLeft, Phone } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (result?.error) {
        setError(result.error.includes("Invalid") ? result.error : "Invalid email or password.");
        setLoading(false);
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in.");
      setLoading(false);
    }
  };

  const quickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F6F9FC] dark:bg-[#0F1B2A]">
      {/* Left Column: Hospital Photo with Navy Overlay (Hidden on small screens) */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-[#0B3A66] text-white flex-col justify-between p-12 overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/login-bg.webp"
          alt="Naseem Ijaz Hospital"
          fill
          priority
          sizes="45vw"
          className="object-cover opacity-25 mix-blend-luminosity"
        />

        {/* Brand / Logo at top */}
        <div className="relative z-10 space-y-3">
          <Link href="/" className="block relative w-60 h-12">
            <Image
              src="/images/logo-white.svg"
              alt="Naseem Ijaz Hospital"
              fill
              priority
              className="object-contain object-left"
            />
          </Link>
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-300">
            Staff & Clinical Portal &bull; Lahore
          </div>
        </div>

        {/* Middle message */}
        <div className="relative z-10 space-y-4 max-w-sm">
          <div className="w-12 h-1 bg-[#1E9E8F] rounded-full" />
          <h2 className="text-2xl font-bold font-heading text-white leading-snug">
            Excellence in Compassionate Outpatient Care
          </h2>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            Authorized portal for reception intake, consultant OPD examination, automated billing, and live waiting room display administration.
          </p>
        </div>

        {/* Bottom Help info */}
        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-teal-300" />
            <span>Emergency: +92 42 3578 9999</span>
          </div>
          <Link href="/" className="hover:text-white transition-colors">
            Hospital Website &rarr;
          </Link>
        </div>
      </div>

      {/* Right Column: Clean White Form Area */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        {/* Top return link */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B6B7B] dark:text-[#94A7BA] hover:text-[#0B4F8A] dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Public Website</span>
          </Link>

          <div className="lg:hidden relative w-36 h-8">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              fill
              priority
              className="object-contain object-right dark:hidden"
            />
            <Image
              src="/images/logo-white.svg"
              alt="Logo"
              fill
              priority
              className="object-contain object-right hidden dark:block"
            />
          </div>
        </div>

        {/* Center Form Card */}
        <div className="w-full max-w-md mx-auto my-auto">
          <div className="hospital-card p-8 sm:p-10 bg-white dark:bg-[#162638] shadow-sm">
            <div className="mb-6">
              <h1 className="text-2xl font-bold font-heading text-[#0B4F8A] dark:text-white">
                Staff Sign In
              </h1>
              <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-1">
                Enter your hospital credentials to access your console.
              </p>
            </div>

            {error && (
              <div className="p-3.5 mb-5 rounded-lg bg-red-50 border border-red-200 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span className="font-medium text-red-700">{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} action="#" className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="reception@naseemijaz.pk"
                  className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-4 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-4 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-11 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center h-11 font-bold text-sm mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Sign In to Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick-Fill Demo Roles */}
            <div className="pt-6 mt-6 border-t border-[#E3E9EF] dark:border-[#23374D]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B7B] dark:text-[#94A7BA] block mb-3 text-center">
                One-Click Demo Credentials
              </span>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => quickFill("reception@naseemijaz.pk", "Reception@123")}
                  className="p-2.5 rounded-lg bg-[#F6F9FC] dark:bg-[#111B27] hover:bg-[#E8F1F9] dark:hover:bg-[#1E3147] border border-[#E3E9EF] dark:border-[#23374D] text-left transition-colors cursor-pointer"
                >
                  <div className="font-bold text-[#1B2733] dark:text-white flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#1E9E8F]" />
                    <span>Receptionist</span>
                  </div>
                  <div className="text-[10px] text-[#5B6B7B] dark:text-[#94A7BA]">Desk 1 / Intake</div>
                </button>

                <button
                  type="button"
                  onClick={() => quickFill("doctor@naseemijaz.pk", "Doctor@123")}
                  className="p-2.5 rounded-lg bg-[#F6F9FC] dark:bg-[#111B27] hover:bg-[#E8F1F9] dark:hover:bg-[#1E3147] border border-[#E3E9EF] dark:border-[#23374D] text-left transition-colors cursor-pointer"
                >
                  <div className="font-bold text-[#1B2733] dark:text-white flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-[#0B4F8A]" />
                    <span>Dr. Tariq</span>
                  </div>
                  <div className="text-[10px] text-[#5B6B7B] dark:text-[#94A7BA]">Cardiology OPD</div>
                </button>

                <button
                  type="button"
                  onClick={() => quickFill("admin@naseemijaz.pk", "Admin@123")}
                  className="p-2.5 rounded-lg bg-[#F6F9FC] dark:bg-[#111B27] hover:bg-[#E8F1F9] dark:hover:bg-[#1E3147] border border-[#E3E9EF] dark:border-[#23374D] text-left transition-colors cursor-pointer"
                >
                  <div className="font-bold text-[#1B2733] dark:text-white flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#E39B12]" />
                    <span>Administrator</span>
                  </div>
                  <div className="text-[10px] text-[#5B6B7B] dark:text-[#94A7BA]">Full Control</div>
                </button>

                <button
                  type="button"
                  onClick={() => quickFill("accountant@naseemijaz.pk", "Accountant@123")}
                  className="p-2.5 rounded-lg bg-[#F6F9FC] dark:bg-[#111B27] hover:bg-[#E8F1F9] dark:hover:bg-[#1E3147] border border-[#E3E9EF] dark:border-[#23374D] text-left transition-colors cursor-pointer"
                >
                  <div className="font-bold text-[#1B2733] dark:text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#2E9E6B]" />
                    <span>Accountant</span>
                  </div>
                  <div className="text-[10px] text-[#5B6B7B] dark:text-[#94A7BA]">Billing & Reports</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="text-center text-xs text-[#5B6B7B] dark:text-[#94A7BA] mt-6">
          &copy; {new Date().getFullYear()} Naseem Ijaz Hospital &bull; Jail Road, Lahore
        </div>
      </div>
    </div>
  );
}
