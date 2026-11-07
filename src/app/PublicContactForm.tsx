"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";

export default function PublicContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          subject: subject.trim(),
          message: message.trim(),
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message.");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 rounded-2xl bg-teal-950/40 border border-teal-500/30 text-center space-y-3">
        <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
        <h4 className="font-bold text-white text-sm">Message Sent Successfully</h4>
        <p className="text-xs text-[#9A958C]">
          Thank you for reaching out to Naseem Ijaz Hospital. Our administration team has received your query and will reply promptly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-xs font-semibold text-teal-400 underline hover:text-teal-300 pt-2 block mx-auto"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Honeypot */}
      <input
        type="text"
        name="honeypot"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <span className="text-[11px] text-neutral-400 block mb-1">Your Full Name *</span>
          <input
            type="text"
            placeholder="e.g. Imran Ali"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#11171E] border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-teal-500"
            required
          />
        </div>

        <div>
          <span className="text-[11px] text-neutral-400 block mb-1">Email Address *</span>
          <input
            type="email"
            placeholder="e.g. imran@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#11171E] border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-teal-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <span className="text-[11px] text-neutral-400 block mb-1">Phone Number (Optional)</span>
          <input
            type="tel"
            placeholder="0300-1234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-[#11171E] border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-teal-500 font-mono"
          />
        </div>

        <div>
          <span className="text-[11px] text-neutral-400 block mb-1">Subject *</span>
          <input
            type="text"
            placeholder="e.g. Surgery Inquiry / Executive Checkup"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-[#11171E] border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-teal-500"
            required
          />
        </div>
      </div>

      <div>
        <span className="text-[11px] text-neutral-400 block mb-1">Message *</span>
        <textarea
          rows={3}
          placeholder="How can our clinical or administrative team assist you?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-[#11171E] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-teal-500 resize-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-pill w-full bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-teal disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Inquiry...</span>
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            <span>Submit Inquiry</span>
          </>
        )}
      </button>
    </form>
  );
}
