# UI-STYLE.md — orizonCP dashboard

## Tokens (Tailwind v4 @theme in src/client/styles.css)
- bg: #05070a · surface: rgba(255,255,255,0.04) · border: 1px rgba(255,255,255,0.08)
- accent: #FF6B35 · text: #E8EAED · muted: #8A8F98
- success: #22C55E · warn: #EAB308 · danger: #EF4444
- fonts: Urbanist (headings, 500–700, -0.02em) · Inter (body) · JetBrains Mono (numbers/logs/IDs)
- radius: 14px cards · 10px inputs/buttons · 999px badges
- glass: backdrop-blur 12–16px, surface rgba(255,255,255,0.04), border rgba(255,255,255,0.08)
- icons: Lucide stroke 2, size 20, #606060 (accent #FF6B35 when active)
- motion: 150–200ms ease

## Class patterns
- Card: `glass-card` → rounded-[14px] border border-line bg-glass backdrop-blur-xl
- Input: `glass-input` → h-10 rounded-[10px] border border-line bg-glass px-3 text-sm text-ink placeholder:text-muted focus:border-accent
- Button (primary): `h-10 rounded-[10px] bg-accent px-4 text-sm font-medium text-white hover:bg-accent/90`
- Button (ghost): `h-10 rounded-[10px] border border-line px-4 text-sm text-muted hover:text-ink`
- Badge: `rounded-full px-2.5 py-0.5 text-xs` + dot, mono
- Modal: glass-card + overlay bg-black/60 backdrop-blur
- Table: dense rows, mono numbers (font-mono), borders border-line only on rows
- Status: dot (h-1.5 w-1.5 rounded-full, bg-success/danger) + muted label

## Rules
- Use Tailwind tokens + Lucide only. No new libraries.
- Reuse primitives (Button, Input, Card, Modal, Badge, Tabs, Toast, Dropdown, Toggle, Loader, EmptyState).
- Mono for numbers/logs/IDs. No hardcoded hex — use tokens.
- Placeholders: reword microcopy, no "Aeroplane".