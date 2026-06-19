/** Global site configuration. Edit placeholders here to update the whole site. */
export interface SiteConfig {
  /** Public site name. */
  name: string
  /** Short tagline shown in metadata and hero. */
  tagline: string
  /**
   * Canonical production origin used as the metadata base URL.
   * Controlled by the `NEXT_PUBLIC_SITE_URL` env var; falls back to
   * `https://web-express.com.ar` when the var is unset.
   */
  metadataBase: URL
  /**
   * Shorthand for `metadataBase.host` — the bare hostname without protocol or
   * trailing slash (e.g. `"web-express.com.ar"`). Use this wherever only the
   * domain name is needed (footer copyright, OG badge) so consumers never
   * duplicate `.host` logic.
   */
  readonly domain: string
  /** Contact email address. */
  email: string
  /**
   * WhatsApp number in international format WITHOUT the leading `+` and with no
   * spaces or dashes — e.g. `5491100000000` (country 54, area 9 11, number).
   * Used directly in `https://wa.me/<whatsApp>` deep links.
   */
  whatsApp: string
  /** Social profile URLs. Replace `#` placeholders with real URLs when ready. */
  social: {
    instagram: string
    linkedin: string
    github: string
  }
}

export const siteConfig: SiteConfig = {
  name: "web-express",
  tagline: "Sitios web profesionales para tu negocio",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://web-express.com.ar"),
  get domain() {
    return this.metadataBase.host
  },
  email: "hola@web-express.com.ar",
  whatsApp: "5491100000000",
  social: {
    instagram: "#",
    linkedin: "#",
    github: "#",
  },
}
