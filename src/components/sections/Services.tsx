import { Check } from "lucide-react"
import { services, type ServicePackage } from "@/content/services"
import { formatPriceARS, formatPriceParts } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** IDs of packages that receive the featured (accent-border) treatment. */
const FEATURED_IDS = new Set(["business", "store"])

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <Check
        className="mt-0.5 size-4 shrink-0 text-accent"
        aria-hidden="true"
      />
      <span className="text-sm leading-relaxed text-muted-foreground">
        {text}
      </span>
    </li>
  )
}

function ServiceCard({ pkg }: { pkg: ServicePackage }) {
  const isFeatured = FEATURED_IDS.has(pkg.id)

  return (
    <article
      aria-label={`Paquete ${pkg.name}`}
      className={cn(
        "relative flex flex-col gap-5 rounded-xl border bg-surface p-6",
        "transition-colors duration-200",
        isFeatured
          ? "border-accent/60 ring-1 ring-accent/30"
          : "border-border"
      )}
    >
      {isFeatured && (
        <Badge
          className="absolute right-4 top-4 z-10 border-accent/50 bg-accent/10 text-accent"
          variant="outline"
          aria-label="Paquete popular"
        >
          Popular
        </Badge>
      )}

      {/* Card header */}
      <div className="space-y-1">
        <h3 className="font-display text-xl font-black uppercase leading-tight tracking-wide text-foreground">
          {pkg.name}
        </h3>
        <p className="text-sm leading-snug text-muted-foreground">
          {pkg.description}
        </p>
      </div>

      {/* Price */}
      {(() => {
        const { currency, amount } = formatPriceParts(pkg.price)
        return (
          <p
            className={cn(
              "font-display font-black leading-none tracking-tight",
              isFeatured ? "text-accent" : "text-foreground"
            )}
            aria-label={`Precio: ${formatPriceARS(pkg.price)}`}
          >
            <span className="mr-0.5 align-bottom text-base font-bold">{currency}</span>
            <span className="text-3xl">{amount}</span>
          </p>
        )
      })()}

      {/* Divider */}
      <hr className="border-border" />

      {/* Features list */}
      <ul className="flex flex-col gap-2" aria-label="Incluye">
        {pkg.features.map((f) => (
          <FeatureItem key={f} text={f} />
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-auto pt-2">
        <Button
          asChild
          size="lg"
          variant={isFeatured ? "accent" : "outline"}
          className="w-full cursor-pointer transition-colors duration-150"
        >
          <a href="#contacto" aria-label={`Contratar paquete ${pkg.name}`}>
            Quiero este plan
          </a>
        </Button>
      </div>
    </article>
  )
}

/** Branding + Sitio Web upsell callout — rendered below the 4 cards. */
function BrandingUpsell() {
  return (
    <aside
      aria-label="Combo Branding + Sitio Web"
      className={cn(
        "mt-4 flex flex-col gap-3 rounded-xl border border-accent/40 bg-accent/5 px-6 py-5",
        "sm:flex-row sm:items-center sm:justify-between sm:gap-6"
      )}
    >
      <div className="space-y-1">
        <p className="font-display text-base font-bold text-foreground">
          Combo Branding + Sitio Web
        </p>
        <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
          Contratando Branding junto con cualquier paquete web obtenés
          un descuento especial. Identidad visual y presencia online desde el
          arranque.
        </p>
      </div>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="shrink-0 cursor-pointer border-accent/50 transition-colors duration-150 hover:bg-accent/10"
      >
        <a href="#contacto" aria-label="Consultar combo Branding + Sitio Web">
          Consultar combo
        </a>
      </Button>
    </aside>
  )
}

export function Services() {
  return (
    <section
      id="servicios"
      aria-labelledby="services-heading"
      className="border-t border-border bg-background px-4 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
            Servicios
          </p>
          <h2
            id="services-heading"
            className="font-display text-2xl font-black uppercase leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            El plan que se adapta a tu negocio
          </h2>
          <p className="mx-auto mt-4 max-w-[60ch] text-base leading-relaxed text-muted-foreground">
            Elegí el paquete que mejor se ajusta a lo que necesitás hoy.
            Podés escalar cuando quieras.
          </p>
        </div>

        {/* Bento grid: 1-col → 2-col → 4-col */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {services.map((pkg) => (
            <ServiceCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        {/* Branding + Web upsell callout */}
        <BrandingUpsell />
      </div>
    </section>
  )
}
