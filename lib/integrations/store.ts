import "server-only";
import { createServiceClient, isSupabaseConfigured } from "../supabase/server";
import type { IntegrationProvider } from "../types";

export type IntegrationRow = {
  provider: IntegrationProvider;
  access_token: string | null;
  refresh_token: string | null;
  meta: Record<string, unknown> | null;
};

/** Read a provider's stored credentials (admin-connected). Service role: bypasses RLS. */
export async function getIntegration(provider: IntegrationProvider): Promise<IntegrationRow | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = createServiceClient();
  const { data } = await supabase.from("integrations").select("*").eq("provider", provider).maybeSingle();
  return (data as IntegrationRow) ?? null;
}

export async function upsertIntegration(row: IntegrationRow) {
  const supabase = createServiceClient();
  await supabase.from("integrations").upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: "provider" });
}

export async function deleteIntegration(provider: IntegrationProvider) {
  const supabase = createServiceClient();
  await supabase.from("integrations").delete().eq("provider", provider);
}

/** Connection status for the admin UI — never returns the token itself. */
export async function getIntegrationStatus(provider: IntegrationProvider): Promise<{
  connected: boolean;
  identifier: string | null;
}> {
  const row = await getIntegration(provider);
  if (!row) return { connected: false, identifier: null };
  const identifier =
    (row.meta?.username as string) ?? (row.meta?.handle as string) ?? null;
  return { connected: Boolean(row.access_token || row.refresh_token), identifier };
}
