import { HugeiconsIcon } from "@hugeicons/react";
import { Globe02Icon } from "@hugeicons/core-free-icons";
import { ReactNode, forwardRef } from "react";
import type { Framework } from "../../api";

export function AppIcon({ icon, className = "", size = 20 }: { icon: unknown; className?: string; size?: number }) {
  return <HugeiconsIcon icon={icon as never} size={size} strokeWidth={2} className={className} />;
}

export function surfaceClass(extra = "") {
  return `rounded-lg border border-line bg-surface backdrop-blur-xl ${extra}`.trim();
}

export function shellButton(variant: "primary" | "secondary" | "ghost" | "danger" = "secondary") {
  const base =
    "inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 text-[13px] font-medium leading-none transition disabled:opacity-60";

  if (variant === "primary") {
    return `${base} bg-brand font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-brand-hover`;
  }
  if (variant === "danger") {
    return `${base} border border-bad/40 bg-bad/10 text-bad hover:bg-bad/20`;
  }
  if (variant === "ghost") {
    return `${base} text-ink-muted hover:bg-hover hover:text-ink`;
  }
  return `${base} border border-line bg-elevated text-ink-muted hover:border-line-strong hover:bg-hover hover:text-ink`;
}

export function chipClass(active: boolean) {
  const base = "inline-flex h-9 items-center gap-2 rounded-md px-2.5 text-[12.5px] font-medium transition";
  return active
    ? `${base} bg-active text-ink`
    : `${base} border border-line bg-elevated text-ink-muted hover:border-line-strong hover:bg-hover hover:text-ink`;
}

export function statusDotColor(status: string) {
  if (status === "active" || status === "running" || status === "deployed" || status === "success") return "bg-ok";
  if (status === "failed" || status === "crashed") return "bg-bad";
  if (status === "building" || status === "queued" || status === "degraded" || status === "restarting") return "bg-warn";
  if (status === "current") return "bg-brand-edge";
  return "bg-ink-dim";
}

export function statusClass(_status: string) {
  return "border border-line bg-hover text-ink-muted";
}

export function StatusPill({ status }: { status: string }) {
  return (
    <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-line bg-hover px-2.5 text-xs font-medium text-ink-muted">
      <span className={`h-1.5 w-1.5 rounded-full ${statusDotColor(status)}`} />
      {status}
    </span>
  );
}

export function deploymentCardClass(_status: string, selected: boolean) {
  if (selected) return "border-brand-edge bg-accent-soft text-ink";
  return "border-line bg-surface text-ink-muted hover:border-line-strong hover:bg-hover";
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="mb-2 block text-xs font-medium text-ink-muted">{children}</span>;
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
      className={`h-10 w-full rounded-md border border-line bg-elevated px-3 text-sm text-ink outline-none transition placeholder:text-ink-dim hover:border-line-strong focus:border-brand-edge focus:ring-2 focus:ring-accent-soft ${className}`}
    />
  );
});

export function SectionTitle({ icon, title, meta }: { icon: unknown; title: string; meta?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-8 w-8 place-items-center rounded-md border border-line bg-elevated text-ink-muted">
        <AppIcon icon={icon} size={16} />
      </div>
      <div>
        <h2 className="text-base font-semibold tracking-tight text-ink">{title}</h2>
        {meta ? <p className="text-xs text-ink-dim">{meta}</p> : null}
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
    <div className="inline-flex h-6 items-center gap-2 rounded-full border border-line bg-hover px-2.5 text-xs font-medium text-ink-muted">
      <div className="grid h-3.5 w-3.5 place-items-center overflow-hidden">
        <FrameworkMark framework={framework} size={14} fallback={<BrowserIconFallback size={14} />} />
      </div>
      {framework?.name ?? fallbackLabel}
    </div>
  );
}

export function InfoRow({ icon, label }: { icon: unknown | ((props: { className?: string; size?: number }) => ReactNode); label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-line bg-elevated px-3 py-2.5 text-[12.5px] text-ink-muted">
      {typeof icon === "function" ? icon({ size: 16 }) : <AppIcon icon={icon} size={16} />}
      <span className="truncate">{label}</span>
    </div>
  );
}
