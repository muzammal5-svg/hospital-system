"use client";

import React, { useState, useEffect, useRef } from "react";
import { Tv, Volume2, VolumeX, Maximize2, Minimize2, Activity, Bell, AlertTriangle } from "lucide-react";

export default function TvDisplayPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [currentCall, setCurrentCall] = useState<any | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play hospital chime sound using Web Audio API (zero external mp3 dependency, always works)
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
      // Dual tone pleasant airport/hospital chime: 587.33 Hz (D5) -> 880 Hz (A5)
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

    // Connect to Server-Sent Events (SSE)
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

    eventSource.onerror = () => {
      // Auto reconnect handled by browser
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

  // Compute active doctor boards
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

  // General waiting next 5
  const allWaiting = visits
    .filter((v) => v.status === "WAITING")
    .sort((a, b) => {
      if (a.priority === "EMERGENCY" && b.priority !== "EMERGENCY") return -1;
      if (b.priority === "EMERGENCY" && a.priority !== "EMERGENCY") return 1;
      return a.tokenNumber - b.tokenNumber;
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between selection:bg-teal-500 selection:text-black">
      {/* Top Banner Bar */}
      <header className="h-20 border-b border-white/10 px-8 flex items-center justify-between bg-[#0A0A0A]/90">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-teal-500 flex items-center justify-center text-black font-black shadow-glow-teal">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl tracking-tight leading-none text-white">
              NASEEM IJAZ HOSPITAL
            </h1>
            <span className="text-xs text-teal-400 font-semibold uppercase tracking-widest block mt-1">
              OPD Waiting Room & Live Consultation Display • لاہور
            </span>
          </div>
        </div>

        {/* Live Status Indicators & Fullscreen */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <span>LIVE QUEUE ACTIVE</span>
          </div>

          <div className="text-xl font-mono font-bold text-white tracking-wider">
            {currentTime || "10:00:00 AM"}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playChime();
              }}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={soundEnabled ? "Mute Calling Chime" : "Enable Calling Chime"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-teal-400" /> : <VolumeX className="w-5 h-5 text-neutral-400" />}
            </button>

            <button
              onClick={toggleFullScreen}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main TV Screen Content */}
      <main className="flex-1 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Now Serving Giant Callout Banner */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Call Alert Card */}
          <div className="relative rounded-3xl border-2 border-teal-500 bg-gradient-to-br from-[#0c2738] to-[#0A0A0A] p-8 text-center shadow-glow-teal overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-teal-400 via-teal-200 to-teal-500" />

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 font-bold uppercase tracking-widest text-xs mb-4">
              <Bell className="w-4 h-4 animate-bounce text-teal-400" />
              <span>NOW SERVING / براہ کرم تشریف لائیں</span>
            </div>

            {/* Giant Token */}
            <div className="font-display font-black text-8xl md:text-9xl text-white tracking-tighter my-2">
              #{String(currentCall?.tokenNumber || (visits.find(v => v.status === "IN_CONSULTATION")?.tokenNumber || 1)).padStart(2, "0")}
            </div>

            {/* Patient Name */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-teal-200 truncate">
              {currentCall?.patientName || visits.find(v => v.status === "IN_CONSULTATION")?.patient?.fullName || "Patient In Consultation"}
            </h2>

            {/* Doctor & Room */}
            <div className="mt-6 pt-6 border-t border-white/10 flex justify-around text-left">
              <div>
                <span className="text-xs uppercase text-[#9A958C] block font-semibold">Proceed To Room</span>
                <span className="text-2xl font-black text-amber-400 block font-mono">
                  {currentCall?.roomNo || visits.find(v => v.status === "IN_CONSULTATION")?.doctor?.roomNo || "OPD-101"}
                </span>
              </div>
              <div>
                <span className="text-xs uppercase text-[#9A958C] block font-semibold">Consultant</span>
                <span className="text-lg font-bold text-white block">
                  {currentCall?.doctorName || visits.find(v => v.status === "IN_CONSULTATION")?.doctor?.name || "Dr. Tariq Mahmood"}
                </span>
              </div>
            </div>
          </div>

          {/* Next in Line Strip */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-neutral-400 mb-4 flex items-center justify-between">
              <span>Next 5 Patients in Line (تیار رہیں)</span>
              <span className="text-xs text-teal-400 font-mono">{allWaiting.length} Waiting</span>
            </h3>

            {allWaiting.length === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-500">
                Lobby queue is clear. All registered patients have been called.
              </div>
            ) : (
              <div className="space-y-2.5">
                {allWaiting.map((v, i) => (
                  <div
                    key={v.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border ${
                      v.priority === "EMERGENCY"
                        ? "bg-red-950/40 border-red-500/50 text-red-200"
                        : "bg-[#11171E] border-white/5 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 font-mono font-bold flex items-center justify-center text-sm">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-bold text-sm block">{v.patient?.fullName}</span>
                        <span className="text-xs text-[#9A958C]">
                          {v.doctor?.name} • Room {v.doctor?.roomNo}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-display font-black text-xl text-teal-300 block">
                        #{String(v.tokenNumber).padStart(2, "0")}
                      </span>
                      {v.priority === "EMERGENCY" && (
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest animate-pulse">
                          EMERGENCY
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Multi-Doctor Consultation Boards */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
            <h3 className="font-display font-bold text-base text-white uppercase tracking-wider mb-6 flex items-center justify-between">
              <span>Doctors OPD Boards (کنسلٹنٹس کی صورتحال)</span>
              <span className="text-xs text-teal-400 font-mono">{doctorsList.length} Rooms Active</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctorsList.map(({ doctor, department, inConsultation, waiting }) => (
                <div
                  key={doctor.id}
                  className="rounded-2xl border border-white/10 bg-[#11171E] p-4 flex flex-col justify-between"
                >
                  {/* Doctor Details */}
                  <div className="border-b border-white/10 pb-3 mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-white">{doctor.name}</h4>
                        <span className="text-xs text-teal-400 font-medium block">
                          {department?.name}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 font-mono font-black text-xs">
                        {doctor.roomNo}
                      </span>
                    </div>
                  </div>

                  {/* Active Patient In Room */}
                  <div className="mb-3">
                    <span className="text-[10px] uppercase font-bold text-[#9A958C] block mb-1">
                      Currently In Consultation
                    </span>
                    {inConsultation ? (
                      <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-500/30 flex justify-between items-center">
                        <span className="font-bold text-xs text-teal-200 truncate">
                          {inConsultation.patient.fullName}
                        </span>
                        <span className="font-mono font-black text-base text-teal-400 ml-2">
                          #{String(inConsultation.tokenNumber).padStart(2, "0")}
                        </span>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-neutral-500 text-center">
                        Available / Awaiting Next Token
                      </div>
                    )}
                  </div>

                  {/* Waiting Counter */}
                  <div className="flex items-center justify-between text-xs text-[#9A958C] pt-2 border-t border-white/5">
                    <span>Waiting in Queue:</span>
                    <span className="font-mono font-bold text-white bg-black/40 px-2 py-0.5 rounded border border-white/5">
                      {waiting.length} Patients
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Scrolling Emergency Ticker */}
      <footer className="h-12 bg-teal-950/80 border-t border-teal-500/30 px-6 flex items-center justify-between text-xs text-teal-200">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] uppercase">
            HOSPITAL NOTICE
          </span>
          <span className="font-medium">
            Please keep your 80mm Token Slip ready. If you require wheelchair or emergency assistance, inform Reception Desk 1 immediately.
          </span>
        </div>
        <div className="font-mono text-teal-300 font-bold shrink-0">
          UAN: +92 42 3578 9000
        </div>
      </footer>
    </div>
  );
}
