import type { Profile } from "@/lib/types";

const icons = {
  x: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
  ),
  github: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.37.5 0 5.78 0 12.292c0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.563C20.565 21.917 24 17.495 24 12.292 24 5.78 18.627.5 12 .5z" /></svg>
  ),
  linkedin: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
  ),
  website: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
  ),
  email: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>
  ),
};

export function Socials({ profile }: { profile: Profile }) {
  const links: { key: keyof typeof icons; href: string; show: boolean }[] = [
    { key: "x", href: profile.x_handle ? `https://x.com/${profile.x_handle.replace(/^@/, "")}` : "", show: !!profile.x_handle },
    { key: "github", href: profile.github_username ? `https://github.com/${profile.github_username}` : "", show: !!profile.github_username },
    { key: "linkedin", href: profile.linkedin, show: !!profile.linkedin },
    { key: "website", href: profile.website, show: !!profile.website },
  ];
  const visible = links.filter((l) => l.show);
  if (!visible.length) return null;

  return (
    <div className="flex items-center gap-2.5">
      {visible.map((l) => (
        <a
          key={l.key}
          href={l.href}
          target={l.key === "email" ? undefined : "_blank"}
          rel="noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-[color-mix(in_oklab,var(--card)_70%,transparent)] text-muted backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:text-foreground hover:border-[color-mix(in_oklab,var(--g1)_50%,var(--border))] hover:shadow-[0_8px_20px_-12px_var(--ring)]"
          aria-label={l.key}
        >
          {icons[l.key]}
        </a>
      ))}
    </div>
  );
}
