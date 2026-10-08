import { Globe02Icon, WorkflowSquare07Icon } from "@hugeicons/core-free-icons";
import { AppIcon } from "./primitives";

export type RuntimeMode = "web" | "worker";

const runtimeModeOptions: Array<{ value: RuntimeMode; label: string; icon: unknown }> = [
  { value: "web", label: "Web service", icon: Globe02Icon },
  { value: "worker", label: "Worker", icon: WorkflowSquare07Icon }
];

export function RuntimeModeControl({ value, onChange, disabled = false }: { value: RuntimeMode; onChange: (mode: RuntimeMode) => void; disabled?: boolean }) {
  return (
    <div className="inline-grid w-full max-w-sm grid-cols-2 gap-2">
      {runtimeModeOptions.map((mode) => (
        <button
          key={mode.value}
          type="button"
          className={`inline-flex h-9 min-w-0 items-center justify-center gap-2 px-3 text-xs transition disabled:opacity-40 ${
            value === mode.value
              ? "bg-blue-600 text-white"
              : "border border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800 hover:text-neutral-100"
          }`}
          disabled={disabled}
          onClick={() => onChange(mode.value)}
        >
          <AppIcon icon={mode.icon} size={14} className="shrink-0" />
          <span className="truncate">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
