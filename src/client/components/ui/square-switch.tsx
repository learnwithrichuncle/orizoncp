export function SquareSwitch({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  className = ""
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={`h-5 w-9 shrink-0 rounded-md border p-0.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft disabled:cursor-not-allowed disabled:opacity-40 ${
        checked ? "border-accent bg-accent" : "border-line bg-glass"
      } ${className}`}
      onClick={() => onCheckedChange(!checked)}
    >
      <span
        aria-hidden="true"
        className={`block h-3.5 w-3.5 rounded-sm transition ${
          checked ? "translate-x-4 bg-white" : "translate-x-0 bg-muted"
        }`}
      />
    </button>
  );
}
