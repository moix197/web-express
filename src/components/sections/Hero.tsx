import { siteConfig } from "@/content/site"
import { Button } from "@/components/ui/button"
import { buildWhatsAppUrl, RESERVE_CALL_WA_MESSAGE } from "@/lib/contact"

export function Hero() {
  const waHref = buildWhatsAppUrl("", RESERVE_CALL_WA_MESSAGE, siteConfig)

  return (
    <section id="inicio" className="flex min-h-dvh flex-col items-center justify-center px-4 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-prose text-center">
        {/* Eyebrow */}
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent sm:mb-6">
          {siteConfig.name}
        </p>

        {/* Headline — DM Sans via --font-display, clamped oversized */}
        <h1
          className="mb-6 font-display font-black uppercase leading-[0.9] tracking-tight text-foreground sm:mb-8"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.25rem)" }}
        >
          Tu negocio merece estar en la web
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-[48ch] text-base leading-relaxed text-muted-foreground sm:mb-12 sm:text-lg">
          Sitios profesionales, rápidos y listos para captar clientes desde el primer día.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          {/* Primary — WhatsApp */}
          <Button
            asChild
            size="lg"
            variant="default"
            className="h-11 min-w-[200px] px-6 text-base transition-colors duration-150 ease-out"
          >
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Reservá una llamada
            </a>
          </Button>

          {/* Secondary — smooth-scroll anchor */}
          <Button
            asChild
            size="lg"
            variant="accent"
            className="h-11 min-w-[200px] px-6 text-base transition-colors duration-150 ease-out"
          >
            <a href="#servicios">Ver servicios</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
