import { ArrowLeft01Icon, CloudServerIcon } from "@hugeicons/core-free-icons";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, type ProjectDetail } from "../api";
import { ServicePageShell } from "../features/services/service-page-shell";
import { ProjectRouteLoader } from "../features/projects/project-route-loader";
import {
  routeSegmentToServiceTab,
  serviceTabToRouteSegment,
  type ServiceTab,
} from "../features/services/service-tabs";
import { AppIcon } from "../components/ui/primitives";
import { usePageTitle } from "../lib/page-title";

export function ServicePage({
  projectSlug,
  serviceSlug,
  serviceTab,
}: {
  projectSlug: string;
  serviceSlug: string;
  serviceTab?: string;
}) {
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const selectedTab = useMemo<ServiceTab>(
    () => routeSegmentToServiceTab(serviceTab),
    [serviceTab],
  );

  const loadProject = useCallback(async (options: { showLoading?: boolean } = {}) => {
    const showLoading = options.showLoading ?? true;
    if (showLoading) setLoading(true);
    try {
      const result = await api.project(projectSlug);
      startTransition(() => {
        setProject(result.project);
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
    setError("");
    setLoading(true);
    void loadProject();
  }, [loadProject]);

  const currentProject = project?.slug === projectSlug ? project : null;
  const service =
    currentProject?.services.find((item) => item.slug === serviceSlug) ?? null;
  const refreshProjectInBackground = useCallback(
    () => loadProject({ showLoading: false }),
    [loadProject],
  );
  usePageTitle(
    service
      ? `${service.name} - ${currentProject?.name ?? projectSlug}`
      : (currentProject?.name ?? projectSlug),
  );

  function navigateToProject() {
    void navigate({ to: "/$projectSlug", params: { projectSlug } });
  }

  function navigateToTab(tab: ServiceTab) {
    const segment = serviceTabToRouteSegment[tab];
    if (segment === "overview") {
      void navigate({
        to: "/$projectSlug/$serviceSlug",
        params: { projectSlug, serviceSlug },
      });
      return;
    }
    void navigate({
      to: "/$projectSlug/$serviceSlug/$serviceTab",
      params: { projectSlug, serviceSlug, serviceTab: segment },
    });
  }

  function navigateToService(nextServiceSlug: string) {
    void navigate({
      to: "/$projectSlug/$serviceSlug",
      params: { projectSlug, serviceSlug: nextServiceSlug },
    });
  }

  function navigateToTransferredService(nextProjectSlug: string, nextServiceSlug: string) {
    void navigate({
      to: "/$projectSlug/$serviceSlug",
      params: { projectSlug: nextProjectSlug, serviceSlug: nextServiceSlug },
    });
  }

  if (error) {
    return (
      <section className="grid min-h-dvh place-items-center px-5 py-12">
        <div className="w-full max-w-lg rounded-[14px] border border-line bg-glass p-5 backdrop-blur-xl">
          <h1 className="text-lg text-ink">Could not load service</h1>
          <p className="mt-2 text-sm text-bad">{error}</p>
          <button
            type="button"
            className="mt-5 inline-flex h-9 items-center justify-center gap-2 border border-line px-3.5 text-sm text-muted transition hover:border-line hover:bg-hover"
            onClick={navigateToProject}
          >
            <AppIcon icon={ArrowLeft01Icon} size={15} />
            Back to project
          </button>
        </div>
      </section>
    );
  }

  if (loading || !currentProject) {
    return <ProjectRouteLoader label="Loading service" fullPage />;
  }

  if (!service) {
    return (
      <section className="grid min-h-dvh place-items-center px-5 py-12">
        <div className="w-full max-w-lg rounded-[14px] border border-line bg-glass p-5 backdrop-blur-xl">
          <AppIcon icon={CloudServerIcon} size={20} className="text-ink-dim" />
          <h1 className="mt-4 text-lg text-ink">Service not found</h1>
          <p className="mt-2 text-sm leading-6 text-ink-dim">
            There is no service named <span className="font-mono text-ink-muted">{serviceSlug}</span> in this project.
          </p>
          <Link
            to="/$projectSlug"
            params={{ projectSlug }}
            className="mt-5 inline-flex h-9 items-center justify-center gap-2 border border-line px-3.5 text-sm text-muted transition hover:border-line hover:bg-hover"
          >
            <AppIcon icon={ArrowLeft01Icon} size={15} />
            Back to project
          </Link>
        </div>
      </section>
    );
  }

  return (
    <ServicePageShell
      key={service.id}
      selectedTab={selectedTab}
      serviceId={service.id}
      onClose={navigateToProject}
      onTabChange={navigateToTab}
      onProjectRefresh={refreshProjectInBackground}
      onDeleted={navigateToProject}
      pageServices={currentProject.services}
      onServiceSelect={navigateToService}
      onTransferred={navigateToTransferredService}
    />
  );
}
