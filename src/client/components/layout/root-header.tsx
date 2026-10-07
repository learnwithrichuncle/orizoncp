import { Link } from "@tanstack/react-router";

export function RootHeader() {
  return (
    <header className="h-topbar border-b border-line-subtle flex items-center px-6">
      <div className="text-sm font-medium text-ink-muted">
        <Link to="/" className="hover:text-ink">
          Projects
        </Link>
      </div>
    </header>
  );
}
