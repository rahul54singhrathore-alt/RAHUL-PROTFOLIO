"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

/** Total site visits. Increments once per browser session, then just reads. */
export function ViewCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const sb = createClient()!;
    (async () => {
      try {
        if (sessionStorage.getItem("pv-counted")) {
          const { data } = await sb.from("page_views").select("views").eq("slug", "site").maybeSingle();
          if (data) setCount(Number(data.views));
        } else {
          const { data, error } = await sb.rpc("bump_views", { p_slug: "site" });
          if (!error && data != null) {
            setCount(Number(data));
            sessionStorage.setItem("pv-counted", "1");
          }
        }
      } catch {
        /* counter is best-effort */
      }
    })();
  }, []);

  if (count == null) return null;

  return (
    <span className="inline-flex items-center gap-1.5" title="Total visits">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span className="tabular-nums">{count.toLocaleString()}</span> views
    </span>
  );
}
