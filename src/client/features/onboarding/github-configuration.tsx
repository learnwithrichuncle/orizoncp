import {
  CheckmarkCircle02Icon,
  GithubIcon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { AppIcon } from "../../components/ui/primitives";
import { startGitHubAppManifestFlow } from "../../lib/github-app-manifest";
import { GitHubCredentialsModal } from "./github-credentials-modal";
import type { OnboardingForm } from "./onboarding-types";

export function GitHubConfiguration({
  form,
  update,
}: {
  form: OnboardingForm;
  update: (patch: Partial<OnboardingForm>) => void;
}) {
  const [manualOpen, setManualOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  async function connect() {
    setConnecting(true);
    setError("");
    try {
      const result = await startGitHubAppManifestFlow({
        redirectTo: "onboarding",
      });
      if (result.ok) {
        setConnected(true);
      } else {
        setError(result.message);
      }
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Could not connect to GitHub",
      );
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div>
      {connected ? (
        <div className="flex items-start gap-3 border border-white/20 bg-white/10 px-4 py-4">
          <span className="mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full bg-white text-black">
            <AppIcon icon={CheckmarkCircle02Icon} size={14} />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">GitHub connected</p>
            <p className="mt-1 text-xs leading-5 text-zinc-400">
              Finish onboarding, then choose repositories from system settings.
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-white/10 bg-black/30 p-5">
          <div className="flex items-start gap-4">
            <span className="grid h-10 w-10 flex-none place-items-center rounded-full border border-white/15 bg-white/5 text-white">
              <AppIcon icon={GithubIcon} size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">
                Create a GitHub App automatically
              </p>
              <p className="mt-1.5 text-xs leading-5 text-zinc-500">
                orizonCP fills every credential and returns you here when the
                GitHub App is ready.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void connect()}
            disabled={connecting}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-blue-600 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-blue-500 disabled:opacity-60"
          >
            <AppIcon icon={GithubIcon} size={15} />
            {connecting ? "Connecting…" : "Connect GitHub"}
          </button>
        </div>
      )}

      {error ? (
        <div className="mt-4 border-l-2 border-white bg-white/10 px-4 py-3 text-xs text-zinc-200">
          {error}
        </div>
      ) : null}

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-zinc-600">
          Or
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <button
        type="button"
        onClick={() => setManualOpen(true)}
        className="flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-400 transition hover:text-white"
      >
        <AppIcon icon={LinkSquare02Icon} size={13} />
        Enter credentials manually
      </button>

      <GitHubCredentialsModal
        open={manualOpen}
        onClose={() => setManualOpen(false)}
        form={form}
        update={update}
      />
    </div>
  );
}