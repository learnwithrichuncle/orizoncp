import {
  CloudServerIcon,
  DragDropVerticalIcon,
  FolderOpenIcon,
  FunctionIcon,
  GitBranchIcon,
  GithubIcon,
  Globe02Icon,
  PackageIcon
} from "@hugeicons/core-free-icons";
import type { ProjectEnvironment, Service } from "../../api";
import type { DragEvent } from "react";
import { AppIcon, FrameworkMark } from "../../components/ui/primitives";
import { formatTime } from "../../lib/format";
import { dockerImageForService, isDatabaseService, isDockerImageService } from "../../../shared/service-source";
import { functionRuntimeLabels, isFunctionService } from "../../../shared/service-functions";
import { ServiceCardActions } from "./service-card-actions";

function statusTone(status: string) {
  if (status === "active" || status === "running") {
    return { text: "text-green-500", dot: "bg-green-500" };
  }
  if (status === "building" || status === "queued") {
    return { text: "text-amber-500", dot: "animate-pulse bg-amber-500" };
  }
  if (status === "crashed") {
    return { text: "text-orange-300", dot: "bg-orange-400" };
  }
  if (status === "failed") {
    return { text: "text-red-500", dot: "bg-red-500" };
  }
  return { text: "text-neutral-500", dot: "bg-zinc-600" };
}

export function ProjectServiceCard({
  service,
  environment,
  isDragging,
  canMoveEnvironment,
  onDragStart,
  onDragEnd,
  onMoveEnvironment,
  onOpen
}: {
  service: Service;
  environment: ProjectEnvironment;
  isDragging: boolean;
  canMoveEnvironment: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onMoveEnvironment: () => void;
  onOpen: () => void;
}) {
  const isDatabase = isDatabaseService(service);
  const isDockerImage = isDockerImageService(service);
  const isFunction = isFunctionService(service);
  const visibleUrl = (service.primaryUrl || service.localUrl).replace("127.0.0.1", window.location.hostname);
  const visibleLabel = visibleUrl.replace(/^https?:\/\//, "");
  const sourceLabel = isFunction
    ? `${functionRuntimeLabels[service.functionRuntime ?? "node"]} function`
    : service.dockerImage ||
      (isDockerImage ? dockerImageForService(service) : "") ||
      service.repoFullName ||
      service.repoUrl.replace(/^https?:\/\//, "").replace(/^github\.com\//, "");
  const status = statusTone(service.status);
  const sourceIcon = isDatabase
    ? CloudServerIcon
    : isFunction
      ? FunctionIcon
      : isDockerImage
        ? PackageIcon
        : GithubIcon;
  const fallbackIcon = isDatabase
    ? CloudServerIcon
    : isFunction
      ? FunctionIcon
      : isDockerImage
        ? PackageIcon
        : Globe02Icon;

  return (
    <article
      role="button"
      tabIndex={0}
      draggable={canMoveEnvironment}
      className={`group relative flex min-h-52 flex-col border bg-neutral-950 p-4 text-left transition-all ${
        isDragging
          ? "scale-[0.98] cursor-grabbing border-blue-600/70 opacity-35 shadow-[0_0_36px_rgba(103,232,249,0.16)]"
          : "cursor-grab border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 active:cursor-grabbing"
      }`}
      onClick={onOpen}
      onDragStart={(event: DragEvent<HTMLElement>) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", service.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      {canMoveEnvironment ? (
        <span className="pointer-events-none absolute left-1/2 top-1 -translate-x-1/2 text-zinc-700 opacity-0 transition group-hover:opacity-100" aria-hidden="true">
          <AppIcon icon={DragDropVerticalIcon} size={14} />
        </span>
      ) : null}
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center border border-neutral-800 bg-neutral-900 p-2.5">
          <FrameworkMark
            framework={service.framework}
            size={20}
            fallback={<AppIcon icon={fallbackIcon} size={17} className="text-neutral-400" />}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="truncate text-base text-neutral-100">{service.name}</h2>
            <span className={`inline-flex shrink-0 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] ${status.text}`}>
              <span className={`h-1.5 w-1.5 ${status.dot}`} />
              {service.status}
            </span>
          </div>

          {isDatabase ? (
            <p className="mt-1 truncate font-mono text-[10px] text-neutral-500">
              {window.location.hostname}:{service.hostPort}
            </p>
          ) : visibleUrl ? (
            <a
              href={visibleUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block truncate text-xs text-neutral-500 transition hover:text-white"
              onClick={(event) => event.stopPropagation()}
            >
              {visibleLabel}
            </a>
          ) : (
            <p className="mt-1 text-xs text-neutral-500">No public URL</p>
          )}
        </div>
      </div>

      <div className="mt-5 min-w-0">
        <div className="flex min-w-0 items-center gap-2 text-xs text-neutral-400">
          <AppIcon icon={sourceIcon} size={14} className="shrink-0 text-neutral-500" />
          <span className="truncate">{isDatabase ? "Database service" : sourceLabel}</span>
        </div>

        {!isDatabase && !isDockerImage && !isFunction ? (
          <div className="mt-3 flex min-w-0 items-center gap-2 text-xs text-neutral-500">
            <AppIcon icon={FolderOpenIcon} size={14} className="shrink-0 text-neutral-500" />
            <span className="truncate">{service.rootDir || "Repository root"}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-auto flex items-end justify-between gap-4 border-t border-neutral-800 pt-4">
        <div className="min-w-0">
          {!isDatabase && !isDockerImage && !isFunction ? (
            <span className="inline-flex max-w-full items-center gap-1.5 font-mono text-[9px] text-neutral-500">
              <AppIcon icon={GitBranchIcon} size={12} />
              <span className="truncate">{service.branch}</span>
            </span>
          ) : null}
          <p className="mt-1 font-mono text-[9px] text-neutral-500">
            {formatTime(service.lastDeployedAt ?? service.updatedAt)}
          </p>
        </div>
        <ServiceCardActions
          serviceName={service.name}
          environment={environment}
          canVisit={Boolean(visibleUrl)}
          canMoveEnvironment={canMoveEnvironment}
          onOpen={onOpen}
          onVisit={() => window.open(visibleUrl, "_blank", "noopener,noreferrer")}
          onMoveEnvironment={onMoveEnvironment}
        />
      </div>
    </article>
  );
}
