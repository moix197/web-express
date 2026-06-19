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
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  }
}
