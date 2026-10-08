# HANDOFF.md

## Done (this session)
- Removed the entire design system / design rules (branch `remove-design-rules`).
- Unified loaders to one circle loader (`components/ui/loader.tsx` + `.page-loader` css + static one in index.html); deleted `spinner.tsx`.
- Top bar: no title, `h-5`, no border. Sidebar: removed theme toggle + notification bell; removed dead `/cdn` + `/billing` nav.
- Added root `notFoundComponent` (404) via `pages/not-found-page.tsx`.
- Service tabs drive the sidebar via `features/services/service-nav-store.ts` (all 10 tabs, per service type).
- Fixed the 3 pre-existing typecheck errors. `tsc --noEmit` (client + server) is clean; build passes.
- **User CRUD (DONE)**: `PATCH`/`DELETE /api/system/users/:userId` (`system-user-routes.ts`, `user-management.ts`) with last-owner + owns-projects guards; `api.updateSystemUser`/`deleteSystemUser`; role `<select>` + Delete (with confirm) in `components/modals/user-list.tsx` + `users-settings-panel.tsx`.
- **Environment CRUD (backend + api DONE)**: `PATCH`/`DELETE /api/projects/:projectId/environments/:environmentId` (`index.ts` ~L2282, `project-environments.ts` rename/delete with guards — no default, ≥1 env, must be empty); `api.updateProjectEnvironment`/`deleteProjectEnvironment`.

## Remaining

### 1. Environment rename/delete UI (backend ready)
- `components/modals/create-environment-modal.tsx` already parameterized-ready — add `title`/`submitLabel`/`initialName`/`description` props (not yet added) to reuse it for rename, or make a small `RenameEnvironmentModal`.
- In `pages/project-page.tsx` (~L295): add "Rename" / "Delete" buttons for `selectedEnvironment` (disable when `isDefault`); wire `api.updateProjectEnvironment` / `api.deleteProjectEnvironment`, then reload the project. Add a `ConfirmationDialog` for delete.

### 2. Deployment rollback
- Server: `POST /api/deployments/:deploymentId/rollback` (`index.ts` ~L3145, auth via `getAuthorizedDeploymentService`). Require the source deployment has an `imageTag`; re-enqueue with `enqueueDeployment(service.id, { trigger: "rollback:" + source.id })`.
- `deploy.ts runDeployment()` (~L847): add an early branch — if `deployment.trigger.startsWith("rollback:")`, resolve the source deployment's `imageTag` and run it via the same container-run path as the docker-image branch (~L994–1030) instead of building.
- Client: `api.rollbackDeployment(id)`; add a Rollback button in `features/services/service-deployments-panel.tsx` (top action row).

### 3. Cleanup
- God files: `src/server/index.ts` (~3.8k), `src/server/deploy.ts` (1.7k), `create-service-modal.tsx` (1.3k), `service-page-shell.tsx` (~0.95k).
- Duplication: two R2 stacks (`/api/system/r2` vs `/api/system/backup-storage/r2`), three DB viewers, overlapping env editors.
- Unused `GET /api/search`; `exportMigrationBundle` bypasses the shared `request` helper.
- Branding filenames: `website/src/components/aeroplane-logo.astro`, `website/src/content/docs/docs/migration/aeroplane-bundles.md`.

## Notes
- Repo root: `C:\Users\learn\Videos\ORIZON CP\aeroplane`. Commands: `npm run dev`, `npm run build`, `npm run typecheck`.
- Branch: `remove-design-rules`. `tsc --noEmit` clean; `vite build` passes.
