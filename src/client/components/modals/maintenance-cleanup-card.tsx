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
  const rowClass = "flex justify-between gap-3 border-b border-neutral-800 py-2.5 last:border-b-0";

  return (
    <div className="border border-neutral-800 bg-neutral-950">
      <div className="flex items-center gap-3 border-b border-neutral-800 px-4 py-3.5">
        <AppIcon icon={HardDriveIcon} size={16} className="text-neutral-500" />
        <div>
          <h3 className="text-sm text-neutral-100">Cleanup</h3>
          <p className="mt-0.5 text-xs text-neutral-500">Disk and Docker candidates</p>
        </div>
      </div>

      <div className="px-4 text-sm text-neutral-400">
        <div className={rowClass}>
          <span>Top Docker candidate</span>
          <span className="shrink-0 font-mono text-xs text-neutral-500">{topDockerRow ? `${formatBytes(topDockerRow.reclaimableBytes)} ${topDockerRow.type}` : "0 B"}</span>
        </div>
        <div className={rowClass}>
          <span>orizonCP data</span>
          <span className="shrink-0 font-mono text-xs text-neutral-500">{formatBytes(dataPath?.bytes ?? null)}</span>
        </div>
        <div className={rowClass}>
          <span>Backups</span>
          <span className="shrink-0 font-mono text-xs text-neutral-500">{formatBytes(backupsPath?.bytes ?? null)}</span>
        </div>
        <div className={rowClass}>
          <span>APT cache</span>
          <span className="shrink-0 font-mono text-xs text-neutral-500">{formatBytes(aptPath?.bytes ?? null)}</span>
        </div>
        <div className={rowClass}>
          <span>System logs</span>
          <span className="shrink-0 font-mono text-xs text-neutral-500">{formatBytes(logsPath?.bytes ?? null)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-neutral-800 p-4">
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-2 bg-blue-600 px-3.5 text-sm text-neutral-100 transition hover:bg-zinc-200 disabled:opacity-50"
          onClick={() => onRunCleanup("safe", safeCleanupTargets)}
          disabled={Boolean(cleanupMode) || loading}
        >
          <AppIcon icon={Refresh03Icon} size={14} className={cleanupMode === "safe" ? "animate-spin" : ""} />
          Safe cleanup
        </button>

        {confirmVolumes ? (
          <div className="border-l-2 border-red-500 bg-red-500/10 p-3">
            <p className="text-xs leading-relaxed text-red-500">Delete unused Docker volumes? This will not remove attached volumes, but it can delete persistent service or database data left behind by removed containers.</p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="inline-flex h-9 items-center justify-center gap-2 border border-red-500/50 px-3 text-sm text-red-500 transition hover:bg-red-500/10 disabled:opacity-50" onClick={() => onRunCleanup("volumes", ["docker-volumes"])} disabled={Boolean(cleanupMode)}>
                <AppIcon icon={Delete02Icon} size={14} className={cleanupMode === "volumes" ? "animate-spin" : ""} />
                Delete volumes
              </button>
              <button type="button" className="inline-flex h-9 items-center justify-center border border-neutral-800 px-3 text-sm text-neutral-400 transition hover:border-neutral-800 hover:bg-neutral-800 disabled:opacity-50" onClick={() => onConfirmVolumesChange(false)} disabled={Boolean(cleanupMode)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="inline-flex h-9 items-center justify-center gap-2 border border-red-500/40 px-3.5 text-sm text-red-500 transition hover:bg-red-500/10 disabled:opacity-50" onClick={() => onConfirmVolumesChange(true)} disabled={Boolean(cleanupMode) || loading}>
            <AppIcon icon={Delete02Icon} size={14} />
            Clean volumes
          </button>
        )}
      </div>
    </div>
  );
}
