"use client";

import { useState } from "react";
import type { Contributions, ContributionDay } from "@/lib/types";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const levelClass = [
  "bg-zinc-900",
  "bg-green-900",
  "bg-green-700",
  "bg-green-500",
  "bg-green-400",
];

type Tip = { x: number; y: number; day: ContributionDay } | null;

function prettyDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export function ContributionGraph({ data, username }: { data: Contributions; username?: string }) {
  const [tip, setTip] = useState<Tip>(null);

  if (!data.weeks.length) {
    if (!username) return null;
    return (
      <div className="overflow-x-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://ghchart.rshah.org/22c55e/${username}`}
          alt={`${username} GitHub contributions`}
          className="min-w-full rounded"
          style={{ filter: "invert(0) opacity(0.9)" }}
        />
      </div>
    );
  }

  const monthLabels: { col: number; label: string }[] = [];
  let lastMonth = -1;
  data.weeks.forEach((week, i) => {
    const first = week[0];
    if (!first) return;
    const m = new Date(first.date).getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ col: i, label: MONTHS[m] });
      lastMonth = m;
    }
  });

  return (
    <div className="relative select-none" onMouseLeave={() => setTip(null)}>
      <div className="overflow-x-auto pb-1">
        <div className="inline-block min-w-full">
          <div className="mb-1 flex gap-[3px] pl-0">
            {data.weeks.map((_, i) => {
              const lbl = monthLabels.find((x) => x.col === i);
              return (
                <div key={i} className="w-[11px] text-[9px] tracking-wide text-muted">
                  {lbl ? lbl.label : ""}
                </div>
              );
            })}
          </div>
          <div className="flex gap-[3px]">
            {data.weeks.map((week, wi) => (
              <div
                key={wi}
                className="rise flex flex-col gap-[3px]"
                style={{ animationDelay: `${Math.min(wi * 12, 700)}ms`, animationDuration: "0.5s" }}
              >
                {week.map((day) => (
                  <div
                    key={day.date}
                    onMouseEnter={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      const host = e.currentTarget.closest(".relative")!.getBoundingClientRect();
                      setTip({ x: r.left - host.left + r.width / 2, y: r.top - host.top, day });
                    }}
                    className={`h-[11px] w-[11px] rounded-[2px] outline outline-0 outline-foreground/20 transition-transform duration-150 hover:scale-[1.6] hover:outline-1 ${levelClass[day.level]}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {tip && (
        <div
          className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-[11px] shadow-md"
          style={{ left: tip.x, top: tip.y - 6 }}
        >
          <span className="font-semibold">
            {tip.day.count === 0 ? "No" : tip.day.count} contribution{tip.day.count === 1 ? "" : "s"}
          </span>
          <span className="text-muted"> · {prettyDate(tip.day.date)}</span>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-y-2 text-[11px] text-muted">
        <span>
          <span className="font-medium text-foreground">{data.total}</span> contributions{data.range ? ` · ${data.range}` : ""}
        </span>
        <span className="flex items-center gap-1">
          Less
          {levelClass.map((c, i) => (
            <span key={i} className={`h-[10px] w-[10px] rounded-[2px] ${c}`} />
          ))}
          More
        </span>
      </div>
    </div>
  );
}
