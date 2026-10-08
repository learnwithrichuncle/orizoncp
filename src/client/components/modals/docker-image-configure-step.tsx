import { ArrowLeft01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { FormEvent, useMemo, useState } from "react";
import { dockerImageRepoFullName, validateDockerImageReference } from "../../../shared/service-source";
import { AppIcon, FieldLabel, FormInput } from "../ui/primitives";
import { RuntimeModeControl } from "../ui/runtime-mode-control";

type EnvEntry = {
  key: string;
  value: string;
};

type DockerImageSubmitPayload = {
  name: string;
  repoFullName: string;
  repoUrl: string;
  branch: string;
  dockerImage: string;
  runtimeMode: "web" | "worker";
  internalPort: number;
  env: EnvEntry[];
};

function nameFromImageReference(value: string) {
  const withoutDigest = value.split("@")[0] ?? value;
  const withoutTag = withoutDigest.replace(/:[^/:]+$/, "");
  return withoutTag.split("/").filter(Boolean).at(-1)?.replace(/[^a-zA-Z0-9_.-]+/g, "-") ?? "";
}

function upsertEnvEntry(entries: EnvEntry[], entry: EnvEntry) {
  const next = new Map(entries.map((item) => [item.key, item.value]));
  next.set(entry.key, entry.value);
  return Array.from(next.entries()).map(([key, value]) => ({ key, value }));
}

export function DockerImageConfigureStep({
  onBack,
  onSubmit,
  busy
}: {
  onBack: () => void;
  onSubmit: (payload: DockerImageSubmitPayload) => Promise<void>;
  busy: boolean;
}) {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [runtimeMode, setRuntimeMode] = useState<"web" | "worker">("web");
  const [internalPort, setInternalPort] = useState(8080);
  const [envEntries, setEnvEntries] = useState<EnvEntry[]>([]);
  const [envForm, setEnvForm] = useState<EnvEntry>({ key: "", value: "" });

  const imageValidation = useMemo(() => validateDockerImageReference(image), [image]);
  const canSubmit = imageValidation.ok && name.trim() && (runtimeMode === "worker" || (internalPort >= 1 && internalPort <= 65535));

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!imageValidation.ok || !canSubmit) return;

    await onSubmit({
      name: name.trim(),
      repoFullName: dockerImageRepoFullName(imageValidation.image),
      repoUrl: "docker-image",
      branch: "latest",
      dockerImage: imageValidation.image,
      runtimeMode,
      internalPort,
      env: envEntries
    });
  }

  function addEnvEntry() {
    const key = envForm.key.trim();
    if (!key || !/^[A-Z_][A-Z0-9_]*$/i.test(key)) return;
    setEnvEntries((current) => upsertEnvEntry(current, { key, value: envForm.value }));
    setEnvForm({ key: "", value: "" });
  }

  return (
    <form onSubmit={submit} className="flex min-h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="space-y-4">
          <div>
            <FieldLabel>Docker image</FieldLabel>
            <FormInput
              value={image}
              onChange={(event) => {
                const nextImage = event.target.value;
                setImage(nextImage);
                setName((current) => current || nameFromImageReference(nextImage));
              }}
              placeholder="ghcr.io/org/app:latest"
              autoComplete="off"
              disabled={busy}
              required
              variant="monochrome"
              className="!h-9 border-neutral-800 bg-neutral-950 font-mono text-xs"
            />
            {image.trim() && !imageValidation.ok ? (
              <p className="mt-2 text-xs text-red-500">{imageValidation.error}</p>
            ) : (
              <p className="mt-2 text-xs text-neutral-500">Private images use the host Docker registry login.</p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel>Service name</FieldLabel>
              <FormInput value={name} onChange={(event) => setName(event.target.value)} placeholder="api" disabled={busy} required variant="monochrome" className="!h-9 border-neutral-800 bg-neutral-950 text-xs" />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Runtime mode</FieldLabel>
              <RuntimeModeControl value={runtimeMode} onChange={setRuntimeMode} disabled={busy} />
            </div>
            {runtimeMode !== "worker" ? (
              <div>
                <FieldLabel>Internal port</FieldLabel>
                <FormInput
                  type="number"
                  min={1}
                  max={65535}
                  value={internalPort}
                  onChange={(event) => setInternalPort(Number(event.target.value))}
                  disabled={busy}
                  required
                  variant="monochrome"
                  className="!h-9 border-neutral-800 bg-neutral-950 text-xs"
                />
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <FieldLabel>Environment variables</FieldLabel>
              <span className="font-mono text-[9px] text-neutral-500">{envEntries.length} set</span>
            </div>
            <div className="border border-neutral-800">
              {envEntries.length === 0 ? (
                <div className="px-3 py-4 text-xs text-neutral-500">No variables yet.</div>
              ) : (
                envEntries.map((entry) => (
                  <div key={entry.key} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_auto] items-center gap-3 border-b border-neutral-800 px-3 py-2 last:border-b-0">
                    <div className="truncate font-mono text-[10px] tracking-[0.08em] text-neutral-400">{entry.key}</div>
                    <div className="truncate font-mono text-xs text-neutral-500">{entry.value || "empty"}</div>
                    <button
                      type="button"
                      className="grid h-7 w-7 place-items-center text-neutral-500 transition hover:bg-red-500/10 hover:text-red-500"
                      onClick={() => setEnvEntries((current) => current.filter((item) => item.key !== entry.key))}
                      aria-label={`Remove ${entry.key}`}
                    >
                      <AppIcon icon={Delete02Icon} size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_auto]">
              <FormInput value={envForm.key} onChange={(event) => setEnvForm({ ...envForm, key: event.target.value })} placeholder="KEY" disabled={busy} variant="monochrome" className="!h-9 border-neutral-800 bg-neutral-950 font-mono text-xs" />
              <FormInput value={envForm.value} onChange={(event) => setEnvForm({ ...envForm, value: event.target.value })} placeholder="value" disabled={busy} variant="monochrome" className="!h-9 border-neutral-800 bg-neutral-950 font-mono text-xs" />
              <button type="button" className="inline-flex h-9 items-center justify-center border border-neutral-800 px-3 text-xs text-neutral-400 transition hover:border-neutral-800 hover:bg-neutral-800 hover:text-white disabled:opacity-40" onClick={addEnvEntry} disabled={!envForm.key.trim() || busy}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-neutral-800 pt-4">
        <button type="button" className="inline-flex h-8 items-center justify-center gap-2 px-3 text-xs text-neutral-500 transition hover:bg-neutral-800 hover:text-white disabled:opacity-40" onClick={onBack} disabled={busy}>
          <AppIcon icon={ArrowLeft01Icon} size={16} />
          Back
        </button>
        <button type="submit" className="inline-flex h-8 items-center justify-center bg-blue-600 px-4 text-xs text-neutral-100 transition hover:bg-zinc-200 disabled:opacity-40" disabled={!canSubmit || busy}>
          {busy ? "Creating…" : "Create service"}
        </button>
      </div>
    </form>
  );
}
