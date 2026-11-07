'use client';

import React, { useState, useEffect } from 'react';
import { formatPKR, formatDate } from '@/lib/utils';
import {
  PageHeader,
  Card,
  CardHeader,
  StatusChip,
  Avatar,
  useToast,
} from '@/components/ui-app';
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
  ExternalLink,
  ShieldAlert,
  UserCheck,
  RotateCcw,
} from 'lucide-react';

interface QueueClientProps {
  initialVisits: any[];
  doctors: any[];
}

export default function QueueClient({ initialVisits, doctors }: QueueClientProps) {
  const toast = useToast();
  const [visits, setVisits] = useState(initialVisits);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [callingId, setCallingId] = useState<string | null>(null);

  const fetchVisits = async () => {
    try {
      const res = await fetch('/api/visits');
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
    const eventSource = new EventSource('/api/queue/stream');
    eventSource.onmessage = () => {
      fetchVisits();
    };
    return () => eventSource.close();
  }, []);

  const handleCallPatient = async (visitId: string) => {
    setCallingId(visitId);
    try {
      const res = await fetch(`/api/visits/${visitId}/call`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        fetchVisits();
        toast.success('Patient Called', `Token #${data.visit?.tokenNumber} called to room.`);
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
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, priority }),
      });
      fetchVisits();
      toast.info('Status Updated', `Patient marked as ${status}`);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredVisits = visits.filter(
    (v) => !selectedDoctor || v.doctorId === selectedDoctor
  );

  const waitingList = filteredVisits.filter((v) => v.status === 'WAITING');
  const inConsultationList = filteredVisits.filter((v) => v.status === 'IN_CONSULTATION');
  const completedList = filteredVisits.filter((v) => v.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live OPD Queue Status"
        subtitle="Real-time waiting room orchestration synchronized with TV displays and audio chime."
        breadcrumbs={[
          { label: 'Hospital', href: '/dashboard' },
          { label: 'Live Queue' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="h-10 rounded-lg border border-[#D5DDE5] bg-white px-3 text-xs font-semibold text-[#1B2733] shadow-2xs focus:border-[#0B4F8A] focus:outline-none"
            >
              <option value="">All Consultants ({doctors.length})</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.name} ({d.room || d.roomNo || 'Room 101'})
                </option>
              ))}
            </select>

            <a
              href="/display"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0B4F8A] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#093F6E] transition-colors"
            >
              <Tv className="h-4 w-4" />
              <span>Open TV Display</span>
              <ExternalLink className="h-3 w-3 opacity-80" />
            </a>
          </div>
        }
      />

      {/* 3-Column Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Column 1: Waiting */}
        <div className="rounded-xl border border-[#E3E9EF] bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0F4F8] pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <h3 className="font-heading text-sm font-bold text-[#1B2733]">
                Waiting in Lobby
              </h3>
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 font-mono text-xs font-bold text-amber-800">
              {waitingList.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
            {waitingList.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#8A97A5]">
                No patients waiting in queue.
              </div>
            ) : (
              waitingList.map((v) => {
                const isEmergency = v.priority === 'EMERGENCY';
                return (
                  <div
                    key={v.id}
                    className={`rounded-xl border p-4 transition-all ${
                      isEmergency
                        ? 'border-rose-300 bg-rose-50/60 shadow-xs'
                        : 'border-[#E3E9EF] bg-[#FBFDFF] hover:border-[#B5CDE0] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-heading text-2xl font-black text-[#0B4F8A]">
                          #{String(v.tokenNumber).padStart(2, '0')}
                        </span>
                        <div>
                          <span className="font-bold text-xs text-[#1B2733] block">
                            {v.patient?.fullName || v.patient?.name}
                          </span>
                          <span className="text-[11px] text-[#5B6B7B]">
                            Dr. {v.doctor?.name} ({v.doctor?.room || v.doctor?.roomNo || 'Room 101'})
                          </span>
                        </div>
                      </div>

                      {isEmergency && (
                        <span className="rounded bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white animate-pulse">
                          EMERGENCY
                        </span>
                      )}
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-[#F0F4F8] flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(
                            v.id,
                            'WAITING',
                            isEmergency ? 'NORMAL' : 'EMERGENCY'
                          )
                        }
                        className={`text-[11px] font-semibold ${
                          isEmergency
                            ? 'text-[#5B6B7B] hover:text-[#1B2733]'
                            : 'text-rose-600 hover:text-rose-800'
                        }`}
                      >
                        {isEmergency ? 'Remove Flag' : 'Mark Emergency'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCallPatient(v.id)}
                        disabled={callingId === v.id}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E9E8F] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#167C70] transition-colors disabled:opacity-50"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>{callingId === v.id ? 'Calling...' : 'Call Next'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 2: In Consultation */}
        <div className="rounded-xl border border-[#E3E9EF] bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0F4F8] pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
              <h3 className="font-heading text-sm font-bold text-[#1B2733]">
                In Consultation
              </h3>
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-mono text-xs font-bold text-blue-800">
              {inConsultationList.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
            {inConsultationList.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#8A97A5]">
                No patients currently in consultation.
              </div>
            ) : (
              inConsultationList.map((v) => (
                <div
                  key={v.id}
                  className="rounded-xl border-2 border-[#0B4F8A] bg-[#E8F1F9]/30 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-2xl font-black text-[#0B4F8A]">
                      #{String(v.tokenNumber).padStart(2, '0')}
                    </span>
                    <span className="rounded-full bg-[#0B4F8A] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      Inside Room
                    </span>
                  </div>

                  <div className="mt-2">
                    <h4 className="font-bold text-sm text-[#1B2733]">
                      {v.patient?.fullName || v.patient?.name}
                    </h4>
                    <p className="text-xs text-[#5B6B7B] mt-0.5">
                      Consultant: <strong>Dr. {v.doctor?.name}</strong> ({v.doctor?.room || v.doctor?.roomNo || 'Room 101'})
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#D5E6F5] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(v.id, 'WAITING')}
                      className="text-[11px] font-semibold text-[#5B6B7B] hover:text-[#1B2733]"
                    >
                      Return to Waiting
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(v.id, 'COMPLETED')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Complete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Completed */}
        <div className="rounded-xl border border-[#E3E9EF] bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0F4F8] pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-heading text-sm font-bold text-[#1B2733]">
                Completed Today
              </h3>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-800">
              {completedList.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
            {completedList.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#8A97A5]">
                No consultations completed yet.
              </div>
            ) : (
              completedList.map((v) => (
                <div
                  key={v.id}
                  className="rounded-xl border border-[#E3E9EF] bg-[#F8FAFC] p-3 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1B2733]">
                        #{String(v.tokenNumber).padStart(2, '0')}
                      </span>
                      <span className="font-semibold text-[#1B2733]">
                        {v.patient?.fullName || v.patient?.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8A97A5] mt-0.5 block">
                      Dr. {v.doctor?.name} • Completed
                    </span>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Done
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
