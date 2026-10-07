import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import type { FormEvent } from "react";
import { AppIcon, shellButton } from "../../components/ui/primitives";
import { OnboardingStepShell } from "./onboarding-step-shell";
import type { OnboardingForm } from "./onboarding-types";
import { RuntimeConfigurationFields } from "./runtime-configuration-fields";

type OnboardingRuntimePageProps = {
  form: OnboardingForm;
  update: (patch: Partial<OnboardingForm>) => void;
  error: string;
  submitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  onImport: () => void;
};

export function OnboardingRuntimePage({
  form,
  update,
  error,
  submitting,
  onSubmit,
  onBack,
  onImport,
}: OnboardingRuntimePageProps) {
  return (
    <OnboardingStepShell
      activeStep={1}
      onImport={onImport}
      onStepChange={(step) => {
        if (step === 0) onBack();
      }}
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[560px]"
        aria-label="Configure runtime"
      >
        <div className="mb-9">
          <h2 className="font-hero text-2xl tracking-[-0.04em] text-white sm:text-3xl">
            Configure the runtime
          </h2>
        </div>

        <RuntimeConfigurationFields form={form} update={update} />

        {error ? (
          <div
            role="alert"
            className="mt-6 border-l-2 border-white bg-white/10 px-4 py-3 text-sm text-white"
          >
            {error}
          </div>
        ) : null}

        <div className="mt-7 flex items-center gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={onBack}
            className={`${shellButton("secondary")} disabled:opacity-50`}
            aria-label="Back to owner account"
          >
            <AppIcon icon={ArrowLeft01Icon} size={16} />
            <span>Back</span>
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`${shellButton("primary")} flex-1 disabled:cursor-wait`}
          >
            Save runtime & continue
          </button>
        </div>
      </form>
    </OnboardingStepShell>
  );
}
