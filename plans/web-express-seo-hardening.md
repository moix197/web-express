# Plan: SEO Hardening — web-express landing page

**Created:** 2026-06-19
**Branch:** feat/seo-hardening (base ref: main)
**Status:** not started

---

## Context

The web-express Next.js App Router landing page has multiple SEO gaps that must be closed before go-live: hardcoded domain strings in two places, incomplete Twitter/OG metadata, missing icon set (favicon only), no web manifest, wrong lang attribute, and two semantic HTML issues that hurt accessibility signals. The goal is to make swapping placeholder data for real values a one-place config edit that cannot break SEO or the build.

---

## Risk: medium

---

## Dependencies & Risks

- All 4 existing vitest tests (schema, contact, format, useActiveSection) must keep passing throughout.
- `pnpm build` must remain green after every phase.
- JSON-LD structured data must remain valid (no schema regressions).
- Phase 3 icon generation uses Next.js ImageResponse — edge runtime constraint applies (no Node-only APIs).
- No new npm dependencies may be added (project rule: build our own first).
- The WE monogram visual must be consistent across `icon.tsx`, `apple-icon.tsx`, and the updated OG badge.

---

## Phases

### Phase 0: Create worktree

Create a git worktree for isolated development.

- [ ] **Confirm with orchestrator (user):** branch name `feat/seo-hardening`, base ref `main`, worktree path `../freelo-seo-hardening` — get explicit approval before running the next step.
- [ ] Run `git worktree add ../freelo-seo-hardening -b feat/seo-hardening main`.
- [ ] Run `git worktree list` and confirm the new worktree appears on the correct branch.
- [ ] Set working directory to `../freelo-seo-hardening` for all subsequent phases.

---

### Phase 1: Single source of truth + env-overridable base URL

**Risk:** low
**Mode:** afk
**Type:** frontend

**Success criteria:** Setting `NEXT_PUBLIC_SITE_URL=https://staging.example.com` causes the canonical URL, sitemap, robots.txt, JSON-LD `url` fields, Footer domain text, and OG image domain text ALL to reflect the new domain — confirmed by `grep`-ing source and running `pnpm build` + `pnpm test` green. `grep -r "web-express.com.ar" src/components/ src/app/` returns zero results. No literal "web-express.com.ar" string exists outside `src/content/site.ts` (fallback) and `.env.example`.

**Commit message:** `feat(seo): single source of truth for base URL, env-overridable via NEXT_PUBLIC_SITE_URL`

**File changes:**

| Action | File | What changes |
|---|---|---|
| modify | `src/content/site.ts` | Change `metadataBase` assignment to `new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://web-express.com.ar")` — this keeps it a `URL` object as Next.js requires (not a plain string). Add a `domain` getter: `get domain() { return this.metadataBase.host; }` so consumers read `siteConfig.domain` without duplicating `.host` logic. |
| modify | `src/components/sections/Footer.tsx` | Line 60: replace hardcoded `"web-express.com.ar"` with `siteConfig.domain` (import siteConfig). |
| modify | `src/app/opengraph-image.tsx` | Line 90: replace hardcoded `"web-express.com.ar"` with `siteConfig.domain` (already imports siteConfig). |
| create | `.env.example` | Documents `NEXT_PUBLIC_SITE_URL=https://web-express.com.ar` with a comment explaining it controls canonical/sitemap/robots/JSON-LD/footer/OG. |

**Steps:**

- [x] Read `src/content/site.ts` to confirm current `metadataBase` shape.
- [x] Modify `src/content/site.ts`: change `metadataBase` to `new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://web-express.com.ar")` and add a `domain` getter returning `this.metadataBase.host`.
- [x] Read `src/components/sections/Footer.tsx` line 60, replace the hardcoded string with `siteConfig.domain`.
- [x] Read `src/app/opengraph-image.tsx` line 90, replace the hardcoded string with `siteConfig.domain`.
- [x] Create `.env.example` at project root documenting `NEXT_PUBLIC_SITE_URL`.
- [x] Run `pnpm test` — all 4 tests must pass.
- [x] Run `pnpm build` — must succeed.
- [x] Run `grep -r "web-express.com.ar" src/components/ src/app/` — must return zero results (the only remaining occurrence is the fallback in `src/content/site.ts`).
- [x] Update `src/content/README.md` (or the nearest relevant README) to document the `NEXT_PUBLIC_SITE_URL` env var and the `domain` getter.
- [x] Update project root `README.md` env vars / setup section with `.env.example` reference.

**Tests:**

| Action | File | What it covers |
|---|---|---|
| create | `src/content/__tests__/site.test.ts` | Unit-test the `domain` getter directly: given `siteConfig.metadataBase = new URL("https://example.com")`, `siteConfig.domain` returns `"example.com"`. Also assert `siteConfig.metadataBase` is an instance of `URL` (not a string), validating the Next.js requirement. This is the canonical test for the getter — avoids brittle env-mutation + module-re-require patterns. |
| modify | `src/lib/__tests__/schema.test.ts` | Add a note/comment that JSON-LD url fields are coupled to `siteConfig.metadataBase`; add one assertion that `localBusinessSchema.url` starts with `siteConfig.metadataBase.toString()`. Do NOT attempt env-var mutation of module-init constants — that pattern is unreliable in vitest's module cache. |

**Verification:**

- [x] `pnpm test` passes (all 4 existing + new `src/content/__tests__/site.test.ts`).
- [x] `pnpm build` passes.
- [x] `grep -r "web-express.com.ar" src/components/ src/app/` returns zero results.
- [x] `grep -r "web-express.com.ar" src/content/site.ts` returns exactly one result (the fallback string).
- [x] `siteConfig.metadataBase` is confirmed as a `URL` instance (asserted in site.test.ts).

**Phase review:**

- [x] All Steps and Verification checkboxes above ticked in the plan file
- [x] Reviewer handoff prompt emitted in a fenced code block as the final message of this turn
- [x] Orchestrator cleared context (`/clear`) and pasted the handoff prompt into a fresh session
- [x] Code-reviewer agent has verified this phase
- [x] Any changes made in response to code-reviewer suggestions have been reflected back into this plan file
- [x] Tests for this phase written and passing
- [x] Documentation updated
- [x] Orchestrator (user) has verified and approved this phase
- [x] Changes committed: `feat(seo): single source of truth for base URL, env-overridable via NEXT_PUBLIC_SITE_URL`
- [x] Phase marked complete

---

### Phase 2: Complete metadata for share/crawl correctness

**Risk:** low
**Mode:** afk
**Type:** frontend

**Success criteria:** Built HTML `<head>` (inspectable via `pnpm build` + `pnpm start` or `.next/server/app/index.html`) contains: `<meta name="robots" content="index, follow">`, populated `<meta name="twitter:title">`, `<meta name="twitter:description">`, `<meta name="twitter:image">`, and explicit OG `title`, `description`, `url`, and `images` tags. `pnpm build` green, all tests pass.

**Commit message:** `feat(seo): complete robots directives and twitter/OG metadata in layout`

**File changes:**

| Action | File | What changes |
|---|---|---|
| modify | `src/app/layout.tsx` | Add `robots: { index: true, follow: true, googleBot: { index: true, follow: true } }` to the metadata export. Extend `twitter` object to include `title`, `description`, and `images` (reference `siteConfig`). Make `openGraph` explicit: add `title`, `description`, `url` (from `siteConfig.metadataBase.toString()`), `images`. |

**Steps:**

- [x] Read `src/app/layout.tsx` metadata export to confirm current shape.
- [x] Add `robots` directive block.
- [x] Extend `twitter` with `title` (use `siteConfig.name`), `description` (use `siteConfig.tagline`), `images: [{ url: "/opengraph-image" }]`. Decision: use `/opengraph-image` as the twitter image reference — no separate `twitter-image.tsx` file will be created (see Phase 3). This avoids duplication since Twitter crawlers accept the `twitter:image` meta tag pointing to the OG image route.
- [x] Make `openGraph.title`, `openGraph.description`, `openGraph.url`, `openGraph.images` explicit (currently implicit or missing). Pull values from `siteConfig`.
- [x] Run `pnpm build` — must succeed.
- [x] Run `pnpm test` — all tests must pass.
- [x] Inspect built output (`.next/server/app/page.html` or equivalent) to confirm tags are present.
- [x] Update `src/app/README.md` to document the robots/twitter/OG additions and the twitter-image decision (Phase 2 step per Documentation table).

**Tests:**

No automated tests — justified because: this phase is pure metadata configuration in a Next.js metadata export object. The correctness signal is the built HTML output, which is verified in the Verification step. No extractable pure logic to unit-test.

**Verification:**

- [x] `pnpm build` passes.
- [x] `pnpm test` passes.
- [x] Built HTML contains `robots`, `twitter:title`, `twitter:description`, `twitter:image`, and explicit OG fields (inspect `.next/server/app/page.html` or run `pnpm start` and `curl localhost:3000 | grep -i "og:\|twitter:\|robots"`).

**Phase review:**

- [x] All Steps and Verification checkboxes above ticked in the plan file
- [x] Reviewer handoff prompt emitted in a fenced code block as the final message of this turn
- [x] Orchestrator cleared context (`/clear`) and pasted the handoff prompt into a fresh session
- [x] Code-reviewer agent has verified this phase
- [x] Any changes made in response to code-reviewer suggestions have been reflected back into this plan file
- [x] Tests for this phase written and passing (or no-tests justification accepted)
- [x] Documentation updated
- [x] Orchestrator (user) has verified and approved this phase
- [x] Changes committed: `feat(seo): complete robots directives and twitter/OG metadata in layout`
- [x] Phase marked complete

---

### Phase 3: Icon set + web manifest (WE monogram)

**Risk:** medium
**Mode:** hil
**Type:** frontend

**Success criteria:** Navigating to `/icon`, `/apple-icon`, and `/manifest.webmanifest` in the running app all return valid responses. The browser tab shows the WE favicon. The OG image badge displays "WE" (not "W"). `pnpm build` green, all tests pass.

**Commit message:** `feat(seo): add WE monogram icon set (icon.tsx, apple-icon.tsx) and web manifest`

**Note for executor:** This phase is `Mode: hil` because the WE monogram design requires orchestrator approval before coding. The orchestrator must invoke `ui-ux-pro-max --stack nextjs` (or `--stack shadcn`) and confirm the visual design before the subagent implements the icon files. The favicon.ico already in the public dir must remain in place alongside the new icon routes — Next.js serves both, with `icon.tsx` taking precedence for modern browsers. No favicon.ico deletion.

**File changes:**

| Action | File | What changes |
|---|---|---|
| create | `src/app/icon.tsx` | Next.js ImageResponse icon route. Renders a 32x32 (or 48x48) WE monogram on gradient background, matching OG style. Exports `size` and `contentType`. Uses edge runtime. Imports `siteConfig` for colors if needed. |
| create | `src/app/apple-icon.tsx` | Same as icon.tsx but 180x180 (Apple touch icon size). |
| create | `src/app/manifest.ts` | Next.js manifest route. Returns `MetadataRoute.Manifest` with `name: siteConfig.name`, `short_name: "WE"`, `theme_color: "#c9ae7b"` (accent token — confirm exact hex from `tailwind.config.ts` before hardcoding), `background_color: "#0a0a0a"` (page background — confirm from `globals.css` or Tailwind config before hardcoding), `display: "browser"`, `icons` array referencing `/icon` (192px) and `/apple-icon` (180px); no 512px entry since there is no static 512px asset. |
| modify | `src/app/opengraph-image.tsx` | Update the "W" rounded square badge text to "WE" to match the new monogram. Keep all other visual logic unchanged. |

**Steps:**

- [ ] **[hil — orchestrator]** Invoke `ui-ux-pro-max --stack nextjs` to design the WE monogram mark, requesting it match the existing OG image visual style (gradient + rounded square + text). Approve the design before proceeding.
- [ ] Confirm `theme_color` hex from `tailwind.config.ts` (accent token) and `background_color` hex from `globals.css`/Tailwind config. Update manifest.ts file-changes table above if they differ from the values listed.
- [ ] Read `src/app/opengraph-image.tsx` to understand the existing ImageResponse pattern; replicate the same approach in icon files (no Node-only APIs — edge runtime only).
- [ ] Create `src/app/icon.tsx` using Next.js ImageResponse. Export `size = { width: 48, height: 48 }` and `contentType = "image/png"`. Render WE monogram using the approved design. Do NOT use any Node.js-only APIs (no `fs`, `path`, `Buffer` with Node polyfill, etc.).
- [ ] Create `src/app/apple-icon.tsx` at 180x180. Same monogram, same constraints.
- [ ] Create `src/app/manifest.ts` returning the web manifest object with confirmed color values.
- [ ] Modify `src/app/opengraph-image.tsx` — change "W" to "WE" in the badge text.
- [ ] **twitter-image decision (resolved in Phase 2):** Phase 2 sets `twitter.images: [{ url: "/opengraph-image" }]` in layout metadata. No separate `twitter-image.tsx` is needed. Do not create one.
- [ ] Confirm existing `favicon.ico` is NOT deleted — it coexists with `icon.tsx`. Next.js serves both.
- [ ] Run `pnpm build` — must succeed.
- [ ] Run `pnpm test` — all tests must pass.
- [ ] Start dev server (`pnpm dev`) and verify `/manifest.webmanifest`, `/icon`, `/apple-icon` return 200.
- [ ] Verify browser tab favicon shows WE mark.
- [ ] Update `src/app/README.md` to document the icon/manifest file-convention files, their visual relationship, and the favicon.ico coexistence note.

**Tests:**

No automated tests — justified because: all three new files (icon.tsx, apple-icon.tsx, manifest.ts) are Next.js App Router file-convention route handlers whose correctness is verified by the Next.js build and HTTP response (both covered in Verification). The opengraph-image change is a one-character text edit with no extractable logic.

**Verification:**

- [ ] `pnpm build` passes.
- [ ] `pnpm test` passes.
- [ ] `GET /manifest.webmanifest` returns JSON with correct `name`, `theme_color` (`#c9ae7b` or confirmed value), `icons`.
- [ ] `GET /icon` returns a PNG image (200 status).
- [ ] `GET /apple-icon` returns a PNG image (200 status).
- [ ] `GET /favicon.ico` still returns 200 (existing file not deleted).
- [ ] OG image badge shows "WE" (verify at `/opengraph-image`).
- [ ] Browser tab favicon shows WE mark.
- [ ] No Node-only APIs in icon.tsx or apple-icon.tsx (confirm by `grep -n "require('fs')\|require('path')\|readFileSync" src/app/icon.tsx src/app/apple-icon.tsx` returns no results).

**Phase review:**

- [ ] All Steps and Verification checkboxes above ticked in the plan file
- [ ] Reviewer handoff prompt emitted in a fenced code block as the final message of this turn
- [ ] Orchestrator cleared context (`/clear`) and pasted the handoff prompt into a fresh session
- [ ] Code-reviewer agent has verified this phase
- [ ] Any changes made in response to code-reviewer suggestions have been reflected back into this plan file
- [ ] Tests for this phase written and passing (or no-tests justification accepted)
- [ ] Documentation updated
- [ ] Orchestrator (user) has verified and approved this phase
- [ ] Changes committed: `feat(seo): add WE monogram icon set (icon.tsx, apple-icon.tsx) and web manifest`
- [ ] Phase marked complete

---

### Phase 4: Accessibility/semantic polish (lang, landmark, form)

**Risk:** low
**Mode:** afk
**Type:** frontend

**Success criteria:** axe-core (or browser axe extension) reports zero violations on the Hero section and Contact section. `<html lang="es-AR">` is present in built output. The contact card renders as a `<form>` element. Hero `<section>` has `aria-labelledby` pointing to the `<h1>` id. `pnpm build` + `pnpm test` green.

**Commit message:** `fix(a11y): lang=es-AR, Hero aria-labelledby, Contact div→form`

**File changes:**

| Action | File | What changes |
|---|---|---|
| modify | `src/app/layout.tsx` | Change `<html lang="es">` to `<html lang="es-AR">` (line ~52). |
| modify | `src/components/sections/Hero.tsx` | Add `id="hero-heading"` to the `<h1>` (line ~17). Add `aria-labelledby="hero-heading"` to the `<section id="inicio">` (line ~9). |
| modify | `src/components/sections/Contact.tsx` | Change the wrapping `<div>` of the form card (line ~41) to `<form onSubmit={(e) => e.preventDefault()}>`. No submit behavior added — CTAs remain mailto/wa.me anchor tags. |

**Steps:**

- [ ] Read `src/app/layout.tsx` and change `lang="es"` to `lang="es-AR"`.
- [ ] Read `src/components/sections/Hero.tsx`: add `id="hero-heading"` to `<h1>`, add `aria-labelledby="hero-heading"` to the wrapping `<section>`.
- [ ] Read `src/components/sections/Contact.tsx`: locate the wrapping `<div>` around the form fields (line ~41), change to `<form onSubmit={(e) => e.preventDefault()}>` with matching closing tag.
- [ ] Run `pnpm test` — contact.test.ts and all other tests must pass.
- [ ] Run `pnpm build` — must succeed.
- [ ] Verify `lang="es-AR"` in built HTML.

**Tests:**

No automated tests — justified because: all three changes are pure JSX structural/attribute edits with no extractable business logic. The `<form>` wrapper replaces a `<div>` but adds only `e.preventDefault()` — no logic flows change. `contact.test.ts` already covers wa.me/mailto encoding and must keep passing without modification (verify in Verification). The lang attribute and ARIA linkage are semantic markup changes verified by built HTML inspection and axe. No new logic to unit-test.

**Verification:**

- [ ] `pnpm build` passes.
- [ ] `pnpm test` passes (especially `contact.test.ts`).
- [ ] Built HTML `<html>` tag has `lang="es-AR"`.
- [ ] Hero `<section>` has `aria-labelledby="hero-heading"` and `<h1 id="hero-heading">` in rendered output.
- [ ] Contact card renders as `<form>` in browser DevTools.
- [ ] axe browser extension reports zero new violations on Hero and Contact sections.

**Phase review:**

- [ ] All Steps and Verification checkboxes above ticked in the plan file
- [ ] Reviewer handoff prompt emitted in a fenced code block as the final message of this turn
- [ ] Orchestrator cleared context (`/clear`) and pasted the handoff prompt into a fresh session
- [ ] Code-reviewer agent has verified this phase
- [ ] Any changes made in response to code-reviewer suggestions have been reflected back into this plan file
- [ ] Tests for this phase written and passing (or no-tests justification accepted)
- [ ] Documentation updated
- [ ] Orchestrator (user) has verified and approved this phase
- [ ] Changes committed: `fix(a11y): lang=es-AR, Hero aria-labelledby, Contact div→form`
- [ ] Phase marked complete

---

### Phase 5: Final Verification

**Mode:** hil

**Overall success criteria:**

- `pnpm build` and `pnpm test` (all 4 original + new site.test.ts) pass on the branch.
- JSON-LD (localBusiness + services) validates clean in Google Rich Results Test.
- Social preview (OG + Twitter) shows correct title, description, and WE image.
- `/manifest.webmanifest` is valid JSON with correct fields.
- Env-swap dry run: set `NEXT_PUBLIC_SITE_URL=https://staging.fake.test`, rebuild, confirm canonical/sitemap/robots/JSON-LD/footer/OG all reflect the new domain; revert and rebuild.
- axe reports no violations on Hero and Contact sections.
- Lighthouse SEO score ≥ 95 (or no regressions vs baseline).
- No literal "web-express.com.ar" string in `src/` outside `src/content/site.ts`.
- All phase checkboxes in this file are ticked.

**Steps:**

- [ ] Every preceding phase's Steps/Verification/Phase review checkboxes are ticked in the plan file.
- [ ] Reviewer handoff prompt emitted in a fenced code block (scoped to end-to-end review).
- [ ] Orchestrator cleared context (`/clear`) and pasted the handoff prompt into a fresh session.
- [ ] Code-reviewer agent reviews the entire change end-to-end.
- [ ] Any changes made in response to the final code-reviewer review have been reflected back into this plan file.
- [ ] `pnpm test` — all tests pass.
- [ ] `pnpm build` — succeeds.
- [ ] JSON-LD validated via Google Rich Results Test (paste rendered HTML or URL).
- [ ] OG/Twitter preview verified via social debugger (or meta tag inspection).
- [ ] `/manifest.webmanifest` JSON validated.
- [ ] Env-swap dry run completed and reverted.
- [ ] axe run on Hero + Contact — zero violations.
- [ ] Lighthouse SEO check run.
- [ ] `grep -r "web-express.com.ar" src/` returns only `src/content/site.ts`.
- [ ] No CLAUDE.md invariants violated (no new deps, thin entry points, reuse helpers, minimal changes, pnpm).
- [ ] Overall success criteria met.
- [ ] All phase checkboxes above are ticked.

---

## Documentation

| Change | Documentation location |
|---|---|
| `NEXT_PUBLIC_SITE_URL` env var + `domain` getter in `siteConfig` | Project root `README.md` (env vars section) and `src/content/README.md` (or nearest README in that dir) — added in Phase 1 |
| `.env.example` added | Project root `README.md` (setup section) — added in Phase 1 |
| `robots`, `twitter`, `openGraph` metadata additions; twitter-image decision (use `/opengraph-image`) | `src/app/README.md` (or nearest app-dir README) — note that `twitter.images` points to `/opengraph-image` and no separate `twitter-image.tsx` exists — added in Phase 2 |
| Icon/manifest file-convention files (`icon.tsx`, `apple-icon.tsx`, `manifest.ts`) | `src/app/README.md` — describes file-convention routes, their visual relationship, favicon.ico coexistence, and confirmed manifest color values — added in Phase 3 |
| WE monogram design decision | `src/app/README.md` — note that icon.tsx, apple-icon.tsx, and opengraph-image.tsx share the same visual identity — added in Phase 3 |
| `lang="es-AR"` change | Inline comment in `layout.tsx` only if non-obvious; no separate doc entry needed — Phase 4 |

---

## Tests

| Phase | Logic under test | Test file |
|---|---|---|
| Phase 1 | `siteConfig.domain` getter returns `metadataBase.host` | `src/content/__tests__/site.test.ts` |
| Phase 1 | JSON-LD url fields reflect siteConfig (existing coverage) | `src/lib/__tests__/schema.test.ts` |
| Phase 2 | No testable logic | — justified: pure metadata config object in layout.tsx, verified via built HTML inspection |
| Phase 3 | No testable logic | — justified: Next.js file-convention route handlers (icon.tsx, apple-icon.tsx, manifest.ts), correctness verified via HTTP response and pnpm build; no Node-only API risk confirmed by grep |
| Phase 4 | No testable logic | — justified: pure JSX attribute edits, verified via axe + built HTML |

---

## Human Summary

This plan closes five categories of SEO gaps in the web-express Next.js landing page before go-live.

**Phase 1** makes the base URL a single source of truth. Today, "web-express.com.ar" is hardcoded in three places; after this phase, it lives only in `src/content/site.ts` as a fallback, and a single env var (`NEXT_PUBLIC_SITE_URL`) controls it everywhere — canonical URL, sitemap, robots.txt, JSON-LD, footer, and OG image all update together.

**Phase 2** fills in the missing metadata. The layout currently has no `robots` directives and an incomplete Twitter card (no title/description/image). After this phase, crawlers see explicit index/follow instructions and social platforms see full preview data.

**Phase 3** adds the WE monogram icon set. Today, only `favicon.ico` exists. After this phase, `icon.tsx` and `apple-icon.tsx` generate brand-consistent icons via Next.js ImageResponse (edge runtime, no new dependencies), and `manifest.ts` provides a basic web manifest. The OG image badge is updated from "W" to "WE" for visual consistency.

**Phase 4** fixes two semantic HTML issues that affect both accessibility and SEO signals: the `<html lang>` attribute changes from `"es"` to the more specific `"es-AR"`, the Hero section gets proper `aria-labelledby` linking, and the Contact card's wrapping `<div>` becomes a semantic `<form>`.

**The end state:** a go-live-ready landing page where all SEO signals are correct, all placeholder data flows from a single config location, and changing the production domain requires editing exactly one env var.
