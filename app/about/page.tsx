import type { Metadata } from "next";
import Link from "next/link";
import { getProfile } from "@/lib/data";
import { Socials } from "../_components/Socials";
import { Markdown } from "../_components/Markdown";

export const revalidate = 1800;
export const metadata: Metadata = { title: "About", description: "About me." };

export default async function About() {
  const profile = await getProfile();
  const text = profile.about?.trim() || profile.bio;

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-20">
      <div className="pt-8">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">About</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Hey, I&apos;m <span className="grad-text">{profile.name.split(" ")[0]}</span>.
        </h1>

        <div className="mt-7">
          <Markdown>{text}</Markdown>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-border pt-6">
          <Link
            href="/contact"
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
          >
            Get in touch
          </Link>
          <Socials profile={profile} />
        </div>
      </div>
    </main>
  );
}
