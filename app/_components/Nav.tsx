"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <div className="sticky top-0 z-40">
      <nav className="mx-auto flex max-w-5xl items-center justify-center px-4 py-4 sm:justify-between sm:px-5">
        <div className="flex items-center gap-3 rounded-full border border-border bg-[color-mix(in_oklab,var(--card)_70%,transparent)] px-3 py-1.5 text-[0.8rem] backdrop-blur-md sm:gap-4 sm:px-4 sm:text-sm">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                data-active={active}
                className={`link-u py-0.5 transition-colors ${active ? "text-foreground font-medium" : "text-muted hover:text-foreground"}`}
              >
                {l.label}
              </Link>
            );
          })}
          <span className="h-4 w-px bg-border" aria-hidden />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
