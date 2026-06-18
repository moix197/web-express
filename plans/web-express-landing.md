# Plan: web-express — Freelance Studio Landing Page

**Created:** 2026-06-17
**Branch:** feat/web-express-landing
**Status:** not started

---

## Context

Build a production-grade marketing landing page for **web-express.com.ar**, a freelance web studio targeting Argentine small businesses. The site is static-first (no backend), deployed on Vercel, written entirely in Spanish (Argentine voseo). It showcases 4 service packages, guides visitors through a discovery funnel, and funnels all conversions to WhatsApp or email — no form submission service.

Stack: Next.js 15 App Router · Tailwind CSS v4 · shadcn/ui · next-themes · pnpm · Vercel.

---

## Risk: medium

Primary risks: Tailwind v4 config differences from v3 (CSS-first token approach); next-themes SSR flash; opengraph-image.tsx Edge runtime constraints; correct JSON-LD structure for Argentine business schema.

---

## Dependencies & Risks

| Dependency | Version | Risk | Notes |
|---|---|---|---|
| next | 15.x | low | App Router, stable |
| tailwindcss | 4.x | medium | CSS-first config; no tailwind.config.js needed — tokens go in globals.css |
| shadcn/ui | latest | low | Radix primitives; Accordion used in Phase 4 |
| next-themes | latest | low | SSR flash mitigated with `suppressHydrationWarning` on `<html>` |
| lucide-react | latest | low | SVG icons only; no emoji |
| clsx / tailwind-merge | via shadcn | low | Bundled with shadcn init |

**External risks:**
- WhatsApp deep-link format (`https://wa.me/<number>?text=...`) must be URL-encoded; phone number must be international format without `+`.
- `opengraph-image.tsx` uses Next.js ImageResponse (Edge); custom fonts must be fetched at build time.
- Tailwind v4 does not use `tailwind.config.js` by default — all tokens defined as CSS custom properties in `globals.css` using `@theme` layer.

---

## Phases

### Phase 0: Create worktree

**Steps:**
- [ ] Confirm branch name with the user (default: `feat/web-express-landing`)
- [ ] Initialize the repository: `git init && git commit --allow-empty -m "chore: init repo"` — this creates the required `HEAD`/`main` ref so worktree can branch from it
- [ ] Run `git worktree add ../freelo-web-express -b feat/web-express-landing HEAD`
- [ ] Verify worktree is active on correct branch (`git worktree list`)

---

### Phase 1: Project scaffold + design system foundation

**Risk:** medium
**Mode:** afk
**Type:** config

**Justification for infra phase:** This phase is the one permitted scaffold exception — it bootstraps the entire project skeleton, installs dependencies, and wires design tokens so every subsequent phase can build directly on a consistent foundation without re-touching config files.

**Success criteria:** `pnpm dev` serves the app at `http://localhost:3000` showing a plain "web-express" heading; switching between light and dark mode applies the correct palette tokens visually; DM Sans renders for the heading and Inter for body text; no TypeScript errors on `pnpm build`.

**Commit message:** `chore: scaffold Next.js 15 app with design system, tokens, fonts, and content types`

**File changes:**

| Action | File | What changes |
|---|---|---|
| Create | `src/app/layout.tsx` | Root layout: ThemeProvider, html lang="es", suppressHydrationWarning, DM Sans + Inter via next/font |
| Create | `src/app/page.tsx` | Placeholder heading only: `<h1>web-express</h1>` |
| Create | `src/app/globals.css` | Tailwind v4 `@import`, `@theme` block with all light/dark CSS custom properties, base resets |
| Create | `src/content/site.ts` | Typed `SiteConfig`: metadataBase, email (`hola@web-express.com.ar`), WhatsApp (`5491100000000`), social URLs (placeholder `#`), site name, tagline |
| Create | `src/content/services.ts` | Typed `ServicePackage[]`: 4 packages (STARTER 199000, BUSINESS 399000, STORE 649000, BRANDING STARTER 149000) with name, price, description, features array |
| Create | `src/lib/utils.ts` | `cn()` helper (clsx + tailwind-merge) — copied from shadcn init output |
| Create | `src/lib/format.ts` | `formatPriceARS(n: number): string` — formats number to `AR$199.000` (dot as thousands separator) |
| Create | `src/lib/schema.ts` | `buildLocalBusinessSchema()` and `buildServiceSchema(service: ServicePackage)` returning JSON-LD plain objects |
| Create | `src/components/ui/` | shadcn primitives installed by CLI: button, badge (used later; installed now for consistent versioning) |
| Modify | `package.json` | pnpm scripts; dependencies: next-themes, lucide-react added |

**Steps:**
- [x] In the worktree root, run `pnpm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*" --no-git`
- [x] Run `pnpm add next-themes lucide-react`
- [x] Run `pnpm dlx shadcn@latest init` (select style: default, base color: neutral, CSS variables: yes)
- [x] Run `pnpm dlx shadcn@latest add button badge` to pre-install primitives used across phases
- [x] Replace generated `globals.css` with the full token set under `@theme` (light palette as default, dark under `.dark`) — see token spec in Context; add `prefers-reduced-motion` reset in base layer: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`
- [x] Token usage constraint (bake into a comment in globals.css): gold `#c9ae7b` (`--color-accent`) must be used only for fills, borders, and display/heading text — NEVER for small body text (fails WCAG AA contrast on both light and dark backgrounds); body text must use `--color-foreground` only
- [x] Create `src/content/site.ts` with `SiteConfig` interface and placeholder values (email: `hola@web-express.com.ar`, WhatsApp: `5491100000000`, social URLs: `#`); add inline JSDoc comment on `whatsApp` field explaining format (international without `+`)
- [x] Create `src/content/services.ts` with `ServicePackage` interface and 4 typed package objects
- [x] Create `src/lib/format.ts` with `formatPriceARS`
- [x] Create `src/lib/schema.ts` with both JSON-LD builder functions
- [x] Overwrite `src/lib/utils.ts` if shadcn generated a different version — ensure `cn()` is exported
- [x] Update `src/app/layout.tsx`: import ThemeProvider from next-themes, wrap children, set `html lang="es"`, apply DM Sans to headings via CSS var, Inter to body
- [x] Slim `src/app/page.tsx` to render only `<main><h1>web-express</h1></main>`
- [x] Run `pnpm build` and confirm zero TypeScript errors
- [x] Run `pnpm dev` and verify heading visible, dark/light toggle works (add temporary toggle button to layout for verification, remove before commit)
- [x] Document: update `README.md` with stack, token reference, and `pnpm dev` / `pnpm build` commands

**Tests:**

| Test file | What it tests |
|---|---|
| `src/lib/__tests__/format.test.ts` | `formatPriceARS(199000)` → `"AR$199.000"`, edge: 0, large numbers, integer only |
| `src/lib/__tests__/schema.test.ts` | `buildLocalBusinessSchema()` returns object with `@type: "LocalBusiness"`, correct `priceCurrency: "ARS"`; `buildServiceSchema` maps service name and price |

**Verification:**
- [x] `pnpm dev` — browser at localhost:3000 shows "web-express" heading
- [x] Toggle dark mode class on `<html>` in DevTools — background switches between `#f7f4ef` and `#1d1d1d`
- [x] Inspect font: heading is DM Sans, body is Inter (DevTools → Computed → font-family)
- [x] Hard-reload with dark class active in `<html>` — no flash of unstyled/light content (next-themes `suppressHydrationWarning` working; `defaultTheme` set to `"system"` or explicit)
- [x] `pnpm build` exits 0, no type errors
- [x] `pnpm test` (if vitest configured) — format + schema unit tests pass

**Phase review:**
- [x] All steps completed and checked off
- [x] Commit message follows conventional commits
- [x] No dead/commented-out code introduced
- [x] No new dependencies added beyond what the phase requires
- [x] CLAUDE.md invariants respected (pnpm only; thin entry points; build-our-own before installing; small focused functions)
- [x] README updated alongside code changes

---

### Phase 2: Hero section end-to-end

**Risk:** low
**Mode:** afk
**Type:** frontend

**Success criteria:** Navigating to `http://localhost:3000` shows a full-viewport Hero section in both light and dark mode with: an oversized headline, a working "Reservá una llamada" button that opens `https://wa.me/5491100000000?text=...` in a new tab, a "Ver servicios" anchor that smooth-scrolls to `#servicios`, and the WhatsApp floating button fixed at bottom-right. Tested at 375 px, 768 px, and 1440 px widths.

**Commit message:** `feat(hero): add Hero section with WhatsApp CTA and floating action button`

**File changes:**

| Action | File | What changes |
|---|---|---|
| Create | `src/components/sections/Hero.tsx` | Server Component; reads `siteConfig` from `site.ts`; renders headline, subheadline, two CTAs |
| Create | `src/components/ui/WhatsAppFloatingButton.tsx` | Fixed `z-30` bottom-right button; lucide MessageCircle icon; href from siteConfig |
| Modify | `src/app/page.tsx` | Import and render `<Hero />` and `<WhatsAppFloatingButton />`; layout.tsx handles floating button placement |
| Modify | `src/app/layout.tsx` | Add `<WhatsAppFloatingButton />` outside main so it persists across all pages |

**Steps:**
- [ ] Use `ui-ux-pro-max` skill (--stack nextjs) for Hero visual design decisions before coding
- [ ] Create `src/components/sections/Hero.tsx` as a Server Component — no `"use client"`
- [ ] Headline: oversized (clamp or Tailwind responsive classes), DM Sans, max-width prose container
- [ ] CTA 1: "Reservá una llamada" — `<a href={`https://wa.me/${siteConfig.whatsApp}?text=${encodeURIComponent("Hola, quiero reservar una llamada")}`}>` styled as primary Button (shadcn), opens `_blank`, `rel="noopener noreferrer"`; always hardcode a non-empty default text so URL is valid even with no user input
- [ ] CTA 2: "Ver servicios" — `<a href="#servicios">` styled as ghost/outline Button
- [ ] Apply `min-h-dvh` (not `100vh` or `h-screen`) to Hero wrapper
- [ ] Create `WhatsAppFloatingButton.tsx` — fixed position, `bottom-6 right-6`, `z-30`, lucide `MessageCircle` icon, aria-label "Contactar por WhatsApp"
- [ ] Add `WhatsAppFloatingButton` to `layout.tsx` so it renders on all routes
- [ ] No animations beyond `transition-colors duration-150 ease-out`; no animation libraries (framer-motion, motion, etc.) — transitions respect `prefers-reduced-motion` via the global reset added in Phase 1
- [ ] Verify no full-width body text (headline and sub capped at max-w prose)
- [ ] Document: note WhatsApp URL format in `src/content/site.ts` comment

**Tests:**

No automated tests — justified because: pure presentational Server Component with no extractable logic; all behavior is static HTML links verified by Verification steps below.

**Verification:**
- [ ] `pnpm dev` — Hero fills full viewport height at 375 px, 768 px, 1440 px (Chrome DevTools)
- [ ] "Reservá una llamada" — right-click → inspect href contains `wa.me` and URL-encoded text
- [ ] "Ver servicios" href is `#servicios` (section added in Phase 3; anchor target confirmed then)
- [ ] Floating WhatsApp button visible at bottom-right; does not overlap main content destructively
- [ ] `z-30` confirmed in DevTools (no `z-[9999]` anywhere in DOM)
- [ ] Dark mode: toggle `.dark` class — Hero background and text switch correctly
- [ ] axe DevTools (or axe browser extension) — zero critical/serious violations on Hero
- [ ] Keyboard: Tab to "Reservá una llamada" → Enter opens WhatsApp; Tab to "Ver servicios" → Enter scrolls
- [ ] Color contrast: hero heading and subheadline text pass WCAG AA (≥4.5:1 for body size); gold accent not used for body text
- [ ] `pnpm build` exits 0

**Phase review:**
- [ ] All steps completed and checked off
- [ ] Commit message follows conventional commits
- [ ] No dead/commented-out code introduced
- [ ] No new dependencies added beyond what the phase requires (no animation libs)
- [ ] CLAUDE.md invariants respected (pnpm only; thin entry points; reuse before reinvent; no hover-only primary actions)
- [ ] README updated alongside code changes

---

### Phase 3: About + Services sections

**Risk:** low
**Mode:** afk
**Type:** frontend

**Success criteria:** Scrolling past the Hero shows: (a) an About/Why-us section with 3 clearly labeled pillars (Autogestionable, Diseño profesional, Pensado para crecer) with lucide icons; (b) a Services section with 4 pricing cards in a bento grid layout, each showing the package name, price formatted as `AR$X.000`, and features list. The `#servicios` anchor on the Services section allows the Hero "Ver servicios" CTA to scroll correctly. Both sections render correctly in light and dark at all three breakpoints.

**Commit message:** `feat(sections): add About and Services sections with typed content and bento pricing cards`

**File changes:**

| Action | File | What changes |
|---|---|---|
| Create | `src/components/sections/About.tsx` | Server Component; 3 pillars with lucide icons, short descriptions |
| Create | `src/components/sections/Services.tsx` | Server Component; maps over `services` from `services.ts`; calls `formatPriceARS`; bento grid |
| Modify | `src/app/page.tsx` | Import and render `<About />` then `<Services id="servicios" />` below Hero |

**Steps:**
- [ ] Use `ui-ux-pro-max` skill for bento/pricing card design decisions
- [ ] Create `About.tsx` — 3-column grid (stacks on mobile), each pillar: lucide icon (CheckCircle or similar), heading, short paragraph; no stock photos; text capped at 65ch
- [ ] Choose lucide icons for each pillar: e.g. `Settings2` (Autogestionable), `Palette` (Diseño profesional), `TrendingUp` (Pensado para crecer)
- [ ] Create `Services.tsx` — import `services` array and `formatPriceARS`; map to bento cards; pass `id="servicios"` prop to section element so Hero anchor works
- [ ] Bento grid: CSS Grid, 2-col on md, 4-col on lg; featured card (BUSINESS or STORE) can span 2 rows or have accent border using `--color-accent` token
- [ ] Display "Branding + Sitio Web" upsell mention as a callout below the 4 cards (not a separate card)
- [ ] Each card: package name, price (formatted), feature list with lucide `Check` icon per item, optional CTA linking to `#contacto`
- [ ] No stock photos; rely on typography, spacing, and token colors for visual interest
- [ ] Ensure Services section wrapper has `id="servicios"` for anchor scroll

**Tests:**

No automated tests — justified because: both components are pure presentational Server Components reading from typed content files; `formatPriceARS` is unit-tested in Phase 1; visual correctness verified via Verification steps.

**Verification:**
- [ ] `pnpm dev` — scroll past Hero: About section shows 3 pillars with icons
- [ ] Lucide icons render (SVG, not emoji)
- [ ] Services section shows 4 cards with prices: AR$199.000, AR$399.000, AR$649.000, AR$149.000
- [ ] Hero "Ver servicios" button scrolls to Services section
- [ ] Bento grid: 1 col at 375 px, 2 col at 768 px, 4 col at 1440 px
- [ ] Dark mode: cards use `--color-surface` background, not plain white bleed
- [ ] axe DevTools — zero critical/serious violations on About and Services sections
- [ ] Keyboard: Tab through service cards — all interactive elements (CTA links) reachable
- [ ] `pnpm build` exits 0, no TypeScript errors

**Phase review:**
- [ ] All steps completed and checked off
- [ ] Commit message follows conventional commits
- [ ] No dead/commented-out code introduced
- [ ] No new dependencies added beyond what the phase requires (no animation libs, no state managers)
- [ ] CLAUDE.md invariants respected (pnpm only; reuse `formatPriceARS` from lib; no reinvention; small focused functions)
- [ ] README updated alongside code changes

---

### Phase 4: Process + FAQ sections

**Risk:** low
**Mode:** afk
**Type:** frontend

**Success criteria:** The page now shows a 4-step Process section (Descubrimiento → Diseño → Construcción → Lanzamiento) with visual step numbering, and a FAQ section with a shadcn Accordion containing ~5 Q&As in Argentine Spanish. The Accordion opens/closes on click and is keyboard-accessible (Enter/Space to toggle, Tab to navigate items).

**Commit message:** `feat(sections): add Process steps and FAQ accordion in Argentine Spanish`

**File changes:**

| Action | File | What changes |
|---|---|---|
| Create | `src/components/sections/Process.tsx` | Server Component; 4-step horizontal/vertical timeline with numbered steps and lucide icons |
| Create | `src/components/sections/Faq.tsx` | Client Component (`"use client"` only if needed by Accordion); shadcn Accordion with 5 Q&As |
| Modify | `src/app/page.tsx` | Import and render `<Process />` then `<Faq />` below Services |

**Steps:**
- [ ] Run `pnpm dlx shadcn@latest add accordion` to install shadcn Accordion primitive
- [ ] Create `Process.tsx` — ordered list of 4 steps; each step: large number (accent color token), step title, brief description; responsive layout (vertical on mobile, horizontal on lg)
- [ ] Use lucide icons per step: `Search` (Descubrimiento), `Figma` or `Layout` (Diseño), `Code2` (Construcción), `Rocket` (Lanzamiento)
- [ ] Create `Faq.tsx` — import shadcn `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- [ ] Write 5 Q&As in Argentine voseo Spanish covering: timing (cuánto tarda), hosting/domain (no incluido), self-management (cómo lo administro), Mercado Pago (integration), post-launch support
- [ ] Accordion type `"single"` with `collapsible`; each item has a unique value
- [ ] Verify no animation beyond shadcn's default (radix uses CSS vars for animation; confirm `prefers-reduced-motion` is respected by Radix out of the box — it is)
- [ ] Mark `Faq.tsx` as `"use client"` only if shadcn Accordion requires it; otherwise keep as Server Component
- [ ] Cap FAQ answer text at 65ch

**Tests:**

No automated tests — justified because: Process is a pure static Server Component; FAQ uses shadcn Accordion (Radix, externally tested); accordion behavior is verified via Verification steps including keyboard navigation.

**Verification:**
- [ ] `pnpm dev` — scroll to Process: 4 numbered steps visible, lucide icons render
- [ ] FAQ section: 5 accordion items visible, all collapsed by default
- [ ] Click accordion item → expands; click again → collapses
- [ ] Keyboard: Tab to accordion trigger → Enter → expands; Escape or Enter again → collapses
- [ ] Dark mode: accordion items use surface token, not hardcoded white
- [ ] No decorative animations beyond accordion open/close transition; reduced-motion: open DevTools → Rendering → Emulate prefers-reduced-motion: reduce → accordion still opens/closes without jarring flash
- [ ] axe DevTools — zero critical/serious violations on Process and FAQ sections
- [ ] `pnpm build` exits 0

**Phase review:**
- [ ] All steps completed and checked off
- [ ] Commit message follows conventional commits
- [ ] No dead/commented-out code introduced
- [ ] No new dependencies added beyond what the phase requires (no animation libs beyond shadcn/Radix defaults)
- [ ] CLAUDE.md invariants respected (pnpm only; reuse shadcn Accordion; no animation libs)
- [ ] README updated alongside code changes

---

### Phase 5: Contact section + Footer

**Risk:** low
**Mode:** afk
**Type:** frontend

**Success criteria:** The page ends with a Contact section and Footer. Contact shows: a WhatsApp CTA link, an email CTA link, and optional controlled input fields that build a pre-filled WhatsApp message or mailto string client-side (no server round-trip, no third-party form service). Footer shows: nav links, placeholder social icons, and copyright line. All links are correct and functional.

**Commit message:** `feat(sections): add Contact section with client-side WA/mailto builder and Footer`

**File changes:**

| Action | File | What changes |
|---|---|---|
| Create | `src/lib/contact.ts` | `buildWhatsAppUrl(name, message, config)` and `buildMailtoUrl(name, message, config)` — pure URL-building helpers with encodeURIComponent and empty-input fallback |
| Create | `src/components/sections/Contact.tsx` | Client Component; controlled inputs (name, message); calls helpers from `src/lib/contact.ts`; WhatsApp + email CTA buttons |
| Create | `src/components/sections/Footer.tsx` | Server Component; nav links, social placeholders (lucide icons), copyright |
| Modify | `src/app/page.tsx` | Import and render `<Contact id="contacto" />` then `<Footer />` as final elements |

**Steps:**
- [ ] Create `Contact.tsx` as `"use client"` — two controlled inputs: `name` (text) and `message` (textarea)
- [ ] Build WhatsApp URL: `https://wa.me/${siteConfig.whatsApp}?text=${encodeURIComponent(...)}`; when `name` and `message` are both empty, fall back to a hardcoded default message (never produce a bare `?text=` or `?text=undefined`); sanitize via `encodeURIComponent` only — no custom sanitizer needed (browser link opens externally)
- [ ] Build mailto URL: `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; same empty-input fallback to a non-empty default body
- [ ] Extract URL builders into two small named helper functions (`buildWhatsAppUrl(name, message, config)`, `buildMailtoUrl(name, message, config)`) — keep Contact.tsx thin (CLAUDE.md: small focused functions, thin entry points); helpers can live in `src/lib/contact.ts`
- [ ] Two primary CTA buttons: "Escribinos por WhatsApp" and "Mandanos un email" — both `<a>` tags with dynamically computed href; buttons are always visible even before inputs are filled (inputs just enrich the message)
- [ ] No form submission, no fetch, no third-party endpoint, no react-hook-form, no zod on this component — all client-side string construction only
- [ ] Add `id="contacto"` to Contact section wrapper for anchor links from Services cards
- [ ] Create `Footer.tsx` as Server Component — import `siteConfig`; render: logo/name, nav links (Hero, Servicios, Proceso, FAQ, Contacto), social icons using lucide (Github, Instagram, Linkedin as placeholders), copyright `© {new Date().getFullYear()} web-express.com.ar`
- [ ] Social links use placeholder `#` hrefs until real URLs are set in `site.ts`
- [ ] Footer social icons: lucide SVGs only, no emoji
- [ ] Ensure Contact inputs have accessible `<label>` elements

**Tests:**

| Test file | What it tests |
|---|---|
| `src/lib/__tests__/contact.test.ts` | `buildWhatsAppUrl`: correct `wa.me` prefix, `encodeURIComponent` applied, fallback message when name+message empty, phone number from config; `buildMailtoUrl`: correct `mailto:` prefix, subject+body encoded, fallback when empty |

Footer is pure static Server Component — no extractable logic, no test needed.

**Verification:**
- [ ] `pnpm dev` — scroll to Contact: two CTA buttons visible
- [ ] Click "Escribinos por WhatsApp" without filling inputs → opens `wa.me` URL with default text
- [ ] Type name and message → click WhatsApp CTA → URL includes encoded name + message
- [ ] "Mandanos un email" → opens mailto with pre-filled subject + body
- [ ] Footer: nav links, social icons (SVG, not emoji), copyright year shows current year
- [ ] Contact section `id="contacto"` present in DOM source
- [ ] Dark mode: Contact and Footer use correct token colors
- [ ] axe DevTools — zero critical/serious violations; labels associated with inputs; CTA buttons have descriptive text
- [ ] Keyboard: Tab to name input → type → Tab to message → type → Tab to WhatsApp CTA → Enter opens link; Tab to email CTA → Enter opens mailto
- [ ] `pnpm test` — `contact.test.ts` passes (buildWhatsAppUrl + buildMailtoUrl)
- [ ] `pnpm build` exits 0

**Phase review:**
- [ ] All steps completed and checked off
- [ ] Commit message follows conventional commits
- [ ] No dead/commented-out code introduced
- [ ] No new dependencies added beyond what the phase requires (no RHF, no zod, no email SaaS, no i18n, no state managers)
- [ ] CLAUDE.md invariants respected (pnpm only; thin entry points; helpers in lib; small focused functions)
- [ ] README updated alongside code changes

---

### Phase 6: SEO, metadata, JSON-LD, sitemap, robots, OG image

**Risk:** medium
**Mode:** afk
**Type:** frontend

**Success criteria:** Viewing page source shows: correct `<title>` using template, `<meta>` description, canonical URL, Open Graph tags, and Twitter card tags. `https://localhost:3000/sitemap.xml` returns a valid XML sitemap. `https://localhost:3000/robots.txt` returns a valid robots file. A `<script type="application/ld+json">` tag in the HTML contains valid LocalBusiness and Service JSON-LD. The `/opengraph-image` route returns a 1200×630 image. `<html lang="es">` is present.

**Commit message:** `feat(seo): add metadata API, JSON-LD schemas, OG image, sitemap, and robots`

**File changes:**

| Action | File | What changes |
|---|---|---|
| Modify | `src/app/layout.tsx` | Export `metadata` object: title template `%s | web-express`, description, metadataBase (`https://web-express.com.ar`), openGraph, twitter; inject JSON-LD `<script>` tags via `<Script>` or inline |
| Create | `src/app/opengraph-image.tsx` | Next.js `ImageResponse` (Edge); renders branded 1200×630 OG image with site name and tagline |
| Create | `src/app/sitemap.ts` | Returns `MetadataRoute.Sitemap` with home route and last modified date |
| Create | `src/app/robots.ts` | Returns `MetadataRoute.Robots` with allow all, sitemap URL pointing to `https://web-express.com.ar/sitemap.xml` |
| Modify | `src/app/page.tsx` | Export `metadata` with page-level title (falls back to template default) |

**Steps:**
- [ ] In `layout.tsx`, add `export const metadata: Metadata` with: `title: { template: "%s | web-express", default: "web-express — Sitios web profesionales para tu negocio" }`, description in Spanish, `metadataBase: new URL("https://web-express.com.ar")`, `openGraph` with type `website`, `twitter` with `card: "summary_large_image"`
- [ ] Ensure `<html lang="es">` is set in layout (already done in Phase 1; confirm it persists)
- [ ] Inject JSON-LD: in `layout.tsx` render two `<script type="application/ld+json">` tags using `dangerouslySetInnerHTML` — one for `buildLocalBusinessSchema()`, one for the site overall; individual service schemas can be injected in Services section if needed
- [ ] Create `src/app/opengraph-image.tsx`: export default using `ImageResponse`, size `{ width: 1200, height: 630 }`, renders site name in DM Sans (fetched at build time via `fetch` from Google Fonts or bundled font file); **allowed fallback:** if the custom-font `fetch` complicates the Edge build (timeout or CORS errors at build time), remove the font fetch and let `ImageResponse` use its default sans-serif — note this as a comment in the file so it's an intentional trade-off, not an oversight
- [ ] Create `src/app/sitemap.ts`: export default returning array with `{ url: "https://web-express.com.ar", lastModified: new Date(), changeFrequency: "monthly", priority: 1 }`
- [ ] Create `src/app/robots.ts`: export default returning `{ rules: { userAgent: "*", allow: "/" }, sitemap: "https://web-express.com.ar/sitemap.xml" }`
- [ ] Verify all image `<img>` alt texts are present in Hero and other sections (review Phase 2–5 work)
- [ ] Confirm semantic heading order: one `<h1>` in Hero, `<h2>` for each section heading, `<h3>` for sub-items

**Tests:**

No automated tests — justified because: Next.js Metadata API, sitemap.ts, and robots.ts are framework-generated routes with no extractable business logic; `buildLocalBusinessSchema` and `buildServiceSchema` are unit-tested in Phase 1. Correctness verified via Verification steps and external validators.

**Verification:**
- [ ] `pnpm build && pnpm start` — view source of `http://localhost:3000`: `<title>web-express — Sitios web profesionales...` present
- [ ] `<meta name="description">` present in source
- [ ] `<meta property="og:title">` and `<meta property="og:image">` present
- [ ] `<meta name="twitter:card" content="summary_large_image">` present
- [ ] `<html lang="es">` in source
- [ ] `http://localhost:3000/sitemap.xml` — browser shows XML with home URL
- [ ] `http://localhost:3000/robots.txt` — browser shows `Allow: /` and `Sitemap:` line
- [ ] `http://localhost:3000/opengraph-image` — browser renders 1200×630 branded image
- [ ] View source: `<script type="application/ld+json">` present, paste JSON into schema.org validator — no errors
- [ ] `pnpm build` exits 0

**Phase review:**
- [ ] All steps completed and checked off
- [ ] Commit message follows conventional commits
- [ ] No dead/commented-out code introduced
- [ ] No new dependencies added beyond what the phase requires
- [ ] CLAUDE.md invariants respected (pnpm only; no SEO libs; build-our-own JSON-LD via schema.ts)
- [ ] README updated alongside code changes

---

### Phase 7: Final Verification

**Mode:** hil

**Overall success criteria:**
1. The full page renders correctly in light and dark mode at 375 px, 768 px, and 1440 px with zero layout breaks.
2. All 7 sections (Hero, About, Services, Process, FAQ, Contact, Footer) render with correct Argentine Spanish content.
3. Every CTA (WhatsApp floating button, Hero CTA, Services card CTAs, Contact CTAs) resolves to the correct URL.
4. `pnpm build` is clean (zero TypeScript errors, zero ESLint errors).
5. All unit tests pass (`pnpm test`).
6. Page source passes: correct `<title>`, OG tags, JSON-LD (no schema.org errors), `<html lang="es">`.
7. Sitemap and robots.txt accessible and valid.
8. No CLAUDE.md invariants violated (no npm/yarn, no dead code, thin entry points, small functions, no inline business logic in page.tsx).
9. Vercel preview deployment succeeds and golden path is exercised on the live URL.

**Steps:**
- [ ] Confirm all prior phase checkboxes are ticked (Phases 1–6 phase reviews complete)
- [ ] Run `pnpm build` — confirm exit 0, zero TypeScript errors, zero ESLint errors
- [ ] Run `pnpm test` — confirm all unit tests pass (format.test.ts, schema.test.ts, contact.test.ts)
- [ ] Launch `pnpm dev`; manually walk the golden path:
  - [ ] Land on page: Hero visible, full-viewport, headline readable
  - [ ] Click "Reservá una llamada" — WhatsApp opens in new tab with correct number
  - [ ] Click "Ver servicios" — smooth scrolls to Services section
  - [ ] Services: verify 4 cards, prices as `AR$X.000`, bento grid
  - [ ] About: 3 pillars with lucide icons
  - [ ] Process: 4 numbered steps
  - [ ] FAQ: open each of 5 accordion items; keyboard Tab + Enter navigation
  - [ ] Contact: type name + message → click WhatsApp CTA → URL includes encoded input; click email CTA → mailto opens
  - [ ] Footer: copyright year correct, nav links present, social icons are SVG
  - [ ] WhatsApp floating button: visible throughout scroll, opens WA
- [ ] Edge cases:
  - [ ] Very long name/message in Contact inputs — URL still valid (browser handles truncation)
  - [ ] Prefers-reduced-motion: add media query in DevTools — no jarring motion
  - [ ] Tab through entire page — all interactive elements reachable and focusable
  - [ ] At 375 px: no horizontal scroll, no text overflow
  - [ ] Gold (`#c9ae7b`) only on fills/borders/display text — not on small body text
  - [ ] No `z-[9999]`, no `100vh`/`h-screen`, no full-width body text in source
- [ ] Dark mode end-to-end:
  - [ ] Toggle to dark — all sections use correct dark tokens
  - [ ] No hardcoded `#ffffff` or `#1d1d1d` outside CSS custom property declarations
- [ ] SEO:
  - [ ] View source: `<title>`, `<meta name="description">`, OG tags, JSON-LD `<script>` all present
  - [ ] Paste JSON-LD from source into https://validator.schema.org — no errors
  - [ ] `/sitemap.xml` accessible and valid
  - [ ] `/robots.txt` accessible and valid
- [ ] Code quality — run code-reviewer skill end-to-end:
  - [ ] No correctness bugs flagged
  - [ ] No CLAUDE.md invariant violations (pnpm, thin entry points, no dead code, small functions)
- [ ] Deploy to Vercel preview:
  - [ ] `vercel --prebuilt` or push branch and let Vercel CI trigger
  - [ ] Preview URL opens and golden path passes on live deployment
  - [ ] Vercel build log: zero errors, zero warnings on framework checks
- [ ] Overall success criteria checklist:
  - [ ] Full page correct in light + dark at 375/768/1440 px
  - [ ] All 7 sections present with Argentine Spanish content
  - [ ] All CTAs resolve to correct URLs
  - [ ] `pnpm build` clean
  - [ ] All unit tests pass
  - [ ] SEO/meta/JSON-LD valid
  - [ ] Sitemap + robots valid
  - [ ] No CLAUDE.md invariants violated
  - [ ] Vercel preview deployment succeeds

---

## Documentation

| File | What to document |
|---|---|
| `README.md` | Stack, local dev (`pnpm dev`), build (`pnpm build`), design token reference, content update guide (how to edit `site.ts` / `services.ts` to swap placeholders — WhatsApp number, email, social URLs), deploy (Vercel) |
| `src/content/site.ts` | Inline JSDoc on `SiteConfig` fields; comment explaining WhatsApp number format (international, no `+`) |
| `src/content/services.ts` | Inline JSDoc on `ServicePackage` fields; note on how to add/remove packages |
| `src/lib/format.ts` | JSDoc on `formatPriceARS` parameter and return value |
| `src/lib/schema.ts` | JSDoc on both builder functions; note on `priceCurrency: "ARS"` and JSON-LD spec version |
| `src/lib/contact.ts` | JSDoc on `buildWhatsAppUrl` and `buildMailtoUrl`; note on `encodeURIComponent` usage and empty-input fallback behavior |

---

## Tests

| Test file | Phase | What it tests |
|---|---|---|
| `src/lib/__tests__/format.test.ts` | Phase 1 | `formatPriceARS`: correct dot-separated thousands, `AR$` prefix, edge cases (0, large numbers) |
| `src/lib/__tests__/schema.test.ts` | Phase 1 | `buildLocalBusinessSchema`: required `@type`, `@context`, `priceCurrency: "ARS"` fields; `buildServiceSchema`: maps `ServicePackage` name and price to offer |
| `src/lib/__tests__/contact.test.ts` | Phase 5 | `buildWhatsAppUrl`: wa.me prefix, encodeURIComponent applied, fallback when inputs empty, phone from config; `buildMailtoUrl`: mailto prefix, subject+body encoded, empty fallback |

Phases 2, 3, 4, 6 are pure presentational Server Components or framework-generated routes with no extractable logic; they are verified via Verification steps in each phase.

---

## Human Summary

This plan builds the **web-express.com.ar** marketing landing page as a Next.js 15 App Router site in 7 phases (plus worktree setup):

- **Phase 1** lays the entire foundation: scaffold, Tailwind v4 design tokens, next-themes, typed content files, and lib helpers — justified as the one permitted infra exception.
- **Phases 2–5** are vertical feature slices: each ships a visible, testable section of the page (Hero → About+Services → Process+FAQ → Contact+Footer).
- **Phase 6** layers on all SEO concerns: Next.js Metadata API, JSON-LD, OG image, sitemap, robots.
- **Phase 7** is a human-in-the-loop final verification covering golden path, edge cases, dark/light, a11y, SEO validity, and Vercel deploy.

Key constraints baked into every phase: pnpm only; no backend/form services; no RHF/zod/animation libs/state managers/email SaaS/i18n; lucide SVGs (no emoji); Argentine voseo Spanish; `min-h-dvh` not `100vh`; body text capped at 65–75ch; gold accent (`#c9ae7b`) only on fills/borders/display text — never body text; z-index scale max z-50; axe + keyboard + contrast checks in every phase's Verification; `ui-ux-pro-max` skill invoked for UI design decisions in Phases 2 and 3. Phase 0 now includes `git init` + empty commit because the repo is greenfield non-git. Phase 5 extracts URL builders into `src/lib/contact.ts` (unit-tested) rather than inlining them in the component. OG image font fetch has an explicit allowed fallback to default font if Edge build rejects it.
