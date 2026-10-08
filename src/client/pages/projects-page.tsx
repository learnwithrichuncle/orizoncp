import { useNavigate } from "@tanstack/react-router";
import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import {
  api,
  type GitHubStatus,
  type ProjectCard,
} from "../api";
import { GitHubInstallModal } from "../features/github/github-install-modal";
import {
  ProjectImportModal,
  type ProjectImportSource,
} from "../features/integrations/project-import-modal";
import { RailwayImportModal } from "../features/integrations/railway-import-modal";
import { VercelImportModal } from "../features/integrations/vercel-import-modal";
import { CreateProjectModal } from "../features/projects/create-project-modal";
import { ProjectOverviewCard } from "../features/projects/project-overview-card";
import { ProjectsDashboardHeader } from "../features/projects/projects-dashboard-header";
import { ProjectSearch } from "../features/projects/project-search";
import { ProjectSearchEmptyState } from "../features/projects/project-search-empty-state";
import {
  readPinnedProjectIds,
  writePinnedProjectIds,
} from "../features/projects/pinned-projects";
import { ProjectsEmptyState } from "../features/projects/projects-empty-state";
import { ProjectRouteLoader } from "../features/projects/project-route-loader";
import { serviceIsDeploying } from "../lib/deployment-status";
import { usePageTitle } from "../lib/page-title";

export function ProjectsPage() {
  const navigate = useNavigate();
  usePageTitle("Projects");

  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [githubStatus, setGitHubStatus] = useState<GitHubStatus | null>(null);
  const [setupLoading, setSetupLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [projectImportView, setProjectImportView] = useState<
    "closed" | "choose" | ProjectImportSource
  >("closed");
  const [githubInstallOpen, setGitHubInstallOpen] = useState(false);
  const [error, setError] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [pinnedProjectIds, setPinnedProjectIds] = useState<string[]>([]);

  const loadProjects = useCallback(
    async (options: { showLoading?: boolean } = {}) => {
      const showLoading = options.showLoading ?? true;
      if (showLoading) setSetupLoading(true);
      try {
        const [projectData, githubData] = await Promise.all([
          api.projects(),
          api.githubStatus().catch(() => null),
        ]);
        startTransition(() => {
          setProjects(projectData.projects);
          setGitHubStatus(githubData);
          setGitHubInstallOpen(
            Boolean(
              githubData &&
                githubData.mode === "app" &&
                !githubData.installed &&
                githubData.installUrl,
            ),
          );
          setError("");
          setSetupLoading(false);
        });
      } catch (issue) {
        startTransition(() => {
          setError(
            issue instanceof Error ? issue.message : "Could not load projects",
          );
          setSetupLoading(false);
        });
      }
    },
    [],
  );

  const refreshProjectCards = useCallback(async () => {
    try {
      const projectData = await api.projects();
      startTransition(() => {
        setProjects(projectData.projects);
        setError("");
      });
    } catch (issue) {
      startTransition(() => {
        setError(
          issue instanceof Error ? issue.message : "Could not refresh projects",
        );
      });
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    setPinnedProjectIds(readPinnedProjectIds());
  }, []);

  useEffect(() => {
    const hasDeployingService = projects.some((project) =>
      project.services.some((service) => serviceIsDeploying(service.status)),
    );
    if (setupLoading) return;

    const interval = setInterval(
      () => {
        void refreshProjectCards();
      },
      hasDeployingService ? 1500 : 6000,
    );

    return () => clearInterval(interval);
  }, [projects, refreshProjectCards, setupLoading]);

  async function createProject(payload: {
    name: string;
    description?: string;
  }) {
    const result = await api.createProject(payload);
    await loadProjects();
    void navigate({
      to: "/$projectSlug",
      params: { projectSlug: result.project.slug },
    });
  }

  function openProject(project: ProjectCard) {
    void navigate({
      to: "/$projectSlug",
      params: { projectSlug: project.slug },
    });
  }

  function togglePinnedProject(projectId: string) {
    const next = pinnedProjectIds.includes(projectId)
      ? pinnedProjectIds.filter((id) => id !== projectId)
      : [...pinnedProjectIds, projectId];
    writePinnedProjectIds(next);
    setPinnedProjectIds(next);
  }

  const serviceCount = projects.reduce(
    (total, project) => total + project.serviceCount,
    0,
  );
  const visibleProjects = useMemo(() => {
    const needle = projectSearch.trim().toLowerCase();
    const filtered = needle
      ? projects.filter((project) => {
          const searchableText = [
            project.name,
            project.slug,
            project.description,
            ...project.services.flatMap((service) => [
              service.name,
              service.slug,
              service.status,
              service.repoFullName,
              service.repoUrl,
              service.dockerImage,
              service.branch,
              service.rootDir,
              service.primaryUrl,
              service.localUrl,
              service.framework?.name,
              service.functionRuntime,
            ]),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return searchableText.includes(needle);
        })
      : projects;

    return filtered
      .map((project, originalIndex) => ({ project, originalIndex }))
      .sort((left, right) => {
        const leftPinned = pinnedProjectIds.includes(left.project.id);
        const rightPinned = pinnedProjectIds.includes(right.project.id);
        if (leftPinned === rightPinned) return left.originalIndex - right.originalIndex;
        return leftPinned ? -1 : 1;
      })
      .map(({ project }) => project);
  }, [pinnedProjectIds, projectSearch, projects]);

  return (
    <>
      <ProjectsDashboardHeader
        projectCount={projects.length}
        serviceCount={serviceCount}
        onCreate={() => setCreateOpen(true)}
        onImport={() => setProjectImportView("choose")}
      />

      <div className="mt-7">
        {error ? (
          <div className="mt-6 rounded-md border border-bad bg-bad/20 p-3 text-sm text-bad">
            {error}
          </div>
        ) : null}

        <div className="mt-7">
          {!setupLoading && projects.length > 0 ? (
            <div className="mb-5">
              <ProjectSearch
                query={projectSearch}
                resultCount={visibleProjects.length}
                totalCount={projects.length}
                onQueryChange={setProjectSearch}
              />
            </div>
          ) : null}

          {setupLoading ? (
            <ProjectRouteLoader label="Loading projects" />
          ) : projects.length === 0 ? (
            <ProjectsEmptyState onCreate={() => setCreateOpen(true)} />
          ) : visibleProjects.length === 0 ? (
            <ProjectSearchEmptyState
              query={projectSearch.trim()}
              onClear={() => setProjectSearch("")}
            />
          ) : (
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleProjects.map((project, index) => (
                <ProjectOverviewCard
                  key={project.id}
                  project={project}
                  pinned={pinnedProjectIds.includes(project.id)}
                  onOpen={() => openProject(project)}
                  onTogglePin={() => togglePinnedProject(project.id)}
                />
              ))}
            </section>
          )}
        </div>
      </div>

      <CreateProjectModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createProject}
      />
      <ProjectImportModal
        open={projectImportView === "choose"}
        onClose={() => setProjectImportView("closed")}
        onSelect={setProjectImportView}
      />
      <RailwayImportModal
        open={projectImportView === "railway"}
        onClose={() => setProjectImportView("closed")}
        onBackToProviders={() => setProjectImportView("choose")}
        onSuccess={loadProjects}
      />
      <VercelImportModal
        open={projectImportView === "vercel"}
        onClose={() => setProjectImportView("closed")}
        onBackToProviders={() => setProjectImportView("choose")}
        onSuccess={loadProjects}
      />
      <GitHubInstallModal
        open={githubInstallOpen}
        status={githubStatus}
        onClose={() => setGitHubInstallOpen(false)}
      />
    </>
  );
}
