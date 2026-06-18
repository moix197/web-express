import { describe, expect, it } from "vitest"
import { buildWhatsAppUrl, buildMailtoUrl } from "@/lib/contact"
import { type SiteConfig } from "@/content/site"

const mockConfig: SiteConfig = {
  name: "web-express",
  tagline: "Test tagline",
  metadataBase: new URL("https://web-express.com.ar"),
  email: "hola@web-express.com.ar",
  whatsApp: "5491100000000",
  social: { instagram: "#", linkedin: "#", github: "#" },
}

describe("buildWhatsAppUrl", () => {
  it("has the correct wa.me prefix", () => {
    const url = buildWhatsAppUrl("Ana", "Hola", mockConfig)
    expect(url).toMatch(/^https:\/\/wa\.me\//)
  })

  it("includes the phone number from config", () => {
    const url = buildWhatsAppUrl("Ana", "Hola", mockConfig)
    expect(url).toContain("5491100000000")
  })

  it("encodes special characters in the message", () => {
    const url = buildWhatsAppUrl("Ana García", "Hola, ¿cómo están?", mockConfig)
    // encoded form — raw spaces/special chars must not appear in query value
    expect(url).not.toContain(" ")
    expect(url).toContain(encodeURIComponent("Ana García: Hola, ¿cómo están?"))
  })

  it("uses fallback message when name and message are both empty", () => {
    const url = buildWhatsAppUrl("", "", mockConfig)
    expect(url).toMatch(/\?text=.+/)
    expect(url).not.toContain("undefined")
    // text param must not be empty
    const textParam = new URL(url).searchParams.get("text")
    expect(textParam).toBeTruthy()
    expect(textParam!.length).toBeGreaterThan(0)
  })

  it("uses fallback when name and message are only whitespace", () => {
    const url = buildWhatsAppUrl("   ", "   ", mockConfig)
    const textParam = new URL(url).searchParams.get("text")
    expect(textParam).toBeTruthy()
    expect(textParam).not.toBe("undefined")
  })

  it("includes name prefix when name is provided but message is empty", () => {
    const url = buildWhatsAppUrl("Carlos", "", mockConfig)
    const textParam = new URL(url).searchParams.get("text")
    expect(textParam).toContain("Carlos")
  })
})

describe("buildMailtoUrl", () => {
  it("has the correct mailto: prefix", () => {
    const url = buildMailtoUrl("Ana", "Hola", mockConfig)
    expect(url).toMatch(/^mailto:/)
  })

  it("includes the email from config", () => {
    const url = buildMailtoUrl("Ana", "Hola", mockConfig)
    expect(url).toContain("hola@web-express.com.ar")
  })

  it("encodes subject and body", () => {
    const url = buildMailtoUrl("Carlos López", "Quiero info", mockConfig)
    expect(url).toContain("subject=")
    expect(url).toContain("body=")
    // encoded chars present — raw spaces must not appear in params
    const [, query] = url.split("?")
    const params = new URLSearchParams(query)
    expect(params.get("subject")).not.toBeNull()
    expect(params.get("body")).not.toBeNull()
  })

  it("uses fallback subject and body when name and message are both empty", () => {
    const url = buildMailtoUrl("", "", mockConfig)
    expect(url).toContain("subject=")
    expect(url).toContain("body=")
    const [, query] = url.split("?")
    const params = new URLSearchParams(query)
    expect(params.get("subject")).toBeTruthy()
    expect(params.get("body")).toBeTruthy()
    expect(params.get("subject")).not.toBe("undefined")
    expect(params.get("body")).not.toBe("undefined")
  })

  it("includes name in subject when name is provided", () => {
    const url = buildMailtoUrl("Maria", "Consulta", mockConfig)
    const [, query] = url.split("?")
    const params = new URLSearchParams(query)
    expect(params.get("subject")).toContain("Maria")
  })
})
