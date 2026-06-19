import type { Project } from "@/lib/types";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  return (
    <div className="divide-y divide-border border-t border-b border-border">
      {projects.map((p) => {
        const linked = p.url && p.url !== "#";
        const Row = (
          <div className="group relative flex items-start justify-between gap-4 py-4 pl-4 transition-[padding] duration-300 hover:pl-5">
            <span
              className="absolute left-0 top-4 bottom-4 w-[2px] origin-top scale-y-0 rounded-full transition-transform duration-300 group-hover:scale-y-100"
              style={{ background: "var(--grad)" }}
              aria-hidden
            />
            <div>
              <h3 className="text-sm font-medium"><span className="link-u">{p.title}</span></h3>
              <p className="mt-1 text-sm text-muted leading-relaxed max-w-xl">{p.description}</p>
            </div>
            {linked && (
              <svg className="mt-1 shrink-0 text-muted group-hover:text-foreground transition-colors" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            )}
          </div>
        );
        return linked ? (
          <a key={p.id} href={p.url} target="_blank" rel="noreferrer" className="block">{Row}</a>
        ) : (
          <div key={p.id}>{Row}</div>
        );
      })}
    </div>
  );
}
