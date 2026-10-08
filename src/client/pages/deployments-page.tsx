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
    return "text-[var(--color-accent)]";
  if (status === "running" || status === "superseded") return "text-ok";
  if (status === "failed") return "text-bad";
  return "text-[var(--color-text-secondary)]";
}

function dotTone(status: string) {
  if (status === "queued" || status === "building")
    return "bg-[var(--color-accent)] animate-pulse";
  if (status === "running" || status === "superseded") return "bg-ok";
  if (status === "failed") return "bg-bad";
  return "bg-[var(--color-text-secondary)]";
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
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          All deployments across every project.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-bad/40 bg-bad/10 p-3 text-sm text-bad">
          {error}
        </div>
      ) : null}

      <section className="rounded-lg border border-[var(--cf-border)] bg-white/5">
        {deployments.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[var(--color-text-secondary)]">
            No deployments yet.
          </p>
        ) : (
          <ul>
            {deployments.map((deployment) => (
              <li
                key={deployment.id}
                className="border-b border-[var(--cf-border)] last:border-b-0"
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
                    <div className="mt-0.5 truncate font-mono text-[11px] text-[var(--color-text-secondary)]">
                      {deployment.projectName} · {deployment.trigger}
                      {deployment.commitSha
                        ? ` · ${deployment.commitSha.slice(0, 7)}`
                        : ""}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-mono text-[11px] text-[var(--color-text-secondary)]">
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
                        className="rounded-lg border border-[var(--cf-border)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)] transition-colors hover:bg-white/10 hover:text-white"
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