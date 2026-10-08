import { useEffect, useState } from "react";
import { api } from "../../api";

const minConcurrency = 1;
const maxConcurrency = 10;

function clampConcurrency(value: number) {
  if (!Number.isFinite(value)) return 3;
  return Math.min(maxConcurrency, Math.max(minConcurrency, Math.round(value)));
}

export function DeploymentSettingsPanel({ open }: { open: boolean }) {
  const [deploymentConcurrency, setDeploymentConcurrency] = useState(3);
  const [savedConcurrency, setSavedConcurrency] = useState(3);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadSettings() {
    setLoading(true);
    setError("");
    try {
      const result = await api.systemSettings();
      const next = clampConcurrency(result.settings.deploymentConcurrency);
      setDeploymentConcurrency(next);
      setSavedConcurrency(next);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not load deployment settings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    void loadSettings();
  }, [open]);

  async function saveConcurrency(value: number) {
    const nextValue = clampConcurrency(value);
    setDeploymentConcurrency(nextValue);
    setSaving(true);
    setError("");
    try {
      const result = await api.updateSystemSettings({ deploymentConcurrency: nextValue });
      const next = clampConcurrency(result.settings.deploymentConcurrency);
      setDeploymentConcurrency(next);
      setSavedConcurrency(next);
    } catch (issue) {
      setDeploymentConcurrency(savedConcurrency);
      setError(issue instanceof Error ? issue.message : "Could not save deployment settings");
    } finally {
      setSaving(false);
    }
  }

  const busy = loading || saving;

  return (
    <section className="mx-auto max-w-3xl overflow-hidden border border-neutral-800 bg-neutral-950">
      <header className="border-b border-neutral-800 px-5 py-5 sm:px-7">
        <h2 className="text-xl tracking-[-0.03em] text-white">Concurrent deployments</h2>
        <p className="mt-1.5 text-sm text-neutral-500">Set how many deployments can run at once.</p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-5 px-5 py-5 sm:px-7">
        <div>
          <div className="text-sm text-neutral-400">Concurrency limit</div>
          <div className="mt-1 text-xs text-neutral-500">Between {minConcurrency} and {maxConcurrency}</div>
        </div>
        {loading ? (
          <div className="h-9 w-[132px] animate-pulse bg-neutral-900" />
        ) : (
          <div className="inline-grid grid-cols-[36px_60px_36px]">
            <button
              type="button"
              className="grid h-9 place-items-center border border-neutral-800 text-lg text-neutral-400 transition hover:border-neutral-800 hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              onClick={() => void saveConcurrency(deploymentConcurrency - 1)}
              disabled={busy || deploymentConcurrency <= minConcurrency}
              aria-label="Decrease concurrent deployments"
            >
              -
            </button>
            <div className="grid h-9 place-items-center border-y border-neutral-800 bg-neutral-900 font-mono text-sm text-neutral-100">
              {deploymentConcurrency}
            </div>
            <button
              type="button"
              className="grid h-9 place-items-center border border-neutral-800 text-lg text-neutral-400 transition hover:border-neutral-800 hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              onClick={() => void saveConcurrency(deploymentConcurrency + 1)}
              disabled={busy || deploymentConcurrency >= maxConcurrency}
              aria-label="Increase concurrent deployments"
            >
              +
            </button>
          </div>
        )}
      </div>

      {saving ? <div className="border-t border-neutral-800 px-5 py-3 text-xs text-neutral-500 sm:px-7">Saving…</div> : null}
      {error ? (
        <div className="border-t border-neutral-800 px-5 py-4 sm:px-7">
          <div className="border-l-2 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</div>
        </div>
      ) : null}
    </section>
  );
}
