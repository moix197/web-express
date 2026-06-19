# src/content

Typed content files. Edit these to update the whole site without touching components.

## site.ts

`siteConfig` is the single source of truth for site identity and SEO configuration.

### `metadataBase`

A `URL` object (not a string — Next.js requires this). Controlled by the
`NEXT_PUBLIC_SITE_URL` env var; falls back to `https://web-express.com.ar` when
unset.

Setting `NEXT_PUBLIC_SITE_URL` causes all of the following to reflect the new domain:

- `<link rel="canonical">` (via Next.js `metadataBase`)
- Sitemap (`sitemap.ts` / next-sitemap)
- `robots.txt` host declaration
- JSON-LD `url` fields (`LocalBusiness`, `Service` provider) — via `siteConfig.metadataBase.toString()`
- Footer copyright domain text — via `siteConfig.domain`
- OG image domain badge — via `siteConfig.domain`

### `domain` getter

`siteConfig.domain` returns `siteConfig.metadataBase.host` — the bare hostname
with no protocol or trailing slash (e.g. `"web-express.com.ar"`). Use this in
components that need only the domain name; never duplicate `.host` logic.

## services.ts

The four service packages shown in the Servicios section. Each entry has `id`,
`name`, `price` (in ARS), `description`, and `features`. Add or remove a package
by editing the `services` array.
