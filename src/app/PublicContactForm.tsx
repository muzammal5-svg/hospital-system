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
      <div className="p-6 rounded-xl bg-[#E6F5F3] border border-[#1E9E8F]/30 text-center space-y-3 animate-in fade-in">
        <CheckCircle2 className="w-8 h-8 text-[#1E9E8F] mx-auto" />
        <h4 className="font-bold text-[#1B2733] text-sm font-heading">Message Sent Successfully</h4>
        <p className="text-xs text-[#5B6B7B]">
          Thank you for reaching out to Naseem Ijaz Hospital. Our administration team has received your query and will reply promptly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-xs font-semibold text-[#0B4F8A] underline hover:text-[#093F6E] pt-2 block mx-auto cursor-pointer"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-[#D64545] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-medium">{error}</span>
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
          <span className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] block mb-1">Your Full Name *</span>
          <input
            type="text"
            placeholder="e.g. Imran Ali"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-10"
            required
          />
        </div>

        <div>
          <span className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] block mb-1">Email Address *</span>
          <input
            type="email"
            placeholder="e.g. imran@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-10"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] block mb-1">Phone Number (Optional)</span>
          <input
            type="tel"
            placeholder="0300-1234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] font-mono h-10"
          />
        </div>

        <div>
          <span className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] block mb-1">Subject *</span>
          <input
            type="text"
            placeholder="e.g. Consultation Inquiry / Executive Checkup"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg px-3.5 py-2.5 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] h-10"
            required
          />
        </div>
      </div>

      <div>
        <span className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] block mb-1">Message *</span>
        <textarea
          rows={3}
          placeholder="How can our clinical or administrative team assist you?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-[#F6F9FC] dark:bg-[#111B27] border border-[#E3E9EF] dark:border-[#23374D] rounded-lg p-3 text-[#1B2733] dark:text-[#E6EEF5] outline-none focus:border-[#0B4F8A] resize-none text-xs"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center text-xs font-bold disabled:opacity-50"
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
