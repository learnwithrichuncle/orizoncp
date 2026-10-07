import {
  HardDriveIcon,
  Settings01Icon
} from "@hugeicons/core-free-icons";
import { Link } from "@tanstack/react-router";
import type { BackupScheduleEnabled, BackupScheduleTrigger, BackupStorageTarget, DatabaseBackupSettings } from "../../../api";
import cloudflareLogoUrl from "../../../assets/dns-providers/cloudflare.svg";
import { AppIcon } from "../../ui/primitives";
import { SquareSwitch } from "../../ui/square-switch";
import { ModalShell } from "../modal-shell";
import { retentionLabel, triggerLabel } from "./backup-format";

type BackupSettingsModalProps = {
  open: boolean;
  activeSettings: DatabaseBackupSettings;
  r2Connected: boolean;
  showRemoteStorageOptions: boolean;
  draftStorage: BackupStorageTarget;
  draftScheduleEnabled: BackupScheduleEnabled;
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
  onDraftStorageChange: (storage: BackupStorageTarget) => void;
  onDraftScheduleChange: (trigger: BackupScheduleTrigger, enabled: boolean) => void;
};

export function BackupSettingsModal({
  open,
  activeSettings,
  r2Connected,
  showRemoteStorageOptions,
  draftStorage,
  draftScheduleEnabled,
  saving,
  onClose,
  onSave,
  onDraftStorageChange,
  onDraftScheduleChange
}: BackupSettingsModalProps) {
  return (
    <ModalShell
      open={open}
      title="Backup settings"
      icon={Settings01Icon}
      onClose={onClose}
      width="max-w-lg"
      minHeight="min-h-0"
      variant="monochrome"
    >
      <div className="space-y-5">
        <div>
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim">Destination</p>
          <div className="grid gap-3 md:grid-cols-3">
            {([
              { value: "disk" as const, label: "Disk", cloudflare: false, disabled: false },
              ...(showRemoteStorageOptions
                ? [
                    { value: "r2" as const, label: "R2", cloudflare: true, disabled: !r2Connected },
                    { value: "disk+r2" as const, label: "Both", cloudflare: true, disabled: !r2Connected }
                  ]
                : [])
            ]).map((option) => (
              <button
                key={option.value}
                type="button"
                className={`flex h-14 items-center gap-2.5 px-3 text-left text-xs transition ${
                  draftStorage === option.value
                    ? "bg-accent text-ink"
                    : "border border-line text-ink-muted hover:border-line hover:bg-hover hover:text-white"
                } ${option.disabled ? "cursor-not-allowed opacity-45" : ""}`}
                onClick={() => {
                  if (!option.disabled) onDraftStorageChange(option.value);
                }}
                disabled={option.disabled}
              >
                {option.cloudflare ? (
                  <span className="flex shrink-0 items-center gap-1.5">
                    {option.value === "disk+r2" ? <AppIcon icon={HardDriveIcon} size={13} /> : null}
                    <img src={cloudflareLogoUrl} alt="" className="h-4 w-7 object-contain" />
                  </span>
                ) : (
                  <AppIcon icon={HardDriveIcon} size={15} />
                )}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
          {showRemoteStorageOptions && !r2Connected ? (
            <p className="mt-2 border border-warn/30 bg-warn/10 px-3 py-2 text-xs text-warn">
              Connect R2 in{" "}
              <Link
                to="/settings/$settingsPage"
                params={{ settingsPage: "storage" }}
                className="underline underline-offset-2 hover:text-warn"
              >
                Storage settings
              </Link>{" "}
              to enable remote backups.
            </p>
          ) : null}
        </div>

        <div>
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim">Schedules</p>
          <div className="border border-line">
            {activeSettings.schedules.map((schedule) => {
              const enabled = draftScheduleEnabled[schedule.trigger];
              return (
                <div
                  key={schedule.trigger}
                  className="flex w-full items-center justify-between gap-3 border-b border-line px-3 py-3 text-left transition last:border-b-0 hover:bg-glass"
                >
                  <span>
                    <span className="block text-xs text-ink-muted">{triggerLabel(schedule.trigger)}</span>
                    <span className="mt-1 block font-mono text-[9px] text-ink-dim">
                      every {schedule.intervalHours === 24 ? "24 hours" : schedule.intervalHours === 168 ? "7 days" : "30 days"}, kept for {retentionLabel(schedule.retentionDays)}
                    </span>
                  </span>
                  <SquareSwitch
                    checked={enabled}
                    onCheckedChange={(checked) => onDraftScheduleChange(schedule.trigger, checked)}
                    label={`${enabled ? "Disable" : "Enable"} ${triggerLabel(schedule.trigger).toLowerCase()} backups`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-line pt-4">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center border border-line px-3.5 text-sm text-ink-muted transition hover:border-line hover:bg-hover hover:text-white disabled:opacity-40"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center bg-accent px-4 text-sm text-ink transition hover:bg-zinc-200 disabled:opacity-40"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
