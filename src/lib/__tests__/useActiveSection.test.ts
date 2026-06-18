import { describe, expect, it } from "vitest"
import { getActiveSectionId } from "@/hooks/useActiveSection"

describe("getActiveSectionId", () => {
  it("returns first section id when at top (no sections above line)", () => {
    const tops = [
      { id: "inicio", top: 0 },
      { id: "servicios", top: 900 },
      { id: "proceso", top: 1800 },
    ]
    expect(getActiveSectionId(tops, 300, false)).toBe("inicio")
  })

  it("returns servicios when scrolled so inicio is above line and servicios is below", () => {
    const tops = [
      { id: "inicio", top: -600 },
      { id: "servicios", top: 100 },
      { id: "proceso", top: 1000 },
    ]
    expect(getActiveSectionId(tops, 300, false)).toBe("servicios")
  })

  it("returns the last section whose top is at or above the line", () => {
    const tops = [
      { id: "inicio", top: -600 },
      { id: "servicios", top: -200 },
      { id: "proceso", top: 250 },
      { id: "faq", top: 1200 },
    ]
    expect(getActiveSectionId(tops, 300, false)).toBe("proceso")
  })

  it("defaults to first section when none have crossed the line", () => {
    const tops = [
      { id: "inicio", top: 500 },
      { id: "servicios", top: 1400 },
    ]
    expect(getActiveSectionId(tops, 300, false)).toBe("inicio")
  })

  it("returns last id when isAtBottom is true regardless of tops", () => {
    const tops = [
      { id: "inicio", top: -2000 },
      { id: "contacto", top: -100 },
    ]
    expect(getActiveSectionId(tops, 300, true)).toBe("contacto")
  })

  it("returns empty string for empty array", () => {
    expect(getActiveSectionId([], 300, false)).toBe("")
  })
})
