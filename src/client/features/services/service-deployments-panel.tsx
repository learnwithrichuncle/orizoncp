import { useState } from "react";
import type { ReactNode } from "react";
import { ExternalLink, RotateCw, Terminal } from "lucide-react";
import type { Deployment, DeploymentLog, Service } from "../../api";
import { shortSha, formatTime } from "../../lib/format";
import { DeploymentFailureExplanationModal } from "./deployment-failure-explanation-modal";
import { DeploymentLogsPanel } from "./service-log-panels";

function statusMeta(status: string) {
  if (status === "failed") return { label: "Failed", tone: "bad" as const };
  if (status === "aborted") return { label: "Aborted", tone: "muted" as const };
  if (status === "queued") return { label: "Queued", tone: "warn" as const };
  if (status === "building") return { label: "Building", tone: "warn" as const };
  return { label: "Healthy", tone: "ok" as const };
}

const toneClass = {
  ok: "bg-emerald-500/15 text-emerald-400",
  warn: "bg-amber-500/15 text-amber-400",
  bad: "bg-red-500/15 text-red-400",
  muted: "bg-white/10 text-neutral-400"
};

function PropRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center gap-4 border-b border-neutral-800 px-4 py-2.5 last:border-b-0">
      <span className="w-24 shrink-0 text-xs text-neutral-400">
        {label}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm text-white">{value}</span>
    </div>
  );
}

export function ServiceDeploymentsPanel({
  service,
  projectName,
  deployments,
  activeDeployment,
  activeDeploymentId,
  deploymentLogs,
  activeDeploymentDuration,
  busy,
  onSelectDeployment,
  onDeploy,
  onAbortActiveDeployment,
  onOpenRuntimeLogs
}: {
  service: Service | null;
  projectName?: string;
  deployments: Deployment[];
  activeDeployment: Deployment | null;
  activeDeploymentId: string | null;
  deploymentLogs: DeploymentLog[];
  activeDeploymentDuration: string | null;
  busy: string;
  onSelectDeployment: (deploymentId: string) => void;
  onDeploy: () => void;
  onAbortActiveDeployment: () => void;
  onOpenRuntimeLogs: () => void;
}) {
  const [failureModalOpen, setFailureModalOpen] = useState(false);
  const failedDeploymentSelected = activeDeployment?.status === "failed";
  const buildingDeployment =
    activeDeployment?.status === "queued" || activeDeployment?.status === "building";
  const status = activeDeployment ? statusMeta(activeDeployment.status) : null;

  return (
    <section className="mx-auto flex h-full min-h-0 w-full max-w-[1440px] flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          {projectName ?? service?.name ?? "Service"}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {service?.primaryUrl ? (
            <a
              href={service.primaryUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-9 items-center gap-2 rounded-lg border border-neutral-800 px-3 text-sm text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ExternalLink size={14} />
              Visit
            </a>
          ) : null}
          <button
            type="button"
            onClick={onOpenRuntimeLogs}
            className="flex h-9 items-center gap-2 rounded-lg border border-neutral-800 px-3 text-sm text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Terminal size={14} />
            Runtime logs
          </button>
          {buildingDeployment ? (
            <button
              type="button"
              onClick={onAbortActiveDeployment}
              disabled={busy === "abort"}
              className="flex h-9 items-center gap-2 rounded-lg border border-red-500/40 px-3 text-sm text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
            >
              Abort build
            </button>
          ) : failedDeploymentSelected ? (
            <button
              type="button"
              onClick={() => setFailureModalOpen(true)}
              className="flex h-9 items-center gap-2 rounded-lg border border-neutral-800 px-3 text-sm text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              What happened?
            </button>
          ) : null}
          <button
            type="button"
            onClick={onDeploy}
            disabled={busy === "deploy"}
            className="flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-60"
          >
            <RotateCw size={14} />
            {busy === "deploy" ? "Deploying…" : "Redeploy"}
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3 px-4 py-4">
        <h1 className="font-mono text-xl text-white">
          {activeDeployment ? `dep_${activeDeployment.id}` : "Deployments"}
        </h1>
        {status ? (
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${toneClass[status.tone]}`}
          >
            {status.label}
          </span>
        ) : null}
        {deployments.length > 0 ? (
          <select
            value={activeDeploymentId ?? ""}
            onChange={(event) => onSelectDeployment(event.target.value)}
            className="ml-auto h-9 rounded-lg border border-neutral-800 bg-white/5 px-3 font-mono text-xs text-white outline-none"
          >
            {deployments.map((deployment) => (
              <option key={deployment.id} value={deployment.id}>
                {shortSha(deployment.commitSha)} · {formatTime(deployment.createdAt)}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {activeDeployment ? (
        <div className="mx-4 mb-4 overflow-hidden rounded-lg border border-neutral-800">
          <PropRow label="Project" value={projectName ?? service?.name ?? "—"} />
          <PropRow label="Branch" value={service?.branch || "—"} />
          <PropRow label="Commit" value={shortSha(activeDeployment.commitSha)} />
          <PropRow
            label="Stack"
            value={service?.runtimeMode === "worker" ? "worker" : "server"}
          />
          <PropRow label="Duration" value={activeDeploymentDuration ?? "—"} />
        </div>
      ) : null}

      <div className="min-h-0 flex-1 px-4 pb-4">
        <DeploymentLogsPanel
          logs={deploymentLogs}
          title="Build logs"
          meta={activeDeploymentDuration ?? undefined}
          emptyLabel="Choose a deployment to inspect its build and deploy logs."
          embedded
        />
      </div>

      <DeploymentFailureExplanationModal
        deployment={activeDeployment}
        open={failureModalOpen && failedDeploymentSelected}
        onClose={() => setFailureModalOpen(false)}
      />
    </section>
  );
}