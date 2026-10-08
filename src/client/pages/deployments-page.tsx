import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { api, type GlobalDeployment } from "../api";
import { ProjectRouteLoader } from "../features/projects/project-route-loader";
import {
  deploymentIsPending,
  deploymentStatusLabel,
} from "../lib/deployment-status";
import { usePageTitle } from "../lib/page-title";

function statusTone(status: string) {
  if (status === "queued" || status === "building")
    return "text-blue-500";
  if (status === "running" || status === "superseded") return "text-green-500";
  if (status === "failed") return "text-red-500";
  return "text-neutral-400";
}

function dotTone(status: string) {
  if (status === "queued" || status === "building")
    return "bg-blue-600 animate-pulse";
  if (status === "running" || status === "superseded") return "bg-green-500";
  if (status === "failed") return "bg-red-500";
  return "bg-neutral-400";
}

function relativeTime(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${Math.max(seconds, 0)}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function DeploymentsPage() {
  usePageTitle("Deployments");
  const [deployments, setDeployments] = useState<GlobalDeployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await api.deployments();
      setDeployments(data.deployments);
      setError("");
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Could not load deployments",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const hasPending = deployments.some((deployment) =>
    deploymentIsPending(deployment.status),
  );

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(
      () => {
        void load();
      },
      hasPending ? 1500 : 6000,
    );
    return () => clearInterval(interval);
  }, [hasPending, load, loading]);

  if (loading) {
    return <ProjectRouteLoader label="Loading deployments" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Deployments
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          All deployments across every project.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-500">
          {error}
        </div>
      ) : null}

      <section className="rounded-lg border border-neutral-800 bg-white/5">
        {deployments.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-neutral-400">
            No deployments yet.
          </p>
        ) : (
          <ul>
            {deployments.map((deployment) => (
              <li
                key={deployment.id}
                className="border-b border-neutral-800 last:border-b-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotTone(
                          deployment.status,
                        )}`}
                      />
                      <span className="truncate text-sm text-white">
                        {deployment.serviceName}
                      </span>
                      <span
                        className={`shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] ${statusTone(
                          deployment.status,
                        )}`}
                      >
                        {deploymentStatusLabel(deployment.status)}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate font-mono text-[11px] text-neutral-400">
                      {deployment.projectName} · {deployment.trigger}
                      {deployment.commitSha
                        ? ` · ${deployment.commitSha.slice(0, 7)}`
                        : ""}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-mono text-[11px] text-neutral-400">
                      {relativeTime(deployment.createdAt)}
                    </span>
                    {deployment.projectSlug && deployment.serviceSlug ? (
                      <Link
                        to="/$projectSlug/$serviceSlug/$serviceTab"
                        params={{
                          projectSlug: deployment.projectSlug,
                          serviceSlug: deployment.serviceSlug,
                          serviceTab: "deployments",
                        }}
                        className="rounded-lg border border-neutral-800 px-2.5 py-1 text-xs text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        View
                      </Link>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}