import { FormEvent, useState } from "react";
import type { ApiKeyAccessLevel, ApiKeyExpiryDays, ApiKeyProjectOption, ApiKeyProjectScope } from "../../api";
import { Checkbox } from "../ui/checkbox";
import { Dropdown, type DropdownOption } from "../ui/dropdown";
import { FieldLabel, FormInput } from "../ui/primitives";

type ApiKeyCreateInput = {
  name: string;
  accessLevel: ApiKeyAccessLevel;
  projectScope: ApiKeyProjectScope;
  projectIds: string[];
  expiresInDays: ApiKeyExpiryDays;
};

type ApiKeyCreateFormProps = {
  projects: ApiKeyProjectOption[];
  creating: boolean;
  onCreate: (input: ApiKeyCreateInput) => Promise<void>;
};

const accessOptions: DropdownOption[] = [
  { value: "read", label: "Read" },
  { value: "write", label: "Read and write" }
];

const expiryOptions: DropdownOption[] = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "never", label: "No expiration" }
];

export function ApiKeyCreateForm({ projects, creating, onCreate }: ApiKeyCreateFormProps) {
  const [name, setName] = useState("");
  const [accessLevel, setAccessLevel] = useState<ApiKeyAccessLevel>("read");
  const [projectScope, setProjectScope] = useState<ApiKeyProjectScope>("all");
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [expiresInDays, setExpiresInDays] = useState<ApiKeyExpiryDays>(30);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required");
      return;
    }
    if (projectScope === "selected" && projectIds.length === 0) {
      setError("Choose at least one project");
      return;
    }

    try {
      await onCreate({
        name: trimmedName,
        accessLevel,
        projectScope,
        projectIds: projectScope === "selected" ? projectIds : [],
        expiresInDays
      });
      setName("");
      setAccessLevel("read");
      setProjectScope("all");
      setProjectIds([]);
      setExpiresInDays(30);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not create API key");
    }
  }

  function toggleProject(projectId: string, checked: boolean) {
    setProjectIds((current) => checked ? [...new Set([...current, projectId])] : current.filter((id) => id !== projectId));
  }

  const projectScopeOptions: DropdownOption[] = [
    { value: "all", label: "All projects" },
    { value: "selected", label: "Specific projects", disabled: projects.length === 0 }
  ];

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div>
        <FieldLabel>Name</FieldLabel>
        <FormInput
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Production deploys"
          disabled={creating}
          variant="monochrome"
          className="!h-9 border-line bg-glass text-sm"
        />
      </div>

      <div className="border-y border-line">
        <div className="flex items-center justify-between gap-4 border-b border-line py-2.5">
          <span className="text-xs text-ink-muted">Access</span>
          <Dropdown
            value={accessLevel}
            options={accessOptions}
            onChange={(value) => setAccessLevel(value as ApiKeyAccessLevel)}
            disabled={creating}
            variant="monochrome"
            size="compact"
            className="w-40"
          />
        </div>

        <div className="flex items-center justify-between gap-4 border-b border-line py-2.5">
          <span className="text-xs text-ink-muted">Projects</span>
          <Dropdown
            value={projectScope}
            options={projectScopeOptions}
            onChange={(value) => setProjectScope(value as ApiKeyProjectScope)}
            disabled={creating}
            variant="monochrome"
            size="compact"
            className="w-40"
          />
        </div>

        <div className="flex items-center justify-between gap-4 py-2.5">
          <span className="text-xs text-ink-muted">Expiration</span>
          <Dropdown
            value={expiresInDays === null ? "never" : String(expiresInDays)}
            options={expiryOptions}
            onChange={(value) => {
              setExpiresInDays(value === "never" ? null : (Number(value) as ApiKeyExpiryDays));
            }}
            disabled={creating}
            variant="monochrome"
            size="compact"
            placement="top"
            className="w-40"
          />
        </div>
      </div>

      {projectScope === "selected" ? (
        <div>
          <FieldLabel>Choose projects</FieldLabel>
          <div className="grid max-h-40 gap-0.5 overflow-y-auto border border-line bg-glass p-1.5">
            {projects.map((project) => (
              <Checkbox
                key={project.id}
                checked={projectIds.includes(project.id)}
                label={project.name}
                onChange={(checked) => toggleProject(project.id, checked)}
                disabled={creating}
                className="w-full px-2.5 py-2 transition hover:bg-glass"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm text-ink">{project.name}</span>
                  <span className="mt-0.5 block truncate font-mono text-[9px] text-ink-dim">{project.slug}</span>
                </span>
              </Checkbox>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          className="inline-flex min-h-8 w-fit items-center justify-center bg-accent px-3 text-xs text-ink transition hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-50"
          disabled={creating}
        >
          {creating ? "Creating..." : "Create key"}
        </button>
        {error ? <span className="text-sm text-bad">{error}</span> : null}
      </div>
    </form>
  );
}
