import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getProfile, getStartups, getTech, getProjects, getAllPosts } from "@/lib/data";
import { getIntegrationStatus } from "@/lib/integrations/store";
import {
  signOut,
  saveStartup, deleteStartup,
  saveTech, deleteTech,
  saveProject, deleteProject,
  savePost, deletePost,
} from "./actions";
import { ProfileForm } from "./_components/ProfileForm";
import { ListEditor } from "./_components/ListEditor";
import { Integrations } from "./_components/Integrations";
import { AIPostGenerator } from "./_components/AIPostGenerator";

export const dynamic = "force-dynamic";

export default async function Admin() {
  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto w-full max-w-md px-5 py-20">
        <h1 className="text-xl font-semibold">Supabase not configured</h1>
        <p className="mt-2 text-sm text-muted">
          Copy <code>.env.example</code> to <code>.env.local</code>, fill in your Supabase URL + keys, run{" "}
          <code>supabase/schema.sql</code>, then reload.
        </p>
      </main>
    );
  }

  await requireAdmin();
  const [profile, startups, tech, projects, posts, gh] = await Promise.all([
    getProfile(),
    getStartups(),
    getTech(),
    getProjects(),
    getAllPosts(),
    getIntegrationStatus("github"),
  ]);

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
          <a href="/" className="text-sm text-muted hover:underline">View site →</a>
        </div>
        <form action={signOut}>
          <button className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-foreground/[0.04]">Sign out</button>
        </form>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        <ProfileForm profile={profile} />

        <Integrations github={gh} />

        <ListEditor
          title="Startups"
          description="Your products / indie projects with MRR badges."
          items={startups}
          saveAction={saveStartup}
          deleteAction={deleteStartup}
          fields={[
            { name: "name", label: "Name", half: true },
            { name: "mrr", label: "MRR badge", placeholder: "$4.2k/mo", half: true },
            { name: "logo", label: "Logo URL (falls back to emoji)", placeholder: "https://…/icon.png", half: true },
            { name: "emoji", label: "Emoji fallback", placeholder: "⚡", half: true },
            { name: "url", label: "URL", placeholder: "https://", half: true },
            { name: "sort_order", label: "Sort order", type: "number", half: true },
            { name: "tagline", label: "Tagline" },
          ]}
        />

        <ListEditor
          title="Tech Stack"
          description="Icons render from devicon — set slug to the devicon name (e.g. typescript, nextjs)."
          items={tech}
          saveAction={saveTech}
          deleteAction={deleteTech}
          fields={[
            { name: "name", label: "Name", half: true },
            { name: "slug", label: "devicon slug", placeholder: "typescript", half: true },
            { name: "url", label: "URL", placeholder: "https://", half: true },
            { name: "sort_order", label: "Sort order", type: "number", half: true },
          ]}
        />

        <ListEditor
          title="Featured Projects"
          items={projects}
          saveAction={saveProject}
          deleteAction={deleteProject}
          fields={[
            { name: "title", label: "Title", half: true },
            { name: "url", label: "URL", placeholder: "https://", half: true },
            { name: "description", label: "Description", textarea: true },
            { name: "sort_order", label: "Sort order", type: "number", half: true },
          ]}
        />

        <AIPostGenerator />

        <ListEditor
          title="Blog Posts"
          description="Markdown supported. Toggle Published to show a post on /blog."
          items={posts}
          saveAction={savePost}
          deleteAction={deletePost}
          fields={[
            { name: "title", label: "Title", half: true },
            { name: "slug", label: "Slug", placeholder: "my-post", half: true },
            { name: "excerpt", label: "Excerpt", textarea: true, rows: 2 },
            { name: "cover_image", label: "Cover image URL", placeholder: "https://", half: true },
            { name: "published", label: "Published", type: "checkbox", half: true },
            { name: "content", label: "Content (Markdown)", textarea: true, rows: 10 },
          ]}
        />
      </div>
    </main>
  );
}
