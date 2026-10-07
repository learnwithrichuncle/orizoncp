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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-base/80 p-4 backdrop-blur-sm">
      <div className="mx-auto flex min-h-full items-center justify-center">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-project-title"
          className="w-full max-w-xl rounded-lg border border-line bg-surface p-8 text-ink shadow-2xl"
        >
          <header className="flex items-start justify-between gap-5">
            <h2
              id="create-project-title"
              className="text-2xl font-bold text-ink"
            >
              Create a new project
            </h2>
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="grid h-9 w-9 flex-none place-items-center rounded-md text-ink-dim transition hover:bg-hover hover:text-ink disabled:opacity-50"
              aria-label="Close create project modal"
            >
              <XIcon size={20} />
            </button>
          </header>

          <form onSubmit={submit} className="mt-8">
            <div className="grid gap-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-medium text-ink-muted">
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
                  placeholder="Acme platform"
                  autoComplete="off"
                  required
                  autoFocus
                  className="h-9 w-full rounded-md border border-line bg-elevated px-3 text-sm text-ink outline-none transition placeholder:text-ink-dim hover:border-line-strong focus:border-brand-edge focus:ring-2 focus:ring-accent-soft"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-ink-muted">
                    Description
                  </span>
                  <span className="text-xs text-ink-dim">
                    Optional
                  </span>
                </span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Internal tools and APIs"
                  rows={4}
                  className="w-full resize-y rounded-md border border-line bg-elevated p-3 text-sm text-ink outline-none transition placeholder:text-ink-dim hover:border-line-strong focus:border-brand-edge focus:ring-2 focus:ring-accent-soft"
                />
              </label>
            </div>

            {error ? (
              <div
                role="alert"
                className="mt-5 rounded-md border border-bad bg-bad/20 p-3 text-sm text-bad"
              >
                {error}
              </div>
            ) : null}

            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                className="rounded-md border border-line bg-elevated px-4 py-2 text-sm font-medium text-ink-muted transition hover:border-line-strong hover:bg-hover hover:text-ink disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="rounded-md border border-brand-edge bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-hover disabled:cursor-wait disabled:opacity-60"
              >
                {busy ? "Creating…" : "Create project"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
