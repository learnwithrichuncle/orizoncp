import type { FormEvent } from "react";
import { GitHubConfiguration } from "./github-configuration";
import { OnboardingStepForm } from "./onboarding-step-form";
import { OnboardingStepShell } from "./onboarding-step-shell";
import type { OnboardingForm } from "./onboarding-types";

export function OnboardingGitHubPage({
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
      activeStep={2}
      onImport={onImport}
      onStepChange={onStepChange}
    >
      <OnboardingStepForm
        title="Connect GitHub"
        badge="Optional"
        error={error}
        submitting={submitting}
        actionLabel="Continue to domains"
        onSubmit={onSubmit}
        onBack={onBack}
      >
        <GitHubConfiguration form={form} update={update} />
      </OnboardingStepForm>
    </OnboardingStepShell>
  );
}
