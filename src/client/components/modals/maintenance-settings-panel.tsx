import { Alert02Icon, Refresh03Icon } from "@hugeicons/core-free-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api, type MaintenanceCleanupTarget, type MaintenanceCommandResult, type SystemMaintenanceInfo } from "../../api";
import { AppIcon } from "../ui/primitives";
import { MaintenanceCleanupCard } from "./maintenance-cleanup-card";
import { MaintenanceCommandLog } from "./maintenance-command-log";
import { MaintenanceDockerStorage } from "./maintenance-docker-storage";
import { MaintenanceHistoryChart } from "./maintenance-history-chart";
import { MaintenanceSummaryGrid } from "./maintenance-summary-grid";
import { healthLabel } from "./maintenance-utils";

export function MaintenanceSettingsPanel({ open }: { open: boolean }) {
  const [info, setInfo] = useState<SystemMaintenanceInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [cleanupMode, setCleanupMode] = useState<"" | "safe" | "volumes">("");
  const [commands, setCommands] = useState<MaintenanceCommandResult[]>([]);
  const [confirmVolumes, setConfirmVolumes] = useState(false);
  const [error, setError] = useState("");

  const loadMaintenance = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setInfo(await api.systemMaintenance());
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not load maintenance data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    void loadMaintenance();
  }, [loadMaintenance, open]);

  const dockerMax = useMemo(() => {
    return Math.max(...(info?.docker.rows.map((row) => row.sizeBytes ?? 0) ?? []), 1);
  }, [info]);

  async function runCleanup(mode: "safe" | "volumes", targets: MaintenanceCleanupTarget[]) {
    setCleanupMode(mode);
    setError("");
    setCommands([]);
    try {
      const result = await api.runSystemMaintenanceCleanup(targets);
      setInfo(result.info);
      setCommands(result.commands);
      setConfirmVolumes(false);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Cleanup failed");
    } finally {
      setCleanupMode("");
    }
  }

  const healthTone = !info
    ? "text-neutral-500"
    : info.alerts.some((alert) => alert.includes("90%"))
      ? "text-red-500"
      : info.alerts.length > 0
        ? "text-amber-500"
        : "text-green-500";
  const healthDot = !info
    ? "bg-ink-dim"
    : info.alerts.some((alert) => alert.includes("90%"))
      ? "bg-red-500"
      : info.alerts.length > 0
        ? "bg-amber-500"
        : "bg-green-500";
  const checkedAt = info
    ? new Date(info.checkedAt).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : null;

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 backdrop-blur-xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 px-5 py-5 sm:px-7">
          <div>
            <h2 className="text-xl tracking-[-0.03em] text-neutral-100">Host health</h2>
            <p className="mt-1.5 text-sm text-neutral-500">
              {checkedAt
                ? `Checked ${checkedAt} · ${info?.history.length ?? 0} history samples`
                : "Disk, Docker, logs, and build artifacts."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] ${healthTone}`}>
              <span className={`h-1.5 w-1.5 ${loading ? "animate-pulse" : ""} ${healthDot}`} />
              {loading ? "Checking" : healthLabel(info)}
            </span>
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center gap-2 border border-neutral-800 px-3.5 text-sm text-neutral-400 transition hover:border-neutral-700 hover:bg-neutral-800 hover:text-neutral-100 disabled:opacity-50"
              onClick={() => void loadMaintenance()}
              disabled={loading || Boolean(cleanupMode)}
            >
              <AppIcon icon={Refresh03Icon} size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </header>

        {error ? (
          <div className="px-5 py-4 sm:px-7">
            <div className="border-l-2 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</div>
          </div>
        ) : null}

        {info?.alerts.length ? (
          <div className="divide-y divide-warn/15 border-t border-amber-500/20 bg-amber-500/[0.06]">
            {info.alerts.map((alert) => (
              <div key={alert} className="flex items-center gap-2 px-5 py-3 text-sm text-amber-500 sm:px-7">
                <AppIcon icon={Alert02Icon} size={15} />
                {alert}
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <MaintenanceSummaryGrid info={info} loading={loading} />

      <div className="grid gap-4 xl:grid-cols-3">
        <MaintenanceHistoryChart history={info?.history ?? []} metric="disk" label="Disk trend" />
        <MaintenanceHistoryChart history={info?.history ?? []} metric="docker" label="Docker reclaimable trend" />
        <MaintenanceHistoryChart history={info?.history ?? []} metric="builds" label="Build artifact trend" />
      </div>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <MaintenanceDockerStorage info={info} loading={loading} dockerMax={dockerMax} />
        <MaintenanceCleanupCard
          info={info}
          loading={loading}
          cleanupMode={cleanupMode}
          confirmVolumes={confirmVolumes}
          onConfirmVolumesChange={setConfirmVolumes}
          onRunCleanup={(mode, targets) => void runCleanup(mode, targets)}
        />
      </section>

      <MaintenanceCommandLog commands={commands} />
    </div>
  );
}
