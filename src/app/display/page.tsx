"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Volume2, VolumeX, Maximize2, Minimize2, Bell, AlertTriangle, Clock, ArrowLeft } from "lucide-react";

export default function TvDisplayPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [currentCall, setCurrentCall] = useState<any | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const audioContextRef = useRef<AudioContext | null>(null);

  // Dual tone hospital chime using Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      // 587.33 Hz (D5) -> 880 Hz (A5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880, now + 0.3);
      gain2.gain.setValueAtTime(0.3, now + 0.3);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.3);
      osc2.stop(now + 1.2);
    } catch (e) {
      console.warn("Audio chime prevented by browser policy", e);
    }
  };

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(
        d.toLocaleTimeString("en-PK", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch current visits
  const fetchQueue = async () => {
    try {
      const res = await fetch("/api/visits");
      const data = await res.json();
      if (data.visits) {
        setVisits(data.visits);
      }
    } catch (err) {
      console.error("Queue fetch error:", err);
    }
  };

  useEffect(() => {
    fetchQueue();

    // SSE connection
    const eventSource = new EventSource("/api/queue/stream");

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.event === "PATIENT_CALLED") {
          setCurrentCall(payload);
          playChime();
          fetchQueue();
        } else if (
          payload.event === "NEW_VISIT" ||
          payload.event === "STATUS_CHANGED"
        ) {
          fetchQueue();
        }
      } catch (err) {
        // Heartbeat or ping
      }
    };

    return () => {
      eventSource.close();
    };
  }, [soundEnabled]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullScreen(false);
    }
  };

  // Group visits per doctor
  const doctorBoards: Record<string, any> = {};
  visits.forEach((v) => {
    if (!doctorBoards[v.doctorId]) {
      doctorBoards[v.doctorId] = {
        doctor: v.doctor,
        department: v.department,
        inConsultation: null,
        waiting: [],
      };
    }
    if (v.status === "IN_CONSULTATION") {
      doctorBoards[v.doctorId].inConsultation = v;
    } else if (v.status === "WAITING") {
      doctorBoards[v.doctorId].waiting.push(v);
    }
  });

  const doctorsList = Object.values(doctorBoards);

  // All waiting list (next 8)
  const allWaiting = visits
    .filter((v) => v.status === "WAITING")
    .sort((a, b) => {
      if (a.priority === "EMERGENCY" && b.priority !== "EMERGENCY") return -1;
      if (b.priority === "EMERGENCY" && a.priority !== "EMERGENCY") return 1;
      return a.tokenNumber - b.tokenNumber;
    })
    .slice(0, 8);

  const activeServing = currentCall
    ? {
        tokenNumber: currentCall.tokenNumber,
        patientName: currentCall.patientName,
        doctorName: currentCall.doctorName,
        roomNo: currentCall.roomNo,
      }
    : visits.find((v) => v.status === "IN_CONSULTATION")
    ? {
        tokenNumber: visits.find((v) => v.status === "IN_CONSULTATION")?.tokenNumber,
        patientName: visits.find((v) => v.status === "IN_CONSULTATION")?.patient?.fullName,
        doctorName: visits.find((v) => v.status === "IN_CONSULTATION")?.doctor?.name,
        roomNo: visits.find((v) => v.status === "IN_CONSULTATION")?.doctor?.roomNo,
      }
    : null;

  return (
    <div className="min-h-screen bg-[#F6F9FC] text-[#1B2733] flex flex-col justify-between selection:bg-[#E8F1F9]">
      {/* 1. High-Contrast Top Banner Bar */}
      <header className="h-20 bg-white border-b-2 border-[#0B4F8A] px-6 sm:px-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/" className="relative w-64 h-12 block" title="Back to Hospital Portal">
            <Image
              src="/images/logo.svg"
              alt="Naseem Ijaz Hospital"
              fill
              priority
              className="object-contain object-left"
            />
          </Link>

          <div className="hidden sm:block h-8 w-px bg-[#E3E9EF]" />

          <div className="hidden md:block">
            <span className="text-sm font-bold text-[#0B4F8A] font-heading block leading-tight">
              OUTPATIENT WAITING LOUNGE DISPLAY
            </span>
            <span className="text-xs text-[#5B6B7B] font-urdu block">
              شعبہ آؤٹ پیشنٹ &bull; لائیو ٹوکن بورڈ
            </span>
          </div>
        </div>

        {/* Live Status Indicators & Controls */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F5F3] border border-[#1E9E8F]/40 text-[#167C70] text-xs font-mono font-bold tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E9E8F] animate-pulse" />
            <span>LIVE QUEUE ACTIVE</span>
          </div>

          <div className="text-2xl font-mono font-bold text-[#0B4F8A] tracking-wider hidden sm:block">
            {currentTime || "10:00:00 AM"}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playChime();
              }}
              className="p-2.5 rounded-lg bg-[#F6F9FC] border border-[#E3E9EF] text-[#5B6B7B] hover:text-[#0B4F8A] transition-colors cursor-pointer"
              title={soundEnabled ? "Mute Calling Chime" : "Enable Calling Chime"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-[#1E9E8F]" /> : <VolumeX className="w-5 h-5 text-[#8A97A5]" />}
            </button>

            <button
              onClick={toggleFullScreen}
              className="p-2.5 rounded-lg bg-[#F6F9FC] border border-[#E3E9EF] text-[#5B6B7B] hover:text-[#0B4F8A] transition-colors cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main TV Board Area */}
      <main className="flex-1 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Giant Now Serving Navy Card */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Giant Callout Navy Card */}
          <div className="rounded-2xl bg-[#0B3A66] text-white p-8 md:p-10 shadow-lg text-center relative overflow-hidden border-2 border-[#1E9E8F]">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#1E9E8F] text-white font-bold text-xs uppercase tracking-widest mb-4 shadow-sm">
              <Bell className="w-4 h-4 animate-bounce" />
              <span>NOW SERVING / برائے مہربانی تشریف لائیں</span>
            </div>

            {/* Giant Token Number */}
            <div className="font-heading font-black text-8xl md:text-9xl text-white tracking-tight my-2">
              #{String(activeServing?.tokenNumber || 1).padStart(2, "0")}
            </div>

            {/* Patient Name */}
            <h2 className="text-3xl md:text-4xl font-bold text-teal-200 truncate mt-2">
              {activeServing?.patientName || "Waiting for next patient..."}
            </h2>

            {/* Room & Doctor Callout */}
            <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-2 gap-4 text-left">
              <div className="p-4 rounded-xl bg-white/10">
                <span className="text-xs uppercase text-slate-300 font-bold block mb-1">
                  Proceed To Room
                </span>
                <span className="text-3xl font-black text-amber-300 block font-mono">
                  {activeServing?.roomNo || "OPD-101"}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white/10">
                <span className="text-xs uppercase text-slate-300 font-bold block mb-1">
                  Consultant Doctor
                </span>
                <span className="text-xl font-bold text-white block truncate">
                  {activeServing?.doctorName || "Dr. Tariq Mahmood"}
                </span>
              </div>
            </div>
          </div>

          {/* Doctor-wise Active Serving Strip */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B6B7B]">
              Active Consultant Rooms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctorsList.slice(0, 4).map((board: any) => (
                <div
                  key={board.doctor.id}
                  className="hospital-card p-4 bg-white border border-[#E3E9EF] flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-sm text-[#1B2733] font-heading">
                      {board.doctor.name}
                    </div>
                    <div className="text-xs text-[#5B6B7B]">
                      Room <span className="font-bold font-mono text-[#0B4F8A]">{board.doctor.roomNo}</span> &bull; {board.department.name}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-[#5B6B7B] uppercase font-bold">Serving</div>
                    <div className="font-mono text-xl font-black text-[#0B4F8A]">
                      {board.inConsultation ? `#${board.inConsultation.tokenNumber}` : "—"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Next Tokens Queue List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="hospital-card bg-white p-6 shadow-sm border border-[#E3E9EF]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E3E9EF]">
              <div>
                <h3 className="text-base font-bold font-heading text-[#0B4F8A]">
                  Upcoming Tokens
                </h3>
                <span className="text-xs text-[#5B6B7B] font-urdu block">
                  اگلے مریض برائے مہربانی تیار رہیں
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E8F1F9] text-[#0B4F8A]">
                {allWaiting.length} In Queue
              </span>
            </div>

            <div className="space-y-2.5">
              {allWaiting.length > 0 ? (
                allWaiting.map((v, idx) => (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-xl bg-[#F6F9FC] border border-[#E3E9EF] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-10 h-10 rounded-lg bg-[#0B4F8A] text-white font-mono font-bold text-sm flex items-center justify-center">
                        #{v.tokenNumber}
                      </span>
                      <div>
                        <span className="font-bold text-sm text-[#1B2733] block truncate max-w-[160px]">
                          {v.patient.fullName}
                        </span>
                        <span className="text-xs text-[#5B6B7B]">
                          {v.doctor.name} ({v.doctor.roomNo})
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {v.priority === "EMERGENCY" ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700 border border-red-300">
                          PRIORITY
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-[#1E9E8F]">
                          Position #{idx + 1}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-[#8A97A5] text-sm">
                  All waiting patients have been attended.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 3. Bottom Ticker with Hospital Message */}
      <footer className="h-14 bg-[#0B3A66] text-white px-6 flex items-center justify-between border-t border-[#092E52] text-xs font-medium overflow-hidden">
        <div className="flex items-center gap-2 font-bold text-amber-300 shrink-0">
          <Clock className="w-4 h-4" />
          <span>HOSPITAL NOTICE:</span>
        </div>

        <div className="truncate px-4 text-slate-200">
          Welcome to Naseem Ijaz Hospital &bull; Please wait comfortably in the lobby until your token number is displayed and called &bull; For emergency assistance, please notify Reception Desk 1 immediately &bull; Helpline: +92 42 3578 9999
        </div>

        <div className="shrink-0 text-slate-300 font-mono hidden sm:block">
          Plot 14-B Jail Road, Lahore
        </div>
      </footer>
    </div>
  );
}
