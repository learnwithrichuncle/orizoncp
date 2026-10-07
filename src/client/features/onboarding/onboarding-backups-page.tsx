import type { FormEvent } from "react";
import { BackupConfiguration } from "./backup-configuration";
import { OnboardingStepForm } from "./onboarding-step-form";
import { OnboardingStepShell } from "./onboarding-step-shell";
import type { OnboardingForm } from "./onboarding-types";

export function OnboardingBackupsPage({
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
      activeStep={4}
      onImport={onImport}
      onStepChange={onStepChange}
    >
      <OnboardingStepForm
        title="Plan your backups"
        badge="Final step"
        error={error}
        submitting={submitting}
        actionLabel="Save setup"
        onSubmit={onSubmit}
        onBack={onBack}
      >
        <BackupConfiguration form={form} update={update} />
      </OnboardingStepForm>
    </OnboardingStepShell>
  );
}
