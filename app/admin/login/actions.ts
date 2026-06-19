"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth";

const emailSchema = z.string().email().max(254);

/**
 * Send a one-time login code to an admin email.
 * Gated server-side by the ADMIN_EMAILS allowlist so non-admins never get a code.
 */
export async function sendAdminOtp(
  _prev: unknown,
  formData: FormData,
): Promise<{ ok: boolean; email?: string; error?: string }> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { ok: false, error: "Enter a valid email." };
  const email = parsed.data.trim().toLowerCase();

  if (!isAdminEmail(email)) return { ok: false, error: "This email is not authorized." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  if (error) return { ok: false, error: error.message };

  return { ok: true, email };
}
