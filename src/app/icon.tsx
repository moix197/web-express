import { ImageResponse } from "next/og"

export const runtime = "edge"

export const size = { width: 48, height: 48 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "48px",
          height: "48px",
          background: "#0ea5e9",
          borderRadius: "11px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: 700,
            fontFamily: "sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          WE
        </span>
      </div>
    ),
    size,
  )
}
