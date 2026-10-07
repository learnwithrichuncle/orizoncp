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
  variant = "default"
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
}) {
  if (!open) return null;

  const monochrome = variant === "monochrome";
  const panelClassName = monochrome
    ? `flex max-h-[min(720px,calc(100vh-2rem))] ${minHeight} w-full ${width} flex-col border border-line bg-base shadow-[0_24px_80px_rgba(0,0,0,0.6)]`
    : surfaceClass(`flex max-h-[min(720px,calc(100vh-2rem))] ${minHeight} w-full ${width} flex-col p-6 md:p-7`);

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto p-4 ${monochrome ? "bg-base/75" : "bg-base/45 backdrop-blur-sm"}`}>
      <div className="mx-auto flex min-h-full items-center justify-center">
        <div className={panelClassName}>
          <div
            className={
              monochrome
                ? "flex items-center justify-between gap-4 border-b border-line px-5 py-4"
                : "mb-6 flex items-start justify-between gap-4 border-b border-line/90 pb-5"
            }
          >
            {monochrome ? (
              <div className="flex min-w-0 items-center gap-3">
                <AppIcon icon={icon} size={16} className="shrink-0 text-ink-muted" />
                <div className="min-w-0">
                  <h2 className="truncate text-lg tracking-[-0.03em] text-white">{title}</h2>
                  {meta ? <p className="mt-0.5 truncate text-xs text-ink-dim">{meta}</p> : null}
                </div>
              </div>
            ) : (
              <SectionTitle icon={icon} title={title} meta={meta} />
            )}
            <button
              type="button"
              className={
                monochrome
                  ? "grid h-8 w-8 shrink-0 place-items-center border border-line text-ink-dim transition hover:border-line hover:bg-hover hover:text-white"
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
