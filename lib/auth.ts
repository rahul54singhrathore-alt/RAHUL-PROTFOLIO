import "server-only";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "./supabase/server";

/** Comma-separated allowlist of admin emails. */
function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Is this email allowed to sign in as admin? Empty allowlist → allow any. */
export function isAdminEmail(email: string): boolean {
  const allow = adminEmails();
  if (!allow.length) return true;
  return allow.includes(email.trim().toLowerCase());
}

export async function getAdminUser() {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user?.email) return null;
  const allow = adminEmails();
  // If no allowlist set, any authenticated user is admin (single-user setup).
  if (allow.length && !allow.includes(user.email.toLowerCase())) return null;
  return user;
}

/** Guard for admin routes — redirects to login when not an admin. */
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
