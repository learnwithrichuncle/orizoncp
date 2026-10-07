import { useState, useEffect } from "react";
import {
  EyeIcon,
  EyeOff,
  CopyIcon,
  CopyCheckIcon,
  PencilEdit02Icon,
  Delete02Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  InformationCircleIcon
} from "@hugeicons/core-free-icons";
import { AppIcon, FormInput } from "../ui/primitives";
import { AutocompleteInput } from "../ui/autocomplete-input";
import type { EnvVar } from "../../api";
import { ConfirmationDialog } from "./confirmation-dialog";

interface EnvVarRowProps {
  item: EnvVar;
  onSave: (key: string, value: string) => Promise<void>;
  onDelete: () => Promise<void>;
  busy: boolean;
  suggestions: Array<{ key: string; label: string }>;
}

const publicDatabaseUrlKeys = new Set([
  "DATABASE_PUBLIC_URL",
  "POSTGRES_PUBLIC_URL",
  "MYSQL_PUBLIC_URL",
  "REDIS_PUBLIC_URL",
  "MONGODB_PUBLIC_URL",
  "CLICKHOUSE_PUBLIC_URL"
]);

export function EnvVarRow({ item, onSave, onDelete, busy, suggestions }: EnvVarRowProps) {
  const [editing, setEditing] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editKey, setEditKey] = useState(item.key);
  const [editValue, setEditValue] = useState(item.value ?? "");

  // Polling replaces `item` with a new object. Only sync server values while
  // the row is closed so an active draft is never overwritten.
  useEffect(() => {
    if (editing) return;
    setEditKey(item.key);
    setEditValue(item.value ?? "");
  }, [editing, item.key, item.value]);

  async function handleCopy() {
    if (!item.value) return;
    try {
      await navigator.clipboard.writeText(item.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editKey.trim()) return;
    try {
      await onSave(editKey.trim(), editValue);
      setEditing(false);
    } catch (err) {
      console.error("Failed to save env var:", err);
    }
  }

  const hasReference = !!(item.resolvedValue && item.resolvedValue !== item.value);
  const isPublicDatabaseUrl = publicDatabaseUrlKeys.has(item.key);
  const publicDatabaseUrlHint = item.key === "POSTGRES_PUBLIC_URL"
    ? "Use this outside this server. Postgres TLS uses a public CA when Caddy has issued one; otherwise clients that verify certificates need the service CA certificate."
    : "Use this if you need to connect to this database outside this server.";
  const hintId = `env-public-url-hint-${item.id}`;

  function PublicDatabaseUrlHint() {
    if (!isPublicDatabaseUrl) return null;

    return (
      <span className="relative shrink-0">
        <button
          type="button"
          className="group inline-flex h-7 w-7 items-center justify-center text-ink-dim transition hover:text-white focus:text-white focus:outline-none"
          onClick={() => setHintOpen((current) => !current)}
          onBlur={() => setHintOpen(false)}
          aria-describedby={hintId}
          aria-expanded={hintOpen}
          aria-label={publicDatabaseUrlHint}
        >
          <AppIcon icon={InformationCircleIcon} size={15} />
          <span
            id={hintId}
            className={`pointer-events-none absolute left-1/2 top-[calc(100%+0.5rem)] z-40 w-72 -translate-x-1/2 border border-line bg-base px-3 py-2 text-left text-xs normal-case leading-5 tracking-normal text-ink-muted shadow-[0_16px_40px_rgba(0,0,0,0.5)] ${
              hintOpen ? "block" : "hidden group-hover:block group-focus:block"
            }`}
          >
            {publicDatabaseUrlHint}
          </span>
        </button>
      </span>
    );
  }

  if (editing) {
    return (
      <div className="flex w-full flex-col gap-2 border-b border-line bg-glass px-5 py-3">
        <form
          onSubmit={handleSave}
          className="grid w-full gap-3 lg:grid-cols-[minmax(180px,0.8fr)_minmax(260px,1.4fr)_104px] lg:items-center"
        >
          <div>
            <FormInput
              value={editKey}
              onChange={(e) => setEditKey(e.target.value)}
              placeholder="KEY"
              autoComplete="off"
              required
              disabled={busy}
              variant="monochrome"
              className="!h-9 border-line bg-base font-mono text-xs uppercase tracking-[0.04em]"
            />
          </div>
          <div className="relative flex min-w-0 items-center">
            <AutocompleteInput
              type={hidden ? "password" : "text"}
              value={editValue}
              onChange={(val) => setEditValue(val)}
              suggestions={suggestions}
              placeholder="VALUE"
              autoComplete="off"
              disabled={busy}
              variant="monochrome"
              className="!h-9 border-line bg-base pr-9 font-mono text-xs"
            />
            <button
              type="button"
              className="absolute right-2 text-ink-dim transition hover:text-white"
              onClick={() => setHidden(!hidden)}
              disabled={busy}
            >
              <AppIcon icon={hidden ? EyeIcon : EyeOff} size={15} />
            </button>
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="submit"
              className="inline-flex h-9 w-9 items-center justify-center bg-accent text-ink transition hover:bg-zinc-200 disabled:opacity-50"
              disabled={busy}
              title="Save"
              aria-label="Save variable"
            >
              <AppIcon icon={CheckmarkCircle02Icon} size={14} />
            </button>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center border border-line text-ink-muted transition hover:border-line hover:bg-hover hover:text-white disabled:opacity-50"
              onClick={() => {
                setEditKey(item.key);
                setEditValue(item.value ?? "");
                setEditing(false);
              }}
              disabled={busy}
              title="Cancel"
              aria-label="Cancel editing"
            >
              <AppIcon icon={Cancel01Icon} size={14} />
            </button>
          </div>
        </form>
        {hasReference && (
          <div className="flex select-none items-center gap-2 font-mono text-[10px] text-ink-dim">
            <span className="border border-line px-1.5 py-0.5 text-[8px] uppercase tracking-[0.08em] text-ink-muted">
              Reference
            </span>
            <span>resolves to</span>
            <span className={hidden ? "select-none tracking-widest text-ink-dim" : "select-all text-ink-muted"}>
              {hidden ? "••••••••••••••••" : item.resolvedValue}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full flex-col gap-2 border-b border-line px-5 py-3 transition last:border-b-0 hover:bg-glass">
        <div className="grid w-full gap-3 lg:grid-cols-[minmax(180px,0.8fr)_minmax(260px,1.4fr)_104px] lg:items-center">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-mono text-xs uppercase tracking-[0.04em] text-ink">
              {item.key}
            </span>
            <PublicDatabaseUrlHint />
          </div>

          <div className="relative flex min-w-0 items-center">
            <FormInput
              type={hidden ? "password" : "text"}
              value={item.value ?? ""}
              readOnly
              variant="monochrome"
              className="!h-9 cursor-text select-all border-line bg-glass pr-9 font-mono text-xs"
            />
            <button
              type="button"
              className="absolute right-2 text-ink-dim transition hover:text-white"
              onClick={() => setHidden(!hidden)}
              disabled={busy}
              title={hidden ? "Show Value" : "Hide Value"}
            >
              <AppIcon icon={hidden ? EyeIcon : EyeOff} size={15} />
            </button>
          </div>

          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              className={`inline-flex h-8 w-8 items-center justify-center border transition ${
                copied
                  ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                  : "border-line text-ink-dim hover:border-line-strong hover:bg-hover hover:text-white"
              }`}
              onClick={handleCopy}
              title={copied ? "Copied!" : "Copy Value"}
              disabled={busy || !item.value}
            >
              <AppIcon icon={copied ? CopyCheckIcon : CopyIcon} size={15} />
            </button>

            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center border border-line text-ink-dim transition hover:border-line-strong hover:bg-hover hover:text-white"
              onClick={() => {
                setHidden(false);
                setEditing(true);
              }}
              title="Edit"
              disabled={busy}
            >
              <AppIcon icon={PencilEdit02Icon} size={15} />
            </button>

            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center border border-line text-ink-dim transition hover:border-rose-400/50 hover:bg-rose-400/10 hover:text-rose-300"
              onClick={() => setDeleteDialogOpen(true)}
              title="Delete"
              disabled={busy}
            >
              <AppIcon icon={Delete02Icon} size={15} />
            </button>
          </div>
        </div>
        {hasReference && (
          <div className="flex select-none items-center gap-2 font-mono text-[10px] text-ink-dim">
            <span className="border border-line px-1.5 py-0.5 text-[8px] uppercase tracking-[0.08em] text-ink-muted">
              Reference
            </span>
            <span>resolves to</span>
            <span className={hidden ? "select-none tracking-widest text-ink-dim" : "select-all text-ink-muted"}>
              {hidden ? "••••••••••••••••" : item.resolvedValue}
            </span>
          </div>
        )}
      </div>

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete variable?"
        subject={item.key}
        description="This environment variable will be removed from the service. Deployments that depend on it may fail until it is restored."
        confirmLabel="Delete variable"
        busy={busy}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          setDeleteDialogOpen(false);
          void onDelete();
        }}
      />
    </>
  );
}
