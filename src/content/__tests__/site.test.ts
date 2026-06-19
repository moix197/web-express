import { describe, expect, it } from "vitest"
import { siteConfig } from "@/content/site"

describe("siteConfig", () => {
  it("metadataBase is a URL instance (not a plain string)", () => {
    // Next.js requires metadataBase to be a URL object; this guards against
    // accidental regression to a string assignment.
    expect(siteConfig.metadataBase).toBeInstanceOf(URL)
  })

  it("domain getter returns the hostname of metadataBase", () => {
    // The getter must equal metadataBase.host so consumers never duplicate
    // the `.host` accessor.
    expect(siteConfig.domain).toBe(siteConfig.metadataBase.host)
  })

  it("domain getter returns a non-empty string with no protocol or trailing slash", () => {
    const domain = siteConfig.domain
    expect(typeof domain).toBe("string")
    expect(domain.length).toBeGreaterThan(0)
    expect(domain).not.toMatch(/^https?:\/\//)
    expect(domain).not.toMatch(/\/$/)
  })
})
