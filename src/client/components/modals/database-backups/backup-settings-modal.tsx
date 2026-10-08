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
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500">Destination</p>
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
                    ? "bg-blue-600 text-neutral-100"
                    : "border border-neutral-800 text-neutral-400 hover:border-neutral-800 hover:bg-neutral-800 hover:text-white"
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
            <p className="mt-2 border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-500">
              Connect R2 in{" "}
              <Link
                to="/settings/$settingsPage"
                params={{ settingsPage: "storage" }}
                className="underline underline-offset-2 hover:text-amber-500"
              >
                Storage settings
              </Link>{" "}
              to enable remote backups.
            </p>
          ) : null}
        </div>

        <div>
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500">Schedules</p>
          <div className="border border-neutral-800">
            {activeSettings.schedules.map((schedule) => {
              const enabled = draftScheduleEnabled[schedule.trigger];
              return (
                <div
                  key={schedule.trigger}
                  className="flex w-full items-center justify-between gap-3 border-b border-neutral-800 px-3 py-3 text-left transition last:border-b-0 hover:bg-neutral-900"
                >
                  <span>
                    <span className="block text-xs text-neutral-400">{triggerLabel(schedule.trigger)}</span>
                    <span className="mt-1 block font-mono text-[9px] text-neutral-500">
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

        <div className="flex items-center justify-end gap-2 border-t border-neutral-800 pt-4">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center border border-neutral-800 px-3.5 text-sm text-neutral-400 transition hover:border-neutral-800 hover:bg-neutral-800 hover:text-white disabled:opacity-40"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center bg-blue-600 px-4 text-sm text-neutral-100 transition hover:bg-zinc-200 disabled:opacity-40"
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
