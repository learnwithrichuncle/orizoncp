import type { FormEvent } from "react";
import type { OnboardingForm } from "./onboarding-types";
import { OnboardingStepShell } from "./onboarding-step-shell";
import { OwnerStep } from "./owner-step";
import { shellButton } from "../../components/ui/primitives";

type OnboardingOwnerPageProps = {
  form: OnboardingForm;
  update: (patch: Partial<OnboardingForm>) => void;
  error: string;
  submitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onImport: () => void;
};

export function OnboardingOwnerPage({
  form,
  update,
  error,
  submitting,
  onSubmit,
  onImport,
}: OnboardingOwnerPageProps) {
  return (
    <OnboardingStepShell activeStep={0} onImport={onImport}>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[520px]"
        aria-label="Create owner account"
      >
        <div className="mb-9 flex items-start justify-between gap-5">
          <div>
            <h2 className="font-hero text-2xl tracking-[-0.04em] text-white sm:text-3xl">
              Create the owner account
            </h2>
          </div>
          <span className="mt-1 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            Required
          </span>
        </div>

        <OwnerStep form={form} update={update} />

        {error ? (
          <div
            role="alert"
            className="mt-5 border-l-2 border-white bg-white/10 px-4 py-3 text-sm text-white"
          >
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className={`${shellButton("primary")} mt-6 w-full disabled:cursor-wait`}
        >
          {submitting ? "Saving…" : "Save & continue"}
        </button>
      </form>
    </OnboardingStepShell>
  );
}
