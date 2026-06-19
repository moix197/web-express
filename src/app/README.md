# src/app — Next.js App Router

## Metadata (`layout.tsx`)

The root `metadata` export in `layout.tsx` is the single location for global SEO metadata. All values are derived from `siteConfig` (`src/content/site.ts`) to ensure a one-place config edit propagates everywhere.

### robots

```ts
robots: {
  index: true,
  follow: true,
  googleBot: { index: true, follow: true },
}
```

Produces `<meta name="robots" content="index, follow">` and the Googlebot-specific variant. Set `index: false` here (or via `NEXT_PUBLIC_SITE_URL`) to gate crawling on staging.

### openGraph

Explicit fields: `title`, `description`, `url` (from `siteConfig.metadataBase.toString()`), and `images`. This ensures social platforms receive full preview data rather than relying on Next.js inference.

### twitter

Explicit fields: `title`, `description`, and `images`. `title` is the combined `"${siteConfig.name} — ${siteConfig.tagline}"` string (same as the root default title); `description` is the full marketing sentence shared with `openGraph`. Both are derived from local `title`/`description` consts hoisted above the `metadata` export. The `images` array references `/opengraph-image` (the Next.js ImageResponse route defined in `src/app/opengraph-image.tsx`).

**Decision — no separate `twitter-image.tsx`:** Twitter crawlers accept `twitter:image` pointing to the OG image route. Creating a separate `twitter-image.tsx` would duplicate the ImageResponse logic with no functional benefit. `twitter.images` points to `/opengraph-image` and that is sufficient.

## File-convention routes

| File | Route | Purpose |
|---|---|---|
| `opengraph-image.tsx` | `/opengraph-image` | OG image (also referenced by `twitter.images`) |
| `icon.svg` | `/icon` | Favicon SVG — gold logo isologo |
| `apple-icon.svg` | `/apple-icon` | Apple touch icon SVG — gold logo isologo |
| `manifest.ts` | `/manifest.webmanifest` | Web app manifest |
| `sitemap.ts` | `/sitemap.xml` | XML sitemap |
| `robots.ts` | `/robots.txt` | Robots directives |

## Icon set — gold logo

`icon.svg` and `apple-icon.svg` serve the official `logo_gold.svg` isologo as the site icon via Next.js file conventions. The WE monogram (`icon.tsx` / `apple-icon.tsx`) has been removed.

| File | Route | Format |
|---|---|---|
| `icon.svg` | `/icon` | SVG — served directly by Next.js |
| `apple-icon.svg` | `/apple-icon` | SVG — Apple touch icon fallback |

`favicon.ico` remains in `public/` and coexists with `icon.svg`; legacy browsers fall back to `favicon.ico`. `theme_color` (`#c9ae7b`) already matches the logo gradient midpoint — no change needed in `manifest.ts`.

## Web manifest (`manifest.ts`)

Confirmed color values read from `src/app/globals.css`:

| Token | Hex | Source |
|---|---|---|
| `theme_color` | `#c9ae7b` | `--accent` (gold brand token) |
| `background_color` | `#f7f4ef` | `--background` (light mode page background) |

`display: "browser"` is used (not `"standalone"`) because this is a marketing site, not an installable PWA. The `icons` array references `/icon` (48×48) and `/apple-icon` (180×180); no 512 px entry is included.
