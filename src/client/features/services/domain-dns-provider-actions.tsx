import type { DnsProviderId, DnsProviderStatus } from "../../api";
import { dnsProviders } from "../../components/modals/dns-management-data";

export function DomainDnsProviderActions({
  providers,
  busyProviderId,
  onApply
}: {
  providers: DnsProviderStatus[];
  busyProviderId: DnsProviderId | null;
  onApply: (providerId: DnsProviderId) => void;
}) {
  const connectedProviders = providers.filter((provider) => provider.connected);
  if (connectedProviders.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {connectedProviders.map((provider) => {
        const busy = busyProviderId === provider.id;
        const definition = dnsProviders.find((item) => item.id === provider.id);
        return (
          <button
            key={provider.id}
            type="button"
            className="inline-flex h-8 items-center justify-center gap-2 border border-line px-3 text-xs text-ink-muted transition hover:border-line hover:bg-hover hover:text-white disabled:opacity-40"
            disabled={Boolean(busyProviderId)}
            onClick={() => onApply(provider.id)}
          >
            {definition ? <img src={definition.logoUrl} alt="" className="h-3.5 w-5 object-contain" /> : null}
            {busy ? `Updating ${provider.name}…` : `Add to ${provider.name}`}
          </button>
        );
      })}
    </div>
  );
}
