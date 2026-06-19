"use client";

import type { Experience } from "@/lib/types";

function formatPeriod(start: string, end: string | null): string {
  const fmt = (d: string) => {
    const [y, m] = d.split("-");
    return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };
  return `${fmt(start)} — ${end ? fmt(end) : "Present"}`;
}

export function ExperienceList({ experience }: { experience: Experience[] }) {
  if (!experience.length) return null;
  return (
    <div className="flex flex-col gap-6">
      {experience.map((e) => (
        <div key={e.id} className="group relative pl-4">
          <span
            className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full opacity-30 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: "var(--grad)" }}
            aria-hidden
          />
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
            <h3 className="text-sm font-semibold">{e.role}</h3>
            <span className="text-sm font-medium grad-text">{e.company}</span>
          </div>
          <p className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted">
            {formatPeriod(e.start_date, e.end_date)}
          </p>
          <p className="mt-2 text-sm text-muted leading-relaxed">{e.description}</p>
        </div>
      ))}
    </div>
  );
}
