import { PlusIcon } from "lucide-react";

export function ProjectsEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-neutral-800 bg-neutral-900 p-10">
      <h2 className="text-xl font-semibold text-neutral-100">Create your first project</h2>
      <p className="mt-2 max-w-md text-center text-sm text-neutral-400">
        Projects organize services, deployments, environment variables, and
        domains into one workspace.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-8 inline-flex h-9 items-center gap-2 rounded-md border border-blue-600 bg-blue-600 px-3.5 text-sm font-medium text-white transition hover:bg-blue-500"
      >
        <PlusIcon size={16} />
        New project
      </button>
    </section>
  );
}
