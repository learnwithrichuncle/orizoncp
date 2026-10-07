import type { FormEvent } from "react";
import { DomainConfiguration } from "./domain-configuration";
import { OnboardingStepForm } from "./onboarding-step-form";
import { OnboardingStepShell } from "./onboarding-step-shell";
import type { OnboardingForm } from "./onboarding-types";

export function OnboardingDomainPage({
  form,
  update,
  error,
  submitting,
  onSubmit,
  onBack,
  onImport,
  onStepChange,
}: {
  form: OnboardingForm;
  update: (patch: Partial<OnboardingForm>) => void;
  error: string;
  submitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  onImport: () => void;
  onStepChange: (step: number) => void;
}) {
  return (
    <OnboardingStepShell
      activeStep={3}
      onImport={onImport}
      onStepChange={onStepChange}
    >
      <OnboardingStepForm
        title="Set up your domains"
        badge="Optional"
        error={error}
        submitting={submitting}
        actionLabel="Continue to backups"
        onSubmit={onSubmit}
        onBack={onBack}
      >
        <DomainConfiguration form={form} update={update} />
      </OnboardingStepForm>
    </OnboardingStepShell>
  );
}
