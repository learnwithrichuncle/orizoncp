import { XIcon } from "lucide-react";
import type { ReactNode } from "react";

export function ProviderImportShell({
  open,
  title,
  stepLabel,
  logo,
  onClose,
  children,
  width = "max-w-xl",
  bodyClassName = "min-h-0 flex-1 overflow-y-auto",
}: {
  open: boolean;
  title: string;
  stepLabel: string;
  logo: ReactNode;
  onClose: () => void;
  children: ReactNode;
  width?: string;
  bodyClassName?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 p-4 backdrop-blur-sm">
      <div className="mx-auto flex min-h-full items-center justify-center">
        <section
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={`flex max-h-[min(760px,calc(100dvh-2rem))] min-h-[420px] w-full ${width} flex-col rounded-lg border border-neutral-800 bg-neutral-900 p-8 text-neutral-100 shadow-2xl`}
        >
          <header className="flex items-start justify-between gap-5">
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid h-9 w-9 flex-none place-items-center">
                {logo}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-2xl font-bold text-neutral-100">
                  {title}
                </h2>
                <p className="text-xs text-neutral-500">
                  {stepLabel}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 flex-none place-items-center rounded-md text-neutral-500 transition hover:bg-neutral-800 hover:text-neutral-100"
              aria-label={`Close ${title}`}
            >
              <XIcon size={20} />
            </button>
          </header>

          <div className={`mt-8 ${bodyClassName}`}>{children}</div>
        </section>
      </div>
    </div>
  );
}
