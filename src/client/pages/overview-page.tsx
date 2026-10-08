import { Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  api,
  type GitHubStatus,
  type ProjectCard,
  type R2SettingsStatus,
  type ToolCheck,
} from "../api";
import { useAuthStatus } from "../components/auth/auth-context";
import { GitHubInstallModal } from "../features/github/github-install-modal";
import { ProjectOverviewCard } from "../features/projects/project-overview-card";
import { ProjectRouteLoader } from "../features/projects/project-route-loader";
import { SetupTodoList } from "../features/projects/setup-todo-list";
import {
  settingsPageForTab,
  type SystemSettingsTab,
} from "../features/settings/settings-pages";
import { serviceIsDeploying } from "../lib/deployment-status";
import { usePageTitle } from "../lib/page-title";
import { isDatabaseService } from "../../shared/service-source";

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone?: "ok" | "warn";
}) {
  return (
    <div className="rounded-lg border border-[var(--cf-border)] bg-white/5 px-4 py-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
        {label}
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        {tone ? (
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              tone === "ok" ? "bg-ok" : "bg-warn"
            }`}
          />
        ) : null}
        <span className="text-2xl font-semibold tracking-tight text-white">
          {value}
        </span>
      </div>
    </div>
  );
}

export function OverviewPage() {
  const navigate = useNavigate();
  const authStatus = useAuthStatus();
  usePageTitle("Overview");

  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [tools, setTools] = useState<ToolCheck[]>([]);
  const [githubStatus, setGitHubStatus] = useState<GitHubStatus | null>(null);
  const [domainSettings, setDomainSettings] = useState<
    Awaited<ReturnType<typeof api.systemSettings>> | null
  >(null);
  const [r2Status, setR2Status] = useState<R2SettingsStatus | null>(null);
  const [githubInstallOpen, setGitHubInstallOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser = authStatus?.user ?? null;
  const owner = currentUser?.role === "owner";
  const name = currentUser?.name || "there";

  const load = useCallback(async () => {
    try {
      const [projectData, systemData, githubData, domainData, r2Data] =
        await Promise.all([
          api.projects(),
          api.system().catch(() => ({ tools: [] })),
          api.githubStatus().catch(() => null),
          api.systemSettings().catch(() => null),
          api
            .r2Settings()
            .then((result) => result.r2)
            .catch(() => null),
        ]);
      setProjects(projectData.projects);
      setTools(systemData.tools);
      setGitHubStatus(githubData);
      setDomainSettings(domainData);
      setR2Status(r2Data);
      setError("");
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Could not load overview",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const serviceCount = projects.reduce(
    (total, project) => total + project.serviceCount,
    0,
  );
  const databases = projects.flatMap((project) =>
    project.services.filter((service) => isDatabaseService(service)),
  );
  const deployingCount = projects.reduce(
    (total, project) =>
      total +
      project.services.filter((service) => serviceIsDeploying(service.status))
        .length,
    0,
  );

  function openSystemSettings(tab: SystemSettingsTab = "root-domain") {
    void navigate({
      to: "/settings/$settingsPage",
      params: { settingsPage: settingsPageForTab(tab).slug },
    });
  }

  if (loading) {
    return <ProjectRouteLoader label="Loading overview" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {name}&rsquo;s workspace
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Hi {name}, let&rsquo;s get into it.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-bad/40 bg-bad/10 p-3 text-sm text-bad">
          {error}
        </div>
      ) : null}

      {owner ? (
        <SetupTodoList
          domainSettings={domainSettings}
          githubStatus={githubStatus}
          r2Status={r2Status}
          tools={tools}
          onOpenSettings={openSystemSettings}
          onOpenGitHubInstall={() => setGitHubInstallOpen(true)}
        />
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat label="Status" value={deployingCount > 0 ? "Working" : "Online"} tone={deployingCount > 0 ? "warn" : "ok"} />
        <Stat label="Projects" value={projects.length} />
        <Stat label="Services" value={serviceCount} />
        <Stat label="Databases" value={databases.length} />
        <Stat label="Deploying" value={deployingCount} />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-white">Projects</h2>
          <Link
            to="/projects"
            className="rounded-lg border border-[var(--cf-border)] px-3 py-1 text-xs text-[var(--color-text-secondary)] transition-colors hover:bg-white/10 hover:text-white"
          >
            View all
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="rounded-lg border border-[var(--cf-border)] bg-white/5 px-5 py-10 text-center text-sm text-[var(--color-text-secondary)]">
            No projects yet.
          </p>
        ) : (
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((project) => (
              <ProjectOverviewCard
                key={project.id}
                project={project}
                pinned={false}
                onOpen={() =>
                  void navigate({
                    to: "/$projectSlug",
                    params: { projectSlug: project.slug },
                  })
                }
                onTogglePin={() => undefined}
              />
            ))}
          </section>
        )}
      </section>

      <GitHubInstallModal
        open={githubInstallOpen}
        status={githubStatus}
        onClose={() => setGitHubInstallOpen(false)}
      />
    </div>
  );
}