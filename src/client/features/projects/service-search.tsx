import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { AppIcon } from "../../components/ui/primitives";

export function ServiceSearch({
  query,
  resultCount,
  totalCount,
  onQueryChange,
}: {
  query: string;
  resultCount: number;
  totalCount: number;
  onQueryChange: (query: string) => void;
}) {
  const serviceLabel = totalCount === 1 ? "service" : "services";

  return (
    <div className="mb-5 flex flex-col gap-3 border-y border-neutral-800 py-4 sm:flex-row sm:items-center sm:justify-between">
      <label className="relative block w-full sm:max-w-md">
        <span className="sr-only">Search services</span>
        <AppIcon
          icon={Search01Icon}
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
        />
        <input
          type="text"
          inputMode="search"
          role="searchbox"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search services…"
          className="h-11 w-full border border-neutral-800 bg-neutral-950/30 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-neutral-800 focus:bg-neutral-950/50"
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear service search"
            className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center text-neutral-500 transition hover:bg-neutral-800 hover:text-white"
          >
            <AppIcon icon={Cancel01Icon} size={14} />
          </button>
        ) : null}
      </label>

      <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
        {query.trim()
          ? `${resultCount} of ${totalCount} ${serviceLabel}`
          : `${totalCount} ${serviceLabel}`}
      </span>
    </div>
  );
}
