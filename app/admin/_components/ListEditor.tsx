"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, Field, SubmitButton, FormStatus } from "./ui";

export type FieldDef = {
  name: string;
  label: string;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
  type?: string;
  half?: boolean;
};

type SaveAction = (prev: { ok?: boolean; error?: string }, fd: FormData) => Promise<{ ok?: boolean; error?: string }>;
type DeleteAction = (id: string) => Promise<void>;

type Item = Record<string, unknown> & { id: string };

function Row({
  item,
  fields,
  saveAction,
  deleteAction,
  isNew,
}: {
  item: Item | null;
  fields: FieldDef[];
  saveAction: SaveAction;
  deleteAction: DeleteAction;
  isNew?: boolean;
}) {
  const [state, action] = useActionState(saveAction, {});
  const [pending, start] = useTransition();
  const router = useRouter();

  function remove() {
    if (!item) return;
    if (!confirm("Delete this item?")) return;
    start(async () => {
      await deleteAction(item.id);
      router.refresh();
    });
  }

  return (
    <form action={action} className="rounded-lg border border-border p-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
            <Field
              label={f.label}
              name={f.name}
              type={f.type}
              textarea={f.textarea}
              rows={f.rows}
              placeholder={f.placeholder}
              defaultValue={item && f.type !== "checkbox" ? String(item[f.name] ?? "") : ""}
              defaultChecked={f.type === "checkbox" ? Boolean(item?.[f.name]) : undefined}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <SubmitButton>{isNew ? "Add" : "Save"}</SubmitButton>
        {item && (
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="text-sm text-red-500 hover:underline disabled:opacity-50"
          >
            {pending ? "Deleting…" : "Delete"}
          </button>
        )}
        <FormStatus state={state} />
      </div>
    </form>
  );
}

export function ListEditor({
  title,
  description,
  items,
  fields,
  saveAction,
  deleteAction,
}: {
  title: string;
  description?: string;
  items: Item[];
  fields: FieldDef[];
  saveAction: SaveAction;
  deleteAction: DeleteAction;
}) {
  return (
    <Card>
      <h2 className="text-base font-semibold">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      <div className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <Row key={item.id} item={item} fields={fields} saveAction={saveAction} deleteAction={deleteAction} />
        ))}
        <div>
          <div className="label mb-2">Add new</div>
          <Row item={null} fields={fields} saveAction={saveAction} deleteAction={deleteAction} isNew />
        </div>
      </div>
    </Card>
  );
}
