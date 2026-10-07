import { XIcon } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

export function CreateProjectModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: {
    name: string;
    description?: string;
  }) => Promise<void>;
}) {
  const [form, setForm] = useState({ name: "", description: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) return;
    setForm({ name: "", description: "" });
    setBusy(false);
    setError("");
  }, [open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onCreate({
        name: form.name,
        description: form.description || undefined,
      });
      onClose();
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Could not create project",
      );
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-base/60 backdrop-blur-sm"
        onClick={busy ? undefined : onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
        className="slide-in-right absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-base shadow-2xl"
      >
        <header className="flex items-start justify-between gap-5 border-b border-line px-6 py-5">
          <h2
            id="create-project-title"
            className="font-hero text-xl tracking-[-0.03em] text-ink"
          >
            Create project
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="grid h-9 w-9 flex-none place-items-center rounded-[10px] text-muted transition hover:bg-hover hover:text-ink disabled:opacity-50"
            aria-label="Close create project"
          >
            <XIcon size={20} />
          </button>
        </header>

        <form
          onSubmit={submit}
          className="flex flex-1 flex-col gap-y-5 overflow-y-auto px-6 py-6"
        >
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-muted">
              Project name
            </span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="Project name"
              autoComplete="off"
              required
              autoFocus
              className="h-10 w-full rounded-[10px] border border-line bg-glass px-3 text-sm text-ink outline-none transition placeholder:text-muted hover:border-line-strong focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </label>

          {error ? (
            <div
              role="alert"
              className="rounded-[10px] border border-bad bg-bad/20 p-3 text-sm text-bad"
            >
              {error}
            </div>
          ) : null}

          <div className="mt-auto flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="h-10 rounded-[10px] border border-line px-4 text-sm font-medium text-muted transition hover:border-line-strong hover:text-ink disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="h-10 rounded-[10px] bg-accent px-4 text-sm font-medium text-white transition hover:bg-brand-hover disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? "Creating…" : "Create project"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
