import { Settings2, Palette, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Pillar {
  icon: React.ComponentType<{ className?: string }>
  heading: string
  body: string
}

const pillars: Pillar[] = [
  {
    icon: Settings2,
    heading: "Autogestionable",
    body: "Tu sitio viene listo para que lo manejés vos. Actualizá textos, imágenes y productos sin depender de un desarrollador ni pagar por cada cambio.",
  },
  {
    icon: Palette,
    heading: "Diseño profesional",
    body: "Cada sitio se diseña desde cero según tu identidad de marca. Nada de plantillas genéricas — tu negocio merece una presencia que lo represente de verdad.",
  },
  {
    icon: TrendingUp,
    heading: "Pensado para crecer",
    body: "Arrancás con lo que necesitás hoy y podés sumar funcionalidades mañana. SEO, analítica y rendimiento optimizados desde el día uno.",
  },
]

function PillarCard({ pillar }: { pillar: Pillar }) {
  const Icon = pillar.icon

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-surface p-6",
        "transition-colors duration-200"
      )}
    >
      <span
        className="inline-flex size-11 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent"
        aria-hidden="true"
      >
        <Icon className="size-5" />
      </span>

      <h3 className="text-base font-black uppercase leading-snug tracking-wider text-foreground">
        {pillar.heading}
      </h3>

      <p className="max-w-[65ch] text-base leading-relaxed text-muted-foreground">
        {pillar.body}
      </p>
    </div>
  )
}

export function About() {
  return (
    <section
      aria-labelledby="about-heading"
      className="section-invert border-t border-border bg-background px-4 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
            Por qué elegirnos
          </p>
          <h2
            id="about-heading"
            className="font-display text-2xl font-black uppercase leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            Resultados que se ven desde el primer día
          </h2>
        </div>

        {/* 3-column grid — stacks on mobile */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <PillarCard key={pillar.heading} pillar={pillar} />
          ))}
        </div>
      </div>
    </section>
  )
}
