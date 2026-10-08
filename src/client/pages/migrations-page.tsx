import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { RailwayLogo } from "../components/icons/railway-logo";
import { VercelLogo } from "../components/icons/vercel-logo";
import { RailwayImportModal } from "../features/integrations/railway-import-modal";
import { VercelImportModal } from "../features/integrations/vercel-import-modal";
import { usePageTitle } from "../lib/page-title";

export function MigrationsPage() {
  usePageTitle("Migrate");
  const navigate = useNavigate();
  const [active, setActive] = useState<null | "railway" | "vercel">(null);

  function goToProjects() {
    void navigate({ to: "/projects" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Migrate to Orizon CP
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Bring your projects over from Vercel or Railway.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setActive("vercel")}
          className="flex flex-col items-start gap-4 rounded-lg border border-[var(--cf-border)] bg-white/5 p-5 text-left transition-colors hover:bg-white/10"
        >
          <VercelLogo className="h-6 w-6 text-white" />
          <div>
            <div className="text-sm font-medium text-white">
              Migrate from Vercel
            </div>
            <div className="mt-1 text-xs text-[var(--color-text-secondary)]">
              Import Vercel projects, domains, and environment variables.
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActive("railway")}
          className="flex flex-col items-start gap-4 rounded-lg border border-[var(--cf-border)] bg-white/5 p-5 text-left transition-colors hover:bg-white/10"
        >
          <RailwayLogo className="h-6 w-6 text-white" />
          <div>
            <div className="text-sm font-medium text-white">
              Migrate from Railway
            </div>
            <div className="mt-1 text-xs text-[var(--color-text-secondary)]">
              Import Railway projects, services, and variables.
            </div>
          </div>
        </button>
      </div>

      <VercelImportModal
        open={active === "vercel"}
        onClose={() => setActive(null)}
        onBackToProviders={() => setActive(null)}
        onSuccess={goToProjects}
      />
      <RailwayImportModal
        open={active === "railway"}
        onClose={() => setActive(null)}
        onBackToProviders={() => setActive(null)}
        onSuccess={goToProjects}
      />
    </div>
  );
}