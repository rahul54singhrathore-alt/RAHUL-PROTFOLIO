"use client";

import { useEffect, useState } from "react";

/** Thin gradient bar at the very top that fills with scroll depth. */
export function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? (h.scrollTop / max) * 100 : 0);
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[2px]" aria-hidden>
      <div
        className="h-full origin-left transition-[width] duration-150 ease-out"
        style={{ width: `${p}%`, background: "var(--grad)" }}
      />
    </div>
  );
}
