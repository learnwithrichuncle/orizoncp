import { SearchIcon, XIcon } from "lucide-react";

export function ProjectSearch({
  query,
  onQueryChange,
}: {
  query: string;
  resultCount: number;
  totalCount: number;
  onQueryChange: (query: string) => void;
}) {
  return (
    <div className="w-full max-w-sm">
      <label className="relative block">
        <span className="sr-only">Search projects</span>
        <SearchIcon
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
        />
        <input
          type="text"
          inputMode="search"
          role="searchbox"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search projects…"
          className="h-9 w-full rounded-md border border-neutral-800 bg-neutral-800 pl-9 pr-9 text-sm text-neutral-100 outline-none transition placeholder:text-neutral-500 hover:border-neutral-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-900"
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear project search"
            className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-neutral-500 transition hover:bg-neutral-800 hover:text-neutral-100"
          >
            <XIcon size={16} />
          </button>
        ) : null}
      </label>
    </div>
  );
}
