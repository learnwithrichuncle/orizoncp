import { GlobeIcon } from "lucide-react";
import type { ProjectCard } from "../../api";
import { FrameworkMark } from "../../components/ui/primitives";

export function ServiceCluster({ project }: { project: ProjectCard }) {
  const previewServices = project.services.slice(0, 7);
  const extraCount = Math.max(0, project.serviceCount - previewServices.length);

  return (
    <div className="flex min-h-[104px] items-center justify-center rounded-md border border-line bg-elevated p-3">
      <div className="flex max-w-[11.5rem] flex-wrap items-center justify-center gap-2">
        {previewServices.map((service) => (
          <div
            key={service.id}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface p-2.5"
          >
            <FrameworkMark framework={service.framework} size={17} fallback={<GlobeIcon size={16} className="text-ink-dim" />} />
          </div>
        ))}
        {previewServices.length === 0 ? (
          <div className="flex h-full min-h-[104px] items-center justify-center text-xs text-ink-dim">No services yet.</div>
        ) : null}
        {extraCount > 0 ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface font-mono text-xs text-ink-muted">
            +{extraCount}
          </div>
        ) : null}
      </div>
    </div>
  );
}
