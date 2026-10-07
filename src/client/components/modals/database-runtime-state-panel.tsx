import { Alert02Icon, Clock01Icon, DatabaseIcon, DatabaseSync01Icon, Refresh03Icon } from "@hugeicons/core-free-icons";
import type { DatabaseRuntimeState } from "../../api";
import { AppIcon } from "../ui/primitives";

type DatabaseRuntimeStatePanelProps = {
  state: Exclude<DatabaseRuntimeState, "ready">;
  message?: string;
  busy?: boolean;
  onRefresh: () => void;
};

const runtimeStateCopy: Record<Exclude<DatabaseRuntimeState, "ready">, { title: string; fallback: string; icon: unknown; accent: string }> = {
  deploying: {
    title: "Database is deploying",
    fallback: "Data will be available once the container is running.",
    icon: DatabaseSync01Icon,
    accent: "border-warn/35 bg-warn/10 text-warn"
  },
  idle: {
    title: "Database is idle",
    fallback: "Deploy this service before browsing its data.",
    icon: Clock01Icon,
    accent: "border-line-strong bg-base/80 text-ink-muted"
  },
  failed: {
    title: "Database deployment failed",
    fallback: "Check the deployment logs, then retry the deployment.",
    icon: Alert02Icon,
    accent: "border-bad/35 bg-bad/10 text-bad"
  },
  unavailable: {
    title: "Database runtime unavailable",
    fallback: "Deploy or refresh the service, then try again.",
    icon: DatabaseIcon,
    accent: "border-orange-500/35 bg-orange-500/10 text-orange-200"
  }
};

export function DatabaseRuntimeStatePanel({ state, message, busy = false, onRefresh }: DatabaseRuntimeStatePanelProps) {
  const copy = runtimeStateCopy[state];

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-5 py-8 text-center">
      <div className="flex max-w-md flex-col items-center">
        <div className={`mb-4 grid h-10 w-10 place-items-center border ${copy.accent}`}>
          <AppIcon icon={copy.icon} size={19} className={state === "deploying" ? "animate-pulse" : ""} />
        </div>
        <h3 className="text-sm text-ink">{copy.title}</h3>
        <p className="mt-2 text-xs leading-5 text-ink-dim">{message || copy.fallback}</p>
        <button
          type="button"
          className="mt-5 inline-flex h-8 items-center justify-center gap-2 border border-line px-3 text-xs text-ink-muted transition hover:border-line hover:bg-hover hover:text-white disabled:opacity-40"
          onClick={onRefresh}
          disabled={busy}
        >
          <AppIcon icon={Refresh03Icon} size={13} className={busy ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>
    </div>
  );
}
