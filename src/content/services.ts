/**
 * A single service package offered by the studio.
 *
 * To add or remove a package, add/remove an object in the `services` array
 * below. Keep `price` as a plain integer in ARS (no separators) — it is
 * formatted for display by `formatPriceARS` in `src/lib/format.ts`.
 */
export interface ServicePackage {
  /** Unique slug used for keys and anchor targets. */
  id: string
  /** Display name of the package. */
  name: string
  /** Price in ARS as a plain integer (e.g. 199000). */
  price: number
  /** One-line description of who the package is for. */
  description: string
  /** Bullet-point features included in the package. */
  features: string[]
}

export const services: ServicePackage[] = [
  {
    id: "starter",
    name: "Starter",
    price: 199000,
    description: "Una landing profesional para presentar tu negocio.",
    features: [
      "Sitio de una sola página (landing)",
      "Diseño responsive para celular y escritorio",
      "Formulario de contacto a WhatsApp",
      "Optimización básica para Google (SEO)",
      "Publicación y puesta online",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 399000,
    description: "Un sitio completo para mostrar todo lo que hacés.",
    features: [
      "Hasta 5 secciones o páginas",
      "Diseño a medida de tu marca",
      "Galería de trabajos o servicios",
      "Integración con redes sociales",
      "SEO avanzado y velocidad optimizada",
      "Autogestionable: editás los textos vos mismo",
    ],
  },
  {
    id: "store",
    name: "Store",
    price: 649000,
    description: "Una tienda online lista para vender.",
    features: [
      "Catálogo de productos autogestionable",
      "Carrito de compras",
      "Integración con Mercado Pago",
      "Cálculo de envíos",
      "Panel para administrar pedidos y stock",
      "SEO y analítica de ventas",
    ],
  },
]
