import { SearchIcon } from "lucide-react";

export function ProjectSearchEmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <section className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-neutral-800 bg-neutral-900 px-6 text-center">
      <SearchIcon size={24} className="text-neutral-500" />
      <h2 className="mt-5 text-lg font-semibold text-neutral-100">No matching projects</h2>
      <p className="mt-2 max-w-md text-sm text-neutral-400">
        Nothing matched “{query}”. Try a project name, description, or service.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 rounded-md border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-sm font-medium text-neutral-400 transition hover:border-neutral-700 hover:bg-neutral-800 hover:text-neutral-100"
      >
        Clear search
      </button>
    </section>
  );
}
