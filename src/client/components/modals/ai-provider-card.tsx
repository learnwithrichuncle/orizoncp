import { StarIcon } from "@hugeicons/core-free-icons";
import { AppIcon } from "../ui/primitives";
import type { AiProviderDefinition } from "./ai-settings-data";

export function AiProviderCard({
  provider,
  selected,
  connected,
  isDefaultModel,
  onSelect
}: {
  provider: AiProviderDefinition;
  selected: boolean;
  connected: boolean;
  isDefaultModel: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`inline-flex shrink-0 items-center gap-2 rounded-[10px] border px-3 py-2 text-left transition ${
        selected
          ? "border-accent bg-accent-soft text-ink"
          : "border-line text-muted hover:border-line-strong hover:text-ink"
      }`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="grid h-5 w-5 shrink-0 place-items-center">
        <img src={provider.logoUrl} alt="" className="max-h-5 max-w-5 object-contain" loading="lazy" />
      </span>
      <span className="truncate text-sm">{provider.name}</span>

      <span className="flex shrink-0 items-center gap-2">
        {isDefaultModel ? <AppIcon icon={StarIcon} size={12} className="fill-amber-300 text-amber-300" /> : null}
        <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-ok" : "bg-ink-dim"}`} />
        <span className="sr-only">
          {connected ? "Connected" : "Not connected"}
          {isDefaultModel ? ", default provider" : ""}
        </span>
      </span>
    </button>
  );
}
