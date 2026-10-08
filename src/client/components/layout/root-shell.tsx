import { Outlet, useLocation } from "@tanstack/react-router";
import { AuthGate } from "../auth/auth-gate";
import { AppSidebar } from "./app-sidebar";
import { RootHeader } from "./root-header";

export function RootShell() {
  const location = useLocation();
  const path = location.pathname;
  const standalone =
    path === "/login" || path === "/onboarding" || path === "/onboarding/success";

  if (standalone) {
    return (
      <div className="min-h-dvh bg-neutral-950 text-neutral-400">
        <AuthGate>
          <Outlet />
        </AuthGate>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-400 md:pl-[220px]">
      <AppSidebar />
      <div className="flex min-h-dvh flex-col bg-neutral-950">
        <RootHeader />
        <main className="min-w-0 flex-1 overflow-y-auto rounded-tl-2xl bg-neutral-900">
          <div className="mx-auto h-full w-full max-w-[1400px] px-8 py-8">
            <AuthGate>
              <Outlet />
            </AuthGate>
          </div>
        </main>
      </div>
    </div>
  );
}