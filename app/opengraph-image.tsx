import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Portfolio";

export default async function Image() {
  const p = await getProfile();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0b0b0c",
          color: "#ededed",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#8b8b93", letterSpacing: 2, textTransform: "uppercase" }}>
          {p.role || "Developer"}
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 16, letterSpacing: -2 }}>
          {p.name || "Portfolia"}
        </div>
        <div style={{ fontSize: 30, color: "#a1a1aa", marginTop: 28, maxWidth: 900, lineHeight: 1.4 }}>
          {(p.bio || "").slice(0, 130)}
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 48, fontSize: 24, color: "#8b8b93" }}>
          {p.location && <span>📍 {p.location}</span>}
          {p.website && <span>{p.website.replace(/^https?:\/\//, "")}</span>}
        </div>
      </div>
    ),
    { ...size },
  );
}
