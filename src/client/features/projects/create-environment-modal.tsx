import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { SettingsDialog } from "../settings/settings-dialog";

export function CreateEnvironmentModal({
  open,
  onClose,
  onCreate
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setError("");
      setSaving(false);
    }
  }, [open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError("");
    try {
      await onCreate(name.trim());
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not create environment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingsDialog open={open} title="New environment" width="max-w-md" onClose={() => {
      if (!saving) onClose();
    }}>
      <form onSubmit={(event) => void submit(event)}>
        <p className="text-sm leading-6 text-neutral-500">
          Create another place to organize this project's services.
        </p>

        <label className="mt-5 block">
          <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
            Environment name
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Staging"
            autoComplete="off"
            autoFocus
            maxLength={50}
            required
            className="h-11 w-full border border-neutral-800 bg-neutral-900 px-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 hover:border-neutral-700 focus:border-white focus:bg-neutral-900"
          />
        </label>

        {error ? (
          <div role="alert" className="mt-4 border-l-2 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        ) : null}

        <div className="mt-6 border-t border-neutral-800 pt-4">
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center bg-blue-600 px-5 text-sm text-neutral-100 transition hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-50"
            disabled={saving || !name.trim()}
          >
            {saving ? "Creating…" : "Create environment"}
          </button>
        </div>
      </form>
    </SettingsDialog>
  );
}
