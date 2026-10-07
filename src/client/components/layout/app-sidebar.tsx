import { LayoutGridIcon, SettingsIcon, SearchIcon } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-1.5 px-2.5 pt-5 text-[11.5px] font-medium text-ink-dim">
      {children}
    </div>
  );
}

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
      className={`flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium transition-colors duration-150 ${
        active ? "bg-active text-ink" : "text-ink-muted hover:bg-hover hover:text-ink"
      }`}
    >
      <Icon size={16} strokeWidth={1.5} className={active ? "text-ink" : "text-ink-dim"} />
      {label}
    </Link>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="flex h-dvh w-sidebar flex-col border-r border-sidebar-edge bg-sidebar">
      <a className="brand flex items-center gap-2 px-4 py-4" href="/" aria-label="Orizon home">
        <span className="logo-word text-[15px] font-bold tracking-tight text-ink flex items-center gap-0.5">
          <svg className="logo-o h-5 w-5 text-ink" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <defs>
              <clipPath id="logoRing"><circle cx="12" cy="12" r="9"></circle></clipPath>
            </defs>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4"></circle>
            <g clipPath="url(#logoRing)">
              <circle cx="12" cy="13.5" r="4" fill="currentColor"></circle>
              <rect x="2" y="13.4" width="20" height="9" fill="var(--color-sidebar)"></rect>
              <line x1="3" y1="13.4" x2="21" y2="13.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"></line>
            </g>
          </svg>
          <span>rizon</span>
        </span>
        <span className="rounded border border-line bg-elevated px-1 py-0.5 text-[10px] text-ink-dim">
          v0.1
        </span>
      </a>

      <div className="px-3">
        <div className="flex h-9 items-center gap-2 rounded-md border border-line bg-elevated px-2.5">
          <SearchIcon size={14} strokeWidth={1.5} className="text-ink-dim" />
          <span className="text-[12.5px] text-ink-dim">Search</span>
          <kbd className="ml-auto flex h-5 items-center rounded border border-line px-1.5 text-[10px] text-ink-dim">
            Ctrl K
          </kbd>
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        <SectionLabel>Workspace</SectionLabel>
        <NavItem
          to="/"
          label="Projects"
          icon={LayoutGridIcon}
          active={path === "/" || path.startsWith("/project")}
        />

        <SectionLabel>Infrastructure</SectionLabel>

        <SectionLabel>Manage</SectionLabel>
        <NavItem
          to="/settings"
          label="Settings"
          icon={SettingsIcon}
          active={path.startsWith("/settings")}
        />
      </nav>
    </aside>
  );
}