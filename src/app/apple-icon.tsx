import { ImageResponse } from "next/og"

export const runtime = "edge"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "180px",
          height: "180px",
          background: "#0ea5e9",
          borderRadius: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: "68px",
            fontWeight: 700,
            fontFamily: "sans-serif",
            letterSpacing: "-2px",
          }}
        >
          WE
        </span>
      </div>
    ),
    size,
  )
}
