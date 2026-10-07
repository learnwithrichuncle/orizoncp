import { type FormEvent, useState } from "react";
import { api } from "../../api";

function LoginField({
  label,
  type,
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  label: string;
  type: "email" | "password";
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-ink-muted">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        className="h-9 w-full rounded-md border border-line bg-elevated px-3 text-sm text-ink outline-none transition placeholder:text-ink-dim hover:border-line-strong focus:border-brand-edge focus:ring-2 focus:ring-accent-soft"
      />
    </label>
  );
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.login({ email, password });
      window.dispatchEvent(new Event("orizoncp-auth-changed"));
      window.location.assign("/");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not sign in");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-sm rounded-lg border border-line bg-surface p-8"
      aria-label="Sign in to orizonCP"
    >
      <h1 className="text-2xl font-bold text-ink">Welcome back</h1>

      <div className="mt-8 grid gap-y-5">
        <LoginField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          placeholder="you@example.com"
        />
        <LoginField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          placeholder="Enter your password"
        />
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-5 rounded-md border border-bad bg-bad/20 p-3 text-sm text-bad"
        >
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 flex h-9 w-full items-center justify-center rounded-md bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
