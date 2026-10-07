import type { DatabaseColumn, DatabaseRow, DatabaseRowValue } from "../../api";

function displayValue(value: DatabaseRowValue) {
  if (value === null) return "NULL";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

export function DatabaseResultTable({
  columns,
  rows,
  emptyLabel = "No rows returned."
}: {
  columns: Array<DatabaseColumn | string>;
  rows: DatabaseRow[];
  emptyLabel?: string;
}) {
  const columnMeta = columns.map((column) => (
    typeof column === "string"
      ? { name: column, type: "" }
      : { name: column.name, type: column.type }
  ));
  const columnNames = columnMeta.map((column) => column.name);

  if (columnNames.length === 0 || rows.length === 0) {
    return <div className="border border-line bg-base/45 px-5 py-8 text-sm text-ink-dim">{emptyLabel}</div>;
  }

  return (
    <div className="h-full min-h-0 overflow-auto border border-line-strong bg-base">
      <table className="min-w-full border-collapse text-left font-mono text-sm">
        <thead className="sticky top-0 z-10 bg-base text-ink-muted">
          <tr>
            {columnMeta.map((column) => (
              <th key={column.name} className="min-w-[220px] border-b border-r border-line-strong px-4 py-3 font-semibold">
                <span className="block truncate">
                  <span className="text-ink-muted">{column.name}</span>
                  {column.type ? <span className="ml-2 text-ink-dim">{column.type}</span> : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-line odd:bg-base even:bg-base/45 hover:bg-elevated/60">
              {columnNames.map((column) => {
                const value = row[column] ?? null;
                return (
                  <td key={column} className="min-w-[220px] max-w-[320px] border-r border-line px-4 py-3 align-middle text-ink">
                    <span className={`block truncate ${value === null ? "text-ink-dim" : ""}`} title={displayValue(value)}>
                      {displayValue(value)}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
