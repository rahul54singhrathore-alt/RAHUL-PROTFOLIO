import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/data";
import { getProfile } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Blog post";

export default async function Image({ params }: { params: { slug: string } }) {
  const [post, profile] = await Promise.all([getPostBySlug(params.slug), getProfile()]);
  const title = post?.title ?? "Blog";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0c",
          color: "#ededed",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 26, color: "#8b8b93", letterSpacing: 2, textTransform: "uppercase" }}>Blog</div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1, maxWidth: 1000 }}>{title}</div>
        <div style={{ fontSize: 28, color: "#a1a1aa" }}>{profile.name}</div>
      </div>
    ),
    { ...size },
  );
}
