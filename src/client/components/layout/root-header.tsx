import { SearchIcon } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

export function RootHeader() {
  const location = useLocation();
  const path = location.pathname;

  const crumb =
    path === "/" || path.startsWith("/project")
      ? "Projects"
      : path.startsWith("/settings")
        ? "Settings"
        : "orizonCP";

  return (
    <header className="flex h-topbar flex-none items-center gap-4 border-b border-line bg-base/60 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-2 font-mono text-[12px] tracking-wide text-muted">
        <Link to="/" className="transition-colors hover:text-ink">
          {crumb}
        </Link>
      </div>

      <div className="ml-auto flex h-9 w-72 items-center gap-2 rounded-[10px] border border-line bg-glass px-3 text-muted">
        <SearchIcon size={16} strokeWidth={2} />
        <span className="text-[13px]">Search</span>
        <kbd className="ml-auto flex h-5 items-center rounded border border-line px-1.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </div>
    </header>
  );
}