"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle(e: React.MouseEvent) {
    const next = !dark;
    setDark(next);

    const apply = () => {
      document.documentElement.classList.toggle("dark", next);
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {}
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startVT = (document as Document & {
      startViewTransition?: (cb: () => void) => void;
    }).startViewTransition;

    if (!reduce && typeof startVT === "function") {
      // Anchor the circular reveal at the switch.
      const root = document.documentElement;
      root.style.setProperty("--tx", `${e.clientX}px`);
      root.style.setProperty("--ty", `${e.clientY}px`);
      startVT.call(document, apply);
    } else {
      apply();
    }
  }

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label="Toggle theme"
      className="relative flex h-6 w-11 items-center rounded-full border border-border bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] px-0.5 transition-colors"
    >
      {/* track icons */}
      <svg className="absolute left-1.5 h-3 w-3 text-amber-500/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1 1M17.4 17.4l1 1M18.4 5.6l-1 1M6.6 17.4l-1 1" />
      </svg>
      <svg className="absolute right-1.5 h-3 w-3 text-indigo-400/80" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      {/* sliding knob */}
      <span
        className="relative z-10 h-5 w-5 rounded-full bg-foreground shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: dark ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}
