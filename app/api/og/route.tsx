import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const revalidate = false;

// Generated gradient cover image for blog posts (no external API).
// Usage: /api/og?title=Your%20Post%20Title&tag=Blog
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "Untitled").slice(0, 120);
  const tag = (searchParams.get("tag") || "Blog").slice(0, 24);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "#08080a",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* gradient glow */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: "radial-gradient(circle, #5b6ef5 0%, rgba(91,110,245,0) 65%)",
            opacity: 0.65,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -120,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: "radial-gradient(circle, #1fb6d6 0%, rgba(31,182,214,0) 65%)",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#8b8b93",
            fontWeight: 600,
          }}
        >
          {tag}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: -1,
            color: "#ededed",
            maxWidth: 920,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#8b8b93" }}>sourabh singh</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
