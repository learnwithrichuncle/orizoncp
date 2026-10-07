import { Logout02Icon } from "@hugeicons/core-free-icons";
import { api } from "../../api";
import { AppIcon } from "../ui/primitives";

export function SignOutButton({ className = "" }: { className?: string }) {
  async function signOut() {
    await api.logout().catch(() => null);
    window.dispatchEvent(new Event("orizoncp-auth-changed"));
    window.location.assign("/login");
  }

  return (
    <button
      type="button"
      className={`inline-flex h-9 w-9 items-center justify-center border border-line bg-glass text-ink-dim transition-colors hover:border-line hover:bg-hover hover:text-white ${className}`}
      title="Sign out"
      aria-label="Sign out"
      onClick={() => void signOut()}
    >
      <AppIcon icon={Logout02Icon} size={15} />
    </button>
  );
}
