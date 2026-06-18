# web-express

Marketing landing page for **web-express.com.ar**, a freelance web studio for
Argentine small businesses. Static-first, deployed on Vercel, written in
Argentine Spanish (voseo). All conversions funnel to WhatsApp or email.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4** (CSS-first config — tokens live in `src/app/globals.css`, no `tailwind.config.js`)
- **shadcn/ui** (Radix primitives) + **lucide-react** icons
- **next-themes** (light/dark via `class` strategy, `defaultTheme="system"`)
- **Vitest** for unit tests
- **pnpm** as the package manager (npm/yarn not used)

## Commands

```bash
pnpm dev      # start the dev server at http://localhost:3000
pnpm build    # production build (fails on TypeScript errors)
pnpm start    # serve the production build
pnpm test     # run Vitest unit tests
pnpm lint     # run ESLint
```

## Design tokens

All design tokens are CSS custom properties in `src/app/globals.css`, declared
under `:root` (light, default) and `.dark` (dark), then exposed to Tailwind via
the `@theme inline` block.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-background` | `#f7f4ef` | `#1d1d1d` | page background |
| `--color-foreground` | dark ink | light ink | **all body text** |
| `--color-surface` / `--color-card` | `#ffffff` | `#262626` | cards, raised panels |
| `--color-accent` | `#c9ae7b` (gold) | `#c9ae7b` | fills, borders, display/heading text |
| `--color-primary` | dark ink | light ink | primary buttons |
| `--color-muted` / `--color-muted-foreground` | | | subdued surfaces & secondary text |
| `--color-border` / `--color-input` / `--color-ring` | | | lines & focus rings |

**Accent constraint:** the gold accent (`--color-accent`, `#c9ae7b`) is for
**fills, borders, and display/heading text only**. Never use it for small body
text — it fails WCAG AA contrast on both backgrounds. Body text always uses
`--color-foreground`.

Fonts are loaded with `next/font`: **DM Sans** for headings
(`--font-dm-sans` → `--font-display`) and **Inter** for body
(`--font-inter` → `--font-sans`).

## Content

Editable content lives in typed files under `src/content/`:

- `site.ts` — site name, tagline, email, WhatsApp number (international format,
  no `+`), and social URLs (currently `#` placeholders).
- `services.ts` — the four service packages (name, price in ARS, description,
  features). Add or remove a package by editing the `services` array.

## Deploy

Push the branch and let Vercel build it, or run `vercel`. Tailwind v4 and the
App Router work on Vercel with zero extra configuration.
