import { Add01Icon, Layers01Icon } from "@hugeicons/core-free-icons";
import { useMemo, useState, type DragEvent } from "react";
import type { ProjectEnvironment, Service } from "../../api";
import { AppIcon } from "../../components/ui/primitives";

function environmentTabTone({
  selected,
  source,
  validTarget,
  activeTarget
}: {
  selected: boolean;
  source: boolean;
  validTarget: boolean;
  activeTarget: boolean;
}) {
  if (activeTarget) return "scale-[1.04] border-cyan-300 bg-cyan-300 text-ink shadow-[0_0_28px_rgba(103,232,249,0.28)]";
  if (validTarget) return "animate-pulse border-dashed border-cyan-300/60 bg-cyan-300/[0.06] text-cyan-100";
  if (source) return "border-line bg-glass text-ink-dim opacity-50";
  if (selected) return "border-white bg-accent text-ink";
  return "border-line text-ink-muted hover:border-line hover:bg-hover hover:text-white";
}

export function ProjectEnvironmentTabs({
  environments,
  services,
  selectedEnvironmentId,
  draggingService,
  movingEnvironmentId,
  onSelect,
  onCreate,
  onDropService
}: {
  environments: ProjectEnvironment[];
  services: Service[];
  selectedEnvironmentId: string;
  draggingService: Service | null;
  movingEnvironmentId: string;
  onSelect: (environmentId: string) => void;
  onCreate: () => void;
  onDropService: (environmentId: string) => void;
}) {
  const [dropTargetKey, setDropTargetKey] = useState("");
  const serviceCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const service of services) {
      counts.set(service.environmentId, (counts.get(service.environmentId) ?? 0) + 1);
    }
    return counts;
  }, [services]);

  function dragOver(event: DragEvent<HTMLButtonElement>, environmentId: string) {
    if (!draggingService || draggingService.environmentId === environmentId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDropTargetKey(`${draggingService.id}:${environmentId}`);
  }

  return (
    <div className="mb-5">
      <div className={`overflow-hidden font-mono text-[9px] uppercase tracking-[0.14em] text-cyan-300 transition-all ${draggingService ? "mb-2 max-h-8 opacity-100" : "max-h-0 opacity-0"}`}>
        Drop {draggingService?.name ?? "the service"} onto another environment
      </div>
      <div className="flex items-center gap-2 overflow-x-auto border-b border-line pb-3">
        {environments.map((environment) => {
          const selected = environment.id === selectedEnvironmentId;
          const serviceCount = serviceCounts.get(environment.id) ?? 0;
          const source = Boolean(draggingService && draggingService.environmentId === environment.id);
          const validDropTarget = Boolean(draggingService && !source);
          const activeDropTarget = dropTargetKey === `${draggingService?.id}:${environment.id}`;
          const movingHere = movingEnvironmentId === environment.id;

          return (
            <button
              key={environment.id}
              type="button"
              className={`inline-flex h-9 shrink-0 items-center gap-2 border px-3 text-sm transition-all ${environmentTabTone({ selected, source, validTarget: validDropTarget, activeTarget: activeDropTarget })}`}
              onClick={() => onSelect(environment.id)}
              onDragEnter={(event) => dragOver(event, environment.id)}
              onDragOver={(event) => dragOver(event, environment.id)}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropTargetKey("");
              }}
              onDrop={(event) => {
                if (!validDropTarget) return;
                event.preventDefault();
                setDropTargetKey("");
                onDropService(environment.id);
              }}
              aria-pressed={selected}
            >
              <AppIcon icon={Layers01Icon} size={14} />
              {movingHere ? "Moving…" : activeDropTarget ? `Move to ${environment.name}` : environment.name}
              {environment.isDefault ? (
                <span className={`font-mono text-[8px] uppercase tracking-[0.12em] ${selected ? "text-ink-dim" : "text-ink-dim"}`}>
                  default
                </span>
              ) : null}
              <span className={`font-mono text-[9px] ${selected ? "text-ink-dim" : "text-ink-dim"}`}>
                {serviceCount}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          className="inline-flex h-9 shrink-0 items-center gap-2 border border-dashed border-line px-3 text-sm text-ink-dim transition hover:border-line hover:bg-hover hover:text-white"
          onClick={onCreate}
        >
          <AppIcon icon={Add01Icon} size={14} />
          New environment
        </button>
      </div>
    </div>
  );
}
