import { getProfile, getPublishedPosts } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export const revalidate = 1800;

function escape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET() {
  const base = siteUrl();
  const [profile, posts] = await Promise.all([getProfile(), getPublishedPosts()]);
  const items = posts
    .map(
      (p) => `<item>
  <title>${escape(p.title)}</title>
  <link>${base}/blog/${p.slug}</link>
  <guid>${base}/blog/${p.slug}</guid>
  <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
  <description>${escape(p.excerpt)}</description>
</item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>${escape(profile.name)} — Blog</title>
  <link>${base}/blog</link>
  <description>${escape(profile.bio.slice(0, 160))}</description>
  ${items}
</channel></rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml", "Cache-Control": "public, s-maxage=1800, stale-while-revalidate" },
  });
}
