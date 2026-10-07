import { LayoutGridIcon, SettingsIcon, SearchIcon } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

function NavItem({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: typeof LayoutGridIcon;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      title={label}
      className={`grid h-11 w-11 place-items-center rounded-[10px] transition-colors duration-150 ${
        active
          ? "bg-accent-soft text-accent"
          : "text-muted hover:bg-hover hover:text-ink"
      }`}
    >
      <Icon size={20} strokeWidth={2} />
    </Link>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="flex h-dvh w-sidebar flex-col items-center border-r border-line bg-sidebar/60 py-4 backdrop-blur-xl">
      <Link
        to="/"
        aria-label="orizonCP home"
        className="grid h-10 w-10 place-items-center rounded-full border border-line bg-glass text-ink"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" />
          <g clipPath="url(#railLogo)">
            <circle cx="12" cy="13.5" r="4" fill="currentColor" />
            <rect x="2" y="13.4" width="20" height="9" fill="var(--color-base)" />
            <line x1="3" y1="13.4" x2="21" y2="13.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </g>
          <defs>
            <clipPath id="railLogo"><circle cx="12" cy="12" r="9" /></clipPath>
          </defs>
        </svg>
      </Link>

      <nav className="mt-8 flex flex-1 flex-col items-center gap-1.5">
        <NavItem
          to="/"
          label="Projects"
          icon={LayoutGridIcon}
          active={path === "/" || path.startsWith("/project")}
        />
        <NavItem
          to="/settings"
          label="Settings"
          icon={SettingsIcon}
          active={path.startsWith("/settings")}
        />
      </nav>

      <button
        type="button"
        aria-label="Search"
        title="Search"
        className="grid h-11 w-11 place-items-center rounded-[10px] text-muted transition-colors duration-150 hover:bg-hover hover:text-ink"
      >
        <SearchIcon size={20} strokeWidth={2} />
      </button>
    </aside>
  );
}