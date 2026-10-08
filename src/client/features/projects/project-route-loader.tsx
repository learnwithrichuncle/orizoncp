import { Spinner } from "../../components/ui/spinner";

export function ProjectRouteLoader({
  label = "Loading project",
  fullPage = false
}: {
  label?: string;
  fullPage?: boolean;
}) {
  const loader = (
    <div
      role="status"
      aria-label={label}
      className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center"
    >
      <Spinner size={28} />
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
        {label}
      </p>
      <span className="sr-only">Please wait</span>
    </div>
  );

  if (fullPage) {
    return (
      <main className="grid h-dvh place-items-center overflow-hidden bg-neutral-950 text-neutral-100">
        {loader}
      </main>
    );
  }

  return (
    <section className="grid min-h-[calc(100dvh-8rem)] place-items-center overflow-hidden">
      {loader}
    </section>
  );
}