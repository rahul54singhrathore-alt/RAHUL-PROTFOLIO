import "server-only";
import { createServiceClient } from "../supabase/server";

const BUCKET = "blog-covers";

/** Generate an on-brand 16:9 cover with Imagen, store it in Supabase Storage, return the public URL. */
export async function generateAndStoreCover(slug: string, title: string): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const model = process.env.GEMINI_IMAGE_MODEL || "imagen-4.0-fast-generate-001";

  const prompt =
    `Editorial blog cover illustration for an article titled "${title}". ` +
    `Abstract, modern, minimal tech aesthetic. Deep near-black background with smooth indigo (#5b6ef5), ` +
    `blue and cyan (#1fb6d6) gradient light, soft geometric shapes and subtle grain. ` +
    `Cinematic, high quality, no text, no letters, no words, no logos.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: { sampleCount: 1, aspectRatio: "16:9" },
        }),
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    const json = await res.json();
    const b64 = json?.predictions?.[0]?.bytesBase64Encoded;
    if (!b64) return null;

    const buf = Buffer.from(b64, "base64");
    const supabase = createServiceClient();
    const path = `${slug}.png`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, buf, {
      contentType: "image/png",
      upsert: true,
    });
    if (error) return null;
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  } catch {
    return null;
  }
}
