"use client";

import React, { useState, useEffect } from "react";
import { formatPKR, formatDate } from "@/lib/utils";
import {
  Tv,
  Bell,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Filter,
  Volume2,
} from "lucide-react";

interface QueueClientProps {
  initialVisits: any[];
  doctors: any[];
}

export default function QueueClient({ initialVisits, doctors }: QueueClientProps) {
  const [visits, setVisits] = useState(initialVisits);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [callingId, setCallingId] = useState<string | null>(null);

  const fetchVisits = async () => {
    try {
      const res = await fetch("/api/visits");
      const data = await res.json();
      if (data.visits) {
        setVisits(data.visits);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // Connect to SSE stream for live updates
    const eventSource = new EventSource("/api/queue/stream");
    eventSource.onmessage = () => {
      fetchVisits();
    };
    return () => eventSource.close();
  }, []);

  const handleCallPatient = async (visitId: string) => {
    setCallingId(visitId);
    try {
      const res = await fetch(`/api/visits/${visitId}/call`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        fetchVisits();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCallingId(null);
    }
  };

  const handleStatusChange = async (visitId: string, status: string, priority?: string) => {
    try {
      await fetch(`/api/visits/${visitId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, priority }),
      });
      fetchVisits();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredVisits = visits.filter(
    (v) => !selectedDoctor || v.doctorId === selectedDoctor
  );

  const waitingList = filteredVisits.filter((v) => v.status === "WAITING");
  const inConsultationList = filteredVisits.filter((v) => v.status === "IN_CONSULTATION");
  const completedList = filteredVisits.filter((v) => v.status === "COMPLETED");

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight text-neutral-900 dark:text-white">
            Live OPD Queue Board
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time status board synchronized with waiting room TV displays.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Doctor filter */}
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs font-semibold text-neutral-900 dark:text-white outline-none"
          >
            <option value="">All Doctors ({doctors.length})</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.roomNo})
              </option>
            ))}
          </select>

          <a
            href="/display"
            target="_blank"
            className="btn-pill bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs font-bold gap-2"
          >
            <Tv className="w-4 h-4" />
            <span>Open TV Screen</span>
          </a>
        </div>
      </div>

      {/* 3-Column Kanban Board (Waiting / In Consultation / Completed) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Col 1: Waiting */}
        <div className="rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 p-5 shadow-card-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Waiting in Lobby</h3>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
              {waitingList.length}
            </span>
          </div>

          <div className="space-y-3">
            {waitingList.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                No patients waiting in queue.
              </div>
            ) : (
              waitingList.map((v) => {
                const isEmergency = v.priority === "EMERGENCY";
                return (
                  <div
                    key={v.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isEmergency
                        ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800"
                        : "bg-neutral-50 dark:bg-[#11171E] border-neutral-200 dark:border-white/5"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="font-display font-black text-2xl text-neutral-900 dark:text-white">
                          #{String(v.tokenNumber).padStart(2, "0")}
                        </span>
                        <div>
                          <span className="font-bold text-xs text-neutral-900 dark:text-white block">
                            {v.patient.fullName}
                          </span>
                          <span className="text-[11px] text-neutral-500">
                            Dr. {v.doctor.name} ({v.doctor.roomNo})
                          </span>
                        </div>
                      </div>

                      {isEmergency && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-red-600 text-white font-black animate-pulse">
                          EMERGENCY
                        </span>
                      )}
                    </div>

                    {/* Actions row */}
                    <div className="mt-4 pt-3 border-t border-neutral-200/50 dark:border-white/5 flex items-center justify-between">
                      <button
                        onClick={() =>
                          handleStatusChange(
                            v.id,
                            "WAITING",
                            isEmergency ? "NORMAL" : "EMERGENCY"
                          )
                        }
                        className="text-[11px] text-neutral-500 hover:text-red-500 font-semibold"
                      >
                        {isEmergency ? "Remove Emergency" : "Mark Emergency"}
                      </button>

                      <button
                        onClick={() => handleCallPatient(v.id)}
                        disabled={callingId === v.id}
                        className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-black font-bold text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{callingId === v.id ? "Calling..." : "Call Next"}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Col 2: In Consultation */}
        <div className="rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 p-5 shadow-card-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">In Consultation</h3>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300">
              {inConsultationList.length}
            </span>
          </div>

          <div className="space-y-3">
            {inConsultationList.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                No active consultation in progress.
              </div>
            ) : (
              inConsultationList.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-display font-black text-2xl text-blue-600 dark:text-blue-400">
                        #{String(v.tokenNumber).padStart(2, "0")}
                      </span>
                      <div>
                        <span className="font-bold text-xs text-neutral-900 dark:text-white block">
                          {v.patient.fullName}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          {v.doctor.name} • Room {v.doctor.roomNo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-blue-200/50 dark:border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => handleCallPatient(v.id)}
                      className="text-[11px] text-teal-600 dark:text-teal-400 font-bold hover:underline"
                    >
                      Re-Call Chime
                    </button>

                    <button
                      onClick={() => handleStatusChange(v.id, "COMPLETED")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs"
                    >
                      Mark Completed
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Col 3: Completed Today */}
        <div className="rounded-2xl bg-white dark:bg-[#0B0F14] border border-neutral-200 dark:border-white/10 p-5 shadow-card-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Completed Consults</h3>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
              {completedList.length}
            </span>
          </div>

          <div className="space-y-3">
            {completedList.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                No consultations completed yet today.
              </div>
            ) : (
              completedList.slice(0, 8).map((v) => (
                <div
                  key={v.id}
                  className="p-3 rounded-xl border border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-[#11171E] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                      #{v.tokenNumber}
                    </span>
                    <div>
                      <span className="font-bold text-xs text-neutral-900 dark:text-white block">
                        {v.patient.fullName}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {v.doctor.name}
                      </span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
