"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { sendAdminOtp } from "./actions";

const inputCls =
  "rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-foreground/30";
const btnCls =
  "rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background disabled:opacity-60";

export default function Login() {
  const router = useRouter();
  const [sent, action, sending] = useActionState(sendAdminOtp, { ok: false });

  // Once a code is sent we switch to the verify step.
  const email = sent.ok ? sent.email! : null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-5">
      <h1 className="text-xl font-semibold tracking-tight">Admin sign in</h1>
      <p className="mt-1 text-sm text-muted">
        {email
          ? `Enter the 6-digit code sent to ${email}.`
          : "We'll email you a one-time login code."}
      </p>

      {email ? (
        <VerifyForm email={email} onDone={() => router.push("/admin")} />
      ) : (
        <form action={action} className="mt-6 flex flex-col gap-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            autoFocus
            className={inputCls}
          />
          {sent.error && <p className="text-sm text-red-500">{sent.error}</p>}
          <button type="submit" disabled={sending} className={btnCls}>
            {sending ? "Sending…" : "Send code"}
          </button>
        </form>
      )}

      <p className="mt-4 text-xs text-muted">
        Only allowlisted admin emails can request a code.
      </p>
    </main>
  );
}

function VerifyForm({ email, onDone }: { email: string; onDone: () => void }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.refresh();
    onDone();
  }

  return (
    <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="123456"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
        autoFocus
        maxLength={6}
        className={`${inputCls} tracking-[0.4em]`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={loading} className={btnCls}>
        {loading ? "Verifying…" : "Verify & sign in"}
      </button>
    </form>
  );
}
