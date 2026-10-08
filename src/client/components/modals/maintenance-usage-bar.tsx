export function MaintenanceUsageBar({
  label,
  value,
  detail,
  percent,
  percentLabel,
  tone = "teal"
}: {
  label: string;
  value: string;
  detail?: string;
  percent: number;
  percentLabel?: string;
  tone?: "teal" | "amber" | "rose" | "zinc";
}) {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const color =
    tone === "rose"
      ? "bg-red-500"
      : tone === "amber"
        ? "bg-amber-500"
        : tone === "zinc"
          ? "bg-zinc-400"
          : "bg-blue-600";

  return (
    <div className="border border-neutral-800 bg-neutral-950 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500">{label}</div>
          <div className="mt-2 text-lg text-neutral-100">{value}</div>
        </div>
        <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500">{percentLabel ?? `${Math.round(clampedPercent)}%`}</div>
      </div>
      <div className="mt-4 h-1 bg-neutral-800">
        <div className={`h-full ${color}`} style={{ width: `${clampedPercent}%` }} />
      </div>
      {detail ? <p className="mt-3 text-xs leading-relaxed text-neutral-500">{detail}</p> : null}
    </div>
  );
}
