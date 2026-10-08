import { createFileRoute } from "@tanstack/react-router";
import { DeploymentsPage } from "../pages/deployments-page";

export const Route = createFileRoute("/deployments")({
  component: DeploymentsPage
});
