import { Refresh03Icon } from "@hugeicons/core-free-icons";
import { SettingsDialog } from "../../features/settings/settings-dialog";
import { AppIcon } from "../ui/primitives";

type UpdateConfirmationModalProps = {
  applying: boolean;
  installType: "git" | "image";
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function UpdateConfirmationModal({ applying, installType, open, onCancel, onConfirm }: UpdateConfirmationModalProps) {
  const actionLabel = installType === "image" ? "Pull latest image" : "Update orizonCP";

  return (
    <SettingsDialog open={open} title={actionLabel} onClose={() => {
      if (!applying) onCancel();
    }} width="max-w-md">
      <div>
        <p className="text-sm leading-relaxed text-neutral-400">
          orizonCP may restart after the update. The dashboard can briefly disconnect.
        </p>

        <div className="mt-5 flex items-center justify-end gap-2 border-t border-neutral-800 pt-4">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center border border-neutral-800 px-3.5 text-sm text-neutral-400 transition hover:border-neutral-800 hover:bg-neutral-800 disabled:opacity-50"
            onClick={onCancel}
            disabled={applying}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-2 bg-blue-600 px-4 text-sm text-neutral-100 transition hover:bg-zinc-200 disabled:opacity-50"
            onClick={onConfirm}
            disabled={applying}
          >
            <AppIcon icon={Refresh03Icon} size={13} className={applying ? "animate-spin" : ""} />
            {applying ? "Starting..." : actionLabel}
          </button>
        </div>
      </div>
    </SettingsDialog>
  );
}
