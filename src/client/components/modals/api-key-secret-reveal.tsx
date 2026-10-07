import { CopyCheckIcon, CopyIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { AppIcon } from "../ui/primitives";

export function ApiKeySecretReveal({ token, onDismiss }: { token: string; onDismiss: () => void }) {
  const [copied, setCopied] = useState(false);

  async function copyToken() {
    if (!navigator.clipboard?.writeText) return;
    await navigator.clipboard.writeText(token);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section>
      <div className="border-l-2 border-emerald-400 bg-emerald-400/10 px-4 py-3 text-sm leading-6 text-emerald-200">
        This key is shown only once. Copy it and store it somewhere secure.
      </div>

      <div className="mt-5 flex min-w-0 items-stretch border border-line bg-glass">
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap px-3 py-3 font-mono text-xs text-ink">
          {token}
        </code>
        <button
          type="button"
          className="grid w-11 shrink-0 place-items-center border-l border-line text-ink-muted transition hover:bg-hover hover:text-white"
          onClick={() => void copyToken()}
          title={copied ? "Copied" : "Copy"}
          aria-label={copied ? "Copied API key" : "Copy API key"}
        >
          <AppIcon icon={copied ? CopyCheckIcon : CopyIcon} size={14} />
        </button>
      </div>

      <button
        type="button"
        className="mt-5 inline-flex min-h-10 w-fit items-center justify-center bg-accent px-4 text-sm text-ink transition hover:bg-zinc-200"
        onClick={onDismiss}
      >
        Done
      </button>
    </section>
  );
}
