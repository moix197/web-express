import type { MetadataRoute } from "next"

import { siteConfig } from "@/content/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.metadataBase.toString(),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
