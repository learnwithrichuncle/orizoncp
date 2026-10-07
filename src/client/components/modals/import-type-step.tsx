import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { AppIcon } from "../ui/primitives";
import { ServiceTypeIcon, type ServiceType } from "./service-type-icon";

export type { ServiceType } from "./service-type-icon";

type ServiceTypeOption = {
  key: ServiceType;
  name: string;
  desc: string;
};

const SERVICE_TYPE_OPTIONS: ServiceTypeOption[] = [
  {
    key: "git",
    name: "Git Repository",
    desc: "Deploy from a GitHub repo or Git URL."
  },
  {
    key: "database",
    name: "Database",
    desc: "Provision Postgres, MySQL, MongoDB, or Redis."
  },
  {
    key: "docker-image",
    name: "Docker Image",
    desc: "Run a prebuilt container image."
  },
  {
    key: "function",
    name: "Function",
    desc: "Deploy a serverless function."
  }
];

export function ImportTypeStep({ onSelect }: { onSelect: (type: ServiceType) => void }) {
  return (
    <div className="space-y-2.5">
      {SERVICE_TYPE_OPTIONS.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onSelect(option.key)}
          className="group flex w-full items-center gap-4 rounded-[14px] border border-line bg-glass p-4 text-left transition hover:border-accent/40 hover:bg-hover"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] border border-line bg-hover text-muted transition group-hover:text-accent">
            <ServiceTypeIcon
              type={option.key}
              className={option.key === "docker-image" ? "h-6 w-6 object-contain" : "h-5 w-5"}
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-hero text-sm font-semibold tracking-[-0.02em] text-ink">
              {option.name}
            </span>
            <span className="mt-0.5 block text-xs text-muted">{option.desc}</span>
          </span>
          <AppIcon
            icon={ArrowLeft01Icon}
            size={16}
            className="rotate-180 text-muted transition group-hover:translate-x-0.5 group-hover:text-ink"
          />
        </button>
      ))}
    </div>
  );
}
