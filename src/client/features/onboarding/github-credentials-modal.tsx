import { Cancel01Icon, LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { AppIcon, shellButton } from "../../components/ui/primitives";
import type { OnboardingForm } from "./onboarding-types";

function GitHubField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="h-12 w-full rounded-sm border border-white/15 bg-white/5 px-3.5 font-mono text-xs text-white outline-none transition placeholder:text-zinc-600 hover:border-white/30 focus:border-white focus:bg-white/10 focus:ring-2 focus:ring-white/10"
      />
    </label>
  );
}

export function GitHubCredentialsModal({
  open,
  onClose,
  form,
  update,
}: {
  open: boolean;
  onClose: () => void;
  form: OnboardingForm;
  update: (patch: Partial<OnboardingForm>) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
      <div className="mx-auto flex min-h-full items-center justify-center">
        <div className="w-full max-w-2xl border border-white/15 bg-zinc-950 p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:p-8">
          <div className="mb-9 flex items-start justify-between gap-5">
            <h2 className="font-hero text-2xl tracking-[-0.04em] text-white sm:text-3xl">
              Enter GitHub credentials manually
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-8 w-8 place-items-center border border-white/15 text-zinc-400 transition hover:border-white/35 hover:text-white"
            >
              <AppIcon icon={Cancel01Icon} size={15} />
            </button>
          </div>

          <div className="grid gap-y-5">
            <GitHubField
              label="Access token"
              value={form.githubAccessToken}
              onChange={(githubAccessToken) => update({ githubAccessToken })}
              type="password"
            />
            <GitHubField
              label="Webhook secret"
              value={form.githubWebhookSecret}
              onChange={(githubWebhookSecret) =>
                update({ githubWebhookSecret })
              }
              type="password"
            />
            <GitHubField
              label="App ID"
              value={form.githubAppId}
              onChange={(githubAppId) => update({ githubAppId })}
            />
            <GitHubField
              label="App client ID"
              value={form.githubAppClientId}
              onChange={(githubAppClientId) => update({ githubAppClientId })}
            />
            <GitHubField
              label="App slug"
              value={form.githubAppSlug}
              onChange={(githubAppSlug) => update({ githubAppSlug })}
            />
            <label className="block">
              <span className="mb-2 block font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                App private key
              </span>
              <textarea
                value={form.githubAppPrivateKey}
                onChange={(event) =>
                  update({ githubAppPrivateKey: event.target.value })
                }
                placeholder="-----BEGIN PRIVATE KEY-----"
                spellCheck={false}
                className="min-h-32 w-full resize-y rounded-sm border border-white/15 bg-white/5 px-3.5 py-3 font-mono text-xs text-white outline-none transition placeholder:text-zinc-600 hover:border-white/30 focus:border-white focus:bg-white/10 focus:ring-2 focus:ring-white/10"
              />
            </label>
            <a
              href="https://github.com/settings/apps/new"
              target="_blank"
              rel="noreferrer"
              className="flex h-11 items-center justify-center gap-2 rounded-sm border border-white/15 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-300 transition hover:border-white/30 hover:text-white"
            >
              <AppIcon icon={LinkSquare02Icon} size={13} />
              Open GitHub App settings
            </a>
          </div>

          <div className="mt-7 flex items-center justify-end gap-3 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={onClose}
              className={shellButton("ghost")}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onClose}
              className={shellButton("primary")}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}