import { CheckIcon } from "lucide-react";
import type { ReactNode } from "react";

export function Checkbox({
  checked,
  label,
  onChange,
  disabled = false,
  children,
  className = "",
  boxClassName = "",
  variant: _variant = "default",
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  boxClassName?: string;
  variant?: "default" | "monochrome";
}) {
  return (
    <label className={`group inline-flex select-none items-center gap-2 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
        aria-label={label}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`grid h-4 w-4 place-items-center rounded-sm border transition peer-focus-visible:ring-2 peer-focus-visible:ring-accent-soft ${
          checked
            ? "border-brand bg-brand text-white"
            : "border-line bg-elevated text-transparent group-hover:border-line-strong"
        } ${boxClassName}`}
      >
        <CheckIcon size={12} strokeWidth={3} />
      </span>
      {children}
    </label>
  );
}
