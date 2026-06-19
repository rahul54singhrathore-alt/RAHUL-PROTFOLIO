import type { Profile } from "@/lib/types";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="min-w-0">
      <div className="label mb-1.5">{label}</div>
      <div className="text-sm truncate">{children}</div>
    </div>
  );
}

export function ProfileHeader({ profile }: { profile: Profile }) {
  const initials = profile.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <header>
      <div className="flex items-center gap-5">
        <div className="group relative shrink-0 rise" style={{ animationDelay: "60ms" }}>
          {/* Spinning gradient ring behind the avatar. */}
          <div
            className="absolute -inset-[3px] rounded-full opacity-80 blur-[2px] transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: "conic-gradient(from 0deg, var(--g1), var(--g2), var(--g3), var(--g1))" }}
            aria-hidden
          />
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="relative h-16 w-16 rounded-full object-cover ring-2 ring-background transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-card text-sm font-medium text-muted ring-2 ring-background">
              {initials || "·"}
            </div>
          )}
          {/* live status dot */}
          <span className="absolute bottom-0.5 right-0.5 z-10 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-background">
            <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.6)]" />
          </span>
        </div>

        <div className="rise" style={{ animationDelay: "140ms" }}>
          <h1 className="text-[2.1rem] leading-none font-semibold tracking-tight">
            <span className="grad-text">{profile.name}</span>
          </h1>
          <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">{profile.role}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 rise" style={{ animationDelay: "220ms" }}>
        <Field label="Location">{profile.location}</Field>
        <Field label="Pronouns">{profile.pronouns}</Field>
      </div>
    </header>
  );
}
