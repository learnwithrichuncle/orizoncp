import { Delete02Icon, HardDriveIcon, Refresh03Icon } from "@hugeicons/core-free-icons";
import type { MaintenanceCleanupTarget, SystemMaintenanceInfo } from "../../api";
import { formatBytes } from "../../lib/format";
import { AppIcon } from "../ui/primitives";
import { pathMetric, safeCleanupTargets, topDockerReclaimableRow } from "./maintenance-utils";

export function MaintenanceCleanupCard({
  info,
  loading,
  cleanupMode,
  confirmVolumes,
  onConfirmVolumesChange,
  onRunCleanup
}: {
  info: SystemMaintenanceInfo | null;
  loading: boolean;
  cleanupMode: "" | "safe" | "volumes";
  confirmVolumes: boolean;
  onConfirmVolumesChange: (confirm: boolean) => void;
  onRunCleanup: (mode: "safe" | "volumes", targets: MaintenanceCleanupTarget[]) => void;
}) {
  const dataPath = pathMetric(info, "data");
  const backupsPath = pathMetric(info, "backups");
  const aptPath = pathMetric(info, "apt-cache");
  const logsPath = pathMetric(info, "system-logs");
  const topDockerRow = topDockerReclaimableRow(info);
  const rowClass = "flex justify-between gap-3 border-b border-line py-2.5 last:border-b-0";

  return (
    <div className="border border-line bg-base">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
        <AppIcon icon={HardDriveIcon} size={16} className="text-ink-dim" />
        <div>
          <h3 className="text-sm text-zinc-100">Cleanup</h3>
          <p className="mt-0.5 text-xs text-ink-dim">Disk and Docker candidates</p>
        </div>
      </div>

      <div className="px-4 text-sm text-ink-muted">
        <div className={rowClass}>
          <span>Top Docker candidate</span>
          <span className="shrink-0 font-mono text-xs text-ink-dim">{topDockerRow ? `${formatBytes(topDockerRow.reclaimableBytes)} ${topDockerRow.type}` : "0 B"}</span>
        </div>
        <div className={rowClass}>
          <span>orizonCP data</span>
          <span className="shrink-0 font-mono text-xs text-ink-dim">{formatBytes(dataPath?.bytes ?? null)}</span>
        </div>
        <div className={rowClass}>
          <span>Backups</span>
          <span className="shrink-0 font-mono text-xs text-ink-dim">{formatBytes(backupsPath?.bytes ?? null)}</span>
        </div>
        <div className={rowClass}>
          <span>APT cache</span>
          <span className="shrink-0 font-mono text-xs text-ink-dim">{formatBytes(aptPath?.bytes ?? null)}</span>
        </div>
        <div className={rowClass}>
          <span>System logs</span>
          <span className="shrink-0 font-mono text-xs text-ink-dim">{formatBytes(logsPath?.bytes ?? null)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-line p-4">
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-2 bg-accent px-3.5 text-sm text-ink transition hover:bg-zinc-200 disabled:opacity-50"
          onClick={() => onRunCleanup("safe", safeCleanupTargets)}
          disabled={Boolean(cleanupMode) || loading}
        >
          <AppIcon icon={Refresh03Icon} size={14} className={cleanupMode === "safe" ? "animate-spin" : ""} />
          Safe cleanup
        </button>

        {confirmVolumes ? (
          <div className="border-l-2 border-rose-400 bg-rose-400/10 p-3">
            <p className="text-xs leading-relaxed text-rose-100">Delete unused Docker volumes? This will not remove attached volumes, but it can delete persistent service or database data left behind by removed containers.</p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="inline-flex h-9 items-center justify-center gap-2 border border-rose-400/50 px-3 text-sm text-rose-200 transition hover:bg-rose-400/10 disabled:opacity-50" onClick={() => onRunCleanup("volumes", ["docker-volumes"])} disabled={Boolean(cleanupMode)}>
                <AppIcon icon={Delete02Icon} size={14} className={cleanupMode === "volumes" ? "animate-spin" : ""} />
                Delete volumes
              </button>
              <button type="button" className="inline-flex h-9 items-center justify-center border border-line px-3 text-sm text-ink-muted transition hover:border-line hover:bg-hover disabled:opacity-50" onClick={() => onConfirmVolumesChange(false)} disabled={Boolean(cleanupMode)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="inline-flex h-9 items-center justify-center gap-2 border border-rose-400/40 px-3.5 text-sm text-rose-300 transition hover:bg-rose-400/10 disabled:opacity-50" onClick={() => onConfirmVolumesChange(true)} disabled={Boolean(cleanupMode) || loading}>
            <AppIcon icon={Delete02Icon} size={14} />
            Clean volumes
          </button>
        )}
      </div>
    </div>
  );
}
