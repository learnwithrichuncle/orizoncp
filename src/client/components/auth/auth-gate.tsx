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
import { Spinner } from "../ui/spinner";
import { AuthStatusContext } from "./auth-context";

function AuthLoading() {
  return (
    <main className="grid min-h-dvh place-items-center overflow-hidden bg-neutral-950 text-neutral-100">
      <div role="status" aria-label="Checking access">
        <span className="sr-only">Checking access</span>
        <Spinner size={32} />
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
