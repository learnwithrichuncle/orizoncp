import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  Key02Icon
} from "@hugeicons/core-free-icons";
import { useMemo, useState } from "react";
import type { ApiKeyProjectOption, ApiKeySummary } from "../../api";
import { formatTime } from "../../lib/format";
import { AppIcon } from "../ui/primitives";

type ApiKeyListProps = {
  apiKeys: ApiKeySummary[];
  projects: ApiKeyProjectOption[];
  revokingId: string;
  onRevoke: (apiKeyId: string) => Promise<void>;
};

function isExpired(apiKey: ApiKeySummary) {
  return Boolean(apiKey.expiresAt && Date.parse(apiKey.expiresAt) <= Date.now());
}

function apiKeyStatus(apiKey: ApiKeySummary) {
  if (apiKey.revokedAt) return "revoked";
  if (isExpired(apiKey)) return "expired";
  return "active";
}

function accessLabel(apiKey: ApiKeySummary) {
  return apiKey.accessLevel === "write" ? "Read and write" : "Read";
}

function expirationLabel(apiKey: ApiKeySummary) {
  if (!apiKey.expiresAt) return "No expiration";
  return `${isExpired(apiKey) ? "Expired" : "Expires"} ${formatTime(apiKey.expiresAt)}`;
}

export function ApiKeyList({ apiKeys, projects, revokingId, onRevoke }: ApiKeyListProps) {
  const [confirmingId, setConfirmingId] = useState("");
  const projectNames = useMemo(() => new Map(projects.map((project) => [project.id, project.name])), [projects]);

  function projectLabel(apiKey: ApiKeySummary) {
    if (apiKey.projectScope === "all") return "All projects";
    return apiKey.projectIds.map((projectId) => projectNames.get(projectId) ?? projectId).join(", ") || "No projects";
  }

  if (apiKeys.length === 0) {
    return (
      <div className="flex min-h-52 items-center justify-center px-5 py-10 text-center">
        <div>
          <AppIcon icon={Key02Icon} size={22} className="mx-auto text-neutral-500" />
          <p className="mt-4 text-sm text-neutral-500">No API keys</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/10">
      {apiKeys.map((apiKey) => {
        const status = apiKeyStatus(apiKey);
        const confirming = confirmingId === apiKey.id;
        const revoking = revokingId === apiKey.id;
        const statusTone =
          status === "active"
            ? { dot: "bg-green-500", text: "text-green-500" }
            : status === "expired"
              ? { dot: "bg-amber-500", text: "text-amber-500" }
              : { dot: "bg-red-500", text: "text-red-500" };

        return (
          <article key={apiKey.id} className="px-5 py-5 sm:px-7 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="truncate text-lg text-neutral-100">{apiKey.name}</h3>
                  <span className={`inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] ${statusTone.text}`}>
                    <span className={`h-1.5 w-1.5 ${statusTone.dot}`} />
                    {status}
                  </span>
                </div>
                <div className="mt-1.5 font-mono text-[10px] text-neutral-500">{apiKey.tokenPrefix}</div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {confirming ? (
                  <>
                    <button
                      type="button"
                      className="grid h-9 w-9 place-items-center border border-red-500/50 text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
                      onClick={() => void onRevoke(apiKey.id)}
                      disabled={revoking}
                      title="Revoke"
                      aria-label="Revoke API key"
                    >
                      <AppIcon icon={CheckmarkCircle02Icon} size={16} />
                    </button>
                    <button
                      type="button"
                      className="grid h-9 w-9 place-items-center border border-neutral-800 text-neutral-400 transition hover:border-neutral-800 hover:bg-neutral-800"
                      onClick={() => setConfirmingId("")}
                      disabled={revoking}
                      title="Cancel"
                      aria-label="Cancel revoke"
                    >
                      <AppIcon icon={Cancel01Icon} size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center border border-neutral-800 text-neutral-500 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-500"
                    onClick={() => setConfirmingId(apiKey.id)}
                    title="Revoke"
                    aria-label="Revoke API key"
                  >
                    <AppIcon icon={Delete02Icon} size={15} />
                  </button>
                )}
              </div>
            </div>

            <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500">Access</dt>
                <dd className="mt-1.5 truncate text-sm text-neutral-400">{accessLabel(apiKey)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500">Projects</dt>
                <dd className="mt-1.5 truncate text-sm text-neutral-400">{projectLabel(apiKey)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500">Expiration</dt>
                <dd className="mt-1.5 truncate text-sm text-neutral-400">{expirationLabel(apiKey)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500">Last used</dt>
                <dd className="mt-1.5 truncate text-sm text-neutral-400">{formatTime(apiKey.lastUsedAt)}</dd>
              </div>
            </dl>
          </article>
        );
      })}
    </div>
  );
}
