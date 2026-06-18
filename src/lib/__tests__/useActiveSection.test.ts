import { describe, expect, it } from "vitest"
import { getActiveSectionId } from "@/hooks/useActiveSection"

const ORDERED = ["inicio", "servicios", "proceso", "faq", "contacto"]

describe("getActiveSectionId", () => {
  it("returns the intersecting id that appears first in ordered list", () => {
    expect(getActiveSectionId(["servicios"], ORDERED, false)).toBe("servicios")
  })

  it("returns the first ordered id when no ids are intersecting", () => {
    expect(getActiveSectionId([], ORDERED, false)).toBe("inicio")
  })

  it("returns the topmost ordered id when multiple ids intersect", () => {
    expect(getActiveSectionId(["faq", "proceso"], ORDERED, false)).toBe("proceso")
  })

  it("returns the last ordered id when isAtBottom is true regardless of intersecting set", () => {
    expect(getActiveSectionId(["inicio"], ORDERED, true)).toBe("contacto")
  })

  it("returns the last ordered id when isAtBottom is true and intersecting set is empty", () => {
    expect(getActiveSectionId([], ORDERED, true)).toBe("contacto")
  })
})
