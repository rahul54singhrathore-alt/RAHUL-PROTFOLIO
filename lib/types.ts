export type Profile = {
  name: string;
  role: string;
  location: string;
  email: string;
  pronouns: string;
  tagline: string; // short one-liner shown on the home page
  bio: string;
  about: string; // longer About-page text (Markdown)
  avatar_url: string;
  github_username: string;
  x_handle: string;
  linkedin: string; // full LinkedIn profile URL
  website: string;
  status_text: string; // small status line under the bio
  spotify_playlist: string; // Spotify playlist ID for the embed
};

export type Startup = {
  id: string;
  name: string;
  tagline: string;
  url: string;
  emoji: string; // fallback icon char when no logo
  logo: string; // image URL (favicon / app icon)
  mrr: string; // display string e.g. "$6.4k/mo"
  sort_order: number;
};

export type Tech = {
  id: string;
  name: string;
  slug: string; // devicon slug e.g. "typescript"
  url: string;
  sort_order: number;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  url: string;
  sort_order: number;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  start_date: string; // YYYY-MM
  end_date: string | null;
  description: string;
  sort_order: number;
};

export type NowPlaying = {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumImage?: string;
  songUrl?: string;
};

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type Contributions = { total: number; weeks: ContributionDay[][]; range: string };

export type IntegrationProvider = "github" | "spotify";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  published: boolean;
  published_at: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  body: string;
  read: boolean;
  created_at: string;
};
