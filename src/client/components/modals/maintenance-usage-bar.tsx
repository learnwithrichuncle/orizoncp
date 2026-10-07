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
      ? "bg-rose-400"
      : tone === "amber"
        ? "bg-amber-300"
        : tone === "zinc"
          ? "bg-zinc-400"
          : "bg-accent";

  return (
    <div className="border border-line bg-base p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim">{label}</div>
          <div className="mt-2 text-lg text-ink">{value}</div>
        </div>
        <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim">{percentLabel ?? `${Math.round(clampedPercent)}%`}</div>
      </div>
      <div className="mt-4 h-1 bg-hover">
        <div className={`h-full ${color}`} style={{ width: `${clampedPercent}%` }} />
      </div>
      {detail ? <p className="mt-3 text-xs leading-relaxed text-ink-dim">{detail}</p> : null}
    </div>
  );
}
