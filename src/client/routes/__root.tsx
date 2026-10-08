import { createRootRoute } from "@tanstack/react-router";
import { RootShell } from "../components/layout/root-shell";
import { NotFoundPage } from "../pages/not-found-page";

export const Route = createRootRoute({
  component: RootShell,
  notFoundComponent: NotFoundPage
});
