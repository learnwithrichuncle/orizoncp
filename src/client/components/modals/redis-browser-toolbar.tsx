import {
  Add01Icon,
  DatabaseImportIcon,
  Refresh03Icon,
  Search01Icon
} from "@hugeicons/core-free-icons";
import type { DropdownOption } from "../ui/dropdown";
import { Dropdown } from "../ui/dropdown";
import { AppIcon, FormInput } from "../ui/primitives";

type RedisBrowserToolbarProps = {
  selectedDatabase: string;
  databaseOptions: DropdownOption[];
  typeFilter: string;
  typeOptions: DropdownOption[];
  search: string;
  keyCount: number;
  loading: boolean;
  disabled: boolean;
  onDatabaseChange: (database: string) => void;
  onTypeChange: (type: string) => void;
  onSearchChange: (search: string) => void;
  onRefresh: () => void;
  onImport: () => void;
  onAddKey: () => void;
};

export function RedisBrowserToolbar({
  selectedDatabase,
  databaseOptions,
  typeFilter,
  typeOptions,
  search,
  keyCount,
  loading,
  disabled,
  onDatabaseChange,
  onTypeChange,
  onSearchChange,
  onRefresh,
  onImport,
  onAddKey
}: RedisBrowserToolbarProps) {
  return (
    <header className="border-b border-line">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-lg tracking-[-0.03em] text-white">Data</h2>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim">
            Redis · DB {selectedDatabase} · {keyCount} {keyCount === 1 ? "key" : "keys"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-8 items-center justify-center gap-2 border border-line px-3 text-xs text-ink-muted transition hover:border-line hover:bg-hover hover:text-white disabled:opacity-40"
            onClick={onImport}
            disabled={disabled}
          >
            <AppIcon icon={DatabaseImportIcon} size={13} />
            Import
          </button>
          <button
            type="button"
            className="inline-flex h-8 items-center justify-center gap-2 bg-accent px-3 text-xs text-ink transition hover:bg-zinc-200 disabled:opacity-40"
            onClick={onAddKey}
            disabled={disabled}
          >
            <AppIcon icon={Add01Icon} size={13} />
            New key
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3 sm:px-5">
        <Dropdown
          value={selectedDatabase}
          options={databaseOptions}
          onChange={onDatabaseChange}
          variant="monochrome"
          size="compact"
          className="w-24"
        />
        <Dropdown
          value={typeFilter}
          options={typeOptions}
          onChange={onTypeChange}
          variant="monochrome"
          size="compact"
          className="w-36"
        />
        <div className="relative min-w-52 flex-1">
          <AppIcon
            icon={Search01Icon}
            size={13}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-dim"
          />
          <FormInput
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search keys"
            variant="monochrome"
            className="!h-8 border-line bg-glass pl-8 text-xs"
          />
        </div>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center border border-line text-ink-dim transition hover:border-line hover:bg-hover hover:text-white disabled:opacity-40"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh keys"
          title="Refresh keys"
        >
          <AppIcon icon={Refresh03Icon} size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
    </header>
  );
}
