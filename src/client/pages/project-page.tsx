import { useNavigate } from "@tanstack/react-router";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, type ProjectCard, type ProjectDetail, type Service } from "../api";
import { CreateServiceModal } from "../components/modals/create-service-modal";
import { DeleteProjectModal } from "../components/modals/delete-project-modal";
import { EditProjectModal } from "../features/projects/edit-project-modal";
import { CreateEnvironmentModal } from "../features/projects/create-environment-modal";
import { MoveServiceEnvironmentModal } from "../features/projects/move-service-environment-modal";
import { ProjectEnvironmentTabs } from "../features/projects/project-environment-tabs";
import { ProjectPageToolbar } from "../features/projects/project-page-toolbar";
import { ProjectRouteLoader } from "../features/projects/project-route-loader";
import { ProjectServiceCard } from "../features/projects/project-service-card";
import { ServiceSearch } from "../features/projects/service-search";
import { ServiceSearchEmptyState } from "../features/projects/service-search-empty-state";
import type { ServiceFormPayload } from "../features/services/service-form-types";
import { serviceIsDeploying } from "../lib/deployment-status";
import { usePageTitle } from "../lib/page-title";

export function ProjectPage({ projectSlug }: { projectSlug: string }) {
  const navigate = useNavigate();
  const [project, setProject] = useState<null | ProjectDetail>(null);
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [createServiceOpen, setCreateServiceOpen] = useState(false);
  const [createEnvironmentOpen, setCreateEnvironmentOpen] = useState(false);
  const [movingService, setMovingService] = useState<Service | null>(null);
  const [draggingService, setDraggingService] = useState<Service | null>(null);
  const [movingEnvironmentId, setMovingEnvironmentId] = useState("");
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState("");
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);
  const [editingProject, setEditingProject] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [projectEditError, setProjectEditError] = useState("");
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const currentProject = project?.slug === projectSlug ? project : null;
  const selectedEnvironment = useMemo(() => {
    if (!currentProject) return null;
    return currentProject.environments.find((environment) => environment.id === selectedEnvironmentId)
      ?? currentProject.environments.find((environment) => environment.isDefault)
      ?? currentProject.environments[0]
      ?? null;
  }, [currentProject, selectedEnvironmentId]);

  const loadProject = useCallback(async () => {
    try {
      const [projectData, projectListData] = await Promise.all([
        api.project(projectSlug),
        api.projects().catch(() => ({ projects: [] }))
      ]);
      startTransition(() => {
        setProject(projectData.project);
        setProjects(projectListData.projects);
        setError("");
        setLoading(false);
      });
    } catch (issue) {
      startTransition(() => {
        setError(
          issue instanceof Error ? issue.message : "Could not load project",
        );
        setLoading(false);
      });
    }
  }, [projectSlug]);

  useEffect(() => {
    setProject(null);
    setProjects([]);
    setServiceSearch("");
    setSelectedEnvironmentId("");
    setDraggingService(null);
    setMovingEnvironmentId("");
    setLoading(true);
    void loadProject();
  }, [loadProject, projectSlug]);

  useEffect(() => {
    if (!currentProject) return;

    const hasDeployingService = currentProject.services.some((service) =>
      serviceIsDeploying(service.status),
    );
    const interval = setInterval(() => {
      void loadProject();
    }, hasDeployingService ? 1500 : 6000);
    return () => clearInterval(interval);
  }, [currentProject?.id, currentProject?.services, loadProject]);

  useEffect(() => {
    if (!currentProject || editingProject) return;
    setProjectForm({
      name: currentProject.name,
      description: currentProject.description ?? "",
    });
  }, [currentProject, editingProject]);

  const projectTitle = currentProject?.name ?? projectSlug;
  usePageTitle(projectTitle);

  const environmentServices = useMemo(() => {
    if (!currentProject || !selectedEnvironment) return [];
    return currentProject.services.filter((service) => service.environmentId === selectedEnvironment.id);
  }, [currentProject, selectedEnvironment]);

  const visibleServices = useMemo(() => {
    const needle = serviceSearch.trim().toLowerCase();
    if (!needle) return environmentServices;

    return environmentServices.filter((service) =>
      [
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
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [environmentServices, serviceSearch]);

  async function createService(payload: ServiceFormPayload) {
    if (!currentProject) return;
    if (!selectedEnvironment) return;
    const result = await api.createService(currentProject.id, {
      ...payload,
      environmentId: selectedEnvironment.id
    });
    await api.createDeployment(result.service.id);
    await loadProject();
    void navigate({
      to: "/$projectSlug/$serviceSlug/$serviceTab",
      params: {
        projectSlug,
        serviceSlug: result.service.slug,
        serviceTab: "deployments",
      },
    });
  }

  async function createEnvironment(name: string) {
    if (!currentProject) return;
    const result = await api.createProjectEnvironment(currentProject.id, { name });
    setSelectedEnvironmentId(result.environment.id);
    setCreateEnvironmentOpen(false);
    await loadProject();
  }

  async function moveServiceToEnvironment(environmentId: string) {
    if (!movingService) return;
    await api.moveServiceToEnvironment(movingService.id, { environmentId });
    setMovingService(null);
    await loadProject();
  }

  async function dropServiceIntoEnvironment(environmentId: string) {
    if (!currentProject || !draggingService || draggingService.environmentId === environmentId) return;

    const serviceId = draggingService.id;
    setMovingEnvironmentId(environmentId);
    setDraggingService(null);
    setProject((current) => current ? {
      ...current,
      services: current.services.map((service) => service.id === serviceId ? { ...service, environmentId } : service)
    } : current);

    try {
      await api.moveServiceToEnvironment(serviceId, { environmentId });
      await loadProject();
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not move service");
      await loadProject();
    } finally {
      setMovingEnvironmentId("");
    }
  }

  function navigateToProjects() {
    void navigate({ to: "/projects" });
  }

  function navigateToProject(nextProjectSlug: string) {
    void navigate({
      to: "/$projectSlug",
      params: { projectSlug: nextProjectSlug },
    });
  }

  function navigateToServiceOverview(serviceSlug: string) {
    void navigate({
      to: "/$projectSlug/$serviceSlug",
      params: { projectSlug, serviceSlug },
    });
  }

  async function saveProject() {
    if (!currentProject) return;
    setSavingProject(true);
    setProjectEditError("");
    try {
      const result = await api.updateProject(currentProject.id, {
        name: projectForm.name,
        description: projectForm.description,
      });
      startTransition(() => {
        setProject(result.project);
        setProjects((current) =>
          current.map((item) =>
            item.id === result.project.id ? result.project : item,
          ),
        );
        setEditingProject(false);
      });
    } catch (issue) {
      setProjectEditError(
        issue instanceof Error ? issue.message : "Could not update project",
      );
    } finally {
      setSavingProject(false);
    }
  }

  async function deleteProject() {
    if (!currentProject) return;
    setDeletingProject(true);
    try {
      await api.deleteProject(currentProject.id);
      void navigate({ to: "/projects" });
    } finally {
      setDeletingProject(false);
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1680px] px-5 pb-20 pt-6 sm:px-8 lg:px-10">
        {loading || (!currentProject && !error) ? (
          <ProjectRouteLoader label="Loading project" />
        ) : (
          <>
            <header className="border-b border-neutral-800 pb-6">
                    <ProjectPageToolbar
                      projects={projects}
                      currentProject={currentProject}
                      fallbackProjectName={projectSlug}
                      onBack={navigateToProjects}
                      onProjectSelect={navigateToProject}
                    />

                    <div className="mt-5 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="inline-flex h-10 items-center justify-center bg-blue-600 px-4 text-sm text-white transition hover:bg-blue-500 disabled:opacity-50"
                          onClick={() => setCreateServiceOpen(true)}
                          disabled={!currentProject || !selectedEnvironment}
                        >
                          New service
                        </button>
                        <button
                          type="button"
                          className="h-10 rounded-md border border-neutral-800 px-3 text-sm text-neutral-400 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
                          onClick={() => setDeleteProjectOpen(true)}
                          aria-label="Delete project"
                          disabled={!currentProject}
                        >
                          Delete
                        </button>
                      </div>
                  </header>

                  {error ? (
                    <div className="mt-6 border-l-2 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                      {error}
                    </div>
                  ) : null}

                  <div className="mt-6">
                    {currentProject && selectedEnvironment ? (
                      <>
                        <ProjectEnvironmentTabs
                          environments={currentProject.environments}
                          services={currentProject.services}
                          selectedEnvironmentId={selectedEnvironment.id}
                          draggingService={draggingService}
                          movingEnvironmentId={movingEnvironmentId}
                          onSelect={setSelectedEnvironmentId}
                          onCreate={() => setCreateEnvironmentOpen(true)}
                          onDropService={(environmentId) => void dropServiceIntoEnvironment(environmentId)}
                        />

                        {environmentServices.length === 0 ? (
                          <section className="flex min-h-[400px] items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 px-6 py-16 text-center backdrop-blur-xl">
                            <div>
                              <h2 className="font-sans text-2xl tracking-[-0.03em] text-neutral-100">
                                No services in {selectedEnvironment.name}
                              </h2>
                              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-400">
                                Add a service here or move one from another environment.
                              </p>
                              <button
                                type="button"
                                className="mt-7 inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-6 text-sm font-medium text-white transition hover:bg-blue-500"
                                onClick={() => setCreateServiceOpen(true)}
                              >
                                Add service
                              </button>
                            </div>
                          </section>
                        ) : (
                          <>
                            <ServiceSearch
                              query={serviceSearch}
                              resultCount={visibleServices.length}
                              totalCount={environmentServices.length}
                              onQueryChange={setServiceSearch}
                            />

                            {visibleServices.length === 0 ? (
                              <ServiceSearchEmptyState
                                query={serviceSearch.trim()}
                                onClear={() => setServiceSearch("")}
                              />
                            ) : (
                              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                {visibleServices.map((service) => (
                                  <ProjectServiceCard
                                    key={service.id}
                                    service={service}
                                    environment={selectedEnvironment}
                                    isDragging={draggingService?.id === service.id}
                                    canMoveEnvironment={currentProject.environments.length > 1}
                                    onDragStart={() => setDraggingService(service)}
                                    onDragEnd={() => setDraggingService(null)}
                                    onMoveEnvironment={() => setMovingService(service)}
                                    onOpen={() => navigateToServiceOverview(service.slug)}
                                  />
                                ))}
                              </section>
                            )}
                          </>
                        )}
                      </>
                    ) : null}
                  </div>
                </>
              )}
          </div>

      <CreateServiceModal
        projectId={currentProject?.id ?? ""}
        open={createServiceOpen}
        onClose={() => setCreateServiceOpen(false)}
        onCreate={createService}
      />
      <CreateEnvironmentModal
        open={createEnvironmentOpen}
        onClose={() => setCreateEnvironmentOpen(false)}
        onCreate={createEnvironment}
      />
      <MoveServiceEnvironmentModal
        open={Boolean(movingService)}
        serviceName={movingService?.name ?? "Service"}
        currentEnvironmentId={movingService?.environmentId ?? ""}
        environments={currentProject?.environments ?? []}
        onClose={() => setMovingService(null)}
        onMove={moveServiceToEnvironment}
      />
      <DeleteProjectModal
        open={deleteProjectOpen}
        projectName={currentProject?.name ?? projectSlug}
        busy={deletingProject}
        onClose={() => setDeleteProjectOpen(false)}
        onConfirm={() => void deleteProject()}
      />
      <EditProjectModal
        open={editingProject}
        name={projectForm.name}
        description={projectForm.description}
        projectSlug={currentProject?.slug ?? projectSlug}
        saving={savingProject}
        error={projectEditError}
        onNameChange={(name) => setProjectForm((current) => ({ ...current, name }))}
        onDescriptionChange={(description) => setProjectForm((current) => ({ ...current, description }))}
        onClose={() => {
          setProjectForm({
            name: currentProject?.name ?? "",
            description: currentProject?.description ?? ""
          });
          setProjectEditError("");
          setEditingProject(false);
        }}
        onSave={() => void saveProject()}
      />
    </>
  );
}
