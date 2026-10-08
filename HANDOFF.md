# HANDOFF.md

## Done (this session)
- Removed the entire design system / design rules (branch `remove-design-rules`): tokens, glass utilities, UI-STYLE.md, HANDOFF.md, agents.md UI-RULES; remapped classes to neutral Tailwind defaults; cleaned website css; index.html.
- Unified loaders to one circle loader (`components/ui/loader.tsx` + `.page-loader` css + static one in index.html); deleted `spinner.tsx`.
- Top bar: removed title, height `h-5`, no border.
- Sidebar: removed theme toggle + notification bell; removed dead `/cdn` + `/billing` nav; added root `notFoundComponent` (404) via `pages/not-found-page.tsx`.
- Service tabs now drive the sidebar via `features/services/service-nav-store.ts` (all 10 tabs, per service type).
- Fixed the 3 pre-existing typecheck errors (`ai-provider-form.tsx`, `function-source-panel.tsx`). `tsc --noEmit` is clean; build passes.

## Remaining (next steps, in order)

### 1. Deployment rollback
- Server: add `POST /api/deployments/:deploymentId/rollback` in `src/server/index.ts` (near the other `/api/deployments/:id/*` routes ~L3145).
  - Auth via `getAuthorizedDeploymentService(c)`. Load the source deployment; require `imageTag`.
  - Re-enqueue with a trigger that encodes the source: `enqueueDeployment(service.id, { trigger: "rollback:" + source.id })` (avoids a schema change).
  - In `src/server/deploy.ts` `runDeployment()` (~L847), add an early branch: if `deployment.trigger.startsWith("rollback:")`, resolve the source deployment's `imageTag` and run it using the same container-run path as the docker-image branch (~L994–1030) instead of building.
- Client: `api.rollbackDeployment(deploymentId)` in `src/client/api.ts`; add a "Rollback" button in `features/services/service-deployments-panel.tsx` (top action row).

### 2. User CRUD
- Server: handlers for `/api/system/users` are registered under `app.use("/api/system/users", requireOwnerSessionAccessMiddleware)` (`index.ts` ~L1610). Add `PATCH /api/system/users/:userId` (role: owner|user) and `DELETE /api/system/users/:userId` (block deleting the last owner / self).
- Client: `api.updateSystemUser` / `api.deleteSystemUser`; add role select + delete in `src/client/components/modals/users-settings-panel.tsx`. Roles exist only as `owner|user` in `src/server/auth.ts`.

### 3. Environment rename/delete
- Server: `PATCH /api/projects/:projectId/environments/:environmentId`, `DELETE ...` (reassign or block if services exist). Create-only today (`POST .../environments`).
- Client: `api.updateEnvironment` / `api.deleteEnvironment`; wire into `features/projects/` (project page / create-environment-modal area).

### 4. Cleanup
- God files: `src/server/index.ts` (3.7k), `src/server/deploy.ts` (1.7k), `create-service-modal.tsx` (1.3k), `service-page-shell.tsx` (0.9k).
- Duplication: two R2 stacks (`/api/system/r2` vs `/api/system/backup-storage/r2`), three DB viewers, overlapping env editors.
- Unused `GET /api/search`; `exportMigrationBundle` bypasses the shared `request` helper.
- Branding filenames: `website/src/components/aeroplane-logo.astro`, `website/src/content/docs/docs/migration/aeroplane-bundles.md`.

## Notes
- Repo root: `C:\Users\learn\Videos\ORIZON CP\aeroplane`. Commands: `npm run dev`, `npm run build`, `npm run typecheck`.
- Current branch: `remove-design-rules` (design-rule removal is committed here; the rest above is uncommitted/committed incrementally).
