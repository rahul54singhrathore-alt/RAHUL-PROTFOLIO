"use client";

import { useFormStatus } from "react-dom";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-border bg-card p-5 ${className}`}>{children}</div>;
}

export function Field({
  label,
  name,
  defaultValue = "",
  defaultChecked,
  placeholder,
  type = "text",
  textarea,
  rows = 3,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  defaultChecked?: boolean;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
}) {
  const cls =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30";

  if (type === "checkbox") {
    return (
      <label className="flex items-center gap-2 py-1">
        <input name={name} type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 accent-foreground" />
        <span className="text-sm">{label}</span>
      </label>
    );
  }

  return (
    <label className="flex flex-col gap-1.5">
      <span className="label">{label}</span>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue} placeholder={placeholder} rows={rows} className={`${cls} font-mono`} />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          className={cls}
        />
      )}
    </label>
  );
}

export function SubmitButton({ children = "Save" }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-foreground px-3 py-1.5 text-sm font-medium text-background disabled:opacity-60"
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

export function FormStatus({ state }: { state: { ok?: boolean; error?: string } }) {
  if (state.error) return <span className="text-sm text-red-500">{state.error}</span>;
  if (state.ok) return <span className="text-sm text-green-600">Saved</span>;
  return null;
}
