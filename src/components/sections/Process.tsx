import { Search, Layout, Code2, Rocket } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  number: string
  icon: React.ElementType
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    number: "01",
    icon: Search,
    title: "Descubrimiento",
    description:
      "Entendemos tu negocio, tus objetivos y tu público. Definimos qué necesitás antes de escribir una línea de código.",
  },
  {
    number: "02",
    icon: Layout,
    title: "Diseño",
    description:
      "Creamos la estructura visual del sitio: wireframes, paleta de colores y tipografías alineadas con tu marca.",
  },
  {
    number: "03",
    icon: Code2,
    title: "Construcción",
    description:
      "Desarrollamos el sitio con tecnología moderna, rápida y optimizada para SEO y dispositivos móviles.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Lanzamiento",
    description:
      "Publicamos el sitio, configuramos el dominio y te entregamos todo listo para recibir clientes.",
  },
]

function StepCard({ step, index }: { step: Step; index: number }) {
  const Icon = step.icon
  const isLast = index === STEPS.length - 1

  return (
    <li className="relative flex flex-col items-center gap-4 text-center">
      {/* Connector line (hidden on last item) */}
      {!isLast && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-8 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] bg-border",
            "lg:block"
          )}
        />
      )}

      {/* Number badge + icon */}
      <div className="relative z-10 flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-accent/40 bg-surface ring-1 ring-accent/20">
        <span
          className="font-display text-xs font-black leading-none tracking-widest text-accent"
          aria-hidden="true"
        >
          {step.number}
        </span>
        <Icon
          className="mt-1 size-4 text-accent"
          aria-hidden="true"
        />
      </div>

      {/* Text */}
      <div className="px-4 lg:px-6">
        <h3 className="font-display text-base font-black uppercase leading-tight tracking-wider text-foreground">
          {step.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {step.description}
        </p>
      </div>
    </li>
  )
}

export function Process() {
  return (
    <section
      id="proceso"
      aria-labelledby="process-heading"
      className="section-invert border-t border-border bg-background px-4 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
            Cómo trabajamos
          </p>
          <h2
            id="process-heading"
            className="font-display text-2xl font-black uppercase leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            Del brief al lanzamiento
          </h2>
          <p className="mx-auto mt-4 max-w-[60ch] text-base leading-relaxed text-muted-foreground">
            Un proceso claro y sin sorpresas. Sabés en qué etapa estamos en
            todo momento.
          </p>
        </div>

        {/* Steps: vertical on mobile, horizontal on lg */}
        <ol
          aria-label="Etapas del proceso"
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0"
        >
          {STEPS.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </ol>
      </div>
    </section>
  )
}
