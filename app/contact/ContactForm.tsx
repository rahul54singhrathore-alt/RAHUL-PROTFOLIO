"use client";

import { useState } from "react";

const inputBase =
  "w-full bg-transparent border-b-2 border-border pb-1.5 pt-1 text-sm outline-none transition-colors duration-200 placeholder:text-muted/50 focus:border-[var(--g1)]";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-border pb-5">
      <span className="text-sm text-muted">
        {label}
        {required && <span className="ml-0.5 text-red-400">*</span>}
      </span>
      {children}
    </div>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const { sendContactEmail } = await import("./actions");
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
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="h-2.5 w-full" style={{ background: "var(--grad)" }} />
        <div className="flex flex-col items-center gap-3 p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15 text-green-500">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h3 className="text-base font-semibold">Response recorded</h3>
          <p className="max-w-xs text-sm text-muted">Thanks for reaching out — I&apos;ll get back to you soon.</p>
          <button onClick={() => setStatus("idle")} className="mt-1 text-sm text-[var(--g1)] hover:underline">
            Submit another response
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Google Forms-style top accent bar */}
      <div className="h-2.5 w-full" style={{ background: "var(--grad)" }} />

      {/* Form header */}
      <div className="border-b border-border px-6 py-5">
        <h2 className="text-xl font-semibold tracking-tight">Get in touch</h2>
        <p className="mt-1 text-sm text-muted">Have a project, role, or idea? I&apos;d love to hear it.</p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-0 px-6 py-5">
        <div className="flex flex-col gap-5">
          <Field label="Name" required>
            <input name="name" placeholder="Your name" required className={inputBase} />
          </Field>

          <Field label="Email" required>
            <input name="email" type="email" placeholder="your@email.com" required className={inputBase} />
          </Field>

          <div className="flex flex-col gap-1.5 pb-2">
            <span className="text-sm text-muted">
              Message<span className="ml-0.5 text-red-400">*</span>
            </span>
            <textarea
              name="message"
              placeholder="Tell me about your project, role, or idea…"
              rows={5}
              required
              className={`${inputBase} resize-y`}
            />
          </div>
        </div>

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex items-center justify-between">
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-md px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--grad)" }}
          >
            {status === "sending" ? "Submitting…" : "Submit"}
          </button>
          <span className="text-xs text-muted">
            <span className="text-red-400">*</span> Required
          </span>
        </div>
      </div>
    </form>
  );
}
