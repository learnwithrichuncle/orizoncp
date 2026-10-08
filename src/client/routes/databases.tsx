import { createFileRoute } from "@tanstack/react-router";
import { DatabasesPage } from "../pages/databases-page";

export const Route = createFileRoute("/databases")({
  component: DatabasesPage
});
