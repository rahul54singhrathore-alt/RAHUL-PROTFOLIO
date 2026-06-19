import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPublishedPosts } from "@/lib/data";
import { formatDate, readingTime, coverFor } from "@/lib/site";
import { Markdown } from "../../_components/Markdown";

export const revalidate = 1800;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article", publishedTime: post.published_at },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl px-5">
      <article className="pt-8 pb-16">
        <Link href="/blog" className="text-sm text-muted hover:underline">← Blog</Link>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight leading-tight">{post.title}</h1>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted">
          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          <span>·</span>
          <span>{readingTime(post.content)} min read</span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverFor(post)}
          alt={post.title}
          className="mt-6 aspect-[16/9] w-full rounded-xl border border-border object-cover"
        />
        <div className="mt-8">
          <Markdown>{post.content}</Markdown>
        </div>
      </article>
    </main>
  );
}
