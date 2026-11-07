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
      setSuccessMsg("Hospital profile and configuration updated successfully.");
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
    <div className="space-y-6 max-w-4xl text-xs">
      <div className="pb-1 border-b border-[#E3E9EF]">
        <h1 className="font-display font-bold text-2xl tracking-tight text-[#1B2733]">
          Hospital Configuration & System Settings
        </h1>
        <p className="text-sm text-[#5B6B7B] mt-0.5">
          Hospital branding, official letterhead headers, consultation pricing defaults, and database snapshot controls.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-[#2E9E6B] rounded-lg font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Hospital Identity & Branding Form */}
      <form onSubmit={handleSaveProfile} className="p-6 rounded-xl bg-white border border-[#E3E9EF] shadow-sm space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E3E9EF] font-bold text-sm text-[#1B2733]">
          <Building className="w-4 h-4 text-[#0B4F8A]" />
          <span>Hospital Profile & Contact Information</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1B2733] mb-1">
              Hospital Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-white border border-[#E3E9EF] rounded-lg px-3.5 py-2.5 text-xs text-[#1B2733] outline-none focus:border-[#0B4F8A] font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B2733] mb-1">
              Motto / Tagline
            </label>
            <input
              type="text"
              value={profile.tagline || ""}
              onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              className="w-full bg-white border border-[#E3E9EF] rounded-lg px-3.5 py-2.5 text-xs text-[#1B2733] outline-none focus:border-[#0B4F8A]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1B2733] mb-1">
              UAN Helpline Number
            </label>
            <input
              type="text"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full bg-white border border-[#E3E9EF] rounded-lg px-3.5 py-2.5 text-xs text-[#1B2733] outline-none focus:border-[#0B4F8A] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B2733] mb-1">
              Emergency Direct Hotline (24/7)
            </label>
            <input
              type="text"
              value={profile.emergencyPhone || ""}
              onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })}
              className="w-full bg-white border border-[#E3E9EF] rounded-lg px-3.5 py-2.5 text-xs text-red-600 outline-none focus:border-[#0B4F8A] font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B2733] mb-1">
              Official Contact Email
            </label>
            <input
              type="email"
              value={profile.email || ""}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full bg-white border border-[#E3E9EF] rounded-lg px-3.5 py-2.5 text-xs text-[#1B2733] outline-none focus:border-[#0B4F8A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1B2733] mb-1">
            Physical Campus Address (Lahore)
          </label>
          <input
            type="text"
            value={profile.address || ""}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="w-full bg-white border border-[#E3E9EF] rounded-lg px-3.5 py-2.5 text-xs text-[#1B2733] outline-none focus:border-[#0B4F8A]"
          />
        </div>

        {/* Print Letterhead Templates */}
        <div className="pt-4 border-t border-[#E3E9EF] space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-[#1B2733]">
            <Printer className="w-4 h-4 text-[#0B4F8A]" />
            <span>Thermal Receipt & A4 Prescription Letterhead Headers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                80mm Thermal Receipt Header Text
              </label>
              <textarea
                rows={3}
                value={profile.receiptHeader || ""}
                onChange={(e) => setProfile({ ...profile, receiptHeader: e.target.value })}
                className="w-full bg-white border border-[#E3E9EF] rounded-lg p-2.5 text-xs text-[#1B2733] font-mono outline-none focus:border-[#0B4F8A] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                80mm Thermal Receipt Footer Text
              </label>
              <textarea
                rows={3}
                value={profile.receiptFooter || ""}
                onChange={(e) => setProfile({ ...profile, receiptFooter: e.target.value })}
                className="w-full bg-white border border-[#E3E9EF] rounded-lg p-2.5 text-xs text-[#1B2733] font-mono outline-none focus:border-[#0B4F8A] resize-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-[#0B4F8A] hover:bg-[#093F6E] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Database Backup Trigger Card */}
      <div className="p-6 rounded-xl bg-white border border-[#E3E9EF] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E3E9EF]">
          <div className="flex items-center gap-2 font-bold text-sm text-[#1B2733]">
            <Database className="w-4 h-4 text-[#0B4F8A]" />
            <span>Database Backup & Snapshot Engine</span>
          </div>
          <span className="font-mono text-[10px] text-[#0B4F8A] bg-[#E8F1F9] px-2.5 py-0.5 rounded font-bold">
            JSON / SQL Snapshot
          </span>
        </div>

        <p className="text-xs text-[#5B6B7B] leading-relaxed">
          Generates an instantaneous full snapshot of hospital registries, departments, doctors, patients, visits, appointments, and billing ledgers stored safely to the local backup directory.
        </p>

        {backupResult && (
          <div className="p-3 bg-[#E8F1F9] border border-[#0B4F8A]/20 rounded-lg text-[#0B4F8A] font-mono text-xs">
            <div className="font-bold">✓ {backupResult.message}</div>
            <div className="text-[11px] text-[#5B6B7B] mt-1">
              File: {backupResult.filename} • Size: {Math.round(backupResult.sizeBytes / 1024)} KB • Backed up: {backupResult.counts.patients} patients, {backupResult.counts.visits} visits
            </div>
          </div>
        )}

        <button
          onClick={handleTriggerBackup}
          disabled={backupLoading}
          className="px-4 py-2 rounded-lg border border-[#E3E9EF] text-[#1B2733] hover:bg-[#F6F9FC] text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {backupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>Generate Backup Snapshot Now</span>
        </button>
      </div>

      {/* System Roles & Users Overview */}
      <div className="p-6 rounded-xl bg-white border border-[#E3E9EF] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E3E9EF] font-bold text-sm text-[#1B2733]">
          <Users className="w-4 h-4 text-[#0B4F8A]" />
          <span>System Users & Role Privileges</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="p-3.5 rounded-lg bg-[#F6F9FC] border border-[#E3E9EF] flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-xs text-[#1B2733] block">{u.name}</span>
                <span className="text-[#5B6B7B] font-mono text-[11px]">{u.email}</span>
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#E8F1F9] text-[#0B4F8A]">
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
