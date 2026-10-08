import { DatabaseImportIcon } from "@hugeicons/core-free-icons";
import { RailwayLogo } from "../icons/railway-logo";
import { AppIcon } from "../ui/primitives";

type RedisImportSourcePickerProps = {
  value: "railway" | "redis-url";
  railwayAvailable: boolean;
  loading: boolean;
  onChange: (value: "railway" | "redis-url") => void;
};

export function RedisImportSourcePicker({
  value,
  railwayAvailable,
  loading,
  onChange
}: RedisImportSourcePickerProps) {
  return (
    <div>
      <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500">Import from</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={
            value === "railway"
              ? "flex h-14 items-center gap-3 bg-blue-600 px-3 text-left text-neutral-100"
              : "flex h-14 items-center gap-3 border border-neutral-800 px-3 text-left text-neutral-400 transition hover:border-neutral-800 hover:bg-neutral-800 hover:text-white disabled:opacity-35"
          }
          onClick={() => onChange("railway")}
          disabled={!railwayAvailable && !loading}
        >
          <RailwayLogo className={`h-4 w-4 shrink-0 ${value === "railway" ? "brightness-0" : ""}`} />
          <span className="text-sm">Railway</span>
        </button>

        <button
          type="button"
          className={
            value === "redis-url"
              ? "flex h-14 items-center gap-3 bg-blue-600 px-3 text-left text-neutral-100"
              : "flex h-14 items-center gap-3 border border-neutral-800 px-3 text-left text-neutral-400 transition hover:border-neutral-800 hover:bg-neutral-800 hover:text-white"
          }
          onClick={() => onChange("redis-url")}
        >
          <AppIcon icon={DatabaseImportIcon} size={16} />
          <span className="text-sm">Redis URL</span>
        </button>
      </div>
    </div>
  );
}
