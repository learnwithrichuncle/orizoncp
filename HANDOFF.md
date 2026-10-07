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

## Next: Phase 1 — tokens + shell
1. Rewrite `@theme` in styles.css to target tokens, load Urbanist+Inter+JetBrains Mono, remove old tokens.
2. Add glass-card / glass-input / accent-glow utilities.
3. Rebuild shell: slim icon rail nav + top command bar + rearranged container/grid.