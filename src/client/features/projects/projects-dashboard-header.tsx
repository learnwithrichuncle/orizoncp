import { Add01Icon, DatabaseImportIcon } from "@hugeicons/core-free-icons";
import { AppIcon } from "../../components/ui/primitives";

export function ProjectsDashboardHeader({
  projectCount,
  serviceCount,
  onCreate,
  onImport,
}: {
  projectCount: number;
  serviceCount: number;
  onCreate: () => void;
  onImport: () => void;
}) {
  return (
    <header className="border-b border-neutral-800 pb-7">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="font-sans text-3xl tracking-[-0.05em] text-neutral-100 sm:text-4xl">
            Projects
          </h1>
          <p className="mt-3 text-sm text-neutral-500">
            {projectCount} project{projectCount === 1 ? "" : "s"}
            <span className="mx-2 text-neutral-600">/</span>
            {serviceCount} service{serviceCount === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onImport}
            className="flex h-10 items-center gap-2 rounded-md border border-neutral-800 px-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-400 transition hover:border-neutral-700 hover:text-neutral-100"
          >
            <AppIcon icon={DatabaseImportIcon} size={14} />
            Import from…
          </button>
          <button
            type="button"
            onClick={onCreate}
            className="flex h-10 items-center gap-2 rounded-md bg-blue-600 px-4 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-blue-500"
          >
            <AppIcon icon={Add01Icon} size={14} />
            New project
          </button>
        </div>
      </div>
    </header>
  );
}
