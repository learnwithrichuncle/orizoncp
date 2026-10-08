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
      className={`inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-left transition ${
        selected
          ? "border-blue-600 bg-blue-950 text-neutral-100"
          : "border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-100"
      }`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="grid h-5 w-5 shrink-0 place-items-center">
        <img src={provider.logoUrl} alt="" className="max-h-5 max-w-5 object-contain" loading="lazy" />
      </span>
      <span className="truncate text-sm">{provider.name}</span>

      <span className="flex shrink-0 items-center gap-2">
        {isDefaultModel ? <AppIcon icon={StarIcon} size={12} className="fill-warn text-amber-500" /> : null}
        <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-green-500" : "bg-ink-dim"}`} />
        <span className="sr-only">
          {connected ? "Connected" : "Not connected"}
          {isDefaultModel ? ", default provider" : ""}
        </span>
      </span>
    </button>
  );
}
