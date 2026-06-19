import "server-only";
import { createClient, createAnonClient, isSupabaseConfigured } from "./supabase/server";
import { seedProfile, seedStartups, seedTech, seedProjects, seedPosts, seedExperience } from "./seed";
import type { Profile, Startup, Tech, Project, Experience, Post, Message } from "./types";

// Read-only public content. Reads from Supabase (RLS: public can read).
// Falls back to seed defaults only when Supabase isn't configured yet,
// so `npm run dev` renders instantly before you wire up the DB.

export async function getProfile(): Promise<Profile> {
  if (!isSupabaseConfigured) return seedProfile;
  const supabase = createAnonClient();
  const { data } = await supabase.from("profile").select("*").eq("id", 1).single();
  return (data as Profile) ?? seedProfile;
}

export async function getStartups(): Promise<Startup[]> {
  if (!isSupabaseConfigured) return seedStartups;
  const supabase = createAnonClient();
  const { data } = await supabase.from("startups").select("*").order("sort_order");
  return (data as Startup[]) ?? [];
}

export async function getTech(): Promise<Tech[]> {
  if (!isSupabaseConfigured) return seedTech;
  const supabase = createAnonClient();
  const { data } = await supabase.from("tech_stack").select("*").order("sort_order");
  return (data as Tech[]) ?? [];
}

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return seedProjects;
  const supabase = createAnonClient();
  const { data } = await supabase.from("projects").select("*").order("sort_order");
  return (data as Project[]) ?? [];
}

export async function getExperience(): Promise<Experience[]> {
  if (!isSupabaseConfigured) return seedExperience;
  const supabase = createAnonClient();
  const { data } = await supabase.from("experience").select("*").order("sort_order");
  return (data as Experience[]) ?? seedExperience;
}

// ---- Blog ----
export async function getPublishedPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured) return seedPosts;
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  return (data as Post[]) ?? [];
}

export async function getAllPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient(); // admin: needs auth to see unpublished
  const { data } = await supabase.from("posts").select("*").order("published_at", { ascending: false });
  return (data as Post[]) ?? [];
}

/** Admin contact inbox. RLS: authenticated only. */
export async function getMessages(): Promise<Message[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient(); // admin: RLS gates on is_admin()
  const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  return (data as Message[]) ?? [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured) return seedPosts.find((p) => p.slug === slug) ?? null;
  const supabase = createAnonClient();
  const { data } = await supabase.from("posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  return (data as Post) ?? null;
}

/** Content bundle for the public page. Cached by the page's ISR `revalidate`;
 *  busted on admin save via revalidatePath("/"). */
export async function getPublicContent() {
  const [profile, startups, tech, projects, experience] = await Promise.all([
    getProfile(),
    getStartups(),
    getTech(),
    getProjects(),
    getExperience(),
  ]);
  return { profile, startups, tech, projects, experience };
}
