import { ImageResponse } from "next/og"
import { siteConfig } from "@/content/site"

// Intentional trade-off: no custom font fetch here.
// Fetching Google Fonts at Edge build time risks timeout/CORS failures.
// ImageResponse default sans-serif is used instead for reliability.
export const runtime = "edge"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Gold portal mark — inlined so no fs/readFileSync is needed on the edge runtime.
// Satori does not reliably render inline <svg> with linearGradients referencing
// local defs, but <img src="data:image/svg+xml;base64,..."> renders correctly.
const ICON_SVG = `<svg width="600" height="600" viewBox="255 147 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="portalGold" x1="292" y1="184" x2="812" y2="724" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E6CC91"/>
      <stop offset="45%" stop-color="#C9AE7B"/>
      <stop offset="100%" stop-color="#A98545"/>
    </linearGradient>
  </defs>
  <path fill="url(#portalGold)" fill-rule="evenodd" d="M 298 292 C 298 232, 346 184, 406 184 L 704 184 C 764 184, 812 232, 812 292 L 812 710 L 700 660 L 700 446 C 700 410, 676 379, 642 369 L 443 309 C 418 301, 392 320, 392 347 L 392 660 L 298 710 Z M 444 374 L 617 426 C 646 435, 666 462, 666 493 L 666 642 L 444 642 Z"/>
</svg>`

const ICON_B64 = Buffer.from(ICON_SVG).toString("base64")

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0e7490 100%)",
          fontFamily: "sans-serif",
          padding: "64px",
        }}
      >
        {/* Logo / brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          {/* Gold portal mark — no background container; mark stands on the dark OG gradient */}
          <img
            src={`data:image/svg+xml;base64,${ICON_B64}`}
            width={72}
            height={72}
            style={{ marginRight: "20px" }}
          />
          <span
            style={{
              color: "#ffffff",
              fontSize: "48px",
              fontWeight: 700,
              letterSpacing: "-1px",
            }}
          >
            {siteConfig.name}
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            color: "#bae6fd",
            fontSize: "28px",
            fontWeight: 400,
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
            margin: "0 0 48px 0",
          }}
        >
          {siteConfig.tagline}
        </p>

        {/* CTA badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(14, 165, 233, 0.2)",
            border: "1px solid rgba(14, 165, 233, 0.4)",
            borderRadius: "9999px",
            padding: "12px 32px",
          }}
        >
          <span style={{ color: "#7dd3fc", fontSize: "20px", fontWeight: 500 }}>
            {siteConfig.domain}
          </span>
        </div>
      </div>
    ),
    size,
  )
}
