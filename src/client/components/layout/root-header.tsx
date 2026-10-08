import { Link, useLocation } from "@tanstack/react-router";

export function RootHeader() {
  const location = useLocation();
  const path = location.pathname;

  const crumb =
    path === "/"
      ? "Overview"
      : path.startsWith("/projects") || path.startsWith("/project")
        ? "Projects"
        : path.startsWith("/settings")
          ? "Settings"
          : "orizonCP";

  return (
    <header className="flex h-topbar flex-none items-center gap-4 bg-sidebar px-6">
      <div className="flex items-center gap-2 font-mono text-[12px] tracking-wide text-[var(--color-text-secondary)]">
        <Link to="/" className="transition-colors hover:text-white">
          {crumb}
        </Link>
      </div>
    </header>
  );
}