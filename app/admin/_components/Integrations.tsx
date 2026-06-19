"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { IntegrationProvider } from "@/lib/types";
import { saveIntegrationToken, disconnectIntegration } from "../actions";
import { Card, Field, SubmitButton, FormStatus } from "./ui";

type Status = { connected: boolean; identifier: string | null };

function Dot({ on }: { on: boolean }) {
  return <span className={`inline-block h-2 w-2 rounded-full ${on ? "bg-green-500" : "bg-muted"}`} />;
}

function DisconnectButton({ provider }: { provider: IntegrationProvider }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => start(async () => { await disconnectIntegration(provider); router.refresh(); })}
      disabled={pending}
      className="text-sm text-red-500 hover:underline disabled:opacity-50"
    >
      {pending ? "Disconnecting…" : "Disconnect"}
    </button>
  );
}

function GitHubForm({ status }: { status: Status }) {
  const [state, action] = useActionState(saveIntegrationToken, {});
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dot on={status.connected} />
          <span className="text-sm font-medium">GitHub</span>
          {status.identifier && <span className="text-xs text-muted">· {status.identifier}</span>}
        </div>
        {status.connected && <DisconnectButton provider="github" />}
      </div>
      <form action={action} className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="hidden" name="provider" value="github" />
        <Field label="GitHub username" name="identifier" placeholder="octocat" defaultValue={status.identifier ?? ""} />
        <Field label="Personal access token" name="token" type="password" placeholder="••••••••" />
        <div className="sm:col-span-2 flex items-center gap-3">
          <SubmitButton>{status.connected ? "Update" : "Connect"}</SubmitButton>
          <FormStatus state={state} />
        </div>
      </form>
      <p className="mt-2 text-xs text-muted">
        Create a token at github.com/settings/tokens (classic, scope <code>read:user</code>) for the live contribution graph.
      </p>
    </div>
  );
}

export function Integrations({ github }: { github: Status }) {
  return (
    <Card>
      <h2 className="text-base font-semibold">Integrations</h2>
      <p className="mt-0.5 text-sm text-muted">Connect live data sources for your portfolio.</p>
      <div className="mt-4 flex flex-col gap-3">
        <GitHubForm status={github} />
      </div>
    </Card>
  );
}
