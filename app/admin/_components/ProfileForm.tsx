"use client";

import { useActionState } from "react";
import type { Profile } from "@/lib/types";
import { updateProfile } from "../actions";
import { Card, Field, SubmitButton, FormStatus } from "./ui";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action] = useActionState(updateProfile, {});
  return (
    <Card>
      <h2 className="text-base font-semibold">Profile</h2>
      <p className="mt-0.5 text-sm text-muted">Everything on your public page — fully editable.</p>
      <form action={action} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" name="name" defaultValue={profile.name} required />
        <Field label="Role" name="role" defaultValue={profile.role} placeholder="Full-Stack Developer" />
        <Field label="Location" name="location" defaultValue={profile.location} />
        <Field label="Pronouns" name="pronouns" defaultValue={profile.pronouns} placeholder="he/him" />
        <Field label="Email" name="email" type="email" defaultValue={profile.email} />
        <Field label="Website URL" name="website" defaultValue={profile.website} placeholder="https://" />
        <Field label="Avatar URL" name="avatar_url" defaultValue={profile.avatar_url} placeholder="https://" />
        <Field label="Status line" name="status_text" defaultValue={profile.status_text} placeholder="Building things on the internet" />
        <Field label="Spotify playlist ID" name="spotify_playlist" defaultValue={profile.spotify_playlist} placeholder="5gVuu6bfYxllGEg9mw0qCP" />
        <Field label="GitHub username" name="github_username" defaultValue={profile.github_username} />
        <Field label="X handle" name="x_handle" defaultValue={profile.x_handle} placeholder="@you" />
        <Field label="LinkedIn URL" name="linkedin" defaultValue={profile.linkedin} placeholder="https://linkedin.com/in/you" />
        <div className="sm:col-span-2">
          <Field label="Tagline (short — shown on home)" name="tagline" defaultValue={profile.tagline} placeholder="Building software that feels just right" />
        </div>
        <div className="sm:col-span-2">
          <Field label="Bio" name="bio" defaultValue={profile.bio} textarea />
        </div>
        <div className="sm:col-span-2">
          <Field label="About page text (Markdown)" name="about" defaultValue={profile.about} textarea />
        </div>
        <div className="sm:col-span-2 flex items-center gap-3">
          <SubmitButton />
          <FormStatus state={state} />
        </div>
      </form>
    </Card>
  );
}
