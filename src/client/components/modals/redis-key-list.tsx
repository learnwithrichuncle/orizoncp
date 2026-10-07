import type { DatabaseTable } from "../../api";

type RedisKeyListProps = {
  keys: DatabaseTable[];
  selectedKey: string;
  loading: boolean;
  runtimeUnavailable: boolean;
  onSelect: (key: DatabaseTable) => void;
};

export function RedisKeyList({
  keys,
  selectedKey,
  loading,
  runtimeUnavailable,
  onSelect
}: RedisKeyListProps) {
  return (
    <aside className="flex min-h-0 flex-col border-b border-line lg:border-b-0 lg:border-r">
      <div className="flex h-10 items-center justify-between border-b border-line px-4 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim">
        <span>Keys</span>
        <span>{keys.length}</span>
      </div>

      <div className="min-h-40 flex-1 overflow-y-auto">
        {loading && keys.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-ink-dim">
            Loading keys…
          </div>
        ) : keys.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-ink-dim">
            {runtimeUnavailable ? "Database not ready." : "No keys found."}
          </div>
        ) : (
          keys.map((key) => {
            const selected = selectedKey === key.id;
            return (
              <button
                key={key.id}
                type="button"
                className={
                  selected
                    ? "flex h-11 w-full items-center justify-between gap-3 border-b border-black/10 bg-accent px-4 text-left text-ink"
                    : "flex h-11 w-full items-center justify-between gap-3 border-b border-line-subtle px-4 text-left text-ink-muted transition hover:bg-glass hover:text-white"
                }
                onClick={() => onSelect(key)}
                aria-current={selected ? "true" : undefined}
              >
                <span className="min-w-0 truncate font-mono text-xs">{key.name}</span>
                <span
                  className={`shrink-0 font-mono text-[8px] uppercase tracking-[0.14em] ${
                    selected ? "text-white/60" : "text-ink-dim"
                  }`}
                >
                  {key.schema}
                </span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
