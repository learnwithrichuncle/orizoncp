import { useCallback, useEffect, useMemo, useState } from "react";
import { api, type ProjectCard, type ServiceOverview } from "../api";
import { ProjectRouteLoader } from "../features/projects/project-route-loader";
import { ServiceDomainsPanel } from "../features/services/service-domains-panel";
import { usePageTitle } from "../lib/page-title";
import { isDatabaseService } from "../../shared/service-source";

const selectClass =
  "h-9 w-full rounded-lg border border-[var(--cf-border)] bg-white/5 px-3 text-sm text-white outline-none transition-colors disabled:opacity-50";

export function DomainsPage() {
  usePageTitle("Domains");

  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [overview, setOverview] = useState<ServiceOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await api.projects();
      setProjects(data.projects);
      setError("");
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Could not load projects",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? null;

  const domainServices = useMemo(
    () =>
      selectedProject
        ? selectedProject.services.filter(
            (service) =>
              !isDatabaseService(service) && service.runtimeMode !== "worker",
          )
        : [],
    [selectedProject],
  );

  const loadOverview = useCallback(async () => {
    if (!selectedServiceId) {
      setOverview(null);
      return;
    }
    setOverviewLoading(true);
    try {
      const result = await api.serviceOverview(selectedServiceId);
      setOverview(result);
      setError("");
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Could not load service",
      );
      setOverview(null);
    } finally {
      setOverviewLoading(false);
    }
  }, [selectedServiceId]);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  async function doAction(label: string, action: () => Promise<void>) {
    setBusy(label);
    try {
      await action();
      await loadOverview();
      await load();
    } finally {
      setBusy("");
    }
  }

  function chooseProject(id: string) {
    setSelectedProjectId(id);
    setSelectedServiceId("");
    setOverview(null);
  }

  if (loading) {
    return <ProjectRouteLoader label="Loading domains" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Domains
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Pick a project and service, then connect the DNS records.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-bad/40 bg-bad/10 p-3 text-sm text-bad">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
            Project
          </span>
          <select
            value={selectedProjectId}
            onChange={(event) => chooseProject(event.target.value)}
            className={selectClass}
          >
            <option value="">Select a project…</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
            Service
          </span>
          <select
            value={selectedServiceId}
            onChange={(event) => setSelectedServiceId(event.target.value)}
            disabled={!selectedProject}
            className={selectClass}
          >
            <option value="">Select a service…</option>
            {domainServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedProject && domainServices.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          This project has no services that can take a domain yet.
        </p>
      ) : null}

      {selectedServiceId && overviewLoading ? (
        <ProjectRouteLoader label="Loading domains" />
      ) : null}

      {selectedServiceId && !overviewLoading && overview ? (
        <ServiceDomainsPanel
          serviceId={selectedServiceId}
          domains={overview.domains}
          publicIp={overview.publicIp}
          busy={busy}
          doAction={doAction}
          loadOverview={loadOverview}
        />
      ) : null}

      {!selectedProjectId ? (
        <div className="rounded-lg border border-[var(--cf-border)] bg-white/5 px-5 py-10 text-center text-sm text-[var(--color-text-secondary)]">
          Select a project to add a domain.
        </div>
      ) : null}
    </div>
  );
}