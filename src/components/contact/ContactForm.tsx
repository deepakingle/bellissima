"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, message }),
      });

      if (!res.ok) {
        const msg =
          (await res.json().catch(() => null))?.error ?? "Submit failed.";
        throw new Error(msg);
      }

      setSuccess("Thanks! Your inquiry has been saved. We’ll get back soon.");
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : "Submit failed.");
    } finally {
      setLoading(false);
    }
  }

  const waNumber = "919999999999";
  const waText = `Hello Bellissima!%0A%0AInquiry:%0A${message}`;
  const waHref = `https://wa.me/${waNumber}?text=${waText}`;

  return (
    <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-5 sm:p-8 shadow-sm">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-neutral-200/80 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227]/50"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              className="w-full rounded-2xl border border-neutral-200/80 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227]/50"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email (optional)
          </label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full rounded-2xl border border-neutral-200/80 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227]/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-neutral-200/80 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227]/50"
            required
          />
        </div>

        {error ? (
          <p
            role="alert"
            className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2"
          >
            {error}
          </p>
        ) : null}
        {success ? (
          <p
            role="status"
            className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2"
          >
            {success}
          </p>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-full bg-gradient-to-br from-[#FFD6E0] to-[#F7B3C2] border border-neutral-200 px-6 py-3 text-sm sm:text-base font-semibold text-neutral-900 hover:shadow-sm transition-shadow disabled:opacity-60"
          >
            {loading ? "Sending..." : "Submit Inquiry"}
          </button>
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-full bg-white/70 border border-neutral-200 px-6 py-3 text-sm sm:text-base font-semibold text-neutral-900 hover:bg-white transition-colors text-center"
          >
            WhatsApp
          </a>
        </div>

        <p className="text-xs text-neutral-500">
          Replace the WhatsApp number in code when you’re ready for production.
        </p>
      </form>
    </div>
  );
}

