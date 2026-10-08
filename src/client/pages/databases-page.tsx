import { DatabaseIcon } from "@hugeicons/core-free-icons";
import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { api, type ProjectCard, type Service } from "../api";
import { CreateServiceModal } from "../components/modals/create-service-modal";
import { ModalShell } from "../components/modals/modal-shell";
import { ProjectRouteLoader } from "../features/projects/project-route-loader";
import type { ServiceFormPayload } from "../features/services/service-form-types";
import { usePageTitle } from "../lib/page-title";
import { isDatabaseService } from "../../shared/service-source";

function engineLabel(service: Service) {
  if (service.repoFullName?.startsWith("database:")) {
    return service.repoFullName.slice("database:".length);
  }
  return "database";
}

export function DatabasesPage() {
  usePageTitle("Databases");

  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [createProjectId, setCreateProjectId] = useState<null | string>(null);

  const load = useCallback(async () => {
    try {
      const data = await api.projects();
      setProjects(data.projects);
      setError("");
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Could not load databases",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      void load();
    }, 6000);
    return () => clearInterval(interval);
  }, [load, loading]);

  const databases = projects.flatMap((project) =>
    project.services
      .filter((service) => isDatabaseService(service))
      .map((service) => ({ project, service })),
  );

  function startCreate() {
    if (projects.length === 0) return;
    if (projects.length === 1) {
      setCreateProjectId(projects[0].id);
      return;
    }
    setPickerOpen(true);
  }

  async function createDatabase(payload: ServiceFormPayload) {
    const project = projects.find((item) => item.id === createProjectId);
    if (!project) return;
    const environment =
      project.environments.find((item) => item.isDefault) ??
      project.environments[0];
    if (!environment) {
      throw new Error("This project has no environment yet.");
    }
    const result = await api.createService(project.id, {
      ...payload,
      environmentId: environment.id,
    });
    await api.createDeployment(result.service.id);
    await load();
    setCreateProjectId(null);
  }

  if (loading) {
    return <ProjectRouteLoader label="Loading databases" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Databases
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Every database across your projects.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          disabled={projects.length === 0}
          className="inline-flex h-8 items-center justify-center rounded-lg bg-[var(--color-accent)] px-3 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
        >
          New database
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-bad/40 bg-bad/10 p-3 text-sm text-bad">
          {error}
        </div>
      ) : null}

      <section className="rounded-lg border border-[var(--cf-border)] bg-white/5">
        {databases.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[var(--color-text-secondary)]">
            No databases yet.
          </p>
        ) : (
          <ul>
            {databases.map(({ project, service }) => (
              <li
                key={service.id}
                className="border-b border-[var(--cf-border)] last:border-b-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm text-white">
                        {service.name}
                      </span>
                      <span className="shrink-0 rounded border border-[var(--cf-border)] px-1.5 py-px font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                        {engineLabel(service)}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate font-mono text-[11px] text-[var(--color-text-secondary)]">
                      {project.name}
                    </div>
                  </div>
                  <Link
                    to="/$projectSlug/$serviceSlug/$serviceTab"
                    params={{
                      projectSlug: project.slug,
                      serviceSlug: service.slug,
                      serviceTab: "data",
                    }}
                    className="shrink-0 rounded-lg border border-[var(--cf-border)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)] transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ModalShell
        open={pickerOpen}
        title="Choose a project"
        meta="Where should this database live?"
        icon={DatabaseIcon}
        onClose={() => setPickerOpen(false)}
      >
        <ul className="space-y-1.5">
          {projects.map((project) => (
            <li key={project.id}>
              <button
                type="button"
                onClick={() => {
                  setPickerOpen(false);
                  setCreateProjectId(project.id);
                }}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-[var(--cf-border)] bg-white/5 px-3 py-2.5 text-left transition-colors hover:bg-white/10"
              >
                <span className="truncate text-sm text-white">
                  {project.name}
                </span>
                <span className="shrink-0 font-mono text-[11px] text-[var(--color-text-secondary)]">
                  {project.serviceCount} services
                </span>
              </button>
            </li>
          ))}
        </ul>
      </ModalShell>

      <CreateServiceModal
        open={Boolean(createProjectId)}
        projectId={createProjectId ?? ""}
        initialType="database"
        onClose={() => setCreateProjectId(null)}
        onCreate={createDatabase}
      />
    </div>
  );
}