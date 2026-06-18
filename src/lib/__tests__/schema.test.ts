import { describe, expect, it } from "vitest"
import { buildLocalBusinessSchema, buildServiceSchema } from "@/lib/schema"
import type { ServicePackage } from "@/content/services"

const sampleService: ServicePackage = {
  id: "starter",
  name: "Starter",
  price: 199000,
  description: "Una landing profesional.",
  features: ["Una página"],
}

describe("buildLocalBusinessSchema", () => {
  it("declares the LocalBusiness type and schema.org context", () => {
    const schema = buildLocalBusinessSchema()
    expect(schema["@type"]).toBe("LocalBusiness")
    expect(schema["@context"]).toBe("https://schema.org")
  })

  it("quotes prices in ARS", () => {
    expect(buildLocalBusinessSchema().currenciesAccepted).toBe("ARS")
  })
})

describe("buildServiceSchema", () => {
  it("maps the service name and price into an ARS offer", () => {
    const schema = buildServiceSchema(sampleService)
    expect(schema["@type"]).toBe("Service")
    expect(schema.name).toBe("Starter")
    expect(schema.offers.price).toBe(199000)
    expect(schema.offers.priceCurrency).toBe("ARS")
  })
})
