import type { ReactNode } from "react";
import { OnboardingBrandHeader } from "./onboarding-brand-header";

const setupSteps = [
  "Owner account",
  "Runtime",
  "GitHub",
  "Root domain",
];

export function OnboardingStepShell({
  activeStep,
  children,
  steps = setupSteps,
}: {
  activeStep: number;
  children: ReactNode;
  onImport?: () => void;
  onStepChange?: (step: number) => void;
  steps?: string[];
}) {
  return (
    <main className="min-h-dvh bg-neutral-950 text-neutral-400">
      <div className="flex min-h-dvh items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <OnboardingBrandHeader />
            <div className="mt-2 text-[11px] text-neutral-500">
              Step {activeStep + 1} of {steps.length}
            </div>
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}