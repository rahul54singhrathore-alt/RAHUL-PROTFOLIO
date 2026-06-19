import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { getProfile } from "@/lib/data";
import { siteUrl } from "@/lib/site";
import { ScrollProgress } from "./_components/ScrollProgress";
import { Nav } from "./_components/Nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Instrument_Serif({ variable: "--font-display", weight: "400", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const p = await getProfile();
  const title = p.name ? `${p.name} — ${p.role}` : "Portfolia";
  const description = p.bio?.slice(0, 160) || "Full-stack developer portfolio.";
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s — ${p.name || "Portfolia"}` },
    description,
    openGraph: { title, description, type: "website", siteName: p.name || "Portfolia" },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: p.x_handle ? `@${p.x_handle.replace(/^@/, "")}` : undefined,
    },
  };
}

// Set the theme before paint to avoid a flash of the wrong color scheme.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="aurora" aria-hidden />
        <div className="grid-overlay" aria-hidden />
        <div className="grain" aria-hidden />
        <ScrollProgress />
        <Nav />
        {children}
      </body>
    </html>
  );
}
