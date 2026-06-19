import { describe, expect, it } from "vitest"
import { formatPriceARS, formatPriceParts } from "@/lib/format"

describe("formatPriceParts", () => {
  it("returns currency AR$ and dot-grouped amount", () => {
    const parts = formatPriceParts(199000)
    expect(parts.currency).toBe("AR$")
    expect(parts.amount).toBe("199.000")
  })

  it("returns unmodified amount for values below one thousand", () => {
    const parts = formatPriceParts(999)
    expect(parts.currency).toBe("AR$")
    expect(parts.amount).toBe("999")
  })
})

describe("formatPriceARS", () => {
  it("formats a typical price with dot thousands separator", () => {
    expect(formatPriceARS(199000)).toBe("AR$199.000")
  })

  it("formats zero", () => {
    expect(formatPriceARS(0)).toBe("AR$0")
  })

  it("formats numbers below one thousand without a separator", () => {
    expect(formatPriceARS(999)).toBe("AR$999")
  })

  it("formats large numbers with multiple separators", () => {
    expect(formatPriceARS(1234567)).toBe("AR$1.234.567")
  })

  it("formats all four package prices", () => {
    expect(formatPriceARS(149000)).toBe("AR$149.000")
    expect(formatPriceARS(399000)).toBe("AR$399.000")
    expect(formatPriceARS(649000)).toBe("AR$649.000")
  })
})
