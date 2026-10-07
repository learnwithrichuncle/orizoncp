import { Cancel01Icon } from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";
import { AppIcon } from "../../components/ui/primitives";

export function SettingsDialog({
  open,
  title,
  onClose,
  children,
  width = "max-w-2xl"
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-base/75 p-4">
      <div className="mx-auto flex min-h-full items-center justify-center">
        <section className={`flex max-h-[calc(100vh-2rem)] w-full ${width} flex-col border border-line bg-base`}>
          <header className="flex items-center justify-between gap-4 border-b border-line px-4 py-3.5">
            <h2 className="text-lg tracking-[-0.03em] text-white">{title}</h2>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center border border-line text-ink-muted transition hover:border-line hover:bg-hover hover:text-white"
              onClick={onClose}
              title="Close"
              aria-label="Close"
            >
              <AppIcon icon={Cancel01Icon} size={16} />
            </button>
          </header>
          <div className="min-h-0 overflow-y-auto p-4">{children}</div>
        </section>
      </div>
    </div>
  );
}
