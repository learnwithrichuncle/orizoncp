import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { AppIcon } from "../../components/ui/primitives";

export function RedeployRequiredToast({
  visible,
  busy,
  serviceName,
  onDismiss,
  onRedeploy
}: {
  visible: boolean;
  busy: boolean;
  serviceName: string;
  onDismiss: () => void;
  onRedeploy: () => void;
}) {
  if (!visible) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 w-[min(350px,calc(100vw-2rem))] border border-line bg-base shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-4 border-b border-line px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 bg-amber-300 ${busy ? "animate-pulse" : ""}`} />
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber-300">
              {busy ? "Deploying" : "Redeploy required"}
            </span>
          </div>
          <div className="mt-1 truncate text-sm text-ink">{serviceName}</div>
        </div>
        <button
          type="button"
          className="grid h-7 w-7 shrink-0 place-items-center text-ink-dim transition hover:bg-hover hover:text-white"
          onClick={onDismiss}
          aria-label="Dismiss redeploy reminder"
        >
          <AppIcon icon={Cancel01Icon} size={14} />
        </button>
      </div>

      <div className="px-4 py-3">
        <p className="text-xs leading-5 text-ink-dim">
          Redeploy to apply the settings you just saved.
        </p>
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            className="inline-flex h-8 items-center justify-center px-3 text-xs text-ink-dim transition hover:bg-hover hover:text-white"
            onClick={onDismiss}
            disabled={busy}
          >
            Later
          </button>
          <button
            type="button"
            className="inline-flex h-8 min-w-24 items-center justify-center bg-accent px-3 text-xs text-ink transition hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-60"
            onClick={onRedeploy}
            disabled={busy}
          >
            {busy ? "Starting…" : "Redeploy"}
          </button>
        </div>
      </div>
    </div>
  );
}
