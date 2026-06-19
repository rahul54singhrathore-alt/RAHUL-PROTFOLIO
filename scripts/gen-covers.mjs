// Generate AI cover images (Imagen) for blog posts and store them in Supabase Storage.
// Run: node --env-file=.env.local scripts/gen-covers.mjs [--all]
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const KEY = process.env.GEMINI_API_KEY;
const BUCKET = "blog-covers";
const MODEL = process.env.GEMINI_IMAGE_MODEL || "imagen-4.0-fast-generate-001";

if (!SUPABASE_URL || !SERVICE || !KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / GEMINI_API_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE, { auth: { persistSession: false } });

async function ensureBucket() {
  const { data } = await supabase.storage.getBucket(BUCKET);
  if (!data) {
    await supabase.storage.createBucket(BUCKET, { public: true });
    console.log(`created bucket ${BUCKET}`);
  }
}

async function generateImage(title) {
  const prompt =
    `Editorial blog cover illustration for an article titled "${title}". ` +
    `Abstract, modern, minimal tech aesthetic. Deep near-black background with smooth indigo (#5b6ef5), ` +
    `blue and cyan (#1fb6d6) gradient light, soft geometric shapes and subtle grain. ` +
    `Cinematic, high quality, no text, no letters, no words, no logos.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1, aspectRatio: "16:9" },
      }),
    },
  );
  if (!res.ok) throw new Error(`Imagen ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  const b64 = json?.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error("No image returned");
  return Buffer.from(b64, "base64");
}

async function main() {
  const all = process.argv.includes("--all");
  await ensureBucket();

  let query = supabase.from("posts").select("id, slug, title, cover_image");
  if (!all) query = query.or("cover_image.is.null,cover_image.eq.");
  const { data: posts, error } = await query;
  if (error) throw error;

  console.log(`generating covers for ${posts.length} post(s)…`);
  for (const p of posts) {
    try {
      const buf = await generateImage(p.title);
      const path = `${p.slug}.png`;
      const up = await supabase.storage.from(BUCKET).upload(path, buf, {
        contentType: "image/png",
        upsert: true,
      });
      if (up.error) throw up.error;
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      await supabase.from("posts").update({ cover_image: pub.publicUrl }).eq("id", p.id);
      console.log(`✓ ${p.slug} → ${pub.publicUrl}`);
    } catch (e) {
      console.error(`✗ ${p.slug}: ${e.message}`);
    }
  }
}

main().then(() => process.exit(0));
