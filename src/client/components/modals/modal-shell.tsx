import type { ReactNode } from "react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { AppIcon, SectionTitle, shellButton, surfaceClass } from "../ui/primitives";

export function ModalShell({
  open,
  title,
  meta,
  icon,
  onClose,
  children,
  width = "max-w-3xl",
  minHeight = "min-h-[420px]",
  bodyClassName = "min-h-0 flex-1 overflow-y-auto pr-1",
  variant = "default",
  side = false
}: {
  open: boolean;
  title: string;
  meta?: string;
  icon: unknown;
  onClose: () => void;
  children: ReactNode;
  width?: string;
  minHeight?: string;
  bodyClassName?: string;
  variant?: "default" | "monochrome";
  side?: boolean;
}) {
  if (!open) return null;

  const monochrome = variant === "monochrome" || side;

  if (side) {
    return (
      <div className="fixed inset-0 z-50">
        <div
          className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-full ${width} flex-col border-l border-neutral-800 bg-neutral-950 shadow-2xl`}
        >
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-neutral-800 px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <AppIcon icon={icon} size={16} className="shrink-0 text-neutral-400" />
              <div className="min-w-0">
                <h2 className="truncate text-lg tracking-[-0.03em] text-neutral-100">{title}</h2>
                {meta ? <p className="mt-0.5 truncate text-xs text-neutral-400">{meta}</p> : null}
              </div>
            </div>
            <button
              type="button"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-neutral-800 text-neutral-400 transition hover:border-neutral-800 hover:bg-neutral-800 hover:text-neutral-100"
              onClick={onClose}
              aria-label="Close"
              title="Close"
            >
              <AppIcon icon={Cancel01Icon} size={15} />
            </button>
          </div>
          <div className={`${bodyClassName} min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4`}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  const panelClassName = monochrome
    ? `flex max-h-[min(720px,calc(100vh-2rem))] ${minHeight} w-full ${width} flex-col rounded-lg border border-neutral-800 bg-neutral-900 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.6)]`
    : surfaceClass(`flex max-h-[min(720px,calc(100vh-2rem))] ${minHeight} w-full ${width} flex-col p-6 md:p-7`);

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto p-4 ${monochrome ? "bg-neutral-950/75" : "bg-neutral-950/45 backdrop-blur-sm"}`}>
      <div className="mx-auto flex min-h-full items-center justify-center">
        <div className={panelClassName}>
          <div
            className={
              monochrome
                ? "flex items-center justify-between gap-4 border-b border-neutral-800 px-5 py-4"
                : "mb-6 flex items-start justify-between gap-4 border-b border-neutral-800/90 pb-5"
            }
          >
            {monochrome ? (
              <div className="flex min-w-0 items-center gap-3">
                <AppIcon icon={icon} size={16} className="shrink-0 text-neutral-400" />
                <div className="min-w-0">
                  <h2 className="truncate text-lg tracking-[-0.03em] text-white">{title}</h2>
                  {meta ? <p className="mt-0.5 truncate text-xs text-neutral-500">{meta}</p> : null}
                </div>
              </div>
            ) : (
              <SectionTitle icon={icon} title={title} meta={meta} />
            )}
            <button
              type="button"
              className={
                monochrome
                  ? "grid h-8 w-8 shrink-0 place-items-center border border-neutral-800 text-neutral-500 transition hover:border-neutral-800 hover:bg-neutral-800 hover:text-white"
                  : shellButton("ghost")
              }
              onClick={onClose}
              aria-label="Close"
              title="Close"
            >
              {monochrome ? <AppIcon icon={Cancel01Icon} size={15} /> : "Close"}
            </button>
          </div>
          <div className={`${bodyClassName} ${monochrome ? "px-5 pb-5 pt-4" : ""}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
