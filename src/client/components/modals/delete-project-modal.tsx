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
        <p className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-ink-dim">{projectName}</p>
        <p className="mt-4 border-l-2 border-bad bg-bad/10 px-4 py-3 text-sm leading-relaxed text-bad">
          This will permanently remove this project and every service inside it.
        </p>

        <div className="mt-5 flex justify-end gap-2 border-t border-line pt-4">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center border border-line px-3.5 text-sm text-ink-muted transition hover:border-line hover:bg-hover disabled:opacity-50"
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-2 border border-bad/50 px-3.5 text-sm text-bad transition hover:bg-bad/10 disabled:opacity-50"
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
