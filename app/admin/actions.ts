"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { upsertIntegration, deleteIntegration } from "@/lib/integrations/store";
import { getProfile, getStartups } from "@/lib/data";
import { buildPersona, generateBlogPost } from "@/lib/integrations/gemini";
import { generateAndStoreCover } from "@/lib/integrations/geminiImage";
import type { IntegrationProvider } from "@/lib/types";

function refresh() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/blog");
  revalidatePath("/admin");
}

type State = { ok?: boolean; error?: string };

// ----------------------------------------------------------------------------
// Profile
// ----------------------------------------------------------------------------
// Accepts "", a full http(s) URL, or a site-relative/asset path (e.g. "/sourabh.jpg"
// or "sourabh.jpg"). The public profile renders these directly.
const urlish = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => v === "" || /^https?:\/\//i.test(v) || /^[\w./-]+$/.test(v),
    "Enter a full URL (https://…) or a path",
  );

const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  role: z.string().trim().max(80),
  location: z.string().trim().max(80),
  email: z.string().trim().email("Invalid email").or(z.literal("")),
  pronouns: z.string().trim().max(40),
  tagline: z.string().trim().max(120),
  bio: z.string().trim().max(800),
  about: z.string().trim().max(5000),
  spotify_playlist: z.string().trim().max(64),
  linkedin: z.string().trim().max(300),
  avatar_url: urlish,
  github_username: z.string().trim().max(60),
  x_handle: z.string().trim().max(60),
  website: urlish,
  status_text: z.string().trim().max(120),
});

export async function updateProfile(_prev: State, formData: FormData): Promise<State> {
  await requireAdmin();
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("profile").upsert({ id: 1, ...parsed.data, updated_at: new Date().toISOString() });
  if (error) return { error: error.message };
  refresh();
  return { ok: true };
}

// ----------------------------------------------------------------------------
// Generic list CRUD (startups / tech_stack / projects)
// ----------------------------------------------------------------------------
const startupSchema = z.object({
  name: z.string().trim().min(1).max(80),
  tagline: z.string().trim().max(160),
  url: z.string().trim().max(300),
  emoji: z.string().trim().max(8),
  logo: z.string().trim().max(500),
  mrr: z.string().trim().max(20),
  sort_order: z.coerce.number().int().default(0),
});
const techSchema = z.object({
  name: z.string().trim().min(1).max(60),
  slug: z.string().trim().min(1).max(60),
  url: z.string().trim().max(300),
  sort_order: z.coerce.number().int().default(0),
});
const projectSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(400),
  url: z.string().trim().max(300),
  sort_order: z.coerce.number().int().default(0),
});
const postSchema = z.object({
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens"),
  title: z.string().trim().min(1).max(160),
  excerpt: z.string().trim().max(300),
  content: z.string().trim().max(50000),
  cover_image: z.string().trim().max(500),
  published: z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean()),
});

const tables = {
  startups: startupSchema,
  tech_stack: techSchema,
  projects: projectSchema,
  posts: postSchema,
} as const;
type TableName = keyof typeof tables;

async function saveRow(table: TableName, formData: FormData): Promise<State> {
  await requireAdmin();
  const schema = tables[table];
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const id = formData.get("id") as string | null;
  const supabase = await createClient();
  const payload = id ? { id, ...parsed.data } : parsed.data;
  // Untyped Supabase client: payload is a known-good row for `table`.
  const { error } = await supabase.from(table).upsert(payload as never);
  if (error) return { error: error.message };
  refresh();
  if (table === "posts" && "slug" in parsed.data) revalidatePath(`/blog/${parsed.data.slug}`);
  return { ok: true };
}

async function deleteRow(table: TableName, id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from(table).delete().eq("id", id);
  refresh();
}

// Explicit async wrappers — server actions must be async functions (no bind()).
export async function saveStartup(_prev: State, formData: FormData) { return saveRow("startups", formData); }
export async function saveTech(_prev: State, formData: FormData) { return saveRow("tech_stack", formData); }
export async function saveProject(_prev: State, formData: FormData) { return saveRow("projects", formData); }
export async function savePost(_prev: State, formData: FormData) { return saveRow("posts", formData); }
export async function deleteStartup(id: string) { return deleteRow("startups", id); }
export async function deleteTech(id: string) { return deleteRow("tech_stack", id); }
export async function deleteProject(id: string) { return deleteRow("projects", id); }
export async function deletePost(id: string) { return deleteRow("posts", id); }

// ----------------------------------------------------------------------------
// AI blog post generation (Gemini)
// ----------------------------------------------------------------------------
export async function generateAIPost(_prev: State, formData: FormData): Promise<State> {
  await requireAdmin();
  const topic = String(formData.get("topic") ?? "").trim();
  if (!topic) return { error: "Enter a topic" };

  try {
    const [profile, startups] = await Promise.all([getProfile(), getStartups()]);
    const post = await generateBlogPost(topic, buildPersona(profile, startups));

    const supabase = await createClient();
    // Ensure a unique slug.
    let slug = post.slug || "post";
    const { data: existing } = await supabase.from("posts").select("slug").like("slug", `${slug}%`);
    const taken = new Set((existing ?? []).map((r: { slug: string }) => r.slug));
    if (taken.has(slug)) {
      let i = 2;
      while (taken.has(`${slug}-${i}`)) i++;
      slug = `${slug}-${i}`;
    }

    // Generate a matching AI cover (best-effort — post still saves without it).
    const cover = await generateAndStoreCover(slug, post.title);

    const { error } = await supabase.from("posts").insert({
      slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: cover ?? "",
      published: false, // saved as a draft for you to review + publish
    });
    if (error) return { error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Generation failed" };
  }
}

// ----------------------------------------------------------------------------
// Messages (contact inbox)
// ----------------------------------------------------------------------------
export async function markMessageRead(id: string, read: boolean): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("messages").update({ read }).eq("id", id);
  revalidatePath("/admin");
}

export async function deleteMessage(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("messages").delete().eq("id", id);
  revalidatePath("/admin");
}

// ----------------------------------------------------------------------------
// Integrations (GitHub token). Spotify uses the OAuth route.
// ----------------------------------------------------------------------------
const tokenSchema = z.object({
  provider: z.literal("github"),
  token: z.string().trim().min(1, "Token is required"),
  identifier: z.string().trim().min(1, "Username is required"),
});

export async function saveIntegrationToken(_prev: State, formData: FormData): Promise<State> {
  await requireAdmin();
  const parsed = tokenSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { provider, token, identifier } = parsed.data;
  await upsertIntegration({ provider, access_token: token, refresh_token: null, meta: { username: identifier } });
  refresh();
  return { ok: true };
}

export async function disconnectIntegration(provider: IntegrationProvider): Promise<void> {
  await requireAdmin();
  await deleteIntegration(provider);
  refresh();
}

// ----------------------------------------------------------------------------
// Auth
// ----------------------------------------------------------------------------
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
