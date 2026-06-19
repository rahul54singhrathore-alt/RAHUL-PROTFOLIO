"use client";

import { useState } from "react";
import type { Tech } from "@/lib/types";

// devicon variants vary per icon; try a couple before falling back to a text chip.
function variants(slug: string) {
  return [
    `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`,
    `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-plain.svg`,
    `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original-wordmark.svg`,
  ];
}

function TechIcon({ tech }: { tech: Tech }) {
  const [idx, setIdx] = useState(0);
  const urls = variants(tech.slug);
  const failed = idx >= urls.length;

  const inner = failed ? (
    <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-xs font-medium">
      {tech.name.slice(0, 2)}
    </span>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={urls[idx]}
      alt={tech.name}
      width={36}
      height={36}
      className="h-9 w-9 object-contain"
      onError={() => setIdx((i) => i + 1)}
      loading="lazy"
    />
  );

  const content = (
    <span className="group relative flex flex-col items-center" title={tech.name}>
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-[color-mix(in_oklab,var(--card)_70%,transparent)] backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-[color-mix(in_oklab,var(--g1)_50%,var(--border))] group-hover:shadow-[0_10px_24px_-12px_var(--ring)]">
        {inner}
      </span>
      <span className="pointer-events-none absolute -bottom-5 whitespace-nowrap text-[10px] font-medium text-muted opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
        {tech.name}
      </span>
    </span>
  );

  return tech.url && tech.url !== "#" ? (
    <a href={tech.url} target="_blank" rel="noreferrer">
      {content}
    </a>
  ) : (
    content
  );
}

export function TechStack({ tech }: { tech: Tech[] }) {
  if (!tech.length) return null;
  return (
    <div className="flex flex-wrap gap-3 pb-4">
      {tech.map((t) => (
        <TechIcon key={t.id} tech={t} />
      ))}
    </div>
  );
}
