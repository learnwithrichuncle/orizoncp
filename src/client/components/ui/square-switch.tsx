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
      className={`h-5 w-9 shrink-0 rounded-md border p-0.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 disabled:cursor-not-allowed disabled:opacity-40 ${
        checked ? "border-blue-600 bg-blue-600" : "border-neutral-800 bg-neutral-900"
      } ${className}`}
      onClick={() => onCheckedChange(!checked)}
    >
      <span
        aria-hidden="true"
        className={`block h-3.5 w-3.5 rounded-sm transition ${
          checked ? "translate-x-4 bg-blue-600" : "translate-x-0 bg-muted"
        }`}
      />
    </button>
  );
}
