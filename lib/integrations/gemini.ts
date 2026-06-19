import "server-only";
import type { Profile, Startup } from "../types";

export type GeneratedPost = { title: string; slug: string; excerpt: string; content: string };

/** Build a personality prompt from the owner's own data so posts sound like them. */
export function buildPersona(profile: Profile, startups: Startup[]): string {
  const products = startups.length
    ? startups.map((s) => `${s.name} (${s.tagline}${s.mrr ? `, ${s.mrr}` : ""})`).join("; ")
    : "various side projects";
  return [
    `You are ${profile.name}, ${profile.role || "a developer"} based in ${profile.location || "online"}.`,
    `About you: ${profile.bio}`,
    `You currently build: ${products}.`,
    `Voice: first-person, direct, practical, no corporate fluff or hype. Indie-hacker tone — real lessons from building and shipping software. Short paragraphs, concrete examples, the occasional dry aside. Never use em-dash spam or "in today's fast-paced world" clichés.`,
  ].join("\n");
}

/** Generate a blog post with Gemini. Returns structured JSON (enforced via responseSchema). */
export async function generateBlogPost(topic: string, persona: string): Promise<GeneratedPost> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  const prompt = `${persona}

Write a blog post for your personal site about: "${topic}".

Rules:
- 500–800 words, Markdown body (## subheadings, lists where useful, no H1 — the title is separate).
- First person, in your voice. Practical and specific, not generic.
- slug: short, kebab-case, lowercase, no dates.
- excerpt: one compelling sentence, max 160 characters.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING" },
              slug: { type: "STRING" },
              excerpt: { type: "STRING" },
              content: { type: "STRING" },
            },
            required: ["title", "slug", "excerpt", "content"],
          },
        },
      }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini error ${res.status}: ${detail.slice(0, 200)}`);
  }
  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no content");
  const parsed = JSON.parse(text) as GeneratedPost;
  // Normalize the slug.
  parsed.slug = (parsed.slug || parsed.title)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return parsed;
}
