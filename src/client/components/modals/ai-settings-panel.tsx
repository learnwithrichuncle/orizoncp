import { Key02Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import { api, type AiSettingsStatus } from "../../api";
import { AiProviderDetails } from "./ai-provider-details";
import {
  aiProviders,
  createAiConnections,
  type AiProviderId
} from "./ai-settings-data";
import { ModalShell } from "./modal-shell";

export function AiSettingsPanel() {
  const [defaultProviderId, setDefaultProviderId] = useState<AiProviderId | null>(null);
  const [defaultModel, setDefaultModel] = useState("");
  const [connections, setConnections] = useState(createAiConnections);
  const [credentialError, setCredentialError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyProviderId, setBusyProviderId] = useState<AiProviderId | null>(null);
  const [openProviderId, setOpenProviderId] = useState<AiProviderId | null>(null);

  const openProvider = openProviderId
    ? aiProviders.find((provider) => provider.id === openProviderId) ?? null
    : null;
  const openConnection = openProviderId ? connections[openProviderId] : null;
  const connectedProviderCount = aiProviders.filter(
    (provider) => connections[provider.id].connected
  ).length;

  function syncAiSettings(ai: AiSettingsStatus) {
    const nextConnections = createAiConnections();

    for (const provider of aiProviders) {
      const status = ai.providers.find((item) => item.id === provider.id);
      if (!status) continue;

      nextConnections[provider.id] = {
        connected: status.connected,
        keySuffix: status.keySuffix,
        selectedModel: status.selectedModel,
        savedAt: status.updatedAt ?? status.connectedAt ?? ""
      };
    }

    setDefaultProviderId(ai.defaultProvider);
    setDefaultModel(ai.defaultModel);
    setConnections(nextConnections);
  }

  useEffect(() => {
    let ignore = false;

    async function loadAiSettings() {
      setLoading(true);
      try {
        const response = await api.aiSettings();
        if (!ignore) {
          syncAiSettings(response.ai);
          setCredentialError("");
        }
      } catch (error) {
        if (!ignore) setCredentialError(error instanceof Error ? error.message : "Could not load AI providers.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void loadAiSettings();
    return () => {
      ignore = true;
    };
  }, []);

  async function updateProviderModel(providerId: AiProviderId, modelId: string) {
    if (connections[providerId].selectedModel === modelId) return;

    setConnections((current) => ({
      ...current,
      [providerId]: { ...current[providerId], selectedModel: modelId }
    }));

    if (!connections[providerId].connected) return;

    setBusyProviderId(providerId);
    try {
      const response = await api.updateAiProvider(providerId, { apiKey: "", selectedModel: modelId });
      syncAiSettings(response.ai);
      setCredentialError("");
    } catch (error) {
      const provider = aiProviders.find((item) => item.id === providerId);
      setCredentialError(error instanceof Error ? error.message : `Could not update ${provider?.name ?? providerId} model.`);
    } finally {
      setBusyProviderId(null);
    }
  }

  async function updateProviderApiKey(providerId: AiProviderId, apiKey: string) {
    const provider = aiProviders.find((item) => item.id === providerId);
    const selectedModel = connections[providerId].selectedModel;

    setBusyProviderId(providerId);
    try {
      const response = await api.updateAiProvider(providerId, { apiKey, selectedModel });
      syncAiSettings(response.ai);
      setCredentialError("");
    } catch (error) {
      setCredentialError(error instanceof Error ? error.message : `Could not save ${provider?.name ?? providerId} API key.`);
      throw error;
    } finally {
      setBusyProviderId(null);
    }
  }

  async function updateDefaultModel(providerId: AiProviderId) {
    const connection = connections[providerId];
    const provider = aiProviders.find((item) => item.id === providerId);
    const modelId = connection.selectedModel;
    if (defaultProviderId === providerId && defaultModel === modelId) return;

    if (!connection.connected) {
      setOpenProviderId(providerId);
      setCredentialError(`Save a ${provider?.name ?? providerId} API key before setting it as default.`);
      return;
    }

    setDefaultProviderId(providerId);
    setDefaultModel(modelId);
    setBusyProviderId(providerId);

    try {
      const response = await api.updateAiSettings({ defaultProvider: providerId, defaultModel: modelId });
      syncAiSettings(response.ai);
      setCredentialError("");
    } catch (error) {
      setCredentialError(error instanceof Error ? error.message : `Could not set ${provider?.name ?? providerId} as default.`);
    } finally {
      setBusyProviderId(null);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-3" aria-label="Loading AI providers">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-white/5" />
        <div className="h-12 animate-pulse rounded-lg border border-[var(--cf-border)] bg-white/5" />
        <div className="h-12 animate-pulse rounded-lg border border-[var(--cf-border)] bg-white/5" />
        <div className="h-12 animate-pulse rounded-lg border border-[var(--cf-border)] bg-white/5" />
      </div>
    );
  }

  return (
    <>
      <section className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-[var(--cf-border)] bg-white/5">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--cf-border)] px-5 py-4">
          <span className="text-sm font-medium text-white">Models</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
            {connectedProviderCount} connected
          </span>
        </div>

        {credentialError ? (
          <div className="border-b border-[var(--cf-border)] px-5 py-3 text-sm text-bad">
            {credentialError}
          </div>
        ) : null}

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--cf-border)] text-left font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
              <th className="px-5 py-2.5 font-normal">Provider</th>
              <th className="px-5 py-2.5 font-normal">Status</th>
              <th className="hidden px-5 py-2.5 font-normal sm:table-cell">Model</th>
              <th className="px-5 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {aiProviders.map((provider) => {
              const connection = connections[provider.id];
              const isDefault =
                provider.id === defaultProviderId &&
                connection.selectedModel === defaultModel;
              return (
                <tr
                  key={provider.id}
                  onClick={() => setOpenProviderId(provider.id)}
                  className="cursor-pointer border-b border-[var(--cf-border)] transition-colors last:border-b-0 hover:bg-white/10"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={provider.logoUrl}
                        alt=""
                        className="h-6 w-6 shrink-0 object-contain"
                      />
                      <span className="truncate text-sm text-white">
                        {provider.name}
                      </span>
                      {isDefault ? (
                        <span className="shrink-0 rounded-full bg-[var(--color-accent)] px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide text-white">
                          Default
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] ${
                        connection.connected
                          ? "text-ok"
                          : "text-[var(--color-text-secondary)]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          connection.connected
                            ? "bg-ok"
                            : "bg-[var(--color-text-secondary)]"
                        }`}
                      />
                      {connection.connected ? "Connected" : "Not connected"}
                    </span>
                  </td>
                  <td className="hidden px-5 py-3 font-mono text-[11px] text-[var(--color-text-secondary)] sm:table-cell">
                    {connection.selectedModel || "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="inline-flex shrink-0 rounded-lg border border-[var(--cf-border)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)]">
                      {connection.connected ? "Manage" : "Add key"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <ModalShell
        open={Boolean(openProvider)}
        title={openProvider?.name ?? "Model"}
        meta="API key"
        icon={Key02Icon}
        width="max-w-xl"
        onClose={() => setOpenProviderId(null)}
      >
        {openProvider && openConnection ? (
          <AiProviderDetails
            provider={openProvider}
            model={openConnection.selectedModel}
            connected={openConnection.connected}
            keySuffix={openConnection.keySuffix}
            isDefaultModel={
              openProvider.id === defaultProviderId &&
              openConnection.selectedModel === defaultModel
            }
            updating={busyProviderId === openProvider.id}
            onSelectModel={(modelId) =>
              void updateProviderModel(openProvider.id, modelId)
            }
            onSaveApiKey={(apiKey) =>
              updateProviderApiKey(openProvider.id, apiKey)
            }
            onSetDefaultModel={() => void updateDefaultModel(openProvider.id)}
          />
        ) : null}
      </ModalShell>
    </>
  );
}