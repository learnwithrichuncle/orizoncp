import { Link } from "@tanstack/react-router";
import { usePageTitle } from "../lib/page-title";

export function NotFoundPage() {
  usePageTitle("Not found");

  return (
    <div className="grid min-h-[calc(100dvh-10rem)] place-items-center px-6 text-center">
      <div>
        <div className="font-mono text-5xl text-neutral-700">404</div>
        <h1 className="mt-4 text-lg text-neutral-100">Page not found</h1>
        <p className="mt-2 text-sm text-neutral-500">
          This page does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-9 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}