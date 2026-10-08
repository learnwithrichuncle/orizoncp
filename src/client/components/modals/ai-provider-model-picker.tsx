import { ArrowDown01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppIcon } from "../ui/primitives";
import type { AiProviderDefinition } from "./ai-settings-data";

export function AiProviderModelPicker({
  provider,
  selectedModel,
  busy = false,
  onSelectModel
}: {
  provider: AiProviderDefinition;
  selectedModel: string;
  busy?: boolean;
  onSelectModel: (modelId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = useMemo(
    () => provider.models.find((model) => model.id === selectedModel) ?? provider.models[0],
    [provider.models, selectedModel]
  );

  useEffect(() => {
    if (!open) return;

    function closeOnOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [open]);

  return (
    <div ref={rootRef} className="relative" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        className="flex h-11 w-full items-center justify-between gap-3 border border-neutral-800 bg-neutral-900 px-3 text-left text-sm text-neutral-100 outline-none transition hover:border-neutral-700 focus:border-white focus:ring-2 focus:ring-white/10 disabled:cursor-wait disabled:opacity-60"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        disabled={busy}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="min-w-0 truncate">
          {selected?.name ?? selectedModel}
          <span className="ml-2 font-mono text-[9px] text-neutral-500">{selected?.id}</span>
        </span>
        <AppIcon icon={ArrowDown01Icon} size={14} className={`shrink-0 text-neutral-500 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-72 border border-neutral-800 bg-neutral-950 p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.45)]" role="listbox">
          {provider.models.map((model) => {
            const active = model.id === selectedModel;
            return (
              <button
                key={model.id}
                type="button"
                className={`flex w-full items-center justify-between gap-3 px-2.5 py-2 text-left transition ${
                  active ? "bg-neutral-800 text-white" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
                onClick={() => {
                  onSelectModel(model.id);
                  setOpen(false);
                }}
                role="option"
                aria-selected={active}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm">{model.name}</span>
                  <span className="mt-0.5 block truncate font-mono text-[10px] text-neutral-500">{model.id}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5">
                  {active ? <AppIcon icon={CheckmarkCircle02Icon} size={14} /> : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
