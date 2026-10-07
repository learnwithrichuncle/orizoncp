import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  ReactNode,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, type AuthStatus } from "../../api";
import { BrandMark } from "../ui/brand-mark";
import { AuthStatusContext } from "./auth-context";

function AuthLoading() {
  return (
    <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden bg-base text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:72px_72px]"
      />
      <div
        role="status"
        aria-label="Checking access"
        className="relative z-10 flex items-center gap-3 rounded-[14px] border border-line bg-glass px-5 py-4 backdrop-blur-xl"
      >
        <span className="sr-only">Checking access</span>
        <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-line bg-hover text-accent">
          <BrandMark />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Checking access
        </span>
      </div>
    </main>
  );
}

export function AuthGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStatus = useCallback(async () => {
    try {
      const nextStatus = await api.authStatus();
      startTransition(() => {
        setStatus(nextStatus);
        setLoading(false);
      });
    } catch {
      startTransition(() => {
        setStatus(null);
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    void loadStatus();
    window.addEventListener("orizoncp-auth-changed", loadStatus);
    return () =>
      window.removeEventListener("orizoncp-auth-changed", loadStatus);
  }, [loadStatus]);

  const redirectTo = useMemo(() => {
    if (!status) return "";
    const pathname = location.pathname;
    if (!status.setupComplete && pathname !== "/onboarding")
      return "/onboarding";
    if (status.setupComplete && !status.authenticated && pathname !== "/login")
      return "/login";
    if (status.setupComplete && status.authenticated && pathname === "/login")
      return "/";
    return "";
  }, [location.pathname, status]);

  useEffect(() => {
    if (!redirectTo) return;
    if (redirectTo === "/onboarding") {
      void navigate({ to: "/onboarding" });
    } else if (redirectTo === "/login") {
      void navigate({ to: "/login" });
    } else {
      void navigate({ to: "/" });
    }
  }, [navigate, redirectTo]);

  if (loading || redirectTo) return <AuthLoading />;

  return (
    <AuthStatusContext.Provider value={status}>
      {children}
    </AuthStatusContext.Provider>
  );
}
