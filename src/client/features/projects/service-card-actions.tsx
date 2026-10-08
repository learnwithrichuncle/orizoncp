import {
  ArrowRight02Icon,
  ArrowUpRight02Icon,
  FolderTransferIcon,
  MoreVerticalIcon
} from "@hugeicons/core-free-icons";
import { useEffect, useRef, useState } from "react";
import type { ProjectEnvironment } from "../../api";
import { AppIcon } from "../../components/ui/primitives";

export function ServiceCardActions({
  serviceName,
  environment,
  canVisit,
  canMoveEnvironment,
  onOpen,
  onVisit,
  onMoveEnvironment
}: {
  serviceName: string;
  environment: ProjectEnvironment;
  canVisit: boolean;
  canMoveEnvironment: boolean;
  onOpen: () => void;
  onVisit: () => void;
  onMoveEnvironment: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function closeOnOutsideClick(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  function runAction(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <div
      ref={rootRef}
      className="relative shrink-0"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === "Escape") setOpen(false);
      }}
      onDragStart={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <button
        type="button"
        className="grid h-8 w-8 place-items-center border border-neutral-800 text-neutral-500 transition hover:border-neutral-800 hover:bg-neutral-800 hover:text-white"
        onClick={() => setOpen((current) => !current)}
        aria-label={`${serviceName} options`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <AppIcon icon={MoreVerticalIcon} size={16} />
      </button>

      {open ? (
        <div
          className="absolute bottom-full right-0 z-50 mb-2 w-52 border border-neutral-800 bg-neutral-950 p-1 shadow-[0_18px_50px_rgba(0,0,0,0.65)]"
          role="menu"
        >
          <div className="border-b border-neutral-800 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-500">
            {environment.name}
          </div>
          <button
            type="button"
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-neutral-400 transition hover:bg-neutral-900 hover:text-white"
            onClick={() => runAction(onOpen)}
            role="menuitem"
          >
            <AppIcon icon={ArrowRight02Icon} size={14} className="text-neutral-500" />
            Open service
          </button>
          {canVisit ? (
            <button
              type="button"
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-neutral-400 transition hover:bg-neutral-900 hover:text-white"
              onClick={() => runAction(onVisit)}
              role="menuitem"
            >
              <AppIcon icon={ArrowUpRight02Icon} size={14} className="text-neutral-500" />
              Visit service
            </button>
          ) : null}
          <button
            type="button"
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-neutral-400 transition hover:bg-neutral-900 hover:text-white disabled:cursor-not-allowed disabled:text-zinc-700"
            onClick={() => runAction(onMoveEnvironment)}
            disabled={!canMoveEnvironment}
            role="menuitem"
          >
            <AppIcon icon={FolderTransferIcon} size={14} className="text-neutral-500" />
            Move environment
          </button>
        </div>
      ) : null}
    </div>
  );
}
