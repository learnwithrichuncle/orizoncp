import { SearchIcon } from "lucide-react";

export function ProjectSearchEmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <section className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-line bg-surface px-6 text-center">
      <SearchIcon size={24} className="text-ink-dim" />
      <h2 className="mt-5 text-lg font-semibold text-ink">No matching projects</h2>
      <p className="mt-2 max-w-md text-sm text-ink-muted">
        Nothing matched “{query}”. Try a project name, description, or service.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 rounded-md border border-line bg-elevated px-3 py-1.5 text-sm font-medium text-ink-muted transition hover:border-line-strong hover:bg-hover hover:text-ink"
      >
        Clear search
      </button>
    </section>
  );
}
