import { HugeiconsIcon } from "@hugeicons/react";
import { Globe02Icon } from "@hugeicons/core-free-icons";
import { ReactNode, forwardRef } from "react";
import type { Framework } from "../../api";

export function AppIcon({ icon, className = "", size = 20 }: { icon: unknown; className?: string; size?: number }) {
  return <HugeiconsIcon icon={icon as never} size={size} strokeWidth={2} className={className} />;
}

export function surfaceClass(extra = "") {
  return `rounded-lg border border-neutral-800 bg-neutral-900 backdrop-blur-xl ${extra}`.trim();
}

export function shellButton(variant: "primary" | "secondary" | "ghost" | "danger" = "secondary") {
  const base =
    "inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 text-[13px] font-medium leading-none transition disabled:opacity-60";

  if (variant === "primary") {
    return `${base} bg-blue-600 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-blue-500`;
  }
  if (variant === "danger") {
    return `${base} border border-red-500/40 bg-red-500/10 text-red-500 hover:bg-red-500/20`;
  }
  if (variant === "ghost") {
    return `${base} text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100`;
  }
  return `${base} border border-neutral-800 bg-neutral-800 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800 hover:text-neutral-100`;
}

export function chipClass(active: boolean) {
  const base = "inline-flex h-9 items-center gap-2 rounded-md px-2.5 text-[12.5px] font-medium transition";
  return active
    ? `${base} bg-neutral-700 text-neutral-100`
    : `${base} border border-neutral-800 bg-neutral-800 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800 hover:text-neutral-100`;
}

export function statusDotColor(status: string) {
  if (status === "active" || status === "running" || status === "deployed" || status === "success") return "bg-green-500";
  if (status === "failed" || status === "crashed") return "bg-red-500";
  if (status === "building" || status === "queued" || status === "degraded" || status === "restarting") return "bg-amber-500";
  if (status === "current") return "bg-blue-600";
  return "bg-ink-dim";
}

export function statusClass(_status: string) {
  return "border border-neutral-800 bg-neutral-800 text-neutral-400";
}

export function StatusPill({ status }: { status: string }) {
  return (
    <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-800 px-2.5 text-xs font-medium text-neutral-400">
      <span className={`h-1.5 w-1.5 rounded-full ${statusDotColor(status)}`} />
      {status}
    </span>
  );
}

export function deploymentCardClass(_status: string, selected: boolean) {
  if (selected) return "border-blue-600 bg-blue-950 text-neutral-100";
  return "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800";
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="mb-2 block text-xs font-medium text-neutral-400">{children}</span>;
}

export const FormInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    variant?: "default" | "monochrome";
  }
>(({ variant: _variant = "default", className = "", ...props }, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className={`h-10 w-full rounded-md border border-neutral-800 bg-neutral-800 px-3 text-sm text-neutral-100 outline-none transition placeholder:text-neutral-500 hover:border-neutral-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-900 ${className}`}
    />
  );
});

export function SectionTitle({ icon, title, meta }: { icon: unknown; title: string; meta?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-8 w-8 place-items-center rounded-md border border-neutral-800 bg-neutral-800 text-neutral-400">
        <AppIcon icon={icon} size={16} />
      </div>
      <div>
        <h2 className="text-base font-semibold tracking-tight text-neutral-100">{title}</h2>
        {meta ? <p className="text-xs text-neutral-500">{meta}</p> : null}
      </div>
    </div>
  );
}

export function BrowserIconFallback({ className = "", size = 17 }: { className?: string; size?: number }) {
  return <AppIcon icon={Globe02Icon} size={size} className={className} />;
}

export function FrameworkMark({
  framework,
  fallback,
  size = 18
}: {
  framework: Framework | null;
  fallback?: ReactNode;
  size?: number;
}) {
  if (framework?.logoUrl) {
    return (
      <img
        src={framework.logoUrl}
        alt={framework.name}
        className="shrink-0 object-contain"
        loading="lazy"
        style={{ height: size, width: size }}
      />
    );
  }

  return <>{fallback ?? <BrowserIconFallback size={size} />}</>;
}

export function FrameworkBadge({ framework, fallbackLabel = "Service" }: { framework: Framework | null; fallbackLabel?: string }) {
  return (
    <div className="inline-flex h-6 items-center gap-2 rounded-full border border-neutral-800 bg-neutral-800 px-2.5 text-xs font-medium text-neutral-400">
      <div className="grid h-3.5 w-3.5 place-items-center overflow-hidden">
        <FrameworkMark framework={framework} size={14} fallback={<BrowserIconFallback size={14} />} />
      </div>
      {framework?.name ?? fallbackLabel}
    </div>
  );
}

export function InfoRow({ icon, label }: { icon: unknown | ((props: { className?: string; size?: number }) => ReactNode); label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-neutral-800 bg-neutral-800 px-3 py-2.5 text-[12.5px] text-neutral-400">
      {typeof icon === "function" ? icon({ size: 16 }) : <AppIcon icon={icon} size={16} />}
      <span className="truncate">{label}</span>
    </div>
  );
}
