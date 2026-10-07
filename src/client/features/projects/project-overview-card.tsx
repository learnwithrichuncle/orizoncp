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
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface text-left transition hover:border-line-strong">
      <button
        type="button"
        onClick={onOpen}
        className="relative z-10 flex min-w-0 flex-1 flex-col p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-edge"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-ink">
              {project.name}
            </h2>
            {project.description ? (
              <p className="mt-1 line-clamp-2 text-sm text-ink-muted">
                {project.description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mb-3 mt-4">
          <ServiceCluster project={project} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-line-subtle pt-3">
          <span className="text-xs text-ink-muted">
            {project.serviceCount} service{project.serviceCount === 1 ? "" : "s"}
          </span>
          <span className="text-xs text-ink-dim">
            Updated {formatRelativeTime(project.lastUpdatedAt)}
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={onTogglePin}
        aria-label={pinned ? `Remove ${project.name} from favorites` : `Add ${project.name} to favorites`}
        title={pinned ? "Remove from favorites" : "Add to favorites"}
        className={`absolute bottom-2.5 right-2.5 z-20 grid h-8 w-8 place-items-center rounded-md transition ${pinned ? "text-warn" : "text-ink-dim hover:text-ink"}`}
      >
        <StarIcon size={16} className={pinned ? "fill-current" : ""} />
      </button>
    </article>
  );
}
