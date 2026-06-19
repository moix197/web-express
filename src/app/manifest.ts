import type { MetadataRoute } from "next"
import { siteConfig } from "@/content/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "WE",
    theme_color: "#c9ae7b",
    background_color: "#f7f4ef",
    display: "browser",
    icons: [
      {
        src: "/icon",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  }
}
