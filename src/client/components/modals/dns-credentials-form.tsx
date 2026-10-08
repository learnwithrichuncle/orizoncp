import {
  Cancel01Icon,
  Delete02Icon,
  PencilEdit02Icon
} from "@hugeicons/core-free-icons";
import type { FormEvent } from "react";
import { AppIcon, FieldLabel, FormInput } from "../ui/primitives";
import type {
  DnsCredentialValues,
  DnsProviderConnection,
  DnsProviderDefinition
} from "./dns-management-data";
import { DnsProviderLogo } from "./dns-provider-logo";

function savedLabel(savedAt: string) {
  if (!savedAt) return "Saved in this session";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(savedAt));
}

export function DnsCredentialsForm({
  provider,
  values,
  connection,
  editing,
  error,
  busy = false,
  onChange,
  onSave,
  onEdit,
  onCancel,
  onDisconnect
}: {
  provider: DnsProviderDefinition;
  values: DnsCredentialValues;
  connection: DnsProviderConnection;
  editing: boolean;
  error: string;
  busy?: boolean;
  onChange: (values: DnsCredentialValues) => void;
  onSave: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onDisconnect: () => void;
}) {
  function saveCredentials(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    onSave();
  }

  if (connection.connected && !editing) {
    return (
      <section className="flex min-h-[440px] flex-col">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center">
              <DnsProviderLogo provider={provider} className="max-h-7 max-w-9" />
            </div>
            <div>
              <h2 className="text-2xl tracking-[-0.03em] text-white">{provider.name}</h2>
              <div className="mt-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500">
                <span className="h-1.5 w-1.5 bg-blue-600" />
                Connected
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center border border-neutral-800 bg-transparent text-neutral-400 transition hover:border-neutral-800 hover:bg-neutral-800 hover:text-white"
              onClick={onEdit}
              disabled={busy}
              title="Edit DNS credentials"
              aria-label="Edit DNS credentials"
            >
              <AppIcon icon={PencilEdit02Icon} size={15} />
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center border border-neutral-800 bg-transparent text-neutral-500 transition hover:border-neutral-800 hover:bg-neutral-800 hover:text-white"
              onClick={onDisconnect}
              disabled={busy}
              title="Remove DNS credentials"
              aria-label="Remove DNS credentials"
            >
              <AppIcon icon={Delete02Icon} size={15} />
            </button>
          </div>
        </div>

        <div className="mt-8 border-y border-neutral-800">
          <div className="grid gap-2 border-b border-neutral-800 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500">Credential</div>
            <div className="font-mono text-xs text-neutral-100">••••••{connection.keySuffix}</div>
          </div>
          <div className="grid gap-2 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500">Last updated</div>
            <div className="text-sm text-neutral-400">{savedLabel(connection.savedAt)}</div>
          </div>
        </div>

        <p className="mt-auto pt-8 text-sm leading-6 text-neutral-500">
          orizonCP uses this connection when creating and updating service DNS records.
        </p>
      </section>
    );
  }

  return (
    <form onSubmit={saveCredentials} className="flex min-h-[440px] flex-col">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center">
          <DnsProviderLogo provider={provider} className="max-h-7 max-w-9" />
        </div>
        <div>
          <h2 className="text-2xl tracking-[-0.03em] text-white">
            {connection.connected ? `Edit ${provider.name}` : `Connect ${provider.name}`}
          </h2>
        </div>
      </div>

      <div className="mt-8 grid max-w-xl gap-5">
        {provider.fields.map((field) => (
          <div key={field.key}>
            <FieldLabel>{field.label}</FieldLabel>
            <FormInput
              type={field.type ?? "text"}
              value={values[field.key] ?? ""}
              onChange={(event) => onChange({ ...values, [field.key]: event.target.value })}
              placeholder={field.placeholder}
              required={field.required}
              autoComplete="off"
              variant="monochrome"
              className="border-neutral-800 bg-neutral-900"
            />
          </div>
        ))}
      </div>

      {error ? (
        <div className="mt-5 border-l-2 border-white bg-neutral-800 px-4 py-3 text-sm text-neutral-100">
          {error}
        </div>
      ) : null}

      <div className="mt-auto flex flex-col gap-2 pt-8 sm:flex-row">
        <button
          type="submit"
          className="inline-flex min-h-10 w-fit items-center justify-center bg-blue-600 px-4 text-sm text-neutral-100 transition hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-50"
          disabled={busy}
        >
          {busy ? "Saving..." : "Save credentials"}
        </button>
        {connection.connected ? (
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-neutral-800 px-5 text-sm text-neutral-400 transition hover:border-neutral-800 hover:bg-neutral-800 hover:text-white disabled:opacity-50"
            onClick={onCancel}
            disabled={busy}
          >
            <AppIcon icon={Cancel01Icon} size={15} />
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
