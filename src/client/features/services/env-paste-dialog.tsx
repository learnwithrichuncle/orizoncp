import { useEffect, useMemo, useState } from "react";
import { SettingsDialog } from "../settings/settings-dialog";
import { parseEnvText, type ParsedEnvEntry } from "./env-text-parser";

export function EnvPasteDialog({
  open,
  busy,
  onClose,
  onImport
}: {
  open: boolean;
  busy: boolean;
  onClose: () => void;
  onImport: (entries: ParsedEnvEntry[]) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const entries = useMemo(() => parseEnvText(text), [text]);

  useEffect(() => {
    if (!open) setText("");
  }, [open]);

  return (
    <SettingsDialog
      open={open}
      title="Paste .env"
      width="max-w-xl"
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (entries.length === 0 || busy) return;
          void onImport(entries);
        }}
      >
        <label htmlFor="env-paste-value" className="block text-xs text-ink-dim">
          Environment variables
        </label>
        <textarea
          id="env-paste-value"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={"DATABASE_URL=postgres://...\nAPI_KEY=...\nNODE_ENV=production"}
          autoFocus
          spellCheck={false}
          disabled={busy}
          className="mt-2 h-64 w-full resize-none border border-line bg-glass p-3 font-mono text-xs leading-6 text-ink outline-none transition placeholder:text-zinc-700 focus:border-white focus:ring-2 focus:ring-white/10 disabled:opacity-50"
        />

        <div className="mt-3 min-h-5 text-xs text-ink-dim">
          {text.trim()
            ? entries.length > 0
              ? `${entries.length} valid ${entries.length === 1 ? "variable" : "variables"} detected`
              : "No valid KEY=value entries detected"
            : "Paste the contents of a .env file"}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2 border-t border-line pt-4">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center border border-line px-3.5 text-sm text-ink-muted transition hover:border-line hover:bg-hover disabled:opacity-50"
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center bg-accent px-4 text-sm text-ink transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={busy || entries.length === 0}
          >
            {busy ? "Importing…" : `Import ${entries.length || ""}`.trim()}
          </button>
        </div>
      </form>
    </SettingsDialog>
  );
}
