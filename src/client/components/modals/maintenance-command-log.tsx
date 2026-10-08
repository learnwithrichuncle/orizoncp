import { Alert02Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import type { MaintenanceCommandResult } from "../../api";
import { AppIcon } from "../ui/primitives";

export function MaintenanceCommandLog({ commands }: { commands: MaintenanceCommandResult[] }) {
  if (commands.length === 0) return null;

  const complete = commands.every((command) => command.ok);

  return (
    <section className="border border-neutral-800 bg-neutral-950">
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3.5">
        <h3 className="text-sm text-neutral-100">Cleanup activity</h3>
        <span className={`inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] ${complete ? "text-green-500" : "text-red-500"}`}>
          <span className={`h-1.5 w-1.5 ${complete ? "bg-green-500" : "bg-red-500"}`} />
          {complete ? "Complete" : "Check output"}
        </span>
      </div>
      <div className="max-h-64 overflow-y-auto p-4">
        <div className="space-y-4">
          {commands.map((command) => (
            <div key={command.label}>
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
                <AppIcon icon={command.ok ? CheckmarkCircle02Icon : Alert02Icon} size={14} className={command.ok ? "text-green-500" : "text-red-500"} />
                {command.label}
              </div>
              <pre className="mt-2 overflow-x-auto border border-neutral-800 bg-neutral-900 px-3 py-2 font-mono text-[11px] leading-relaxed text-neutral-400">
                {command.output || "Done."}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
