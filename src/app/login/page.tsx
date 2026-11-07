"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, Shield, ArrowRight, AlertCircle, Loader2, UserCheck, Stethoscope, FileText, KeyRound } from "lucide-react";

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
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
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
    <div className="min-h-screen bg-gradient-to-b from-[#0c2738]/40 via-[#07161f] to-[#050505] text-[#EDE8E0] flex flex-col justify-between p-6">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-black font-bold shadow-glow-teal">
            <Activity className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <span className="font-display font-extrabold text-base text-white block leading-tight">
              Naseem Ijaz Hospital
            </span>
            <span className="text-[10px] font-medium text-teal-400 tracking-wider uppercase block">
              Staff Portal • لاہور
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs text-[#9A958C] hover:text-white transition-colors"
        >
          &larr; Back to Public Website
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-12">
        <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-3 border border-teal-500/30">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="font-display font-extrabold text-2xl text-white">
              Hospital Staff Portal
            </h1>
            <p className="text-xs text-[#9A958C]">
              Sign in with your role-authorized credentials.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-bold mb-1.5 uppercase text-[11px] tracking-wider">
                Staff Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reception@naseemijaz.pk"
                className="w-full bg-[#11171E] border border-white/[0.12] rounded-xl px-4 py-3 min-h-[44px] text-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-neutral-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-bold mb-1.5 uppercase text-[11px] tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#11171E] border border-white/[0.12] rounded-xl px-4 py-3 min-h-[44px] text-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-neutral-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-pill w-full bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-teal disabled:opacity-50 mt-4 min-h-[44px]"
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
          <div className="pt-4 border-t border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2 text-center">
              Quick-Fill Demo Credentials (One-Click)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => quickFill("reception@naseemijaz.pk", "Reception@123")}
                className="p-2 rounded-xl bg-[#11171E] hover:bg-teal-950/40 border border-white/5 hover:border-teal-500/30 text-left transition-colors"
              >
                <div className="font-bold text-white flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Receptionist</span>
                </div>
                <div className="text-[10px] text-[#9A958C]">Desk 1 / Intake</div>
              </button>

              <button
                type="button"
                onClick={() => quickFill("doctor@naseemijaz.pk", "Doctor@123")}
                className="p-2 rounded-xl bg-[#11171E] hover:bg-blue-950/40 border border-white/5 hover:border-blue-500/30 text-left transition-colors"
              >
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dr. Tariq</span>
                </div>
                <div className="text-[10px] text-[#9A958C]">Cardiology OPD</div>
              </button>

              <button
                type="button"
                onClick={() => quickFill("admin@naseemijaz.pk", "Admin@123")}
                className="p-2 rounded-xl bg-[#11171E] hover:bg-amber-950/40 border border-white/5 hover:border-amber-500/30 text-left transition-colors"
              >
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Administrator</span>
                </div>
                <div className="text-[10px] text-[#9A958C]">Full System Access</div>
              </button>

              <button
                type="button"
                onClick={() => quickFill("accountant@naseemijaz.pk", "Accountant@123")}
                className="p-2 rounded-xl bg-[#11171E] hover:bg-emerald-950/40 border border-white/5 hover:border-emerald-500/30 text-left transition-colors"
              >
                <div className="font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Accountant</span>
                </div>
                <div className="text-[10px] text-[#9A958C]">Cashier & Closing</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-[#5C5852]">
        Naseem Ijaz Hospital Management Platform • Jail Road, Lahore • Emergency 24/7
      </div>
    </div>
  );
}
