import type { FormEvent, ReactNode } from "react";
import { BackupConfiguration } from "./backup-configuration";
import { DomainConfiguration } from "./domain-configuration";
import { GitHubConfiguration } from "./github-configuration";
import { OnboardingStepForm } from "./onboarding-step-form";
import { OnboardingStepShell } from "./onboarding-step-shell";
import type { OnboardingForm } from "./onboarding-types";
import { RuntimeConfigurationFields } from "./runtime-configuration-fields";

export type RestartOnboardingStep =
  | "runtime"
  | "github"
  | "root-domain"
  | "backups";

const restartSteps = ["Runtime", "GitHub", "Root domain", "Backups"];

const stepContent: Record<
  RestartOnboardingStep,
  {
    title: string;
    badge: string;
  }
> = {
  runtime: {
    title: "Review the runtime",
    badge: "Host settings",
  },
  github: {
    title: "Review GitHub",
    badge: "Optional",
  },
  "root-domain": {
    title: "Review your domains",
    badge: "Optional",
  },
  backups: {
    title: "Review your backups",
    badge: "Final step",
  },
};

export function OnboardingRestartPage({
  activeStep,
  stepIndex,
  form,
  update,
  error,
  submitting,
  onSubmit,
  onStepChange,
}: {
  activeStep: RestartOnboardingStep;
  stepIndex: number;
  form: OnboardingForm;
  update: (patch: Partial<OnboardingForm>) => void;
  error: string;
  submitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onStepChange: (step: number) => void;
}) {
  const metadata = stepContent[activeStep];
  const finalStep = stepIndex === restartSteps.length - 1;
  let fields: ReactNode;

  if (activeStep === "runtime") {
    fields = <RuntimeConfigurationFields form={form} update={update} />;
  } else if (activeStep === "github") {
    fields = <GitHubConfiguration form={form} update={update} />;
  } else if (activeStep === "root-domain") {
    fields = <DomainConfiguration form={form} update={update} />;
  } else {
    fields = <BackupConfiguration form={form} update={update} />;
  }

  return (
    <OnboardingStepShell
      activeStep={stepIndex}
      steps={restartSteps}
      onStepChange={onStepChange}
    >
      <OnboardingStepForm
        title={metadata.title}
        badge={metadata.badge}
        error={error}
        submitting={submitting}
        actionLabel={
          finalStep
            ? "Save setup"
            : `Continue to ${restartSteps[stepIndex + 1].toLowerCase()}`
        }
        onSubmit={onSubmit}
        onBack={
          stepIndex > 0 ? () => onStepChange(stepIndex - 1) : undefined
        }
      >
        {fields}
      </OnboardingStepForm>
    </OnboardingStepShell>
  );
}