import { Add01Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import { api, type ManagedUser } from "../../api";
import { SettingsDialog } from "../../features/settings/settings-dialog";
import { ConfirmationDialog } from "./confirmation-dialog";
import { AppIcon } from "../ui/primitives";
import { UserCreateForm } from "./user-create-form";
import { UserList } from "./user-list";

function sortUsers(users: ManagedUser[]) {
  const list = Array.isArray(users) ? users : [];
  return [...list].sort((a, b) => {
    if (a.role === "owner" && b.role !== "owner") return -1;
    if (b.role === "owner" && a.role !== "owner") return 1;
    return String(a.createdAt ?? "").localeCompare(String(b.createdAt ?? ""));
  });
}

export function UsersSettingsPanel({ open }: { open: boolean }) {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ManagedUser | null>(null);
  const [error, setError] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const result = await api.systemUsers();
      setUsers(sortUsers(result.users));
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    void loadUsers();
  }, [open]);

  async function createUser(input: { email: string; password: string }) {
    setCreating(true);
    setError("");
    try {
      const result = await api.createSystemUser(input);
      setUsers((current) => sortUsers([...current, result.user]));
      setCreateOpen(false);
    } catch (issue) {
      throw new Error(issue instanceof Error ? issue.message : "Could not create user");
    } finally {
      setCreating(false);
    }
  }

  async function changeRole(userId: string, role: "owner" | "user") {
    setBusy(userId);
    setError("");
    try {
      const result = await api.updateSystemUser(userId, { role });
      setUsers((current) =>
        sortUsers(current.map((user) => (user.id === userId ? result.user : user)))
      );
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not update user");
    } finally {
      setBusy("");
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const userId = pendingDelete.id;
    setBusy(userId);
    setError("");
    try {
      await api.deleteSystemUser(userId);
      setUsers((current) => current.filter((user) => user.id !== userId));
      setPendingDelete(null);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not delete user");
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="mx-auto max-w-5xl overflow-hidden border border-neutral-800 bg-neutral-950">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 px-5 py-5 sm:px-7 lg:px-8">
        <div>
          <h2 className="text-xl tracking-[-0.03em] text-white">Users</h2>
          <p className="mt-1.5 text-sm text-neutral-500">
            {loading ? "Loading users…" : `${users.length} ${users.length === 1 ? "user" : "users"}`}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 w-fit items-center justify-center gap-2 bg-blue-600 px-3.5 text-sm text-neutral-100 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setCreateOpen(true)}
          disabled={loading}
        >
          <AppIcon icon={Add01Icon} size={15} />
          Add user
        </button>
      </header>

      <UserList
        users={users}
        loading={loading}
        busy={busy}
        onChangeRole={(userId, role) => void changeRole(userId, role)}
        onDelete={(user) => setPendingDelete(user)}
      />

      {error ? (
        <div className="border-t border-neutral-800 px-5 pb-5 sm:px-7 sm:pb-7 lg:px-8 lg:pb-8">
          <div className="mt-5 border-l-2 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        </div>
      ) : null}

      <SettingsDialog
        open={createOpen}
        title="Add user"
        onClose={() => {
          if (!creating) setCreateOpen(false);
        }}
        width="max-w-md"
      >
        <UserCreateForm creating={creating} onCreate={createUser} />
      </SettingsDialog>

      <ConfirmationDialog
        open={Boolean(pendingDelete)}
        title="Delete this user?"
        subject={pendingDelete?.email}
        description="This removes the user's access. Users who own projects must be emptied first."
        confirmLabel="Delete user"
        busy={busy === pendingDelete?.id}
        onClose={() => {
          if (!busy) setPendingDelete(null);
        }}
        onConfirm={() => void confirmDelete()}
      />
    </section>
  );
}
