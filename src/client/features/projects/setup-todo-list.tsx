import {
  AlertCircleIcon,
  CloudUploadIcon,
  GithubIcon,
  Globe02Icon,
  Settings01Icon
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import type { GitHubStatus, R2SettingsStatus, ToolCheck } from "../../api";
import { ModalShell } from "../../components/modals/modal-shell";
import { AppIcon } from "../../components/ui/primitives";
import type { SystemSettingsTab } from "../settings/settings-pages";

type DomainSettingsSummary = {
  settings: {
    rootDomain: string;
    controlPlaneHostname: string;
  };
  dnsStatus?: "active" | "pending";
  controlPlaneDnsStatus?: "active" | "pending";
};

type SetupTodo = {
  key: string;
  icon: unknown;
  title: string;
  detail: string;
  actionLabel: string;
  onAction: () => void;
};

export function SetupTodoList({
  domainSettings,
  githubStatus,
  r2Status,
  tools,
  onOpenSettings,
  onOpenGitHubInstall
}: {
  domainSettings: DomainSettingsSummary | null;
  githubStatus: GitHubStatus | null;
  r2Status: R2SettingsStatus | null;
  tools: ToolCheck[];
  onOpenSettings: (tab?: SystemSettingsTab) => void;
  onOpenGitHubInstall: () => void;
}) {
  const [open, setOpen] = useState(false);
  const todos: SetupTodo[] = [];
  const dashboardHostname = domainSettings?.settings.controlPlaneHostname ?? "";
  const rootDomain = domainSettings?.settings.rootDomain ?? "";
  const brokenTools = tools.filter((tool) => !tool.ok);

  if (!dashboardHostname) {
    todos.push({
      key: "dashboard-domain",
      icon: Globe02Icon,
      title: "Add dashboard domain",
      detail: "Serve orizonCP from a hostname instead of only the server IP.",
      actionLabel: "Set domain",
      onAction: () => onOpenSettings("root-domain")
    });
  } else if (domainSettings?.controlPlaneDnsStatus !== "active") {
    todos.push({
      key: "dashboard-dns",
      icon: Globe02Icon,
      title: "Finish dashboard DNS",
      detail: `${dashboardHostname} is saved, but DNS has not resolved to this server yet.`,
      actionLabel: "View DNS",
      onAction: () => onOpenSettings("root-domain")
    });
  }

  if (!rootDomain) {
    todos.push({
      key: "root-domain",
      icon: Globe02Icon,
      title: "Add wildcard root domain",
      detail: "Generate service hostnames like api.pilot.example.com automatically.",
      actionLabel: "Set wildcard",
      onAction: () => onOpenSettings("root-domain")
    });
  } else if (domainSettings?.dnsStatus !== "active") {
    todos.push({
      key: "root-dns",
      icon: Globe02Icon,
      title: "Finish wildcard DNS",
      detail: `*.${rootDomain} is saved, but the wildcard record is not active yet.`,
      actionLabel: "View DNS",
      onAction: () => onOpenSettings("root-domain")
    });
  }

  if (!githubStatus?.connected && !githubStatus?.installed) {
    todos.push({
      key: "github",
      icon: GithubIcon,
      title: githubStatus?.mode === "app" ? "Install GitHub App" : "Connect GitHub",
      detail: githubStatus?.mode === "app" ? "The app is configured, but it is not installed on any repositories." : "Connect GitHub to browse repos, branches, and directories.",
      actionLabel: githubStatus?.mode === "app" && githubStatus.installUrl ? "Install app" : "Open setup",
      onAction: () => {
        if (githubStatus?.mode === "app" && githubStatus.installUrl) {
          onOpenGitHubInstall();
        } else {
          onOpenSettings("github");
        }
      }
    });
  }

  if (!r2Status?.connected) {
    todos.push({
      key: "r2",
      icon: CloudUploadIcon,
      title: "Connect R2 backups",
      detail: "Store R2 credentials in orizonCP so database backups can upload.",
      actionLabel: "Set storage",
      onAction: () => onOpenSettings("storage")
    });
  }

  if (brokenTools.length > 0) {
    todos.push({
      key: "tools",
      icon: Settings01Icon,
      title: "Fix host tools",
      detail: brokenTools.map((tool) => tool.name).join(", "),
      actionLabel: "Open settings",
      onAction: () => onOpenSettings()
    });
  }

  if (todos.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-left backdrop-blur-xl transition hover:border-neutral-700"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500">
            <AppIcon icon={AlertCircleIcon} size={18} />
          </span>
          <div className="min-w-0">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-100">
              Setup checklist
            </div>
            <div className="mt-0.5 text-xs text-neutral-400">
              {todos.length} item{todos.length === 1 ? "" : "s"} need attention
            </div>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-800 px-2.5 py-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
          Review
        </span>
      </button>

      <ModalShell
        open={open}
        title="Setup checklist"
        meta={`${todos.length} item${todos.length === 1 ? "" : "s"} still need attention`}
        icon={AlertCircleIcon}
        onClose={() => setOpen(false)}
        width="max-w-2xl"
      >
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.key}
              className="rounded-md border border-neutral-800 bg-neutral-900"
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-neutral-800 bg-neutral-800 text-neutral-400">
                    <AppIcon icon={todo.icon} size={16} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-neutral-100">
                      {todo.title}
                    </div>
                    <p className="mt-0.5 text-xs leading-5 text-neutral-400">
                      {todo.detail}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={todo.onAction}
                  className="shrink-0 rounded-md border border-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-400 transition hover:border-neutral-700 hover:text-neutral-100"
                >
                  {todo.actionLabel}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </ModalShell>
    </>
  );
}
