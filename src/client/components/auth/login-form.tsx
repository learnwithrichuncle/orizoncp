import { type FormEvent, useState } from "react";
import { api } from "../../api";
import { FieldLabel, FormInput } from "../ui/primitives";

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
      className="rounded-lg border border-neutral-800 bg-neutral-900 p-8"
      aria-label="Sign in to orizonCP"
    >
      <h1 className="text-2xl font-bold text-neutral-100">Welcome back</h1>

      <div className="mt-8 grid gap-y-5">
        <div>
          <FieldLabel>Email</FieldLabel>
          <FormInput
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <FieldLabel>Password</FieldLabel>
          <FormInput
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-5 rounded-md border border-red-500 bg-red-500/20 p-3 text-sm text-red-500"
        >
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 flex h-12 w-full items-center justify-center rounded-sm bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}