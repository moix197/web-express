import { ImageResponse } from "next/og"
import { siteConfig } from "@/content/site"

// Intentional trade-off: no custom font fetch here.
// Fetching Google Fonts at Edge build time risks timeout/CORS failures.
// ImageResponse default sans-serif is used instead for reliability.
export const runtime = "edge"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

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
          <div
            style={{
              width: "72px",
              height: "72px",
              background: "#0ea5e9",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "20px",
            }}
          >
            <span style={{ color: "#ffffff", fontSize: "32px", fontWeight: 700, letterSpacing: "-1px" }}>WE</span>
          </div>
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
