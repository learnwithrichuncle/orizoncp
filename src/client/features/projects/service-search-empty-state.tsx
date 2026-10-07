import { Search01Icon } from "@hugeicons/core-free-icons";
import { AppIcon } from "../../components/ui/primitives";

export function ServiceSearchEmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <section className="flex min-h-64 flex-col items-center justify-center border border-dashed border-line bg-base/20 px-6 text-center">
      <AppIcon icon={Search01Icon} size={20} className="text-ink-dim" />
      <h2 className="mt-4 text-lg text-ink">No matching services</h2>
      <p className="mt-1.5 text-sm text-ink-dim">
        Nothing matched “{query}”.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 border border-line px-3.5 py-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-muted transition hover:border-line-strong hover:text-white"
      >
        Clear search
      </button>
    </section>
  );
}
