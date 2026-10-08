import { StarIcon } from "lucide-react";
import type { ProjectCard } from "../../api";
import { formatRelativeTime } from "../../lib/format";
import { ServiceCluster } from "./service-cluster";

export function ProjectOverviewCard({
  project,
  pinned,
  onOpen,
  onTogglePin,
}: {
  project: ProjectCard;
  pinned: boolean;
  onOpen: () => void;
  onTogglePin: () => void;
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 backdrop-blur-xl transition hover:border-blue-600/40">
      <button
        type="button"
        onClick={onOpen}
        className="relative z-10 flex min-w-0 flex-1 flex-col p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-neutral-800 bg-neutral-800 font-sans text-lg font-semibold text-blue-500">
            {project.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-sans text-base font-semibold tracking-[-0.02em] text-neutral-100">
              {project.name}
            </h2>
            <p className="truncate font-mono text-[11px] text-neutral-400">
              {project.slug}
            </p>
          </div>
        </div>

        {project.description ? (
          <p className="mt-3 line-clamp-2 text-sm text-neutral-400">
            {project.description}
          </p>
        ) : null}

        <div className="mb-3 mt-5">
          <ServiceCluster project={project} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-neutral-800 pt-3">
          <span className="font-mono text-xs text-neutral-400">
            {project.serviceCount} service{project.serviceCount === 1 ? "" : "s"}
          </span>
          <span className="text-xs text-neutral-400">
            Updated {formatRelativeTime(project.lastUpdatedAt)}
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={onTogglePin}
        aria-label={pinned ? `Remove ${project.name} from favorites` : `Add ${project.name} to favorites`}
        title={pinned ? "Remove from favorites" : "Add to favorites"}
        className={`absolute bottom-2.5 right-2.5 z-20 grid h-8 w-8 place-items-center rounded-md transition ${pinned ? "text-amber-500" : "text-neutral-400 hover:text-neutral-100"}`}
      >
        <StarIcon size={16} className={pinned ? "fill-current" : ""} />
      </button>
    </article>
  );
}
