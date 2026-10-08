import {
  Refresh03Icon
} from "@hugeicons/core-free-icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import type { AuthUser } from "../../api";
import { useAuthStatus } from "../../components/auth/auth-context";
import { SignOutButton } from "../../components/auth/sign-out-button";
import { AppIcon } from "../../components/ui/primitives";
import { usePageTitle } from "../../lib/page-title";
import { SettingsPanelContent } from "./settings-panel-content";
import {
  settingsPageForSlug,
  settingsPages,
  type SettingsPageSlug
} from "./settings-pages";

function userInitials(user: AuthUser | null) {
  const source = user?.name || user?.email || "A";
  return source
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function SettingsPage({ requestedPage }: { requestedPage: SettingsPageSlug }) {
  const navigate = useNavigate();
  const authStatus = useAuthStatus();
  const currentUser = authStatus?.user ?? null;
  const requestedDefinition = settingsPageForSlug(requestedPage);
  const owner = currentUser?.role === "owner";
  const availablePages = useMemo(
    () => settingsPages.filter((page) => owner || !page.ownerOnly),
    [owner]
  );
  const activePage =
    !owner && requestedDefinition.ownerOnly
      ? settingsPageForSlug("ai")
      : requestedDefinition;

  usePageTitle([activePage.label, "Settings"]);

  useEffect(() => {
    if (owner || !requestedDefinition.ownerOnly) return;
    void navigate({
      to: "/settings/$settingsPage",
      params: { settingsPage: "ai" },
      replace: true
    });
  }, [navigate, owner, requestedDefinition.ownerOnly]);

  return (
    <div className="min-w-0">
      <header className="flex flex-wrap items-center justify-between gap-4 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {activePage.label}
        </h1>

        <div className="flex items-center gap-3">
          {owner ? (
            <Link
              to="/onboarding"
              className="inline-flex h-8 items-center gap-2 rounded-lg border border-neutral-800 px-3 text-xs text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <AppIcon icon={Refresh03Icon} size={16} />
              Restart onboarding
            </Link>
          ) : null}

          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-xs text-white">
              {userInitials(currentUser)}
            </span>
            <span className="hidden text-xs text-neutral-400 sm:block">
              {currentUser?.name || "orizonCP user"}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <SettingsPanelContent activeTab={activePage.tab} owner={owner} />
    </div>
  );
}
