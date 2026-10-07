import { javascript } from "@codemirror/lang-javascript";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import CodeMirror from "@uiw/react-codemirror";
import type { FormEvent } from "react";
import { useMemo } from "react";
import { FieldLabel, FormInput, shellButton } from "../ui/primitives";

const mongoDocumentHighlightStyle = HighlightStyle.define([
  { tag: tags.string, color: "#34d399" },
  { tag: [tags.number, tags.bool, tags.null], color: "#f59e0b" },
  { tag: tags.propertyName, color: "#f4f4f5" },
  { tag: tags.keyword, color: "#e879f9" },
  { tag: tags.punctuation, color: "#71717a" }
]);

const mongoDocumentEditorTheme = EditorView.theme(
  {
    "&": {
      minHeight: "280px",
      backgroundColor: "#09090b",
      color: "#f4f4f5",
      fontSize: "13px"
    },
    "&.cm-focused": {
      outline: "none"
    },
    ".cm-scroller": {
      backgroundColor: "#09090b",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    },
    ".cm-content": {
      minHeight: "280px",
      padding: "12px",
      caretColor: "#f4f4f5"
    },
    ".cm-line": {
      padding: "0"
    },
    ".cm-cursor": {
      borderLeftColor: "#f4f4f5"
    },
    ".cm-placeholder": {
      color: "#71717a"
    },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
      backgroundColor: "rgba(79, 184, 178, 0.22)"
    },
    ".cm-activeLine": {
      backgroundColor: "transparent"
    },
    ".cm-gutters": {
      borderRight: "1px solid #27272a",
      backgroundColor: "#09090b",
      color: "#71717a"
    }
  },
  { dark: true }
);

const mongoDocumentBasicSetup = {
  foldGutter: false,
  highlightActiveLine: false,
  highlightActiveLineGutter: false,
  autocompletion: false,
  searchKeymap: false,
  foldKeymap: false,
  completionKeymap: false
};

function documentJsonError(source: string) {
  const trimmed = source.trim();
  if (!trimmed) return "Document JSON is required";
  try {
    JSON.parse(trimmed);
    return "";
  } catch (error) {
    return error instanceof Error ? error.message : "Document must be valid JSON";
  }
}

export function MongoDocumentModal({
  title,
  subtitle,
  buttonLabel,
  draft,
  error,
  busy,
  showTargetFields = true,
  onDraftChange,
  onSubmit,
  onClose
}: {
  title: string;
  subtitle: string;
  buttonLabel: string;
  draft: Record<string, string>;
  error: string;
  busy: string;
  showTargetFields?: boolean;
  onDraftChange: (draft: Record<string, string>) => void;
  onSubmit: (event: FormEvent) => void;
  onClose: () => void;
}) {
  const documentError = useMemo(() => documentJsonError(draft.document ?? ""), [draft.document]);
  const hasTarget = !showTargetFields || (Boolean((draft.database ?? "").trim()) && Boolean((draft.collection ?? "").trim()));
  const canSubmit = !busy && !documentError && hasTarget;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-base/55 px-6 py-8">
      <form onSubmit={onSubmit} className="flex max-h-full w-full max-w-3xl flex-col border border-line-strong bg-base shadow-[0_24px_90px_rgba(0,0,0,0.5)]">
        <div className="border-b border-line px-5 py-4">
          <div className="font-hero text-lg text-ink">{title}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">{subtitle}</div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {error ? <div className="mb-4 border border-bad/30 bg-bad/25 px-4 py-3 text-sm text-bad">{error}</div> : null}

          {showTargetFields ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <FieldLabel>Database</FieldLabel>
                <FormInput value={draft.database ?? ""} onChange={(event) => onDraftChange({ ...draft, database: event.target.value })} placeholder="orizoncp" required />
              </label>
              <label className="block">
                <FieldLabel>Collection</FieldLabel>
                <FormInput value={draft.collection ?? ""} onChange={(event) => onDraftChange({ ...draft, collection: event.target.value })} placeholder="users" required />
              </label>
            </div>
          ) : null}

          <div className={showTargetFields ? "mt-4" : ""}>
            <FieldLabel>Document JSON</FieldLabel>
            <div className={`overflow-hidden border ${documentError ? "border-bad/70" : "border-line-strong"}`}>
              <CodeMirror
                value={draft.document ?? ""}
                height="280px"
                basicSetup={mongoDocumentBasicSetup}
                extensions={[
                  javascript(),
                  syntaxHighlighting(mongoDocumentHighlightStyle),
                  EditorView.contentAttributes.of({
                    autocapitalize: "off",
                    autocomplete: "off",
                    autocorrect: "off",
                    spellcheck: "false"
                  }),
                  mongoDocumentEditorTheme
                ]}
                onChange={(document) => onDraftChange({ ...draft, document })}
                placeholder={'{\n  "name": "example"\n}'}
                theme="dark"
                className="bg-base [&_.cm-content]:bg-base [&_.cm-editor]:bg-base [&_.cm-scroller]:bg-base"
              />
            </div>
            {documentError ? <div className="mt-2 font-mono text-[10px] text-bad">{documentError}</div> : null}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
          <button type="button" className={shellButton("ghost")} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={shellButton("primary")} disabled={!canSubmit}>
            {buttonLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
