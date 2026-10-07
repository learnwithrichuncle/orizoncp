import { useMemo, useState } from "react";
import type { EnvVar } from "../../api";
import { EnvCodeEditor } from "./env-code-editor";
import { formatEnvText, invalidEnvLineNumbers, parseEnvText, type ParsedEnvEntry } from "./env-text-parser";

export function EnvPlainTextEditor({
  env,
  busy,
  onCancel,
  onSave
}: {
  env: EnvVar[];
  busy: boolean;
  onCancel: () => void;
  onSave: (entries: ParsedEnvEntry[]) => Promise<void>;
}) {
  const [text, setText] = useState(() => formatEnvText(env.map((item) => ({ key: item.key, value: item.value ?? "" }))));
  const entries = useMemo(() => parseEnvText(text), [text]);
  const invalidLines = useMemo(() => invalidEnvLineNumbers(text), [text]);

  return (
    <form
      className="p-4 sm:p-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (busy || invalidLines.length > 0) return;
        void onSave(entries);
      }}
    >
      <label htmlFor="plain-environment-variables" className="block text-xs text-ink-dim">
        Environment variables
      </label>
      <EnvCodeEditor
        value={text}
        onChange={setText}
        disabled={busy}
      />

      <div className="mt-3 flex min-h-5 flex-wrap items-center justify-between gap-2 text-xs text-ink-dim">
        <span>
          {invalidLines.length > 0
            ? `Invalid KEY=value syntax on ${invalidLines.length === 1 ? "line" : "lines"} ${invalidLines.join(", ")}`
            : `${entries.length} ${entries.length === 1 ? "variable" : "variables"}`}
        </span>
        <span>Removing a line deletes that variable when you save.</span>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2 border-t border-line pt-4">
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center border border-line px-3.5 text-sm text-ink-muted transition hover:border-line hover:bg-hover disabled:opacity-50"
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex h-9 items-center justify-center bg-accent px-4 text-sm text-ink transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={busy || invalidLines.length > 0}
        >
          {busy ? "Saving…" : "Save variables"}
        </button>
      </div>
    </form>
  );
}
