import { useMemo, useState, type DragEvent } from "react";
import type { ProjectEnvironment, Service } from "../../api";

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
  if (activeTarget) return "scale-[1.04] border border-blue-600 bg-blue-950 text-neutral-100";
  if (validTarget) return "animate-pulse border border-dashed border-blue-600/60 bg-blue-950 text-neutral-400";
  if (source) return "bg-neutral-900 text-neutral-400 opacity-50";
  if (selected) return "bg-blue-600 text-white";
  return "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100";
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
      <div className={`overflow-hidden font-mono text-[9px] uppercase tracking-[0.14em] text-blue-500 transition-all ${draggingService ? "mb-2 max-h-8 opacity-100" : "max-h-0 opacity-0"}`}>
        Drop {draggingService?.name ?? "the service"} onto another environment
      </div>
      <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-neutral-800 bg-neutral-900 p-1">
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
              className={`inline-flex h-8 shrink-0 items-center gap-2 rounded-full px-3 text-sm transition-all ${environmentTabTone({ selected, source, validTarget: validDropTarget, activeTarget: activeDropTarget })}`}
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
              {movingHere ? "Moving…" : activeDropTarget ? `Move to ${environment.name}` : environment.name}
              {environment.isDefault ? (
                <span className="font-mono text-[8px] uppercase tracking-[0.12em] opacity-70">
                  default
                </span>
              ) : null}
              <span
                className={`grid h-5 min-w-5 place-items-center rounded-full px-1 font-mono text-[10px] ${
                  selected ? "bg-white/20" : "bg-neutral-800"
                }`}
              >
                {serviceCount}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          className="inline-flex h-8 shrink-0 items-center rounded-full px-3 text-sm text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100"
          onClick={onCreate}
        >
          New
        </button>
      </div>
    </div>
  );
}
