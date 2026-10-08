import { XIcon } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { RailwayLogo } from "../../components/icons/railway-logo";
import { VercelLogo } from "../../components/icons/vercel-logo";

export type ProjectImportSource = "railway" | "vercel";

const providers: Array<{
  id: ProjectImportSource;
  name: string;
  logo: ComponentType<SVGProps<SVGSVGElement>>;
}> = [
  {
    id: "railway",
    name: "Railway",
    logo: RailwayLogo,
  },
  {
    id: "vercel",
    name: "Vercel",
    logo: VercelLogo,
  },
];

export function ProjectImportModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (source: ProjectImportSource) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 p-4 backdrop-blur-sm">
      <div className="mx-auto flex min-h-full items-center justify-center">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-import-title"
          className="w-full max-w-2xl rounded-lg border border-neutral-800 bg-neutral-900 p-8 text-neutral-100 shadow-2xl"
        >
          <header className="flex items-start justify-between gap-5">
            <h2 id="project-import-title" className="text-2xl font-bold text-neutral-100">
              Import from…
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 flex-none place-items-center rounded-md text-neutral-500 transition hover:bg-neutral-800 hover:text-neutral-100"
              aria-label="Close project import modal"
            >
              <XIcon size={20} />
            </button>
          </header>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {providers.map((provider) => {
              const Logo = provider.logo;
              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => onSelect(provider.id)}
                  className="group rounded-lg border border-neutral-800 bg-neutral-800 p-6 text-left transition hover:border-neutral-700 hover:bg-neutral-800"
                >
                  <Logo aria-hidden className="h-8 w-8" />
                  <span className="mt-6 block font-semibold text-neutral-100">
                    {provider.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
