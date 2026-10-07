import type { OnboardingForm } from "./onboarding-types";

function RuntimeField({
  label,
  envName,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  envName: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3">
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
          {label}
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-zinc-600">
          {envName}
        </span>
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        spellCheck={false}
        className="h-12 w-full rounded-sm border border-white/15 bg-white/5 px-3.5 font-mono text-xs text-white outline-none transition placeholder:text-zinc-600 hover:border-white/30 focus:border-white focus:bg-white/10 focus:ring-2 focus:ring-white/10"
      />
    </label>
  );
}

export function RuntimeConfigurationFields({
  form,
  update,
}: {
  form: OnboardingForm;
  update: (patch: Partial<OnboardingForm>) => void;
}) {
  return (
    <div className="space-y-9">
      <RuntimeField
        label="Public URL"
        envName="PUBLIC_URL"
        value={form.publicUrl}
        onChange={(publicUrl) => update({ publicUrl })}
        placeholder="https://orizoncp.example.com"
        required
      />
    </div>
  );
}
