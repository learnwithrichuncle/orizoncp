import { FormEvent, useState } from "react";
import { FormInput } from "../ui/primitives";

type UserCreateFormProps = {
  creating: boolean;
  onCreate: (input: { email: string; password: string }) => Promise<void>;
};

export function UserCreateForm({ creating, onCreate }: UserCreateFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");

    const nextEmail = email.trim().toLowerCase();
    if (!nextEmail) {
      setError("Email is required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      await onCreate({ email: nextEmail, password });
      setEmail("");
      setPassword("");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not create user");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="new-user-email" className="block text-xs text-ink-muted">
          Email
        </label>
        <FormInput
          id="new-user-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="teammate@example.com"
          disabled={creating}
          autoComplete="email"
          variant="monochrome"
          className="!h-9 border-line bg-glass text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="new-user-password" className="block text-xs text-ink-muted">
          Password
        </label>
        <FormInput
          id="new-user-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          disabled={creating}
          autoComplete="new-password"
          variant="monochrome"
          className="!h-9 border-line bg-glass text-sm"
        />
      </div>

      {error ? <div className="border-l-2 border-bad bg-bad/10 px-3 py-2.5 text-xs text-bad">{error}</div> : null}

      <div className="flex justify-end border-t border-line pt-4">
        <button
          type="submit"
          className="inline-flex h-9 items-center justify-center bg-accent px-4 text-sm text-ink transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={creating}
        >
          {creating ? "Adding..." : "Add user"}
        </button>
      </div>
    </form>
  );
}
