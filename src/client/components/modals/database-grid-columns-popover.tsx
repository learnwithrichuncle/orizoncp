import { DragDropVerticalIcon, ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import type { DatabaseColumn } from "../../api";
import { AppIcon } from "../ui/primitives";

export function DatabaseGridColumnsPopover({
  columns,
  hiddenColumns,
  visibleCount,
  onToggleColumn
}: {
  columns: DatabaseColumn[];
  hiddenColumns: Set<string>;
  visibleCount: number;
  onToggleColumn: (column: string) => void;
}) {
  return (
    <div className="absolute left-0 top-full z-30 mt-2 w-[320px] border border-line-strong bg-base shadow-[0_22px_70px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between border-b border-line px-3 py-3">
        <div className="text-[13px] font-semibold text-ink">Manage columns</div>
        <AppIcon icon={ViewOffSlashIcon} size={16} className="text-ink-muted" />
      </div>
      <div className="max-h-[360px] overflow-y-auto p-1.5">
        {columns.map((column) => {
          const visible = !hiddenColumns.has(column.name);
          return (
            <button
              key={column.name}
              type="button"
              className={`flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-[13px] transition ${
                visible ? "bg-base text-ink" : "text-ink-muted hover:bg-base hover:text-ink"
              }`}
              onClick={() => onToggleColumn(column.name)}
              disabled={visible && visibleCount === 1}
            >
              <AppIcon icon={visible ? ViewIcon : ViewOffSlashIcon} size={15} className={visible ? "text-ink" : "text-ink-dim"} />
              <span className="min-w-0 flex-1 truncate">{column.name}</span>
              <AppIcon icon={DragDropVerticalIcon} size={14} className="text-ink-dim" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
