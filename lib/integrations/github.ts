import "server-only";
import { getIntegration } from "./store";
import type { Contributions, ContributionDay } from "../types";

const EMPTY: Contributions = { total: 0, weeks: [], range: "" };

/**
 * Live GitHub contribution graph via the GraphQL API.
 * Token + username come from the admin-connected integration, env fallback.
 */
// The underlying GitHub fetch sets `next.revalidate` (30 min), so results are cached.
export async function getContributions(): Promise<Contributions> {
  const integ = await getIntegration("github");
  const token = integ?.access_token ?? process.env.GITHUB_TOKEN ?? "";
  const username = (integ?.meta?.username as string) ?? process.env.GITHUB_USERNAME ?? "";
  if (!token || !username) return EMPTY;

  const query = `query($login:String!){
    user(login:$login){
      contributionsCollection{
        contributionCalendar{
          totalContributions
          weeks{ contributionDays{ date contributionCount contributionLevel } }
        }
      }
    }
  }`;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        // GitHub's API rejects requests without a User-Agent (403). Browsers/curl
        // set one automatically; the Workers runtime does not.
        "User-Agent": `${username}-portfolia`,
      },
      body: JSON.stringify({ query, variables: { login: username } }),
      next: { revalidate: 1800 },
    });
    if (!res.ok) return EMPTY;
    const json = await res.json();
    const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return EMPTY;

    const levelMap: Record<string, ContributionDay["level"]> = {
      NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4,
    };
    const weeks: ContributionDay[][] = cal.weeks.map((w: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: levelMap[d.contributionLevel] ?? 0,
      })),
    );
    const first = weeks[0]?.[0]?.date?.slice(0, 4) ?? "";
    const last = weeks.at(-1)?.at(-1)?.date?.slice(0, 4) ?? "";
    const range = first && last ? (first === last ? first : `${first}–${last.slice(2)}`) : "";
    return { total: cal.totalContributions, weeks, range };
  } catch {
    return EMPTY;
  }
}
