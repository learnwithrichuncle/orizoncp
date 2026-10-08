import { Delete02Icon } from "@hugeicons/core-free-icons";
import { SettingsDialog } from "../../features/settings/settings-dialog";
import { AppIcon } from "../ui/primitives";

export function DeleteProjectModal({
  open,
  projectName,
  busy,
  onClose,
  onConfirm
}: {
  open: boolean;
  projectName: string;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <SettingsDialog
      open={open}
      title="Delete project"
      width="max-w-md"
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <div>
        <p className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">{projectName}</p>
        <p className="mt-4 border-l-2 border-red-500 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-500">
          This will permanently remove this project and every service inside it.
        </p>

        <div className="mt-5 flex justify-end gap-2 border-t border-neutral-800 pt-4">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center border border-neutral-800 px-3.5 text-sm text-neutral-400 transition hover:border-neutral-800 hover:bg-neutral-800 disabled:opacity-50"
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-2 border border-red-500/50 px-3.5 text-sm text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
            onClick={onConfirm}
            disabled={busy}
          >
            <AppIcon icon={Delete02Icon} size={14} />
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </SettingsDialog>
  );
}
