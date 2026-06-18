import { siteConfig } from "@/content/site"
import type { ServicePackage } from "@/content/services"

/**
 * Build a schema.org `LocalBusiness` JSON-LD object for the studio.
 *
 * Prices are quoted in `ARS`. Embed the returned object in a
 * `<script type="application/ld+json">` tag. Uses JSON-LD per schema.org.
 */
export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description: siteConfig.tagline,
    url: siteConfig.metadataBase.toString(),
    email: siteConfig.email,
    telephone: `+${siteConfig.whatsApp}`,
    priceRange: "$$",
    areaServed: "AR",
    currenciesAccepted: "ARS",
  }
}

/**
 * Build a schema.org `Service` JSON-LD object for a single service package.
 *
 * Maps the package name and price into an `Offer` priced in `ARS`.
 */
export function buildServiceSchema(service: ServicePackage) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.name,
      url: siteConfig.metadataBase.toString(),
    },
    offers: {
      "@type": "Offer",
      price: service.price,
      priceCurrency: "ARS",
    },
  }
}
