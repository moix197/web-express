# Plan: web-express — Sticky Top Navigation Bar

**Created:** 2026-06-18
**Branch:** feat/web-express-landing
**Status:** not started

---

## Context

The web-express landing page (`src/app/page.tsx`, branch `feat/web-express-landing`) has no top navigation bar. Visitors have no persistent way to jump between sections or trigger the main WhatsApp CTA while scrolling. This plan adds a sticky top navbar that is always visible (solid, never transparent-over-hero), handles light/dark mode via next-themes, provides anchor links to all 5 sections (Inicio, Servicios, Proceso, FAQ, Contacto), includes a WhatsApp CTA button, a theme toggle, and a mobile hamburger dropdown. It also adds `id="inicio"` to the Hero section and sets `scroll-padding-top` and `scroll-behavior: smooth` in globals.css so anchored sections are not hidden behind the sticky bar.

Stack facts (already resolved — do not re-explore):
- Root layout: `src/app/layout.tsx` — `<body className="flex min-h-full flex-col">`, ThemeProvider wraps children + WhatsAppFloatingButton. `<Navbar />` inserts inside ThemeProvider, before `{children}`.
- Contact helpers: `src/lib/contact.ts` — `buildWhatsAppUrl(name, message, config)` (pure, client-safe), `RESERVE_CALL_WA_MESSAGE`. CTA href uses `buildWhatsAppUrl("", RESERVE_CALL_WA_MESSAGE, siteConfig)`.
- Site config: `src/content/site.ts` — `siteConfig` with `name`, `whatsApp`, etc. No logo asset; brand text uses `siteConfig.name`.
- Globals: `src/app/globals.css` — Tailwind v4 `@import "tailwindcss"`, `@theme` inline tokens, `:root` + `.dark` + `.section-invert` blocks. No `scroll-padding-top` or `scroll-behavior` currently. `prefers-reduced-motion` reset already present.
- z-index convention: WhatsAppFloatingButton = z-30; project cap = z-50. Navbar = z-40.
- Section anchors already in DOM: `#servicios`, `#proceso`, `#faq`, `#contacto`. Hero has no id — Phase 1 adds `id="inicio"`.
- shadcn Button variants: default, outline, secondary, ghost, destructive, link. Sizes: default, xs, sm, lg, icon (size-8), icon-sm (size-7), icon-lg. Ghost for nav links, default for CTA, icon-sm for ThemeToggle.
- Client component import order (from Faq.tsx, Contact.tsx): `"use client"` → react → shadcn ui → lib → content.
- No `components/layout/` dir yet — Navbar lives at `src/components/layout/Navbar.tsx`; ThemeToggle at `src/components/ui/ThemeToggle.tsx`.
- Transitions: only `transition-colors duration-150` in the project. No animation libraries.
- next-themes v0.4.6: ThemeToggle requires mounted-guard (useEffect + `mounted` state) to avoid hydration mismatch.
- Footer (`src/components/sections/Footer.tsx`): defines Inicio link as `href="#"` — Phase 3 refactors Footer to import `NAV_LINKS` from `src/components/layout/nav-links.ts`, which fixes the `href="#"` automatically via the shared constant.
- Single source of truth for height coupling: navbar height is `h-20` (5rem / 80px). `scroll-padding-top: 5rem` in globals.css and the `NAVBAR_HEIGHT = 80` constant in `useActiveSection.ts` both derive from this. If navbar height changes, update all three locations. (NOTE: the scroll-spy was reworked post-implementation from an `IntersectionObserver` to an rAF-throttled `getBoundingClientRect` geometry check — see commit `8db3251`; the active section is the last one whose top crosses `NAVBAR_HEIGHT + 30vh`.)

---

## Risk: low

Narrowly scoped UI addition on top of a completed landing page. No backend, no data fetching, no new dependencies. Primary risks: next-themes hydration flash if mounted-guard is missing in ThemeToggle; scroll-padding-top value must match navbar height (5rem = 80px); IntersectionObserver rootMargin must account for sticky bar height or active-link tracking fires at wrong scroll position; mobile focus management (Escape + return focus to hamburger) is easy to omit.

---

## Dependencies & Risks

| Dependency | Version | Risk | Notes |
|---|---|---|---|
| next-themes | 0.4.6 | low | Already installed; mounted-guard pattern required for ThemeToggle |
| lucide-react | latest | low | Already installed; Menu, X, Sun, Moon icons used |
| shadcn/ui Button | latest | low | Already installed; ghost, default, icon-sm sizes used |
| IntersectionObserver | browser native | low | No polyfill needed for target browsers; no new package required |

**No new pnpm dependencies are introduced in this plan.** All builds on what Phase 1–7 of the landing plan already installed.

**External risks:**
- `scroll-padding-top: 5rem` is tied to the navbar height. If the navbar height changes, this value must be updated in sync.
- IntersectionObserver `rootMargin` of `-80px 0px -60% 0px` assumes ~80px navbar height. Recalibrate if the bar grows.
- ThemeToggle must render `null` until mounted to avoid SSR/client hydration mismatch with next-themes.

---

## Phases

### Phase 0: Branch detection (no-op)

**Mode:** afk
**Type:** config

Phase 0 exception: the branch `feat/web-express-landing` already exists and was created by the web-express-landing plan. No new worktree is created. This is the one permitted exception — the worktree/branch is pre-existing, and creating a duplicate worktree would be destructive. This phase is a detection-only checkpoint to confirm execution context before any code changes.

**Steps:**
- [ ] Confirm the branch exists: `git branch --list feat/web-express-landing`
- [ ] Confirm the working directory is on the correct branch: `git status`
- [ ] No worktree creation needed — branch already exists; execution starts directly on it.

---

### Phase 1: Navbar shell + desktop layout + scroll globals

**Risk:** low
**Mode:** afk
**Type:** frontend

**Success criteria:** At desktop widths (≥ md), the navbar is visible at the top of every scroll position (sticky), shows the brand name linking to `#inicio`, shows 5 inline nav links (Inicio, Servicios, Proceso, FAQ, Contacto), a "Reservá una llamada" CTA that opens the correct WhatsApp URL in a new tab, and a sun/moon theme toggle that flips light/dark with no hydration flash. Clicking any nav link scrolls to the correct section with the heading not hidden behind the bar (scroll-padding-top working). `pnpm build` exits 0.

**Commit message:** `feat(navbar): add sticky desktop navbar with ThemeToggle, anchor links, and scroll globals`

**File changes:**

| Action | File | What changes |
|---|---|---|
| create | `src/components/ui/ThemeToggle.tsx` | Client component; icon-only sun/moon toggle; mounted-guard; `aria-label`; uses shadcn Button size icon-sm |
| create | `src/components/layout/nav-links.ts` | shared NAV_LINKS constant used by Navbar and Footer |
| create | `src/components/layout/Navbar.tsx` | Client component; imports `NAV_LINKS` from `nav-links.ts`; desktop: brand + inline links (ghost Button) + CTA (default Button) + ThemeToggle; `sticky top-0 z-40` always-solid; hamburger hidden (not yet implemented) |
| modify | `src/app/layout.tsx` | Import and render `<Navbar />` inside ThemeProvider, before `{children}` |
| modify | `src/app/globals.css` | Add `scroll-padding-top: 5rem` and `scroll-behavior: smooth` to `html`; extend `prefers-reduced-motion` block with `scroll-behavior: auto` |
| modify | `src/components/sections/Hero.tsx` | Add `id="inicio"` to the outermost `<section>` element |

**Steps:**
- [x] Create `src/components/ui/ThemeToggle.tsx` — `"use client"`; import `useTheme` from `next-themes`; use the mounted-guard pattern exactly: `const [mounted, setMounted] = useState(false); useEffect(() => { setMounted(true); }, []); if (!mounted) return null;` — this is the required next-themes hydration guard; rendering before mount would cause a server/client mismatch because `useTheme()` returns `undefined` on the server; render shadcn `Button` size `icon-sm` with lucide `Sun` when theme is `"dark"`, `Moon` when `"light"`; `aria-label="Cambiar tema"` — icon-only buttons MUST have an aria-label; without it, screen readers announce only the SVG title or nothing; `aria-label='Cambiar tema'` satisfies WCAG 2.1 SC 4.1.2; `onClick` toggles between `"light"` and `"dark"`; do NOT use `text-accent` on the toggle label or any small text — it fails WCAG AA on both backgrounds; use `text-foreground` for any labels
- [x] Create directory `src/components/layout/`
- [x] Create `src/components/layout/nav-links.ts` — `export const NAV_LINKS: ReadonlyArray<{ label: string; href: string }> = [{ label: "Inicio", href: "#inicio" }, { label: "Servicios", href: "#servicios" }, { label: "Proceso", href: "#proceso" }, { label: "FAQ", href: "#faq" }, { label: "Contacto", href: "#contacto" }]`
- [x] Create `src/components/layout/Navbar.tsx` — `"use client"`; import `NAV_LINKS` from `src/components/layout/nav-links.ts` (do NOT redefine inline); import `buildWhatsAppUrl`, `RESERVE_CALL_WA_MESSAGE` from `src/lib/contact.ts`; import `siteConfig` from `src/content/site.ts`; import shadcn `Button`; import `cn` from `src/lib/utils`; import `ThemeToggle` from `src/components/ui/ThemeToggle`; render `<header role="banner">` — the `role="banner"` is implicit on a top-level `<header>`, but confirm it renders as a landmark by running axe — with `sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border`; the inner `<nav>` must have `aria-label="Navegación principal"` so it is distinguished from any other `<nav>` on the page; brand = `<a href="#inicio">{siteConfig.name}</a>`; desktop nav = `<nav aria-label="Navegación principal" className="hidden md:flex gap-6">` mapping NAV_LINKS to ghost Button as `<a>`; nav link `<a>` elements styled as ghost Button already inherit shadcn's `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` — confirm this is preserved and not overridden by custom classes; do NOT add a custom `outline` that bypasses the design system; CTA = default Button as `<a href={buildWhatsAppUrl("", RESERVE_CALL_WA_MESSAGE, siteConfig)} target="_blank" rel="noopener noreferrer">`; render `<ThemeToggle />`; no hamburger yet
- [x] Modify `src/app/layout.tsx`: import `Navbar` from `src/components/layout/Navbar`; render `<Navbar />` as first child inside `<ThemeProvider>`, before `{children}`
- [x] Modify `src/app/globals.css`: add `scroll-padding-top: 5rem; scroll-behavior: smooth;` to the `html` selector (add block if not present) — `scroll-padding-top: 5rem` is tied to navbar height `h-20`; see "Single source of truth for height coupling" note in Context; this also prevents the sticky navbar from overlapping the focus outline of anchored headings — if section headings use `focus-visible` outlines, those are now clear of the bar; if navbar height changes, update `scroll-padding-top` here, the `h-20` class on `<header>`, and `rootMargin` in `useActiveSection.ts` together; in the existing `@media (prefers-reduced-motion: reduce)` block, add `scroll-behavior: auto;` — this overrides the `scroll-behavior: smooth` set on `html`, so anchor navigation is instant for users who prefer no motion; this is in addition to the `animation-duration: 0.01ms` reset already present
- [x] Modify `src/components/sections/Hero.tsx`: add `id="inicio"` to the outermost `<section>` element
- [x] No new pnpm dependencies introduced
- [x] Run `pnpm build` — confirm exit 0, zero TypeScript errors

**Tests:**

No automated tests — justified because: Navbar and ThemeToggle are pure presentational client components with no extractable business logic; `NAV_LINKS` is a plain constant defined in `nav-links.ts`; URL building reuses `buildWhatsAppUrl` which is already unit-tested in `src/lib/__tests__/contact.test.ts`; hydration guard and theme switching behavior are verified via Verification steps.

**Verification:**
- [ ] `pnpm dev` — navbar visible at top of page at 1440 px and 768 px widths
- [ ] Navbar is sticky: scroll down past Hero — bar stays fixed at top
- [ ] Brand name text visible; clicking it scrolls to `#inicio` (top of page)
- [ ] All 5 nav links visible in desktop layout; clicking each scrolls to the correct section with heading not hidden behind the bar (scroll-padding-top working)
- [ ] "Reservá una llamada" CTA opens `wa.me` URL in a new tab with correct number and encoded message
- [ ] Theme toggle: click sun/moon — page switches light/dark with no layout flash
- [ ] Hard-reload with dark class on `<html>` — no hydration mismatch warning in console (mounted-guard working)
- [ ] Mobile (375 px): nav links and CTA hidden; no hamburger yet — this is expected at this phase
- [ ] Inspect DOM: `<header>` is a banner landmark; `<nav>` has `aria-label="Navegación principal"`
- [ ] Keyboard: Tab to theme toggle — visible focus-visible ring using token color (not browser default outline)
- [ ] Inspect theme toggle: button uses `text-foreground` or icon color token, not `text-accent`
- [ ] `pnpm build` exits 0

**Phase review:**
- [ ] All Steps and Verification checkboxes above ticked in the plan file
- [ ] Reviewer handoff prompt emitted in a fenced code block as the final message of this turn
- [ ] Orchestrator cleared context (`/clear`) and pasted the handoff prompt into a fresh session
- [x] Code-reviewer agent has verified this phase
- [x] Any changes made in response to code-reviewer suggestions have been reflected back into this plan file
- [x] Tests for this phase written and passing (see Tests subsection above) — or no-tests justification accepted
- [x] Documentation updated (see Documentation section)
- [x] Orchestrator (user) has verified and approved this phase
- [x] Changes committed: `feat(navbar): add sticky desktop navbar with ThemeToggle, anchor links, and scroll globals`
- [x] Phase marked complete

---

### Phase 2: Mobile hamburger + dropdown panel

**Risk:** low
**Mode:** afk
**Type:** frontend

**Success criteria:** At 375 px, a hamburger icon (lucide `Menu`) is visible in the navbar; clicking it opens a dropdown panel directly below the bar containing all 5 nav links, the WhatsApp CTA, and the theme toggle; clicking any link or the CTA closes the panel and navigates/opens correctly; pressing Escape closes the panel and returns focus to the hamburger button; Tab key moves through panel items in DOM order; `pnpm build` exits 0.

**Commit message:** `feat(navbar): add mobile hamburger dropdown with accessibility (aria, Escape, focus)`

**File changes:**

| Action | File | What changes |
|---|---|---|
| modify | `src/components/layout/Navbar.tsx` | Add `useState` for `isOpen`; hamburger button (lucide `Menu` / `X`, `aria-expanded`, `aria-controls="mobile-menu"`, dynamic `aria-label`); mobile panel `div` (`id="mobile-menu"`) with links + CTA + ThemeToggle; Escape key handler with focus return via `useRef`; close-on-link-click; `md:hidden` on hamburger and panel |

**Steps:**
- [x] In `Navbar.tsx` (already a client component), add `const [isOpen, setIsOpen] = useState(false)` and `const hamburgerRef = useRef<HTMLButtonElement>(null)`
- [x] Add hamburger button: `<button ref={hamburgerRef} aria-expanded={isOpen} aria-controls="mobile-menu" aria-label={isOpen ? "Cerrar menú" : "Abrir menú"} className="md:hidden" onClick={() => setIsOpen(v => !v)}>` — render lucide `X` when `isOpen`, `Menu` when closed; the `aria-label` changes dynamically so screen readers announce the current action
- [x] Add mobile dropdown panel: `<div id="mobile-menu" className={cn("md:hidden absolute top-full left-0 right-0 border-b border-border bg-background/95 backdrop-blur-md flex-col gap-2 px-4 py-4", isOpen ? "flex" : "hidden")}>` — containing NAV_LINKS mapped to ghost Button as `<a>` (each `onClick={() => setIsOpen(false)}`), CTA Button (same `onClick`), and `<ThemeToggle />`; each nav link `<a>` has `onClick={() => setIsOpen(false)}` so navigation and panel-close happen atomically — the link navigates (native anchor behavior) and the state update closes the panel
- [x] Add Escape key handler via `useEffect`: register `keydown` listener on `document`; when `e.key === "Escape"` and `isOpen`, call `setIsOpen(false)` and `hamburgerRef.current?.focus()`; the `useEffect` cleanup MUST call `document.removeEventListener('keydown', handler)` — otherwise the handler leaks and continues firing after the component unmounts; DevTools: confirm no event listener leak — open and close panel 5 times rapidly, then unmount (navigate away) and confirm the handler is removed
- [x] Ensure panel items are in DOM order matching visual order (links → CTA → toggle) so Tab navigates naturally without a focus trap
- [x] ~~Apply `relative` directly to `<header>`~~ — CORRECTION (code review): the `<header>` is already `sticky`, which establishes the containing block for the `absolute top-full` panel. `relative` is redundant and conflicts with `sticky`; do NOT add it. No extra wrapper div needed.
- [x] No new pnpm dependencies
- [x] Run `pnpm build` — confirm exit 0

**Tests:**

No automated tests — justified because: the hamburger panel is purely presentational; open/close state is a trivial boolean toggle; `aria-expanded`, Escape handling, and focus return are verified via Verification steps including keyboard navigation at 375 px.

**Verification:**
- [ ] `pnpm dev` at 375 px: hamburger icon (`Menu`) visible in navbar; inline nav links and CTA not visible
- [ ] Click hamburger → panel opens below bar; `aria-expanded="true"`; button shows `X` icon
- [ ] Panel contains: all 5 nav links, "Reservá una llamada" CTA, theme toggle
- [ ] Click any nav link in panel → panel closes, page scrolls to correct section
- [ ] Click CTA in panel → panel closes, WhatsApp opens in new tab
- [ ] Click hamburger (`X`) while open → panel closes; `aria-expanded="false"`
- [ ] Press Escape while panel open → panel closes; focus returns to hamburger button
- [ ] Tab through panel (when open): focus moves through nav links → CTA → ThemeToggle in order; Tab past last item leaves panel naturally (no focus trap)
- [ ] At ≥ md width: hamburger hidden; panel never shown; desktop layout unchanged from Phase 1
- [ ] axe DevTools at 375 px: zero critical/serious violations on navbar
- [ ] Screen reader (VoiceOver or NVDA): announce hamburger button as "Abrir menú, colapsado" when closed
- [ ] `pnpm build` exits 0

**Phase review:**
- [ ] All Steps and Verification checkboxes above ticked in the plan file
- [ ] Reviewer handoff prompt emitted in a fenced code block as the final message of this turn
- [ ] Orchestrator cleared context (`/clear`) and pasted the handoff prompt into a fresh session
- [x] Code-reviewer agent has verified this phase
- [x] Any changes made in response to code-reviewer suggestions have been reflected back into this plan file
- [x] Tests for this phase written and passing (see Tests subsection above) — or no-tests justification accepted
- [x] Documentation updated (see Documentation section)
- [x] Orchestrator (user) has verified and approved this phase
- [x] Changes committed: `feat(navbar): add mobile hamburger dropdown with accessibility (aria, Escape, focus)`
- [x] Phase marked complete

---

### Phase 3: Active-section scroll-spy highlight

**Risk:** low
**Mode:** afk
**Type:** frontend

**Success criteria:** Scrolling the page highlights the correct nav link as each section enters the viewport — Inicio active near top, Servicios active when scrolling through services, etc. The active link is visually distinct (accent underline + `text-foreground`) versus inactive (`text-muted-foreground`). Works in both desktop inline links and mobile panel links. Scroll back to top re-activates Inicio. `pnpm build` exits 0 and `pnpm test` passes for the extracted pure helper.

**Commit message:** `feat(navbar): add IntersectionObserver scroll-spy active-link highlight`

**File changes:**

| Action | File | What changes |
|---|---|---|
| create | `src/hooks/useActiveSection.ts` | Client-side hook; accepts `ids: string[]`; uses `IntersectionObserver` with `rootMargin` accounting for sticky navbar; extracts pure helper `getActiveSectionId`; returns `activeId: string` |
| create | `src/lib/__tests__/useActiveSection.test.ts` | Unit tests for `getActiveSectionId` pure helper |
| modify | `src/components/layout/Navbar.tsx` | Import `useActiveSection`; pass section ids; apply active/inactive class and `aria-current` to each nav link based on `activeId` in both desktop and mobile layouts |
| modify | `src/components/sections/Footer.tsx` | Refactor to import `NAV_LINKS` from `src/components/layout/nav-links.ts`; removes hardcoded list and fixes Inicio href to `"#inicio"` automatically |

**Steps:**
- [x] Create `src/hooks/useActiveSection.ts` — `"use client"`; extract a named pure function `export function getActiveSectionId(intersectingIds: string[], orderedIds: string[], isAtBottom: boolean): string` — when `isAtBottom` is true, return `orderedIds[orderedIds.length - 1]` immediately; otherwise return the first entry in `orderedIds` that is present in `intersectingIds`, falling back to `orderedIds[0]` when none intersect; edge at very top: when `scrollY === 0` (or all sections are below the fold), none may be intersecting; `getActiveSectionId` returns `orderedIds[0]` (`'inicio'`) by its fallback — this is the desired behavior; edge at very bottom: the Contacto section may be too short to cross the `-60% 0px` bottom threshold on a tall viewport; fallback: in `useActiveSection`, after the observer callback, additionally check `window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4` and if true, pass `isAtBottom: true` to `getActiveSectionId` which returns the last section id; implement hook `useActiveSection(ids: string[]): string` that sets up `IntersectionObserver` with `rootMargin: "-80px 0px -60% 0px"`, observes each id, tracks intersecting ids in a `Set`, computes `isAtBottom` in the observer callback (and also on `scroll` event or within the same callback), calls `getActiveSectionId(intersectingIds, ids, isAtBottom)` on change, initializes `activeId` to `ids[0]`; call `observer.disconnect()` inside the `useEffect` cleanup return — failure to do so leaks observer callbacks and causes stale state updates on unmounted components
- [x] Create `src/lib/__tests__/useActiveSection.test.ts` — test `getActiveSectionId`: given `["servicios"]` intersecting, ordered `["inicio","servicios","proceso","faq","contacto"]`, `isAtBottom: false`, returns `"servicios"`; given empty intersecting set and `isAtBottom: false`, returns `"inicio"` (first ordered); given multiple intersecting ids and `isAtBottom: false`, returns the first in ordered list; bottom-of-page fallback: when `isAtBottom` is true, returns the last ordered id regardless of intersecting set
- [x] In `Navbar.tsx`, import `useActiveSection` and call it with `["inicio", "servicios", "proceso", "faq", "contacto"]`; for each nav link `<a>`, derive active state via `activeId === link.href.slice(1)`; apply `text-foreground underline decoration-2 underline-offset-4` when active, `text-muted-foreground` when inactive; use `cn` to compose with existing ghost Button classes; active link receives `aria-current={activeId === link.href.slice(1) ? 'true' : undefined}` — since this is a single-page app with hash navigation, use `aria-current='true'` rather than `aria-current='page'`; `aria-current='page'` would be semantically incorrect for in-page anchors
- [x] Apply the same active/inactive logic and `aria-current` to mobile panel links
- [x] Brand `<a href="#inicio">` does not receive active styling or `aria-current` — it is the brand, not a nav entry
- [x] Refactor `src/components/sections/Footer.tsx` to import `NAV_LINKS` from `src/components/layout/nav-links.ts`; remove the hardcoded nav-link list; map `NAV_LINKS` in Footer — `href="#inicio"` is now automatic from the shared constant
- [x] No new pnpm dependencies; `IntersectionObserver` is a browser-native API
- [x] Run `pnpm build` — confirm exit 0

**Tests:**

| Action | File | What it covers |
|---|---|---|
| create | `src/lib/__tests__/useActiveSection.test.ts` | `getActiveSectionId(intersectingIds, orderedIds, isAtBottom)` — returns first ordered id present in intersecting set; edge: empty intersecting → first ordered id; multiple intersecting → topmost (first in ordered list) wins; bottom-of-page fallback: `isAtBottom: true` returns last ordered id regardless of intersecting set |

Note: the `IntersectionObserver` wiring cannot be unit-tested without a DOM environment. Only the pure selection logic `getActiveSectionId` is extracted and tested. Observer behavior is verified via Verification steps.

**Verification:**
- [ ] `pnpm dev` — load page; "Inicio" link appears active (`text-foreground` + underline) before any scrolling
- [ ] Scroll to Services section — "Servicios" becomes active; "Inicio" becomes inactive (`text-muted-foreground`)
- [ ] Scroll through each section in order — correct link becomes active at each point
- [ ] Scroll back to top — "Inicio" re-activates
- [ ] Mobile (375 px): open hamburger panel while mid-page on Proceso — "Proceso" link is highlighted in panel
- [ ] Reduced-motion: active-link highlight changes instantly (class swap only, no CSS transition needed beyond `transition-colors` already in place)
- [ ] Inspect DOM: active nav link has `aria-current="true"`; inactive links have no `aria-current` attribute
- [ ] Scroll to very bottom of page — "Contacto" link becomes active even if the section is short (bottom-of-page fallback working)
- [ ] Resize browser to a short viewport (~500px height) — scroll-spy still activates sections correctly as you scroll (rootMargin accounts for navbar height)
- [ ] `pnpm test` — `useActiveSection.test.ts` passes
- [ ] `pnpm build` exits 0

**Phase review:**
- [ ] All Steps and Verification checkboxes above ticked in the plan file
- [ ] Reviewer handoff prompt emitted in a fenced code block as the final message of this turn
- [ ] Orchestrator cleared context (`/clear`) and pasted the handoff prompt into a fresh session
- [x] Code-reviewer agent has verified this phase
- [x] Any changes made in response to code-reviewer suggestions have been reflected back into this plan file
- [x] Tests for this phase written and passing (see Tests subsection above) — or no-tests justification accepted
- [x] Documentation updated (see Documentation section)
- [x] Orchestrator (user) has verified and approved this phase
- [x] Changes committed: `feat(navbar): add IntersectionObserver scroll-spy active-link highlight`
- [x] Phase marked complete

---

### Phase 4: Final Verification

**Mode:** hil
**Type:** mixed

Overall success criteria:

1. Navbar visible and sticky at all scroll positions at 375 px, 768 px, and 1440 px.
2. Desktop (≥ md): brand, 5 inline nav links, CTA, theme toggle — all correct.
3. Mobile (< md): hamburger, dropdown panel with links/CTA/toggle, Escape closes and returns focus, link-click closes, Tab-navigable without a focus trap.
4. Active-section scroll-spy highlights the correct link as the user scrolls.
5. Clicking any nav link scrolls to the correct section with heading not hidden behind the navbar.
6. CTA opens the correct WhatsApp URL in a new tab.
7. Theme toggle flips light/dark with no hydration flash.
8. No z-index violations (Navbar z-40, WhatsAppFloatingButton z-30, cap z-50; no `z-[9999]` anywhere).
9. axe DevTools: zero critical/serious violations on navbar in both desktop and mobile layouts.
10. Gold accent not used for small body text in navbar.
11. `pnpm build` clean; `pnpm test` passes.
12. `prefers-reduced-motion`: scroll-behavior resets to auto; no unexpected animations.

**Steps:**
- [ ] Confirm all prior phase checkboxes are ticked (Phases 1–3 phase reviews complete)
- [ ] `pnpm build` — exit 0, zero TypeScript errors, zero ESLint errors
- [ ] `pnpm test` — `useActiveSection.test.ts` (getActiveSectionId) passes
- [ ] Golden path at 1440 px:
  - [ ] Navbar visible and sticky throughout full scroll
  - [ ] All 5 links visible inline; click each → scrolls to correct section; section heading visible (not behind bar)
  - [ ] CTA → WhatsApp opens in new tab with correct `wa.me` URL
  - [ ] Theme toggle → light/dark flip; no console hydration errors on hard reload
  - [ ] Scroll down slowly — active link updates correctly for each section
  - [ ] Scroll to top — Inicio active
- [ ] Golden path at 375 px:
  - [ ] Hamburger visible; no inline links visible
  - [ ] Click hamburger → panel opens; all 5 links + CTA + toggle visible
  - [ ] Click nav link in panel → panel closes, scroll to section with correct offset
  - [ ] Escape → panel closes, focus returns to hamburger
  - [ ] Tab through panel → focus order correct (links → CTA → toggle)
  - [ ] Click CTA in panel → WhatsApp opens in new tab, panel closes
- [ ] axe DevTools at 375 px and 1440 px: zero critical/serious violations
- [ ] Keyboard-only navigation (no mouse):
  - [ ] Tab to hamburger (mobile) → Enter → panel opens
  - [ ] Tab through panel items → all reachable
  - [ ] Escape → panel closes, focus on hamburger
  - [ ] Tab to desktop CTA → Enter → WhatsApp opens
- [ ] Light/dark end-to-end:
  - [ ] Toggle to dark — navbar uses correct token colors (`bg-background/80`, `border-border`)
  - [ ] No hardcoded hex values in `Navbar.tsx` or `ThemeToggle.tsx`
- [ ] z-index audit: DevTools → inspect navbar — `position: sticky; z-index: 40`; WhatsAppFloatingButton z-30; nothing above z-50 in entire DOM
- [ ] `prefers-reduced-motion`: DevTools → Rendering → Emulate prefers-reduced-motion → clicking nav link scrolls instantly (scroll-behavior: auto applied); navbar still functions normally
- [ ] Verify anchor link scroll is instant under reduced-motion (no smooth scroll animation)
- [ ] Color contrast: navbar text (`text-foreground` on `bg-background/80`) passes WCAG AA ≥ 4.5:1; active underline accent not used for small body text
- [ ] Code-reviewer skill run end-to-end on all Phases 1–3 changes combined
- [ ] Overall success criteria checklist:
  - [ ] Sticky navbar on all breakpoints
  - [ ] Desktop and mobile layouts correct
  - [ ] Active scroll-spy works
  - [ ] Anchor scroll offset correct (sections not hidden behind bar)
  - [ ] CTA and theme toggle functional
  - [ ] No z-index violations
  - [ ] axe: zero critical/serious violations
  - [ ] Gold accent not on small body text
  - [ ] `pnpm build` clean
  - [ ] `pnpm test` passes
  - [ ] `prefers-reduced-motion` respected

---

## Documentation

| Change | Documentation location |
|---|---|
| `src/components/layout/Navbar.tsx` — new component | `README.md`: note Navbar component location, `NAV_LINKS` imported from `src/components/layout/nav-links.ts`, and how to add or remove nav links |
| `src/components/layout/nav-links.ts` — shared constant | `README.md`: note that both Navbar and Footer consume this single source of truth for nav link labels and hrefs |
| `src/components/ui/ThemeToggle.tsx` — new component | `README.md`: note ThemeToggle and the mounted-guard pattern required by next-themes |
| `src/hooks/useActiveSection.ts` — new hook | `README.md`: document hook's `ids` param and `rootMargin` approach; note that `getActiveSectionId` is the unit-tested pure helper and accepts `isAtBottom` for the bottom-of-page Contacto fallback |
| `src/app/globals.css` — scroll-padding-top + scroll-behavior | `README.md`: note scroll offset value (5rem) is tied to navbar height `h-20`; single source of truth — if navbar height changes, update `scroll-padding-top` here, `h-20` on `<header>`, and `rootMargin` in `useActiveSection.ts` together |

---

## Tests

| Phase | Logic under test | Test file |
|---|---|---|
| Phase 3 | `getActiveSectionId(intersectingIds, orderedIds, isAtBottom)` — pure helper returning the first ordered id present in the intersecting set, or `orderedIds[0]` as default; bottom-of-page fallback: `isAtBottom: true` returns last ordered id | `src/lib/__tests__/useActiveSection.test.ts` |
| Phase 1 | No extractable logic — reuses `buildWhatsAppUrl` (tested in `src/lib/__tests__/contact.test.ts`); `NAV_LINKS` is a constant in `nav-links.ts` | — (no new test file; existing contact.test.ts covers the URL helper) |
| Phase 2 | No extractable logic — boolean toggle state; aria attributes verified via Verification steps | — |

---

## Human Summary

The landing page at `feat/web-express-landing` converts visitors entirely through WhatsApp and section anchors, but once a visitor scrolls past the Hero they lose navigation context. This plan adds a sticky top navbar — always solid, never transparent — that persists at every scroll position and gives visitors a fast path to any section or the primary WhatsApp CTA without scrolling back to the top. It also anchors the Hero section (`id="inicio"`) and configures smooth scrolling with a 5rem offset so the navbar never obscures a section heading.

The plan slices into three short implementation phases: Phase 1 builds the navbar shell with desktop layout, wires it into the root layout, and sets the scroll globals — it also creates `src/components/layout/nav-links.ts`, a shared `NAV_LINKS` constant consumed by both Navbar and Footer to eliminate duplication; Phase 2 adds the mobile hamburger dropdown with full keyboard accessibility (aria-expanded, Escape, focus return); Phase 3 adds an `IntersectionObserver`-based scroll-spy that highlights the active nav link as the user scrolls, with a pure helper `getActiveSectionId` that accepts an `isAtBottom: boolean` parameter to handle the bottom-of-page Contacto fallback (when the section is too short to cross the intersection threshold), unit-tested in `src/lib/__tests__/useActiveSection.test.ts`. Each phase is self-contained, ends with a passing `pnpm build`, and can be reviewed independently.

The end result is a fully accessible, responsive navbar that works in light and dark mode without any new dependencies — all behavior is built on browser-native APIs (`IntersectionObserver`, CSS `scroll-behavior`), reused project helpers (`buildWhatsAppUrl`, `siteConfig`, shadcn Button, `cn`), and the existing next-themes setup. The only trade-off worth noting is that the scroll-spy `rootMargin` is tied to the 80px navbar height; if the bar height changes, the CSS `scroll-padding-top`, the `h-20` class, and the observer margin all need to be updated together.
