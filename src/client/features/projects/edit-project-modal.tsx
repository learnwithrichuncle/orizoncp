import type { FormEvent } from "react";
import { SettingsDialog } from "../settings/settings-dialog";

export function EditProjectModal({
  open,
  name,
  description,
  projectSlug,
  saving,
  error,
  onNameChange,
  onDescriptionChange,
  onClose,
  onSave
}: {
  open: boolean;
  name: string;
  description: string;
  projectSlug: string;
  saving: boolean;
  error: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave();
  }

  return (
    <SettingsDialog
      open={open}
      title="Edit project"
      width="max-w-lg"
      onClose={() => {
        if (!saving) onClose();
      }}
    >
      <form onSubmit={submit}>
        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-neutral-500">
          {projectSlug}
        </p>
        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Update the name and description shown across this project.
        </p>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
              Project name
            </span>
            <input
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              autoComplete="off"
              autoFocus
              required
              className="h-11 w-full border border-neutral-800 bg-neutral-900 px-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 hover:border-neutral-700 focus:border-white focus:bg-neutral-900"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center justify-between gap-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
                Description
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-zinc-700">
                Optional
              </span>
            </span>
            <textarea
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="What is this project for?"
              rows={4}
              className="w-full resize-none border border-neutral-800 bg-neutral-900 px-3.5 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-700 hover:border-neutral-700 focus:border-white focus:bg-neutral-900"
            />
          </label>
        </div>

        {error ? (
          <div role="alert" className="mt-5 border-l-2 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        ) : null}

        <div className="mt-6 border-t border-neutral-800 pt-4">
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center bg-blue-600 px-5 text-sm text-neutral-100 transition hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-50"
            disabled={saving || !name.trim()}
          >
            {saving ? "Saving…" : "Save project"}
          </button>
        </div>
      </form>
    </SettingsDialog>
  );
}
