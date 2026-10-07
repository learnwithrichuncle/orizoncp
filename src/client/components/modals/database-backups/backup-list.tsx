import {
  Archive01Icon,
  ArchiveRestoreIcon,
  Delete02Icon,
  Download01Icon,
  Refresh03Icon
} from "@hugeicons/core-free-icons";
import { api, type DatabaseBackup as DatabaseBackupRecord } from "../../../api";
import { AppIcon } from "../../ui/primitives";
import { backupStatusClass, formatBytes, formatDate, storageLabel, triggerLabel } from "./backup-format";

type BackupListProps = {
  serviceId: string;
  backups: DatabaseBackupRecord[];
  automaticEnabled: boolean;
  loading: boolean;
  busy: string;
  showRemoteStorageDetails: boolean;
  onDeletePrompt: (backupId: string) => void;
  onRestorePrompt: (backupId: string) => void;
};

function visibleStorageLabel(backup: DatabaseBackupRecord, showRemoteStorageDetails: boolean) {
  if (showRemoteStorageDetails) return storageLabel(backup.storage, Boolean(backup.r2Key));
  return backup.storage === "disk" ? storageLabel(backup.storage) : "Disk";
}

const backupActionClass = "inline-flex h-8 w-8 items-center justify-center border border-line text-ink-dim transition hover:border-line hover:bg-hover hover:text-white disabled:opacity-40";

export function BackupList({
  serviceId,
  backups,
  automaticEnabled,
  loading,
  busy,
  showRemoteStorageDetails,
  onDeletePrompt,
  onRestorePrompt
}: BackupListProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {backups.length === 0 ? (
        <div className="flex min-h-full items-center justify-center p-8 text-center">
          <div>
            <AppIcon icon={Archive01Icon} size={22} className="mx-auto text-zinc-700" />
            <h3 className="mt-4 text-sm text-ink-muted">{loading ? "Loading backups…" : "No backups yet"}</h3>
            {!loading ? (
              <p className="mt-2 max-w-sm text-xs leading-5 text-ink-dim">
                {automaticEnabled ? "Create one now or wait for the next scheduled backup." : "Create one now or enable a schedule in settings."}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <>
          <div className="hidden grid-cols-[minmax(0,1.25fr)_180px_170px_112px] border-b border-line bg-glass px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim lg:grid">
            <span>Backup</span>
            <span>Created</span>
            <span>Storage</span>
            <span className="text-right">Actions</span>
          </div>

          {backups.map((backup) => {
            const deleting = busy === `delete:${backup.id}`;
            const restoring = busy === `restore:${backup.id}`;
            return (
              <article
                key={backup.id}
                className="grid gap-3 border-b border-line px-4 py-4 last:border-b-0 sm:px-5 lg:grid-cols-[minmax(0,1.25fr)_180px_170px_112px] lg:items-center"
              >
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={`shrink-0 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.14em] ${backupStatusClass(backup.status)}`}>
                      {backup.status}
                    </span>
                    <span className="truncate font-mono text-xs text-ink-muted">{backup.fileName ?? backup.id}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-dim">
                    <span>{backup.engine}</span>
                    <span>{backup.format}</span>
                    <span>{triggerLabel(backup.trigger)}</span>
                  </div>
                  {backup.error ? <p className="mt-2 text-xs leading-5 text-bad">{backup.error}</p> : null}
                </div>

                <div className="text-xs text-ink-dim">
                  <span className="mr-2 font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-700 lg:hidden">Created</span>
                  {formatDate(backup.createdAt)}
                </div>

                <div className="min-w-0">
                  <div className="text-xs text-ink-muted">
                    {visibleStorageLabel(backup, showRemoteStorageDetails)} · {formatBytes(backup.sizeBytes)}
                  </div>
                  {showRemoteStorageDetails && backup.r2Key ? (
                    <div className="mt-1 truncate font-mono text-[9px] text-ink-dim">{backup.r2Key}</div>
                  ) : null}
                </div>

                <div className="flex items-center gap-1.5 lg:justify-end">
                  {backup.status === "succeeded" ? (
                    <>
                      <a
                        href={api.databaseBackupDownloadUrl(serviceId, backup.id)}
                        className={backupActionClass}
                        title="Download backup"
                        aria-label="Download backup"
                      >
                        <AppIcon icon={Download01Icon} size={14} />
                      </a>
                      <button
                        type="button"
                        className={`${backupActionClass} hover:border-warn/50 hover:bg-warn/10 hover:text-warn`}
                        onClick={() => onRestorePrompt(backup.id)}
                        disabled={restoring}
                        title="Restore backup"
                        aria-label="Restore backup"
                      >
                        <AppIcon icon={restoring ? Refresh03Icon : ArchiveRestoreIcon} size={14} className={restoring ? "animate-spin" : ""} />
                      </button>
                    </>
                  ) : null}
                  <button
                    type="button"
                    className={`${backupActionClass} hover:border-bad/50 hover:bg-bad/10 hover:text-bad`}
                    onClick={() => onDeletePrompt(backup.id)}
                    disabled={deleting}
                    title="Delete backup"
                    aria-label="Delete backup"
                  >
                    <AppIcon icon={deleting ? Refresh03Icon : Delete02Icon} size={14} className={deleting ? "animate-spin" : ""} />
                  </button>
                </div>
              </article>
            );
          })}
        </>
      )}
    </div>
  );
}
