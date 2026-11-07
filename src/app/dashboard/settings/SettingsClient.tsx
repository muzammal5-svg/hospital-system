"use client";

import React, { useState } from "react";
import {
  Settings,
  Building,
  Printer,
  Users,
  Database,
  CheckCircle2,
  AlertCircle,
  Save,
  Download,
  Loader2,
} from "lucide-react";

interface SettingsClientProps {
  initialProfile: any;
  departments: any[];
  doctors: any[];
  users: any[];
}

export default function SettingsClient({
  initialProfile,
  departments,
  doctors,
  users,
}: SettingsClientProps) {
  const [profile, setProfile] = useState(initialProfile || {});
  const [loading, setLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupResult, setBackupResult] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setProfile(data.profile);
      setSuccessMsg("Hospital profile & letterhead templates saved.");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerBackup = async () => {
    setBackupLoading(true);
    setBackupResult(null);

    try {
      const res = await fetch("/api/backup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Backup failed");

      setBackupResult(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBackupLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl text-xs">
      <div>
        <h1 className="font-display font-extrabold text-2xl tracking-tight text-neutral-900 dark:text-white">
          Hospital Configuration & System Settings
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-0.5">
          Branding, letterhead templates, doctor consultation fees, and database backup controls.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Hospital Identity & Branding Form */}
      <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-200 dark:border-white/10 font-bold text-sm text-neutral-900 dark:text-white">
          <Building className="w-4 h-4 text-teal-500" />
          <span>Hospital Profile & Contact Details</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              Hospital Name
            </label>
            <input
              type="text"
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              Motto / Tagline
            </label>
            <input
              type="text"
              value={profile.tagline || ""}
              onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              UAN Phone Number
            </label>
            <input
              type="text"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              Emergency Direct Hotline
            </label>
            <input
              type="text"
              value={profile.emergencyPhone || ""}
              onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })}
              className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500 font-mono font-bold text-red-500"
            />
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              Official Email
            </label>
            <input
              type="email"
              value={profile.email || ""}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
            Physical Campus Address (Lahore)
          </label>
          <input
            type="text"
            value={profile.address || ""}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-neutral-900 dark:text-white outline-none focus:border-teal-500"
          />
        </div>

        {/* Print Letterhead Templates */}
        <div className="pt-4 border-t border-neutral-200 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-white">
            <Printer className="w-4 h-4 text-teal-500" />
            <span>Thermal Receipt & A4 Prescription Letterhead Headers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                80mm Thermal Receipt Header Text
              </label>
              <textarea
                rows={3}
                value={profile.receiptHeader || ""}
                onChange={(e) => setProfile({ ...profile, receiptHeader: e.target.value })}
                className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl p-2.5 text-neutral-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                80mm Thermal Receipt Footer Text
              </label>
              <textarea
                rows={3}
                value={profile.receiptFooter || ""}
                onChange={(e) => setProfile({ ...profile, receiptFooter: e.target.value })}
                className="w-full bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/10 rounded-xl p-2.5 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-pill bg-teal-500 hover:bg-teal-600 text-black text-xs font-bold gap-2 shadow-glow-teal"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Database Backup Trigger Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-white/10">
          <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-white">
            <Database className="w-4 h-4 text-teal-500" />
            <span>Database Backup & Snapshot Engine</span>
          </div>
          <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded font-bold">
            JSON / pg_dump ready
          </span>
        </div>

        <p className="text-neutral-500 leading-relaxed">
          Generates an instantaneous full snapshot of hospital registries, departments, doctors, patients, visits, appointments, and billing ledgers stored safely to the local backup volume.
        </p>

        {backupResult && (
          <div className="p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-xl text-teal-700 dark:text-teal-300 font-mono">
            <div>✓ {backupResult.message}</div>
            <div className="text-[10px] text-neutral-500 mt-1">
              File: {backupResult.filename} • Size: {Math.round(backupResult.sizeBytes / 1024)} KB • Backed up: {backupResult.counts.patients} patients, {backupResult.counts.visits} visits
            </div>
          </div>
        )}

        <button
          onClick={handleTriggerBackup}
          disabled={backupLoading}
          className="btn-pill bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-bold gap-2"
        >
          {backupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>Generate Backup Snapshot Now</span>
        </button>
      </div>

      {/* System Roles & Users Overview */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 shadow-card-soft space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-200 dark:border-white/10 font-bold text-sm text-neutral-900 dark:text-white">
          <Users className="w-4 h-4 text-teal-500" />
          <span>System Users & Role Privileges</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {users.map((u) => (
            <div key={u.id} className="p-3 rounded-xl bg-neutral-50 dark:bg-[#11171E] border border-neutral-200 dark:border-white/5 flex items-center justify-between">
              <div>
                <span className="font-bold text-neutral-900 dark:text-white block">{u.name}</span>
                <span className="text-neutral-500 font-mono text-[11px]">{u.email}</span>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300">
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
