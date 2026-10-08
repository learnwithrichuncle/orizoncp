import { LoginForm } from "../components/auth/login-form";
import { OnboardingBrandHeader } from "../features/onboarding/onboarding-brand-header";
import { usePageTitle } from "../lib/page-title";

export function LoginPage() {
  usePageTitle("Login");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-neutral-950 px-6 py-12 text-neutral-400">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex justify-center">
          <OnboardingBrandHeader />
        </div>
        <LoginForm />
      </div>
    </main>
  );
}