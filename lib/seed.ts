import type { Profile, Startup, Tech, Project, Post, Experience } from "./types";

// Default content. Used as fallback when Supabase isn't configured yet,
// and as the initial seed for the DB (supabase/schema.sql).
export const seedProfile: Profile = {
  name: "Rahul Singh",
  role: "Developer",
  location: "Faridabad, India",
  email: "rahul54.singhrathore@gmail.com",
  pronouns: "he/him",
  tagline: "Aspiring Software Engineer | Building in public",
  bio: "20 · Aspiring Software Engineer · Building in public. Shipping real-world projects and always learning. 3rd year student at Manav Rachna University.",
  about: "I'm a 20-year-old developer and 3rd year student at Manav Rachna University. I love shipping real-world projects and building in public. Always learning, always growing.",
  avatar_url: "/sourabh.jpg",
  github_username: "rahul54singhrathore-alt",
  x_handle: "RahuXdev",
  linkedin: "https://www.linkedin.com/in/rahul-singh-1a29013a2",
  website: "https://www.tryoras.com",
  status_text: "Shipping real-world projects",
  spotify_playlist: "07TabfwLCp8TxKcOjQhScK",
};

export const seedStartups: Startup[] = [
  { id: "1", name: "Oras", tagline: "Building something real — check it out", url: "https://www.tryoras.com", emoji: "🚀", logo: "/oras-logo.png", mrr: "", sort_order: 1 },
  { id: "2", name: "Vidora", tagline: "Do your best work with Vidora", url: "#", emoji: "📱", logo: "/vidora-logo.png", mrr: "In Progress", sort_order: 2 },
  { id: "3", name: "StarHQ", tagline: "Your startup's command center", url: "https://starhq.app", emoji: "⭐", logo: "https://starhq.app/logo.png", mrr: "", sort_order: 3 },
];

export const seedTech: Tech[] = [
  { id: "1", name: "TypeScript", slug: "typescript", url: "https://www.typescriptlang.org", sort_order: 1 },
  { id: "2", name: "JavaScript", slug: "javascript", url: "https://developer.mozilla.org/docs/Web/JavaScript", sort_order: 2 },
  { id: "3", name: "React", slug: "react", url: "https://react.dev", sort_order: 3 },
  { id: "4", name: "Next.js", slug: "nextjs", url: "https://nextjs.org", sort_order: 4 },
  { id: "5", name: "Node.js", slug: "nodejs", url: "https://nodejs.org", sort_order: 5 },
  { id: "6", name: "Tailwind CSS", slug: "tailwindcss", url: "https://tailwindcss.com", sort_order: 6 },
  { id: "7", name: "Supabase", slug: "supabase", url: "https://supabase.com", sort_order: 7 },
  { id: "8", name: "PostgreSQL", slug: "postgresql", url: "https://www.postgresql.org", sort_order: 8 },
  { id: "9", name: "Python", slug: "python", url: "https://www.python.org", sort_order: 9 },
  { id: "10", name: "Figma", slug: "figma", url: "https://figma.com", sort_order: 10 },
];

export const seedProjects: Project[] = [
  { id: "1", title: "Oras", description: "Real-world product I'm actively shipping and building in public.", url: "https://www.tryoras.com", sort_order: 1 },
];

export const seedPosts: Post[] = [
  {
    id: "1",
    slug: "why-i-build-in-public",
    title: "Why I Build in Public",
    excerpt: "Building in public keeps me accountable, attracts the right people, and turns the messy process of learning into something others can learn from too.",
    content: `Building in public is one of the best decisions I've made as a developer.

When I started working on Oras, I had two choices: build quietly until it was "ready", or share the journey from day one. I chose the latter — and here's why it changed everything.

## Accountability you can't fake

When you tweet about what you're building, you create a public commitment. You can't just abandon a project silently. Your followers, however small, are watching. That mild social pressure is surprisingly powerful when motivation dips at 2am.

## The right people find you

I've had developers reach out to collaborate, potential users offer feedback before I even launched, and other student builders share tools that saved me weeks of work. None of that happens if you build behind closed doors.

## Learning compounds faster

Explaining what you built — even badly — forces clarity. I've caught bugs by writing about my code. I've reconsidered architecture decisions while drafting a thread. Teaching accelerates learning.

## The messy middle is the most valuable part

Nobody needs another "I built X in Y days" success post. What's actually useful is the part where everything broke, the pivot, the rewrite, the week you wanted to quit. That's the stuff that helps other builders.

If you're a student developer sitting on a half-finished project — start sharing it now. Not when it's done. Now.`,
    cover_image: "",
    published: true,
    published_at: "2026-05-10T00:00:00Z",
  },
  {
    id: "2",
    slug: "what-i-learned-shipping-oras",
    title: "What I Learned Shipping Oras",
    excerpt: "From idea to live product as a 3rd year student — the technical decisions, the mistakes, and what I'd do differently.",
    content: `Oras is live. Here's what building and shipping it actually taught me.

## Start with the problem, not the stack

I spent the first two weeks choosing between frameworks instead of talking to potential users. Classic mistake. The tech doesn't matter if nobody wants the thing you're building.

## MVP means embarrassingly minimal

My first version of Oras had one feature. Just one. I kept wanting to add more before launching. Then I remembered: you don't learn until real people use your product. Ship the one thing, learn, then build the next.

## Auth will eat your time

User authentication always takes 3x longer than expected. Next time I'll reach for a managed auth solution on day one instead of trying to roll my own.

## The deployment gap

There's a huge gap between "works on my machine" and "works for everyone". Environment variables, edge cases on different devices, unexpected API rate limits — none of this shows up in local development.

## What I'd do differently

1. Talk to 10 potential users before writing a single line of code
2. Set a hard launch date at the start and work backwards
3. Keep a build log from day one — memory fades fast

Still learning. Still shipping.`,
    cover_image: "",
    published: true,
    published_at: "2026-05-28T00:00:00Z",
  },
  {
    id: "3",
    slug: "being-a-student-developer-in-2026",
    title: "Being a Student Developer in 2026",
    excerpt: "University teaches you CS theory. The internet teaches you to ship. Here's how I'm trying to do both.",
    content: `I'm a 3rd year CS student at Manav Rachna University. I also build and ship real products on the side. These two things are more different than you'd think.

## What university is good at

Fundamentals. Data structures, algorithms, networking, operating systems — the theory that makes you understand *why* things work, not just *how* to use them. This stuff matters more than most bootcamp-brained takes suggest.

## What university doesn't teach

Shipping. Product thinking. How to write code that real users will interact with. How to handle a production incident. How to read a GitHub issues thread and figure out what's actually broken.

## How I bridge the gap

I treat every university project as a real product. README, deployment, clean commit history — even if nobody will ever use it.

I build things that scratch my own itch. Oras came from a genuine problem I had. Personal motivation > assignment motivation every time.

I spend time in public dev communities. Twitter/X, Discord servers, open source repos. Watching how experienced developers think is free education.

## The honest take

Being a student with real projects is a superpower in hiring. Most of your competition has grades. You have deployed software.

Keep building. Keep shipping.`,
    cover_image: "",
    published: true,
    published_at: "2026-06-10T00:00:00Z",
  },
];

export const seedExperience: Experience[] = [
  {
    id: "1",
    company: "Oras",
    role: "Founder & Developer",
    start_date: "2025-11",
    end_date: null,
    description: "Built and shipped Oras as a full-stack web app — designed the UI, wrote the backend, and deployed it to production. Handling everything from database to frontend.",
    sort_order: 1,
  },
  {
    id: "2",
    company: "Vidora",
    role: "Developer",
    start_date: "2026-01",
    end_date: null,
    description: "Building Vidora as a mobile-first app. Designing the product, writing the code, and iterating based on user feedback. Currently in progress.",
    sort_order: 2,
  },
  {
    id: "3",
    company: "Freelance",
    role: "Web & App Developer",
    start_date: "2024-06",
    end_date: null,
    description: "Building websites and apps for clients — from landing pages to full web applications. Focus on clean design, fast performance, and shipping on time.",
    sort_order: 3,
  },
];
