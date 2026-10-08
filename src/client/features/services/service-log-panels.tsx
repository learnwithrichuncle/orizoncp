import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { DeploymentLog, RuntimeLog } from "../../api";

type LogLine = {
  id: number;
  line: string;
  stream: string;
  createdAt: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function logTime(iso: string) {
  const date = new Date(iso);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}.${String(date.getMilliseconds()).padStart(3, "0")}`;
}

function logLevel(log: LogLine): "normal" | "success" | "error" {
  const line = log.line.trim();
  if (log.stream === "stderr") return "error";
  if (line.startsWith("✓")) return "success";
  if (/\b(error|failed|fatal)\b/i.test(line)) return "error";
  if (/build complete|up and running|promoted to production/i.test(line))
    return "success";
  return "normal";
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.8"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9L16 9C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16L9 15Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="text-neutral-400"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
      <path
        d="M12 8V12L14 14"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function LogTerminal({
  logs,
  title,
  meta,
  actions,
  emptyLabel,
  heightClass
}: {
  logs: LogLine[];
  title: string;
  meta?: ReactNode;
  actions?: ReactNode;
  emptyLabel: string;
  heightClass: string;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [tail, setTail] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!tail) return;
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [logs, tail]);

  const needle = query.trim().toLowerCase();
  const visible = needle
    ? logs.filter((log) => log.line.toLowerCase().includes(needle))
    : logs;

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(logs.map((log) => log.line).join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div
      className={`deploy-term flex ${heightClass} w-full flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900`}
    >
      <div className="flex-shrink-0 border-b border-neutral-800 bg-neutral-900 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-neutral-400">
              {logs.length} lines
            </span>
            <span className="hidden text-[10px] text-neutral-600 sm:inline">
              {title}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void copyAll()}
              className="flex items-center gap-1.5 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-[11px] font-medium text-neutral-200 transition-colors hover:bg-neutral-800"
            >
              <CopyIcon />
              {copied ? "Copied" : `Copy ${logs.length}`}
            </button>
            <div className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5">
              <input
                aria-label="Find in logs"
                placeholder="⌘ F"
                spellCheck={false}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-32 bg-transparent text-[11px] text-neutral-200 outline-none placeholder:text-neutral-500"
              />
            </div>
            <button
              type="button"
              aria-pressed={tail}
              title="Follow new output as it arrives"
              onClick={() => setTail((current) => !current)}
              className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                tail
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-400"
                  : "border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-800"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  tail ? "bg-emerald-500" : "bg-[#FFFFFF40]"
                }`}
              />
              Tail
            </button>
            {meta ? (
              <div className="flex items-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5">
                <ClockIcon />
                <span className="font-mono text-[11px] text-neutral-300">
                  {meta}
                </span>
              </div>
            ) : null}
            {actions}
          </div>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 select-none overflow-y-auto bg-neutral-900 font-mono text-[11px]"
      >
        {visible.length === 0 ? (
          <div className="px-4 py-4 text-[11px] text-neutral-500">
            {emptyLabel}
          </div>
        ) : (
          <div className="py-1">
            {visible.map((log) => {
              const level = logLevel(log);
              return (
                <div
                  key={log.id}
                  data-log-row="true"
                  data-level={level}
                  className={`group flex cursor-pointer select-none items-start gap-0 border-l-2 px-4 py-0.5 transition-colors ${
                    level === "success"
                      ? "border-l-emerald-500/60 bg-emerald-500/5"
                      : level === "error"
                        ? "border-l-red-500/60 bg-red-500/5"
                        : "border-l-transparent hover:bg-neutral-900"
                  }`}
                >
                  <div className="flex w-[100px] shrink-0 select-none items-center gap-2 text-[11px] text-neutral-500">
                    <span>{logTime(log.createdAt)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <pre
                      className={`overflow-x-auto whitespace-pre-wrap leading-tight [tab-size:2] ${
                        level === "success"
                          ? "text-emerald-400"
                          : level === "error"
                            ? "text-red-400"
                            : "text-neutral-300"
                      }`}
                    >
                      {log.line}
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function DeploymentLogsPanel({
  logs,
  emptyLabel,
  title,
  meta,
  actions,
  embedded = false
}: {
  logs: DeploymentLog[];
  emptyLabel: string;
  title: string;
  meta?: ReactNode;
  actions?: ReactNode;
  embedded?: boolean;
}) {
  return (
    <LogTerminal
      logs={logs}
      title={title}
      meta={meta}
      actions={actions}
      emptyLabel={emptyLabel}
      heightClass={embedded ? "h-full min-h-0" : "h-[min(72vh,760px)] min-h-[420px]"}
    />
  );
}

export function RuntimeLogsPanel({
  logs,
  emptyLabel,
  title
}: {
  logs: RuntimeLog[];
  emptyLabel: string;
  title: string;
}) {
  return (
    <LogTerminal
      logs={logs}
      title={title}
      emptyLabel={emptyLabel}
      heightClass="h-[min(72vh,760px)] min-h-[420px]"
    />
  );
}