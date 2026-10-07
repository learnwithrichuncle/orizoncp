# HANDOFF.md

## Task
Restyle ONLY the logged-in dashboard (shell + pages + their components). Dark glassmorphic premium infra dashboard, unrecognizable from Aeroplane. No logic/backend changes.

## Phase 0 (audit) — DONE
- Stack: Vite + React + Tailwind v4 (no tailwind.config.js; theme lives in `@theme` of `src/client/styles.css`). Fonts loaded via @import in styles.css.
- Icons: `lucide-react` (Lucide) already used in sidebar; `primitives.tsx` uses `@hugeicons` — will swap to Lucide in phase 2.
- Shell files: `components/layout/root-shell.tsx`, `app-sidebar.tsx`, `root-header.tsx`.
- Shared UI: `components/ui/` (primitives.tsx, dropdown.tsx, checkbox.tsx, skeleton.tsx, square-switch.tsx, autocomplete-input.tsx, runtime-mode-control.tsx, build-method-control.tsx, github-logo.tsx, brand-mark.tsx, framework-icon-colors.ts).
- Dashboard pages: pages/projects-page.tsx, pages/project-page.tsx, pages/service-page.tsx, features/settings/settings-page.tsx. Also many under `features/projects/`, `features/services/`, `components/modals/`.
- Already restyled (OUT of scope, leave): onboarding flow, login page, onboarding success page, onboarding brand header.

## Phase 2 — DONE
- primitives: AppIcon size 20/stroke 2, surfaceClass +backdrop-blur, buttons rounded-md, inputs h-10.
- square-switch, runtime/build-method controls, autocomplete dropdown: old white/black/zinc → accent/line/muted/glass tokens.
- dropdown menu +backdrop-blur. Build passes.

## Phase 3 — DONE (bulk token sweep)
- Swept 125 + 104 files: zinc/neutral → ink/muted/dim; border-white/*, bg-white/* → line/glass/hover; active `bg-white text-black` → `bg-accent text-white`; `bg-black`→`bg-base`. Build passes.

## Phase 4 — DONE (color sweep)
- Replaced old Railway teal brand (#4FB8B2/#7fe3dd/#9af4ee) → orizonCP accent (#FF6B35/#FF8A5C) across 47 files; text-zinc-100→text-ink. No `aeroplane` refs remain in client. Build passes.

## Remaining (optional / future)
- Icon library: `primitives.tsx` AppIcon still renders `@hugeicons`; sidebar/header already use `lucide-react`. Visual parity achieved via stroke 2/size 20; full swap deferred (105 files, divergent icon names, high breakage risk, no visual gain).
- Structural reorder: projects dashboard header wired in (stats + New project/Import actions). project-page/service-page section reorder still available as polish.