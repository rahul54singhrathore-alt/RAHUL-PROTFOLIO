import type { Metadata } from "next";
import { getProfile } from "@/lib/data";
import { Socials } from "../_components/Socials";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact", description: "Get in touch." };

export default async function Contact() {
  const profile = await getProfile();
  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-20">
      <div className="grid gap-8 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12">
        {/* Left — intro */}
        <div className="lg:pt-2">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">Contact</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Let&apos;s <span className="grad-text">talk</span>.
          </h1>
          <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-muted">
            Have a project, a role, or an idea worth building? Drop a message and I&apos;ll get back to you.
          </p>
          <div className="mt-7">
            <div className="label mb-3">Or find me on</div>
            <Socials profile={profile} />
          </div>
        </div>

        {/* Right — form */}
        <ContactForm />
      </div>
    </main>
  );
}
