/** Global site configuration. Edit placeholders here to update the whole site. */
export interface SiteConfig {
  /** Public site name. */
  name: string
  /** Short tagline shown in metadata and hero. */
  tagline: string
  /** Canonical production origin used as the metadata base URL. */
  metadataBase: URL
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
  metadataBase: new URL("https://web-express.com.ar"),
  email: "hola@web-express.com.ar",
  whatsApp: "5491100000000",
  social: {
    instagram: "#",
    linkedin: "#",
    github: "#",
  },
}
