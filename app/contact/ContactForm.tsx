"use client";

import { useState } from "react";
import { sendContactEmail } from "./actions";

const field =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-[color-mix(in_oklab,var(--g1)_55%,var(--border))] focus:ring-2 focus:ring-[var(--ring)]";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError(null);
    const result = await sendContactEmail(data);
    if (result.ok) {
      setStatus("ok");
      form.reset();
    } else {
      setStatus("error");
      setError(result.error ?? "Something went wrong — try again.");
    }
  }

  if (status === "ok") {
    return (
      <div className="card-x flex flex-col items-center gap-3 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15 text-green-500">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-base font-semibold">Message sent</h3>
        <p className="max-w-xs text-sm text-muted">Thanks for reaching out — I&apos;ll get back to you soon.</p>
        <button onClick={() => setStatus("idle")} className="mt-1 text-sm text-muted underline hover:text-foreground">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-x flex flex-col gap-4 p-5 sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="label">Name</span>
          <input name="name" placeholder="Jane Doe" required className={field} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="label">Email</span>
          <input name="email" type="email" placeholder="jane@email.com" required className={field} />
        </label>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="label">Message</span>
        <textarea name="message" placeholder="Tell me about your project, role, or idea…" rows={5} required className={`${field} resize-y`} />
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.01] disabled:opacity-60 sm:w-auto sm:self-start sm:px-6"
      >
        {status === "sending" ? "Sending…" : "Send message"}
        {status !== "sending" && <span className="transition-transform group-hover:translate-x-0.5">→</span>}
      </button>
    </form>
  );
}
