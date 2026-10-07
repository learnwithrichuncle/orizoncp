import { SkeletonBlock } from "../../components/ui/skeleton";

function ProjectCardSkeleton() {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <SkeletonBlock className="h-5 w-32 max-w-full" />
          <SkeletonBlock className="mt-2 h-4 w-48 max-w-full" />
        </div>
      </div>

      <div className="mt-4 min-h-[104px] rounded-md border border-line bg-elevated p-3" />

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-line-subtle pt-3">
        <SkeletonBlock className="h-4 w-14" />
        <SkeletonBlock className="h-4 w-20" />
      </div>
    </div>
  );
}

export function ProjectsGridSkeleton() {
  return (
    <section
      role="status"
      aria-label="Loading projects"
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      <span className="sr-only">Loading projects</span>
      {Array.from({ length: 8 }).map((_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </section>
  );
}
