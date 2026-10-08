import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import type { FormEvent, ReactNode } from "react";
import { AppIcon, shellButton } from "../../components/ui/primitives";

export function OnboardingStepForm({
  title,
  badge,
  children,
  error,
  submitting,
  actionLabel,
  onSubmit,
  onBack,
}: {
  title: string;
  badge: string;
  children: ReactNode;
  error: string;
  submitting: boolean;
  actionLabel: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack?: () => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-[560px]"
      aria-label={title}
    >
      <div className="mb-9 flex items-start justify-between gap-5">
        <div>
          <h2 className="font-sans text-2xl tracking-[-0.04em] text-white sm:text-3xl">
            {title}
          </h2>
        </div>
        <span className="mt-1 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
          {badge}
        </span>
      </div>

      {children}

      {error ? (
        <div
          role="alert"
          className="mt-6 border-l-2 border-white bg-white/10 px-4 py-3 text-sm text-white"
        >
          {error}
        </div>
      ) : null}

      <div className="mt-7 flex items-center gap-3">
        {onBack ? (
          <button
            type="button"
            disabled={submitting}
            onClick={onBack}
            className={`${shellButton("secondary")} disabled:opacity-50`}
            aria-label="Previous onboarding step"
          >
            <AppIcon icon={ArrowLeft01Icon} size={16} />
            <span>Back</span>
          </button>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className={`${shellButton("primary")} flex-1 disabled:cursor-wait`}
        >
          {submitting ? "Saving…" : actionLabel}
        </button>
      </div>
    </form>
  );
}