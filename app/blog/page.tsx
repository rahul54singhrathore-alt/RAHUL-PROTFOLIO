import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/data";
import { formatDate, readingTime, coverFor } from "@/lib/site";

export const revalidate = 1800;
export const metadata: Metadata = { title: "Blog", description: "Writing on building software." };

export default async function Blog() {
  const posts = await getPublishedPosts();
  return (
    <main className="mx-auto w-full max-w-2xl px-5">
      <div className="pt-8">
        <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
        <p className="mt-1 text-sm text-muted">Notes on building software.</p>

        {posts.length === 0 ? (
          <p className="mt-10 text-sm text-muted">No posts yet — add one from the admin.</p>
        ) : (
          <div className="mt-8 flex flex-col gap-4">
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="card-x group flex items-stretch overflow-hidden">
                <div className="relative w-32 shrink-0 overflow-hidden border-r border-border sm:w-56">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverFor(p)}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center p-4 sm:p-5">
                  <h2 className="text-[0.95rem] font-semibold leading-snug sm:text-base">{p.title}</h2>
                  {p.excerpt && (
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{p.excerpt}</p>
                  )}
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                    <span>{formatDate(p.published_at)}</span>
                    <span>·</span>
                    <span>{readingTime(p.content)} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
