"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { generateAIPost } from "../actions";
import { Field, SubmitButton, FormStatus } from "./ui";

export function AIPostGenerator() {
  const [state, action] = useActionState(generateAIPost, {});
  const router = useRouter();

  // Refresh the list when a draft is created.
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <div className="rounded-lg border border-dashed border-border p-4">
      <div className="flex items-center gap-2">
        <span className="grad-text text-sm font-semibold">✨ Generate with AI</span>
        <span className="text-xs text-muted">Gemini · saves as a draft in your voice</span>
      </div>
      <form action={action} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Field label="Topic" name="topic" placeholder="e.g. lessons from launching Lifebar on the App Store" />
        </div>
        <SubmitButton>Generate draft</SubmitButton>
      </form>
      <div className="mt-2 flex items-center gap-2">
        <FormStatus state={state} />
        {state.ok && <span className="text-xs text-muted">Draft created below — review &amp; publish.</span>}
      </div>
    </div>
  );
}
