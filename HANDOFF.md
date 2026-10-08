# HANDOFF.md

## Done (this session)
- Removed the entire design system / design rules (branch `remove-design-rules`).
- Unified loaders to one circle loader; deleted `spinner.tsx`.
- Top bar: no title, `h-5`, no border. Sidebar: removed theme toggle + notification bell, and dead `/cdn` + `/billing` nav.
- Added root `notFoundComponent` (404) via `pages/not-found-page.tsx`.
- Service tabs drive the sidebar via `features/services/service-nav-store.ts` (all 10 tabs, per service type).
- Fixed the 3 pre-existing typecheck errors. `tsc` (client + server) clean; build passes.
- **User CRUD — DONE**: `PATCH`/`DELETE /api/system/users/:userId` + guards; `api.updateSystemUser`/`deleteSystemUser`; role `<select>` + Delete (confirm) in the Users panel.
- **Environment CRUD — DONE**: `PATCH`/`DELETE /api/projects/:projectId/environments/:environmentId` + guards; `api.updateProjectEnvironment`/`deleteProjectEnvironment`; **Rename / Delete** buttons on the project page (Delete disabled for the default env) with the (now-parameterized) `CreateEnvironmentModal` + `ConfirmationDialog`.

## Remaining

### 1. Deployment rollback
- Server: `POST /api/deployments/:deploymentId/rollback` (`index.ts` ~L3145; auth via `getAuthorizedDeploymentService`). Require the source deployment has an `imageTag`; re-enqueue with `enqueueDeployment(service.id, { trigger: "rollback:" + source.id })`.
- `deploy.ts runDeployment()` (~L847): add an early branch — if `deployment.trigger.startsWith("rollback:")`, resolve the source deployment's `imageTag` and run it via the same container-run path as the docker-image branch (~L994–1030) instead of building. Read that branch fully before editing.
- Client: `api.rollbackDeployment(id)`; Rollback button in `features/services/service-deployments-panel.tsx`.

### 2. Cleanup
- Done: removed unused `GET /api/search` (+ `searchSchema`); deleted dead `website/src/components/aeroplane-logo.astro`; renamed `aeroplane-bundles.md` → `orizoncp-bundles.md` (also fixed the docs sidebar entry in `astro.config.mjs`).
- Remaining (larger/riskier): god-file splitting (`src/server/index.ts` ~3.8k, `deploy.ts` 1.7k, `create-service-modal.tsx` 1.3k, `service-page-shell.tsx` ~0.95k); duplication (two R2 stacks, three DB viewers, overlapping env editors); `exportMigrationBundle` bypasses the shared `request` helper.

## Notes
- Repo root: `C:\Users\learn\Videos\ORIZON CP\aeroplane`. Commands: `npm run dev`, `npm run build`, `npm run typecheck`.
- Branch: `remove-design-rules`. `tsc` clean; `vite build` passes.
