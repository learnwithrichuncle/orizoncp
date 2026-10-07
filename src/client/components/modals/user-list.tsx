import { UserGroupIcon } from "@hugeicons/core-free-icons";
import type { ManagedUser } from "../../api";
import { formatTime } from "../../lib/format";
import { AppIcon } from "../ui/primitives";

function roleTone(role: string) {
  if (role === "owner") return "text-amber-300";
  return "text-ink-muted";
}

function initial(user: ManagedUser) {
  return (user.name || user.email).trim().charAt(0).toUpperCase();
}

export function UserList({ users, loading }: { users: ManagedUser[]; loading: boolean }) {
  if (loading && users.length === 0) {
    return (
      <div className="divide-y divide-white/10">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-[76px] animate-pulse bg-glass" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex min-h-52 items-center justify-center px-5 py-10 text-center">
        <div>
          <AppIcon icon={UserGroupIcon} size={22} className="mx-auto text-ink-dim" />
          <p className="mt-4 text-sm text-ink-dim">No users</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="hidden grid-cols-[minmax(220px,1.4fr)_100px_80px_100px_80px_150px] gap-4 border-b border-line bg-glass px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim md:grid sm:px-7 lg:px-8">
        <span>User</span>
        <span>Role</span>
        <span>Projects</span>
        <span>Services</span>
        <span>Keys</span>
        <span>Last login</span>
      </div>
      <div className="divide-y divide-white/10">
      {users.map((user) => (
        <article
          key={user.id}
          className="grid gap-4 px-5 py-4 md:grid-cols-[minmax(220px,1.4fr)_100px_80px_100px_80px_150px] md:items-center sm:px-7 lg:px-8"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center border border-line bg-glass text-sm text-ink">
              {initial(user)}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm text-zinc-100">{user.name || user.email}</h3>
              <p className="mt-0.5 truncate text-xs text-ink-dim">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 md:contents">
            <div>
              <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim md:hidden">Role</span>
              <span className={`inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] ${roleTone(user.role)}`}>
                <span className={`h-1.5 w-1.5 ${user.role === "owner" ? "bg-amber-400" : "bg-zinc-500"}`} />
                {user.role}
              </span>
            </div>
            <div>
              <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim md:hidden">Projects</span>
              <span className="text-sm text-ink-muted">{user.projectCount}</span>
            </div>
            <div>
              <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim md:hidden">Services</span>
              <div className="text-sm text-ink-muted">
                {user.activeServiceCount}
                <span className="text-ink-dim"> / {user.serviceCount}</span>
              </div>
            </div>
            <div>
              <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim md:hidden">API keys</span>
              <span className="text-sm text-ink-muted">{user.apiKeyCount}</span>
            </div>
            <div>
              <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim md:hidden">Last login</span>
              <span className="text-xs text-ink-dim">{formatTime(user.lastLoginAt)}</span>
            </div>
          </div>
        </article>
      ))}
      </div>
    </div>
  );
}
