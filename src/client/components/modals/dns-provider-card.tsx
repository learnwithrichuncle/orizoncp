import type { DnsProviderDefinition } from "./dns-management-data";
import { DnsProviderLogo } from "./dns-provider-logo";

export function DnsProviderCard({
  provider,
  selected,
  connected,
  onSelect
}: {
  provider: DnsProviderDefinition;
  selected: boolean;
  connected: boolean;
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
        <DnsProviderLogo provider={provider} className="max-h-5 max-w-5 object-contain" />
      </span>
      <span className="truncate text-sm">{provider.name}</span>
      <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-green-500" : "bg-ink-dim"}`} />
      <span className="sr-only">{connected ? "Connected" : "Not connected"}</span>
    </button>
  );
}
