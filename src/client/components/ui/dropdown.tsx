import { ChevronDownIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export type DropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export function Dropdown({
  value,
  options,
  onChange,
  disabled = false,
  placeholder = "Select...",
  className = "",
  variant: _variant = "default",
  size: _size = "default",
  placement = "bottom"
}: {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  variant?: "default" | "monochrome";
  size?: "default" | "compact";
  placement?: "top" | "bottom";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = useMemo(() => options.find((option) => option.value === value), [options, value]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        className="flex h-9 w-full items-center justify-between rounded-md border border-line bg-elevated px-3 text-left text-sm text-ink outline-none transition hover:border-line-strong focus:border-brand-edge focus:ring-2 focus:ring-accent-soft disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`min-w-0 truncate ${selected ? "" : "text-ink-dim"}`}>{selected?.label ?? placeholder}</span>
        <ChevronDownIcon size={16} className={`shrink-0 text-ink-dim transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div
          className={`absolute left-0 right-0 z-40 max-h-64 overflow-y-auto rounded-md border border-line bg-surface p-1 shadow-2xl ${
            placement === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
          role="listbox"
        >
          {options.length === 0 ? (
            <div className="px-2.5 py-2 text-sm text-ink-dim">No options</div>
          ) : options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                className={`block w-full rounded-md px-2 py-1.5 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  active
                    ? "bg-active text-ink"
                    : "text-ink-muted hover:bg-hover hover:text-ink"
                }`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                disabled={option.disabled}
                role="option"
                aria-selected={active}
              >
                <span className="block truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
