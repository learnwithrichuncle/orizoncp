import { createFileRoute } from "@tanstack/react-router";
import { MigrationsPage } from "../pages/migrations-page";

export const Route = createFileRoute("/migrations")({
  component: MigrationsPage
});
