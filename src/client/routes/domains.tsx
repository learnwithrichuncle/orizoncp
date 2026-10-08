import { createFileRoute } from "@tanstack/react-router";
import { DomainsPage } from "../pages/domains-page";

export const Route = createFileRoute("/domains")({
  component: DomainsPage
});
