import type { Startup } from "@/lib/types";

// Deterministic sparkline from the name (SSR-safe — no Math.random).
function sparkPath(seed: string, w = 240, h = 48) {
  const n = 16;
  const pts: number[] = [];
  let acc = 0;
  for (let i = 0; i < n; i++) {
    const c = seed.charCodeAt((i * 7) % Math.max(seed.length, 1)) || 65;
    acc += ((c % 9) - 3) * 0.6;
    pts.push(acc);
  }
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const span = max - min || 1;
  const step = w / (n - 1);
  const coords = pts.map((p, i) => {
    const x = i * step;
    const y = h - 4 - ((p - min) / span) * (h - 10);
    return [x, y] as const;
  });
  const line = coords.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  return { line, area };
}

export function StartupGrid({ startups }: { startups: Startup[] }) {
  if (!startups.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {startups.map((s) => {
        const { line, area } = sparkPath(s.name + s.id);
        const gid = `g-${s.id}`;
        const linked = s.url && s.url !== "#";
        const Card = (
          <div className="card-x group h-full p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-card text-base leading-none transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  {s.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.logo} alt={s.name} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    s.emoji
                  )}
                </span>
                <span className="truncate text-sm font-semibold">{s.name}</span>
              </div>
              {s.mrr && (
                <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-foreground/80">
                  {s.mrr}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">{s.tagline}</p>
            <svg viewBox="0 0 240 48" className="mt-3 w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(234 179 8 / 0.28)" />
                  <stop offset="100%" stopColor="rgb(234 179 8 / 0)" />
                </linearGradient>
              </defs>
              <path d={area} fill={`url(#${gid})`} />
              <path d={line} fill="none" stroke="rgb(234 179 8)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
        );
        return linked ? (
          <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="block">{Card}</a>
        ) : (
          <div key={s.id}>{Card}</div>
        );
      })}
    </div>
  );
}
