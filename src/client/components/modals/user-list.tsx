import { UserGroupIcon } from "@hugeicons/core-free-icons";
import type { ManagedUser } from "../../api";
import { formatTime } from "../../lib/format";
import { AppIcon } from "../ui/primitives";

const GRID = "md:grid-cols-[minmax(200px,1.4fr)_130px_70px_90px_60px_140px_90px]";

function initial(user: ManagedUser) {
  return (user.name || user.email).trim().charAt(0).toUpperCase();
}

export function UserList({
  users,
  loading,
  busy,
  onChangeRole,
  onDelete
}: {
  users: ManagedUser[];
  loading: boolean;
  busy: string;
  onChangeRole: (userId: string, role: "owner" | "user") => void;
  onDelete: (user: ManagedUser) => void;
}) {
  if (loading && users.length === 0) {
    return (
      <div className="divide-y divide-white/10">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-[76px] animate-pulse bg-neutral-900" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex min-h-52 items-center justify-center px-5 py-10 text-center">
        <div>
          <AppIcon icon={UserGroupIcon} size={22} className="mx-auto text-neutral-500" />
          <p className="mt-4 text-sm text-neutral-500">No users</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={`hidden ${GRID} gap-4 border-b border-neutral-800 bg-neutral-900 px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 md:grid sm:px-7 lg:px-8`}>
        <span>User</span>
        <span>Role</span>
        <span>Projects</span>
        <span>Services</span>
        <span>Keys</span>
        <span>Last login</span>
        <span>Actions</span>
      </div>
      <div className="divide-y divide-white/10">
        {users.map((user) => (
          <article
            key={user.id}
            className={`grid gap-4 px-5 py-4 ${GRID} md:items-center sm:px-7 lg:px-8`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center border border-neutral-800 bg-neutral-900 text-sm text-neutral-100">
                {initial(user)}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm text-neutral-100">{user.name || user.email}</h3>
                <p className="mt-0.5 truncate text-xs text-neutral-500">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 md:contents">
              <div>
                <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 md:hidden">
                  Role
                </span>
                <select
                  value={user.role}
                  disabled={busy === user.id}
                  onChange={(event) =>
                    onChangeRole(user.id, event.target.value as "owner" | "user")
                  }
                  className="h-8 rounded-md border border-neutral-800 bg-neutral-900 px-2 text-xs text-neutral-200 outline-none disabled:opacity-50"
                >
                  <option value="owner">owner</option>
                  <option value="user">user</option>
                </select>
              </div>
              <div>
                <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 md:hidden">
                  Projects
                </span>
                <span className="text-sm text-neutral-400">{user.projectCount}</span>
              </div>
              <div>
                <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 md:hidden">
                  Services
                </span>
                <div className="text-sm text-neutral-400">
                  {user.activeServiceCount}
                  <span className="text-neutral-500"> / {user.serviceCount}</span>
                </div>
              </div>
              <div>
                <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 md:hidden">
                  API keys
                </span>
                <span className="text-sm text-neutral-400">{user.apiKeyCount}</span>
              </div>
              <div>
                <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 md:hidden">
                  Last login
                </span>
                <span className="text-xs text-neutral-500">{formatTime(user.lastLoginAt)}</span>
              </div>
              <div>
                <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 md:hidden">
                  Actions
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(user)}
                  disabled={busy === user.id}
                  className="inline-flex h-8 items-center justify-center rounded-md border border-red-500/40 px-2.5 text-xs text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}