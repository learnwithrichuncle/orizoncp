import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import { api } from "../api";
import { AppIcon } from "../components/ui/primitives";
import { OnboardingBrandHeader } from "../features/onboarding/onboarding-brand-header";
import { usePageTitle } from "../lib/page-title";

export function OnboardingSuccessPage() {
  const [dashboardUrl, setDashboardUrl] = useState("/");
  const [loading, setLoading] = useState(true);
  usePageTitle("Setup Complete");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [auth, domains] = await Promise.all([
          api.authStatus(),
          api.systemSettings(),
        ]);
        if (cancelled) return;

        const hostname = domains.settings.controlPlaneHostname ?? "";
        if (hostname && domains.controlPlaneDnsStatus === "active") {
          setDashboardUrl(`https://${hostname}`);
        } else if (auth.runtimeConfig?.publicUrl) {
          setDashboardUrl(auth.runtimeConfig.publicUrl);
        }
      } catch {
        setDashboardUrl("/");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-neutral-950 px-6 py-12 text-neutral-400">
      <div className="w-full max-w-lg">
        <div className="mb-12">
          <OnboardingBrandHeader />
        </div>

        <h1 className="mt-6 font-sans text-4xl tracking-[-0.045em] text-neutral-100">
          orizonCP is ready.
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-400">
          Your control plane is configured and ready for its first deployment.
        </p>

        <button
          type="button"
          disabled={loading}
          onClick={() => window.location.assign(dashboardUrl)}
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-sm bg-blue-600 px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-blue-500 disabled:opacity-60"
        >
          Open dashboard
          <AppIcon icon={ArrowRight02Icon} size={16} />
        </button>
      </div>
    </main>
  );
}