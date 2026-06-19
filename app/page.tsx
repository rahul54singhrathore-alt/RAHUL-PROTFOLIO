import Link from "next/link";
import { getPublicContent, getPublishedPosts } from "@/lib/data";
import { getContributions } from "@/lib/integrations/github";
import { formatDate } from "@/lib/site";
import { ProfileHeader } from "./_components/ProfileHeader";
import { SpotifyEmbed } from "./_components/SpotifyEmbed";
import { Socials } from "./_components/Socials";
import { ContributionGraph } from "./_components/ContributionGraph";
import { StartupGrid } from "./_components/StartupGrid";
import { FeaturedProjects } from "./_components/FeaturedProjects";
import { ExperienceList } from "./_components/ExperienceList";
import { Reveal } from "./_components/Reveal";
import { ViewCounter } from "./_components/ViewCounter";

// Rendered per-request on the worker so runtime-only secrets (GITHUB_TOKEN)
// are available — the GitHub contribution graph needs them. The underlying
// GitHub + Supabase fetches are themselves cached (revalidate: 1800), so this
// stays cheap at portfolio scale.
export const dynamic = "force-dynamic";

function Section({ label, children, id, n }: { label: string; id?: string; n: number; children: React.ReactNode }) {
  return (
    <Reveal as="section" id={id} className="pt-12 first:pt-0">
      <div className="mb-5 flex items-center gap-3">
        <span className="grad-text font-mono text-xs font-semibold tabular-nums">{String(n).padStart(2, "0")}</span>
        <span className="label">{label}</span>
      </div>
      {children}
    </Reveal>
  );
}

export default async function Home() {
  const [{ profile, startups, projects, experience }, contributions, posts] = await Promise.all([
    getPublicContent(),
    getContributions(),
    getPublishedPosts(),
  ]);
  const latestPosts = posts.slice(0, 3);

  let n = 0;

  return (
    <main className="mx-auto w-full max-w-5xl px-5">
      <div className="grid grid-cols-1 gap-10 pt-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-14">
        {/* ---- LEFT: fixed identity ---- */}
        <aside className="min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-1 lg:[scrollbar-width:none]">
          <ProfileHeader profile={profile} />

          <div className="mt-6 flex flex-col items-start gap-4 rise" style={{ animationDelay: "380ms" }}>
            {profile.status_text && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.5)]" />
                <span>{profile.status_text}</span>
              </div>
            )}
            <Socials profile={profile} />
          </div>

          <Link
            href="/contact"
            className="group mt-7 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.03] rise"
            style={{ animationDelay: "440ms" }}
          >
            Get in touch
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>

          {profile.spotify_playlist && (
            <div className="mt-7 rise" style={{ animationDelay: "520ms" }}>
              <div className="label mb-3">On repeat</div>
              <SpotifyEmbed playlistId={profile.spotify_playlist} />
            </div>
          )}
        </aside>

        {/* ---- RIGHT: scrolling content ---- */}
        <div className="flex min-w-0 flex-col">
          {contributions.weeks.length > 0 && (
            <Section label="Contributions" n={(n += 1)}>
              <ContributionGraph data={contributions} />
            </Section>
          )}

          {startups.length > 0 && (
            <Section label="Startups" n={(n += 1)}>
              <StartupGrid startups={startups} />
            </Section>
          )}

          {projects.length > 0 && (
            <Section label="Featured Projects" id="projects" n={(n += 1)}>
              <FeaturedProjects projects={projects} />
            </Section>
          )}

          {experience.length > 0 && (
            <Section label="Experience" id="experience" n={(n += 1)}>
              <ExperienceList experience={experience} />
            </Section>
          )}

          {latestPosts.length > 0 && (
            <Section label="Writing" n={(n += 1)}>
              <div className="divide-y divide-border border-t border-b border-border">
                {latestPosts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/blog/${p.slug}`}
                    className="group flex items-baseline justify-between gap-4 py-4"
                  >
                    <span className="text-sm font-medium"><span className="link-u">{p.title}</span></span>
                    <span className="shrink-0 text-xs text-muted">{formatDate(p.published_at)}</span>
                  </Link>
                ))}
              </div>
              <Link href="/blog" className="link-u mt-4 inline-block text-sm text-muted hover:text-foreground">
                All posts →
              </Link>
            </Section>
          )}
        </div>
      </div>

      <footer className="mt-20 mb-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>© {profile.name}</span>
        <div className="flex items-center gap-4">
          <ViewCounter />
          <span>Built with Next.js · Supabase</span>
        </div>
      </footer>
    </main>
  );
}
