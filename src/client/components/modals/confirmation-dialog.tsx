import { Cancel01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { useId } from "react";
import { AppIcon } from "../ui/primitives";

type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  subject?: string;
  eyebrow?: string;
  busy?: boolean;
  icon?: unknown;
  confirmIcon?: unknown;
  tone?: "danger" | "warning";
  zIndexClassName?: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  subject,
  eyebrow = "Confirm action",
  busy = false,
  icon = Delete02Icon,
  confirmIcon = Delete02Icon,
  tone = "danger",
  zIndexClassName = "z-[70]",
  onClose,
  onConfirm
}: ConfirmationDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const iconToneClass = tone === "warning" ? "text-amber-500" : "text-red-500";
  const descriptionToneClass = tone === "warning"
    ? "border-amber-500 bg-amber-500/10 text-amber-500"
    : "border-red-500 bg-red-500/10 text-red-500";
  const confirmToneClass = tone === "warning"
    ? "border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
    : "border-red-500/50 text-red-500 hover:bg-red-500/10";

  if (!open) return null;

  return (
    <div className={`fixed inset-0 ${zIndexClassName} overflow-y-auto bg-neutral-950/75 p-4`}>
      <div className="mx-auto flex min-h-full items-center justify-center">
        <section role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-900 backdrop-blur-xl">
          <header className="flex items-center justify-between gap-4 border-b border-neutral-800 px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <AppIcon icon={icon} size={16} className={`shrink-0 ${iconToneClass}`} />
              <div className="min-w-0">
                <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-500">{eyebrow}</div>
                <h2 id={titleId} className="truncate text-lg tracking-[-0.03em] text-neutral-100">
              {title}
                </h2>
              </div>
            </div>
            <button
              type="button"
              className="grid h-9 w-9 shrink-0 place-items-center border border-neutral-800 text-neutral-400 transition hover:border-neutral-800 hover:bg-neutral-800 hover:text-white disabled:opacity-50"
              onClick={onClose}
              disabled={busy}
              aria-label="Close"
              title="Close"
            >
              <AppIcon icon={Cancel01Icon} size={16} />
            </button>
          </header>

          <div className="p-4">
            {subject ? <p className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">{subject}</p> : null}
            <p id={descriptionId} className={`mt-4 border-l-2 px-4 py-3 text-sm leading-relaxed ${descriptionToneClass}`}>
              {description}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-neutral-800 pt-4">
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
                className={`inline-flex h-9 items-center justify-center gap-2 border px-3.5 text-sm transition disabled:opacity-50 ${confirmToneClass}`}
                onClick={() => void onConfirm()}
                disabled={busy}
              >
                <AppIcon icon={confirmIcon} size={14} />
                {confirmLabel}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
