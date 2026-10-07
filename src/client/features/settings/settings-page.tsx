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
      <header className="border-b border-line px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="font-hero text-2xl tracking-[-0.04em] text-ink">
              {activePage.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {owner ? (
              <Link
                to="/onboarding"
                className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-line px-3 text-xs text-muted transition hover:border-line-strong hover:text-ink"
              >
                <AppIcon icon={Refresh03Icon} size={16} />
                Restart onboarding
              </Link>
            ) : null}

            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs text-white">
                {userInitials(currentUser)}
              </span>
              <span className="hidden text-xs text-muted sm:block">
                {currentUser?.name || "orizonCP user"}
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>

        <nav
          aria-label="Settings"
          className="mt-4 flex gap-1 overflow-x-auto pb-0.5"
        >
          {availablePages.map((page) => {
            const active = activePage.slug === page.slug;
            return (
              <Link
                key={page.slug}
                to="/settings/$settingsPage"
                params={{ settingsPage: page.slug }}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "flex h-9 shrink-0 items-center gap-2 rounded-[10px] bg-accent-soft px-3 text-sm text-accent"
                    : "flex h-9 shrink-0 items-center gap-2 rounded-[10px] px-3 text-sm text-muted transition hover:bg-hover hover:text-ink"
                }
              >
                <AppIcon icon={page.icon} size={16} />
                {page.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="mx-auto w-full max-w-[1400px] px-8 py-8">
        <SettingsPanelContent activeTab={activePage.tab} owner={owner} />
      </div>
    </div>
  );
}
